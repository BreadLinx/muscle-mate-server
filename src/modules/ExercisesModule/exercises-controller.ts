import ExerciseModel from "./exercise-model.js";
import UserModel from "../AuthModule/user-model.js";
import { Response, Request } from "express";
import { checkAuthTokenValidity } from "../../utils/checkAuthTokenValidity.js";
import { IAuthRequestParams } from "../../types/requestTypes.js";
import { getUserFromDB } from "../../utils/getUserFromDB.js";
import { handleError } from "../../utils/handleError.js";
import { validationResult } from "express-validator";
import { handleUpload } from "../../utils/cloudinary.js";

export const createExercise = async (
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

    const user = await getUserFromDB(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "there is no such a user",
      });
    }

    // if (!user.role || user.role === "user") {
    //   return res.status(500).json({
    //     success: false,
    //     message: "you don not have enough rights to do this action",
    //   });
    // }

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

    const muscleGroups = req.body.groups.split(",");

    const doc = new ExerciseModel({
      image: imageURL,
      name: req.body.name,
      muscleGroups,
      description: req.body.description,
      tutorialLink: req.body.tutorialLink,
    });

    const exercise = (await doc.save()).toJSON();

    res.json({
      success: true,
      ...exercise,
    });
  } catch (err: any) {
    handleError(res, err);
  }
};

export const getExercises = async (req: Request, res: Response) => {
  try {
    const exercises = await ExerciseModel.find();
    res.json({ success: true, data: exercises });
  } catch (err: any) {
    handleError(res, err);
  }
};
