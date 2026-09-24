import express from "express";
import { getTopicsByChapter, createTopic } from "../controllers/topicController.js";

const router = express.Router();

router.route("/:chapterId").get(getTopicsByChapter);
router.route("/").post(createTopic);

export default router;