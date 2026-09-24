import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import StudyPlan from "../modals/studyPlanSchema.js";
import Problem from "../modals/problemSchema.js";

export const createStudyPlan = asyncHandler(async (req, res) => {
  const { problemId, scheduledDate, notes } = req.body;
  const userId = req.user._id;

  // Validate IDs
  if (!mongoose.Types.ObjectId.isValid(problemId)) {
    res.status(400);
    throw new Error("Invalid problem ID");
  }

  // Parse date
  const date = new Date(scheduledDate);
  if (isNaN(date.getTime())) {
    res.status(400);
    throw new Error("Invalid scheduledDate");
  }

  const studyPlan = await StudyPlan.create({
    userId,
    problemId,
    scheduledDate: date,
    notes: notes || null,
  });

  // Populate problem info for response
  const populated = await StudyPlan.findById(studyPlan._id).populate("problemId", "title difficulty");
  res.status(201).json(populated);
});

export const getStudyPlans = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { startDate, endDate } = req.query;

  let filter = { userId };
  if (startDate || endDate) {
    filter.scheduledDate = {};
    if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) filter.scheduledDate.$gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      if (!isNaN(end.getTime())) filter.scheduledDate.$lte = end;
    }
  }

  const plans = await StudyPlan.find(filter)
    .populate("problemId", "title difficulty")
    .sort({ scheduledDate: 1 });

  res.json(plans);
});

export const updateStudyPlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { problemId, scheduledDate, notes } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid study plan ID");
  }

  const update = {};
  if (problemId !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      res.status(400);
      throw new Error("Invalid problem ID");
    }
    update.problemId = problemId;
  }
  if (scheduledDate !== undefined) {
    const date = new Date(scheduledDate);
    if (isNaN(date.getTime())) {
      res.status(400);
      throw new Error("Invalid scheduledDate");
    }
    update.scheduledDate = date;
  }
  if (notes !== undefined) {
    update.notes = notes;
  }

  const studyPlan = await StudyPlan.findOneAndUpdate(
    { _id: id, userId },
    update,
    { new: true }
  ).populate("problemId", "title difficulty");

  if (!studyPlan) {
    res.status(404);
    throw new Error("Study plan not found");
  }

  res.json(studyPlan);
});

export const deleteStudyPlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid study plan ID");
  }

  const studyPlan = await StudyPlan.findOneAndDelete({ _id: id, userId });
  if (!studyPlan) {
    res.status(404);
    throw new Error("Study plan not found");
  }

  res.json({ message: "Study plan deleted" });
});