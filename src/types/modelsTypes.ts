import { Types } from "mongoose";

export interface UserDocExercise {
  exerciseId: string;
  name: string;
  image: string;
  weight: number;
  weightIncrease: number;
  repeats: number;
  timesPerRepeat: number;
  completed: boolean;
}

export type Tdays =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface IWorkoutDay {
  name: string;
  completed: boolean;
  exercises: UserDocExercise[];
}

export type TWorkouts = Record<Tdays, IWorkoutDay>;

export interface UserDoc {
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  role: "user" | "moderator" | "admin" | "owner";
  userExercises: ExerciseDoc[];
  workouts: TWorkouts;
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
