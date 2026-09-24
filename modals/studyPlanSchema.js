import mongoose from "mongoose";

const studyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const StudyPlan = mongoose.model("StudyPlan", studyPlanSchema);
export default StudyPlan;