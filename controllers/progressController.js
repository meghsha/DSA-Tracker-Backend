import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import UserProgress from "../modals/userProgressSchema.js";
import Problem from "../modals/problemSchema.js";

export const updateProgress = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const { status } = req.body;
  const userId = req.user._id;

  // Validate problemId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(problemId)) {
    res.status(400);
    throw new Error("Invalid problem ID");
  }

  // Validate status
  const validStatuses = ['not_started', 'in_progress', 'completed'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const progress = await UserProgress.findOneAndUpdate(
    { userId, problemId },
    {
      $set: {
        status,
        completedAt: status === 'completed' ? new Date() : null,
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

  // Count completed problems (status === 'completed')
  const completedCount = progressRecords.filter(p => p.status === 'completed').length;
  // Count in progress problems (status === 'in_progress')
  const inProgressCount = progressRecords.filter(p => p.status === 'in_progress').length;

  const percentage = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;

  res.json({
    progress: progressRecords,
    summary: {
      completed: completedCount,
      inProgress: inProgressCount,
      total: totalProblems,
      percentage,
    },
  });
});