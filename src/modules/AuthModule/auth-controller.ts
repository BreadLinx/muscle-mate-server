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
import { checkAuthTokenValidity } from "../../utils/checkAuthTokenValidity.js";
import { IAuthRequestParams } from "../../types/requestTypes.js";
import { getUserFromDB } from "../../utils/getUserFromDB.js";
import { handleError } from "../../utils/handleError.js";
import { handleUpload } from "../../utils/cloudinary.js";

import dotenv from "dotenv";
dotenv.config();

import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const authTokensPrivateKey = process.env.AUTH_TOKEN_KEY as string;
const refreshTokensPrivateKey = process.env.REFRESH_TOKEN_KEY as string;

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
      role: "user",
      userExercises: [],
      workouts: {
        monday: {
          name: "",
          completed: false,
          exercices: [],
        },
        tuesday: {
          name: "",
          completed: false,
          exercices: [],
        },
        wednesday: {
          name: "",
          completed: false,
          exercices: [],
        },
        thursday: {
          name: "",
          completed: false,
          exercices: [],
        },
        friday: {
          name: "",
          completed: false,
          exercices: [],
        },
        saturday: {
          name: "",
          completed: false,
          exercices: [],
        },
        sunday: {
          name: "",
          completed: false,
          exercices: [],
        },
      },
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
      { expiresIn: "365d" },
    );

    const { passwordHash, ...userData } = user.toJSON();

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
      { expiresIn: "365d" },
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
      },
      refreshTokensPrivateKey,
      { expiresIn: "365d" },
    );

    const { passwordHash, ...userData } = user.toJSON();

    res.json({ success: true, userData, authToken, refreshToken });
  } catch (err: any) {
    handleError(res, err);
  }
};

export const signout = async (
  req: Request<IAuthRequestParams, {}, { refreshToken: string }>,
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

    const user = await getUserFromDB(decoded._id);
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
  req: Request<IAuthRequestParams>,
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

    const user = await getUserFromDB(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Такого пользователя не существует",
      });
    }

    const { passwordHash, ...userData } = user;

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
    const tokenValidity = await checkAuthTokenValidity(req.params.authToken);
    if (!tokenValidity) {
      return res.status(403).json({
        success: false,
        message: "invalid signature",
      });
    }

    const user = await getUserFromDB(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "there is no such a user",
      });
    }

    const imageAdress = user.avatarUrl;

    if (imageAdress !== "") {
      const adress = path.join(__dirname, "..", "..", "..", imageAdress);
      try {
        fs.unlink(adress, err => {
          console.log(err);
        });
      } catch (err) {
        console.log(err);
      }
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

export const createUserExercise = async (
  req: Request<{ userId: string; authToken: string }>,
  res: Response,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const tokenValidity = await checkAuthTokenValidity(req.params.authToken);
    if (!tokenValidity) {
      return res.status(403).json({
        success: false,
        message: "invalid signature",
      });
    }
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "there is no such a user",
      });
    }

    if (!req.file) {
      handleError(res, "there was a trouble adding the file, try again later");
      return;
    }
    let imageURL;
    try {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      const { secure_url } = cldRes;
      imageURL = secure_url;
    } catch (err) {
      console.log(err);
      res.send({
        message: err,
      });
    }
    const muscleGroups = req.body.groups.split(", ");

    user.userExercises.push({
      image: imageURL as string,
      name: req.body.name,
      muscleGroups,
      description: req.body.description,
      tutorialLink: req.body.tutorialLink,
    });

    const userData = (await user.save()).toJSON();
    res.json({
      success: true,
      data: { ...userData },
    });
  } catch (err: any) {
    handleError(res, err);
  }
};
