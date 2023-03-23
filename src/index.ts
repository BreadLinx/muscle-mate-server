import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./modules/AuthModule/auth-routes.js";
import exercisesRoutes from "./modules/ExercisesModule/exercises-routes.js";

dotenv.config();

mongoose
  .connect(
    `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.19rhici.mongodb.net/muscleMate?retryWrites=true&w=majority`,
  )
  .then(() => console.log("DB ok"))
  .catch((err: Error | null) => console.log("DB error", err));

const app: Express = express();

app.use(cors());
app.use(express.json());

// Routes
app.get("/testconnection", (req, res) => {
  res.json({
    success: true,
    message: "server is available",
  });
});

app.use(authRoutes);
app.use(exercisesRoutes);

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
  console.log("everything is fine");
});
