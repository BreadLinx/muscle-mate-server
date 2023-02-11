import { Types } from "mongoose";

export interface UserDoc {
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  __v: number;
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
}
