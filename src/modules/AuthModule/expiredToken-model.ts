import { Schema, model } from "mongoose";
import { ExpiredTokenDoc } from "../../types/modelsTypes.js";

const ExpiredTokenSchema = new Schema<ExpiredTokenDoc>(
  {
    type: { type: String, required: true },
    token: { type: String, required: true },
  },
  { timestamps: true },
);

export default model<ExpiredTokenDoc>("ExpiredToken", ExpiredTokenSchema);
