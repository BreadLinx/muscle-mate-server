import { body } from "express-validator";

export const createExerciseValidation = [
  body("name").isLength({ min: 3 }),
  body("tutorialLink").isURL(),
];
