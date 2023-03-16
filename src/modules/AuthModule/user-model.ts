import { Schema, model } from "mongoose";
import { UserDoc } from "../../types/modelsTypes.js";

const UserSchema = new Schema<UserDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
    role: { type: String, required: true },
    favoriteExercices: [String],
    workouts: {
      type: {
        monday: {
          name: String,
          exercices: [
            {
              _id: String,
              weight: Number,
              weightIncrease: Number,
              repeats: Number,
              timesPerRepeat: Number,
            },
          ],
        },
        tuesday: {
          name: String,
          exercices: [
            {
              _id: String,
              weight: Number,
              weightIncrease: Number,
              repeats: Number,
              timesPerRepeat: Number,
            },
          ],
        },
        wednesday: {
          name: String,
          exercices: [
            {
              _id: String,
              weight: Number,
              weightIncrease: Number,
              repeats: Number,
              timesPerRepeat: Number,
            },
          ],
        },
        thursday: {
          name: String,
          exercices: [
            {
              _id: String,
              weight: Number,
              weightIncrease: Number,
              repeats: Number,
              timesPerRepeat: Number,
            },
          ],
        },
        friday: {
          name: String,
          exercices: [
            {
              _id: String,
              weight: Number,
              weightIncrease: Number,
              repeats: Number,
              timesPerRepeat: Number,
            },
          ],
        },
        saturday: {
          name: String,
          exercices: [
            {
              _id: String,
              weight: Number,
              weightIncrease: Number,
              repeats: Number,
              timesPerRepeat: Number,
            },
          ],
        },
        sunday: {
          name: String,
          exercices: [
            {
              _id: String,
              weight: Number,
              weightIncrease: Number,
              repeats: Number,
              timesPerRepeat: Number,
            },
          ],
        },
      },
      required: true,
    },
  },
  { timestamps: true },
);

export default model<UserDoc>("User", UserSchema);
