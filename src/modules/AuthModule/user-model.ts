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
  },
  { timestamps: true },
);

export default model<UserDoc>("User", UserSchema);
