const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    filename: { type: String, default: "Pasted resume text" },
    extractedSkills: [{ type: String, maxlength: 100 }],
    careerRecommendations: { type: [mongoose.Schema.Types.Mixed], default: [] },
    roadmap: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", analysisSchema);