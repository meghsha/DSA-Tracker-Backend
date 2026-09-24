import express from "express";
import { updateProgress, getProgress } from "../controllers/progressController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all routes in this router
router.use(authMiddleware);

router.route("/:problemId").put(updateProgress);
router.route("/").get(getProgress);

export default router;