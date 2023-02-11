import { body } from "express-validator";

export const createPostValidation = [
  body("text").isString(),
  body("imageUrl").optional().isURL(),
];
