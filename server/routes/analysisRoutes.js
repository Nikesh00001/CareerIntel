
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const path = require("path");
const FormData = require("form-data");

const Analysis = require("../models/Analysis");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

const ML_URL = (
  process.env.ML_SERVICE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_TEXT_LENGTH = 100000;

// --------------------------------------------------
// Upload configuration
// --------------------------------------------------

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (![".pdf", ".docx"].includes(ext)) {
      return cb(new Error("Only PDF and DOCX files are supported."));
    }

    cb(null, true);
  },
});

const handleResumeUpload = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (error) {
      const status =
        error instanceof multer.MulterError
          ? error.code === "LIMIT_FILE_SIZE"
            ? 413
            : 400
          : 400;

      return res.status(status).json({
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "Resume exceeds the 5 MB upload limit."
            : error.message || "Unable to upload resume.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message:
          'No file received. Send a PDF or DOCX using FormData field name "file".',
      });
    }

    next();
  });
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function getReadableError(error) {
  const data = error.response?.data;
  const details = data?.detail;

  if (Array.isArray(details)) {
    return details
      .map((item) => {
        if (typeof item === "string") return item;

        const location = Array.isArray(item?.loc)
          ? item.loc.join(" → ")
          : "Request";

        return `${location}: ${item?.msg || "Invalid input"}`;
      })
      .join("; ");
  }

  if (typeof details === "string") return details;
  if (typeof data?.message === "string") return data.message;
  if (typeof error.message === "string") return error.message;

  return "An unexpected error occurred.";
}

function getMLData(responseData) {
  return (
    responseData?.analysis ??
    responseData?.result ??
    responseData
  );
}

function normalizeSkills(skills) {
  return skills
    .map((skill) =>
      typeof skill === "string"
        ? skill
        : skill?.name || skill?.skill
    )
    .filter(
      (skill) =>
        typeof skill === "string" && skill.trim().length > 0
    )
    .map((skill) => skill.trim().slice(0, 100))
    .slice(0, 200);
}

function normalizeAnalysisData(responseData) {
  const data = getMLData(responseData);

  const skills =
    data?.extracted_skills ??
    data?.extractedSkills;

  const careers =
    data?.career_recommendations ??
    data?.careerRecommendations;

  const roadmap =
    data?.suggested_learning_roadmap ??
    data?.suggestedLearningRoadmap ??
    data?.roadmap ??
    null;

  if (!Array.isArray(skills) || !Array.isArray(careers)) {
    throw new Error(
      "Python ML service returned an unexpected response format. Check its JSON response."
    );
  }

  return {
    extractedSkills: normalizeSkills(skills),
    careerRecommendations: careers.slice(0, 50),
    roadmap,
  };
}

async function saveAnalysis({
  userId,
  filename,
  responseData,
}) {
  const result = normalizeAnalysisData(responseData);

  const analysis = await Analysis.create({
    user: userId,
    filename: filename.slice(0, 255),
    extractedSkills: result.extractedSkills,
    careerRecommendations: result.careerRecommendations,
    roadmap: result.roadmap,
  });

  return {
    ...analysis.toObject(),
    extracted_skills: analysis.extractedSkills,
    career_recommendations: analysis.careerRecommendations,
    suggested_learning_roadmap: analysis.roadmap,
  };
}

function handleMLError(error, res, operation) {
  console.error(
    `${operation}:`,
    JSON.stringify(
      error.response?.data || error.message,
      null,
      2
    )
  );

  if (error.code === "ECONNREFUSED") {
    return res.status(503).json({
      message:
        "Cannot connect to Python ML service. Start FastAPI on port 8000.",
    });
  }

  if (
    error.code === "ECONNABORTED" ||
    error.code === "ETIMEDOUT"
  ) {
    return res.status(504).json({
      message: "Python ML service timed out. Please try again.",
    });
  }

  if (error.response) {
    return res.status(502).json({
      message: getReadableError(error),
      python_status: error.response.status,
    });
  }

  if (error.message?.includes("unexpected response format")) {
    return res.status(502).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: "Failed to process or save the resume.",
  });
}

// --------------------------------------------------
// POST /api/analyses/upload
// Analyze a PDF or DOCX resume
// --------------------------------------------------

router.post("/upload", handleResumeUpload, async (req, res) => {
  try {
    const file = req.file;
    const form = new FormData();

    form.append("file", file.buffer, {
      filename: path.basename(file.originalname),
      contentType: file.mimetype,
    });

    console.log("Sending uploaded resume to:", ML_URL);

    const mlResponse = await axios.post(
      `${ML_URL}/analyze-resume`,
      form,
      {
        headers: form.getHeaders(),
        maxBodyLength: 6 * 1024 * 1024,
        timeout: 60000,
      }
    );

    const analysis = await saveAnalysis({
      userId: req.user._id,
      filename: path.basename(file.originalname),
      responseData: mlResponse.data,
    });

    return res.status(201).json({
      message: "Resume analyzed and saved successfully.",
      analysis,
    });
  } catch (error) {
    return handleMLError(error, res, "Resume upload analysis error");
  }
});

// --------------------------------------------------
// POST /api/analyses
// Analyze pasted resume text
// --------------------------------------------------

router.post("/", async (req, res) => {
  try {
    const resumeText =
      req.body?.resume_text ??
      req.body?.resumeText ??
      req.body?.text;

    if (
      typeof resumeText !== "string" ||
      !resumeText.trim()
    ) {
      return res.status(400).json({
        message: "Please provide valid resume text.",
      });
    }

    if (resumeText.length > MAX_TEXT_LENGTH) {
      return res.status(413).json({
        message: "Resume text is too long. Maximum length is 100,000 characters.",
      });
    }

    console.log("Sending pasted resume text to:", ML_URL);

    // Assumes FastAPI expects a JSON body with a "text" field.
    const mlResponse = await axios.post(
      `${ML_URL}/analyze-text`,
      { resume_text: resumeText.trim() },
      { timeout: 60000 }
    );

    const analysis = await saveAnalysis({
      userId: req.user._id,
      filename: "Pasted resume text",
      responseData: mlResponse.data,
    });

    return res.status(201).json({
      message: "Resume analyzed and saved successfully.",
      analysis,
    });
  } catch (error) {
    return handleMLError(error, res, "Text analysis error");
  }
});

// --------------------------------------------------
// GET /api/analyses
// Fetch authenticated user's history
// --------------------------------------------------

router.get("/", async (req, res) => {
  try {
    const analyses = await Analysis.find({
      user: req.user._id,
    })
      .select("-__v")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json({ analyses });
  } catch (error) {
    console.error("Fetch analyses error:", error.message);

    return res.status(500).json({
      message: "Unable to load analysis history.",
    });
  }
});

// --------------------------------------------------
// GET /api/analyses/:id
// Fetch one analysis belonging to the current user
// --------------------------------------------------

router.get("/:id", async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).lean();

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found.",
      });
    }

    return res.json({ analysis });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid analysis ID.",
      });
    }

    console.error("Fetch analysis error:", error.message);

    return res.status(500).json({
      message: "Unable to load analysis.",
    });
  }
});

module.exports = router;
