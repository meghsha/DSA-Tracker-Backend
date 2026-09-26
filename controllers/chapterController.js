import asyncHandler from "express-async-handler";
import Chapter from "../modals/chapterSchema.js";
import Topic from "../modals/topicSchema.js";
import Problem from "../modals/problemSchema.js";

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

export const getChapterTree = asyncHandler(async (req, res) => {
  // Fetch all chapters, topics, and problems in parallel
  const [chapters, topics, problems] = await Promise.all([
    Chapter.find().sort({ order: 1, createdAt: 1 }),
    Topic.find().sort({ order: 1, createdAt: 1 }),
    Problem.find().sort({ createdAt: 1 })
  ]);

  // Create maps for quick lookup
  const topicMap = new Map();
  topics.forEach(topic => {
    if (!topicMap.has(topic.chapterId.toString())) {
      topicMap.set(topic.chapterId.toString(), []);
    }
    topicMap.get(topic.chapterId.toString()).push(topic);
  });

  const problemMap = new Map();
  problems.forEach(problem => {
    if (!problemMap.has(problem.topicId.toString())) {
      problemMap.set(problem.topicId.toString(), []);
    }
    problemMap.get(problem.topicId.toString()).push(problem);
  });

  // Build the tree structure
  const tree = chapters.map(chapter => {
    const chapterTopics = topicMap.get(chapter._id.toString()) || [];

    const topicsWithProblems = chapterTopics.map(topic => {
      const topicProblems = problemMap.get(topic._id.toString()) || [];

      return {
        _id: topic._id,
        title: topic.title,
        description: topic.description,
        order: topic.order,
        chapterId: topic.chapterId,
        createdAt: topic.createdAt,
        updatedAt: topic.updatedAt,
        problems: topicProblems.map(problem => ({
          _id: problem._id,
          title: problem.title,
          description: problem.description,
          difficulty: problem.difficulty,
          youtubeUrl: problem.youtubeUrl,
          practiceUrl: problem.practiceUrl,
          articleUrl: problem.articleUrl,
          topicId: problem.topicId,
          createdAt: problem.createdAt,
          updatedAt: problem.updatedAt
        }))
      };
    });

    return {
      _id: chapter._id,
      title: chapter.title,
      description: chapter.description,
      order: chapter.order,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
      topics: topicsWithProblems
    };
  });

  res.json(tree);
});