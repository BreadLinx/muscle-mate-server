import { Types } from "mongoose";

interface UserDocExercise {
  exerciseId: string;
  exerexerciseType: "self" | "common";
  weight: number;
  weightIncrease: number;
  repeats: number;
  timesPerRepeat: number;
  completed: boolean;
}
export interface UserDoc {
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  role: "user" | "moderator" | "admin" | "owner";
  userExercises: ExerciseDoc[];
  workouts: {
    monday: {
      name: string;
      completed: boolean;
      exercises: UserDocExercise[];
    };
    tuesday: {
      name: string;
      completed: boolean;
      exercises: UserDocExercise[];
    };
    wednesday: {
      name: string;
      completed: boolean;
      exercises: UserDocExercise[];
    };
    thursday: {
      name: string;
      completed: boolean;
      exercises: UserDocExercise[];
    };
    friday: {
      name: string;
      completed: boolean;
      exercises: UserDocExercise[];
    };
    saturday: {
      name: string;
      completed: boolean;
      exercises: UserDocExercise[];
    };
    sunday: {
      name: string;
      completed: boolean;
      exercises: UserDocExercise[];
    };
  };
}

export interface ExpiredTokenDoc {
  type: "refresh" | "auth";
  token: string;
  [key: string]: any;
}

export interface ExerciseDoc {
  image: string;
  name: string;
  muscleGroups: string[];
  description?: string;
  tutorialLink?: string;
}
