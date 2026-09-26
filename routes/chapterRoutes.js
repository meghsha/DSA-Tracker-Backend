import express from "express";
import { getChapters, createChapter, getChapterTree } from "../controllers/chapterController.js";

const router = express.Router();

router.route("/").get(getChapters).post(createChapter);
router.route("/tree").get(getChapterTree);

export default router;