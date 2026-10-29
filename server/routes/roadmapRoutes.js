const express = require("express");
const mongoose = require("mongoose");
const RoadmapProgress = require("../models/RoadmapProgress");
const Analysis = require("../models/Analysis");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
  try {
    const progress = await RoadmapProgress.find({
      user: req.user._id,
    })
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ progress });
  } catch (error) {
    res.status(500).json({ message: "Unable to load roadmap progress." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { analysisId, steps } = req.body || {};

    if (
      !Array.isArray(steps) ||
      steps.length > 200 ||
      steps.some(
        (step) =>
          !step ||
          typeof step.skill !== "string" ||
          !step.skill.trim() ||
          step.skill.length > 100
      )
    ) {
      return res.status(400).json({ message: "Invalid roadmap steps." });
    }

    let linkedAnalysis = null;

    if (analysisId) {
      if (!mongoose.isValidObjectId(analysisId)) {
        return res.status(400).json({ message: "Invalid analysis ID." });
      }

      linkedAnalysis = await Analysis.findOne({
        _id: analysisId,
        user: req.user._id,
      }).select("_id");

      if (!linkedAnalysis) {
        return res.status(404).json({ message: "Analysis not found." });
      }
    }

    const allowedStatuses = ["not_started", "in_progress", "completed"];

    const safeSteps = steps.map((step) => ({
      skill: step.skill.trim(),
      status: allowedStatuses.includes(step.status)
        ? step.status
        : "not_started",
    }));

    const progress = await RoadmapProgress.create({
      user: req.user._id,
      analysis: linkedAnalysis?._id || null,
      steps: safeSteps,
    });

    res.status(201).json({ message: "Roadmap saved.", progress });
  } catch (error) {
    console.error("Save roadmap error:", error.message);
    res.status(500).json({ message: "Unable to save roadmap." });
  }
});

router.patch("/:id/steps/:stepIndex", async (req, res) => {
  try {
    const { status } = req.body || {};
    const index = Number(req.params.stepIndex);

    if (
      !mongoose.isValidObjectId(req.params.id) ||
      !Number.isInteger(index) ||
      index < 0 ||
      !["not_started", "in_progress", "completed"].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid progress update." });
    }

    const progress = await RoadmapProgress.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!progress) {
      return res.status(404).json({ message: "Roadmap not found." });
    }

    if (index >= progress.steps.length) {
      return res.status(404).json({ message: "Roadmap step not found." });
    }

    progress.steps[index].status = status;
    await progress.save();

    res.json({ message: "Progress updated.", progress });
  } catch (error) {
    res.status(500).json({ message: "Unable to update progress." });
  }
});

module.exports = router;