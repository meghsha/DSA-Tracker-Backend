import express from "express";
import { getChapters, createChapter } from "../controllers/chapterController.js";

const router = express.Router();

router.route("/").get(getChapters).post(createChapter);

export default router;