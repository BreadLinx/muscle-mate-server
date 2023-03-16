import { Schema, model } from "mongoose";
import { ExerciseDoc } from "../../types/modelsTypes.js";

const ExerciseSchema = new Schema<ExerciseDoc>(
  {
    image: { type: String, required: true },
    name: { type: String, required: true },
    muscleGroups: { type: [String], required: true },
    description: String,
    tutorialLink: String,
  },
  { timestamps: true },
);

export default model<ExerciseDoc>("Exercise", ExerciseSchema);
