import express from "express";
import checkAuth from "../../utils/checkAuth.js";
import {
  signup,
  login,
  getMe,
  patchAvatar,
  signout,
  refreshToken,
  createUserExercise,
} from "./auth-controller.js";
import {
  signupValidation,
  loginValidation,
  signoutValidation,
  createUserExerciseValidation,
} from "./auth-validations.js";
import { upload } from "../../utils/multer.js";

const router = express.Router();

router.post("/auth/login", loginValidation, login);
router.post("/auth/signup", signupValidation, signup);
router.post("/auth/signout", checkAuth, signoutValidation, signout);
router.post("/auth/refreshToken", refreshToken);

router.get("/auth/me", checkAuth, getMe);

// router.patch(
//   "/auth/me/avatar",
//   checkAuth,
//   upload.single("avatar"),
//   patchAvatar,
// );

router.post(
  "/auth/me/exercises",
  checkAuth,
  upload.single("exerciseImage"),
  createUserExerciseValidation,
  createUserExercise,
);

export default router;
