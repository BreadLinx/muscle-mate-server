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
    userExercises: [
      {
        image: String,
        name: String,
        muscleGroups: [String],
        description: String,
        tutorialLink: String,
      },
    ],
    workouts: {
      monday: {
        name: String,
        completed: Boolean,
        exercises: [
          {
            exerciseId: String,
            weight: Number,
            weightIncrease: Number,
            repeats: Number,
            timesPerRepeat: Number,
            completed: Boolean,
          },
        ],
      },
      tuesday: {
        name: String,
        completed: Boolean,
        exercises: [
          {
            exerciseId: String,
            weight: Number,
            weightIncrease: Number,
            repeats: Number,
            timesPerRepeat: Number,
            completed: Boolean,
          },
        ],
      },
      wednesday: {
        name: String,
        completed: Boolean,
        exercises: [
          {
            exerciseId: String,
            weight: Number,
            weightIncrease: Number,
            repeats: Number,
            timesPerRepeat: Number,
            completed: Boolean,
          },
        ],
      },
      thursday: {
        name: String,
        completed: Boolean,
        exercises: [
          {
            exerciseId: String,
            weight: Number,
            weightIncrease: Number,
            repeats: Number,
            timesPerRepeat: Number,
            completed: Boolean,
          },
        ],
      },
      friday: {
        name: String,
        completed: Boolean,
        exercises: [
          {
            exerciseId: String,
            weight: Number,
            weightIncrease: Number,
            repeats: Number,
            timesPerRepeat: Number,
            completed: Boolean,
          },
        ],
      },
      saturday: {
        name: String,
        completed: Boolean,
        exercises: [
          {
            exerciseId: String,
            weight: Number,
            weightIncrease: Number,
            repeats: Number,
            timesPerRepeat: Number,
            completed: Boolean,
          },
        ],
      },
      sunday: {
        name: String,
        completed: Boolean,
        exercises: [
          {
            exerciseId: String,
            weight: Number,
            weightIncrease: Number,
            repeats: Number,
            timesPerRepeat: Number,
            completed: Boolean,
          },
        ],
      },
    },
  },
  { timestamps: true },
);

export default model<UserDoc>("User", UserSchema);
