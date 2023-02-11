import UserModel from "./user-model.js";
import ExpiredTokenModel from "./expiredToken-model.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import { Response, Request } from "express";
import { HydratedDocument } from "mongoose";
import { UserDoc } from "../../types/modelsTypes.js";
import { DBUser } from "types/DBResponsesTypes.js";

import dotenv from "dotenv";
dotenv.config();

import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const authTokensPrivateKey = process.env.AUTH_TOKEN_KEY as string;
const refreshTokensPrivateKey = process.env.REFRESH_TOKEN_KEY as string;

const handleError = (res: Response, message: string) => {
  return res.status(500).json({ success: false, message });
};

const checkAuthTokenValidity = async (token: string) => {
  const checkedToken = await ExpiredTokenModel.findOne({
    type: "auth",
    token,
  });

  if (checkedToken) {
    return false;
  }
  return true;
};

const checkRefreshTokenValidity = async (token: string) => {
  try {
    jwt.verify(token, refreshTokensPrivateKey) as { _id: string };
    const checkedToken = await ExpiredTokenModel.findOne({
      type: "refresh",
      token,
    });

    if (checkedToken) {
      return false;
    }
    return true;
  } catch (err: any) {
    return false;
  }
};

const getUserFromDB = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    return null;
  }

  return user.toJSON();
};

export const signup = async (
  req: Request<{}, {}, { name: string; email: string; password: string }>,
  res: Response,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const doc: HydratedDocument<UserDoc> = new UserModel({
      email: req.body.email,
      name: req.body.name,
      passwordHash: password,
      avatarUrl: "",
    });

    const user = await doc.save();

    const authToken = jwt.sign(
      {
        _id: user._id,
      },
      authTokensPrivateKey,
      { expiresIn: "30m" },
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
      },
      refreshTokensPrivateKey,
      { expiresIn: "30d" },
    );

    const { passwordHash, __v, ...userData } = user.toJSON();

    res.json({ success: true, userData, authToken, refreshToken });
  } catch (err: any) {
    handleError(res, err);
  }
};

export const login = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Пользователя с таким Email не существует.",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user.toJSON().passwordHash,
    );

    if (!isValidPass) {
      return res.status(400).json({
        success: false,
        message: "Неверный логин или пароль.",
      });
    }

    const authToken = jwt.sign(
      {
        _id: user._id,
      },
      authTokensPrivateKey,
      { expiresIn: "30m" },
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
      },
      refreshTokensPrivateKey,
      { expiresIn: "30d" },
    );

    const { passwordHash, __v, ...userData } = user.toJSON();

    res.json({ success: true, userData, authToken, refreshToken });
  } catch (err: any) {
    handleError(res, err);
  }
};

export const signout = async (
  req: Request<
    { userId: string; authToken: string },
    {},
    { refreshToken: string }
  >,
  res: Response,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const authToken = req.params.authToken;
    const refreshToken = req.body.refreshToken;

    const authTokenValidity = await checkAuthTokenValidity(authToken);
    const refreshTokenValidity = await checkRefreshTokenValidity(refreshToken);
    if (!authTokenValidity || !refreshTokenValidity) {
      return res.status(403).json({
        success: false,
        message: "invalid signature",
      });
    }

    const authTokenDoc = new ExpiredTokenModel({
      type: "auth",
      token: authToken,
    });

    const refreshTokenDoc = new ExpiredTokenModel({
      type: "refresh",
      token: refreshToken,
    });

    await authTokenDoc.save();
    await refreshTokenDoc.save();

    res.json({
      success: true,
      message: "logged out successfully",
    });
  } catch (err: any) {
    handleError(res, err);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = (req.headers.authorization || "").split(" ")[1];
    let decoded;

    if (refreshToken) {
      try {
        decoded = jwt.verify(refreshToken, refreshTokensPrivateKey) as {
          _id: string;
        };
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

    const refreshTokenValidity = await checkRefreshTokenValidity(refreshToken);
    if (!refreshTokenValidity) {
      return res.status(403).json({
        success: false,
        message: "invalid signature",
      });
    }

    const user = (await getUserFromDB(decoded._id)) as DBUser;
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "invalid signature",
      });
    }

    const newAuthToken = jwt.sign(
      {
        _id: user._id,
      },
      authTokensPrivateKey,
      { expiresIn: "30m" },
    );

    res.json({ success: true, authToken: newAuthToken });
  } catch (err: any) {
    handleError(res, err);
  }
};

export const getMe = async (
  req: Request<{ userId: string; authToken: string }>,
  res: Response,
) => {
  try {
    const tokenValidity = await checkAuthTokenValidity(req.params.authToken);
    if (!tokenValidity) {
      return res.status(403).json({
        success: false,
        message: "invalid signature",
      });
    }

    const user = (await getUserFromDB(req.params.userId)) as DBUser;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Такого пользователя не существует",
      });
    }

    const { passwordHash, __v, ...userData } = user;

    res.json({ success: true, userData });
  } catch (err: any) {
    handleError(res, err);
  }
};

export const patchAvatar = async (
  req: Request<{ userId: string; authToken: string }>,
  res: Response,
) => {
  try {
    await checkAuthTokenValidity(req.params.authToken);
    const user = (await getUserFromDB(req.params.userId)) as DBUser;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Такого пользователя не существует",
      });
    }

    const imageAdress = user.avatarUrl;

    if (imageAdress !== "") {
      const adress = path.join(__dirname, "..", "..", imageAdress);
      fs.unlink(adress, (err: any) => {
        if (err) {
          console.log(err);
        }
      });
    }

    if (!req.file) {
      return;
    } // Сделать более точную ошибку

    await UserModel.updateOne(
      { _id: req.params.userId },
      { avatarUrl: `/uploads/avatars/${req.file.filename}` },
    );

    res.json({
      success: true,
      filePath: `/uploads/avatars/${req.file.filename}`,
    });
  } catch (err: any) {
    handleError(res, err);
  }
};
