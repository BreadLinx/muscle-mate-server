import mongoose, { Schema, model } from "mongoose";
import { PostsDoc } from "../../types/modelsTypes.js";

const PostSchema = new Schema<PostsDoc>(
  {
    text: {
      type: String,
      required: true,
    },
    imageUrl: String,
    likes: { type: [String], default: [] },
    comments: {
      type: [{ text: String, user: Schema.Types.ObjectId }],
      default: [],
    },
    shares: {
      type: [String],
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

export default model("Post", PostSchema);
