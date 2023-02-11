import express from "express";
import checkAuth from "../../utils/checkAuth.js";
import { createPost, getPosts } from "./posts-controller.js";
import { createPostValidation } from "./posts-validations.js";
const router = express.Router();

router.post("/api/posts", checkAuth, createPostValidation, createPost);
router.get("/api/posts", getPosts);

export default router;
