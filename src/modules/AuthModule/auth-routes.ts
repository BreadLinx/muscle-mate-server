import express from "express";
import checkAuth from "../../utils/checkAuth.js";
import {
  signup,
  login,
  getMe,
  patchAvatar,
  signout,
  refreshToken,
} from "./auth-controller.js";
import {
  signupValidation,
  loginValidation,
  signoutValidation,
} from "./auth-validations.js";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}.${file.originalname.split(".")[1]}`);
  },
});

const upload = multer({ storage });

router.post("/auth/login", loginValidation, login);
router.post("/auth/signup", signupValidation, signup);
router.post("/auth/signout", checkAuth, signoutValidation, signout);
router.post("/auth/refreshToken", refreshToken);

router.get("/auth/me", checkAuth, getMe);
router.patch(
  "/auth/me/avatar",
  checkAuth,
  upload.single("avatar"),
  patchAvatar,
);

export default router;
