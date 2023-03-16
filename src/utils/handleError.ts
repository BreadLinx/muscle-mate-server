import { Response } from "express";

export const handleError = (res: Response, message: string) => {
  return res.status(500).json({ success: false, message });
};
