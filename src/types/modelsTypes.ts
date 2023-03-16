import { Types } from "mongoose";

interface UserDocExercise {
  _id: string;
  weight: number;
  weightIncrease: number;
  repeats: number;
  timesPerRepeat: number;
}
export interface UserDoc {
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  role: "user" | "moderator" | "admin" | "owner";
  favoriteExercices: string[];
  workouts: {
    monday: {
      name: string;
      exercices: UserDocExercise[];
    };
    tuesday: {
      name: string;
      exercices: UserDocExercise[];
    };
    wednesday: {
      name: string;
      exercices: UserDocExercise[];
    };
    thursday: {
      name: string;
      exercices: UserDocExercise[];
    };
    friday: {
      name: string;
      exercices: UserDocExercise[];
    };
    saturday: {
      name: string;
      exercices: UserDocExercise[];
    };
    sunday: {
      name: string;
      exercices: UserDocExercise[];
    };
  };
}

export interface PostsDoc {
  text: string;
  imageUrl?: string;
  likes: string[];
  comments: { text: string; user: string }[];
  shares: string[];
  viewsCount: number;
  owner: Types.ObjectId;
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
