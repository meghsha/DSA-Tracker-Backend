import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import UserProgress from "../modals/userProgressSchema.js";
import Problem from "../modals/problemSchema.js";

export const updateProgress = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const { completed } = req.body;
  const userId = req.user._id;

  // Validate problemId is a valid ObjectId (Mongoose will cast, but we can check)
  if (!mongoose.Types.ObjectId.isValid(problemId)) {
    res.status(400);
    throw new Error("Invalid problem ID");
  }

  const progress = await UserProgress.findOneAndUpdate(
    { userId, problemId },
    {
      $set: {
        completed: !!completed,
        completedAt: !!completed ? new Date() : null,
      },
    },
    { upsert: true, new: true }
  );

  res.json(progress);
});

export const getProgress = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user's progress records
  const progressRecords = await UserProgress.find({ userId }).lean();

  // Get total number of problems
  const totalProblems = await Problem.countDocuments({});

  // Count completed problems
  const completedCount = progressRecords.filter(p => p.completed).length;

  const percentage = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;

  res.json({
    progress: progressRecords,
    summary: {
      completed: completedCount,
      total: totalProblems,
      percentage,
    },
  });
});