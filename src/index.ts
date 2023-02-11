import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import express, { Express, Request } from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import authRoutes from "./modules/AuthModule/auth-routes.js";
import postsRoutes from "./modules/PostsModule/posts-routes.js";
import checkAuth from "./utils/checkAuth.js";

dotenv.config();

mongoose
  .connect(
    `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.19rhici.mongodb.net/muscleMate?retryWrites=true&w=majority`,
  )
  .then(() => console.log("DB ok"))
  .catch((err: Error | null) => console.log("DB error", err));

const app: Express = express();

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, "uploads");
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, `${uuidv4()}.${file.originalname.split(".")[1]}`);
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    success: true,
    filePath: `/uploads/${(req.file as Express.Multer.File).filename}`,
  });
});

// Routes
app.use(authRoutes);
app.use(postsRoutes);

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
  console.log("everything is fine");
});
