const mongoose = require("mongoose");

const roadmapProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    analysis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Analysis",
      default: null,
    },
    steps: [
      {
        skill: { type: String, required: true, maxlength: 100 },
        status: {
          type: String,
          enum: ["not_started", "in_progress", "completed"],
          default: "not_started",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoadmapProgress", roadmapProgressSchema);