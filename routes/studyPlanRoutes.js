import express from "express";
import {
  createStudyPlan,
  getStudyPlans,
  updateStudyPlan,
  deleteStudyPlan,
} from "../controllers/studyPlanController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/").post(createStudyPlan).get(getStudyPlans);
router.route("/:id").patch(updateStudyPlan).delete(deleteStudyPlan);

export default router;