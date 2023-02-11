import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export default (
  req: Request<{ userId: string; authToken: string }>,
  res: Response,
  next: NextFunction,
) => {
  const authToken = (req.headers.authorization || "").split(" ")[1];

  if (authToken) {
    try {
      const decoded = jwt.verify(authToken, "platon123") as { _id: string };
      req.params.userId = decoded._id;
      req.params.authToken = authToken;

      next();
    } catch (err: any) {
      return res.status(403).json({
        success: false,
        message: err.message,
      });
    }
  } else {
    return res.status(403).json({
      success: false,
      message: "invalid signature",
    });
  }
};
