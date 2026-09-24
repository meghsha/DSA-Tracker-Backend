import asyncHandler from "express-async-handler";
import Topic from "../modals/topicSchema.js";

export const getTopicsByChapter = asyncHandler(async (req, res) => {
  const { chapterId } = req.params;

  // Optionally validate chapterId is valid ObjectId
  const topics = await Topic.find({ chapterId }).sort({ order: 1, createdAt: 1 });
  res.json(topics);
});

export const createTopic = asyncHandler(async (req, res) => {
  const { title, description, order, chapterId } = req.body;

  const topic = await Topic.create({
    title,
    description,
    order: order || 0,
    chapterId,
  });

  res.status(201).json(topic);
});