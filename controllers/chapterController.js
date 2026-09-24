import asyncHandler from "express-async-handler";
import Chapter from "../modals/chapterSchema.js";

export const getChapters = asyncHandler(async (req, res) => {
  const chapters = await Chapter.find().sort({ order: 1, createdAt: 1 });
  res.json(chapters);
});

export const createChapter = asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;

  const chapter = await Chapter.create({
    title,
    description,
    order: order || 0,
  });

  res.status(201).json(chapter);
});