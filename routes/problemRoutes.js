import express from "express";
import {
  getProblemsByTopic,
  getProblemById,
  createProblem,
} from "../controllers/problemController.js";

const router = express.Router();

router.route("/topic/:topicId").get(getProblemsByTopic);
router.route("/:id").get(getProblemById);
router.route("/").post(createProblem);

export default router;