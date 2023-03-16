import express from "express";
import { getExercises } from "./exercises-controller.js";
import checkAuth from "../../utils/checkAuth.js";
import { createExercise } from "./exercises-controller.js";
import { createExerciseValidation } from "./exercises-validations.js";
import { upload } from "../../utils/multer.js";

const router = express.Router();

router.get("/api/exercises", getExercises);
router.post(
  "/api/exercises",
  checkAuth,
  upload.single("exerciseImage"),
  createExerciseValidation,
  createExercise,
);
// router.delete("/api/exercises");
// router.patch("/api/exercises");

export default router;
