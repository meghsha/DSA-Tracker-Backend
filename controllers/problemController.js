import asyncHandler from "express-async-handler";
import Problem from "../modals/problemSchema.js";

export const getProblemsByTopic = asyncHandler(async (req, res) => {
  const { topicId } = req.params;

  const problems = await Problem.find({ topicId }).sort({ createdAt: 1 });
  res.json(problems);
});

export const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await Problem.findById(id);
  if (!problem) {
    res.status(404);
    throw new Error("Problem not found");
  }
  res.json(problem);
});

export const createProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    youtubeUrl,
    practiceUrl,
    articleUrl,
    topicId,
  } = req.body;

  const problem = await Problem.create({
    title,
    description,
    difficulty,
    youtubeUrl: youtubeUrl || null,
    practiceUrl: practiceUrl || null,
    articleUrl: articleUrl || null,
    topicId,
  });

  res.status(201).json(problem);
});