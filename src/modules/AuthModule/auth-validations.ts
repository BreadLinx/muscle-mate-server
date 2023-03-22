import { body } from "express-validator";

export const signupValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("name").isLength({ min: 3 }),
];

export const loginValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
];

export const createUserExerciseValidation = [
  body("name").isLength({ min: 3 }),
  body("tutorialLink").isURL(),
];

export const signoutValidation = [body("refreshToken").isJWT()];
