import PostsModel from "./post-model.js";
import UserModel from "../AuthModule/user-model.js";
import { Response, Request } from "express";

const handleError = (res: Response, message: string) => {
  return res.status(500).json({ success: false, message });
};

export const createPost = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    const user = await UserModel.findById(req.params.userId);

    if (!user) {
      return;
    } // сделать более точную ошибку

    const doc = new PostsModel({
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      likes: req.body.likes,
      comments: req.body.comments,
      shares: req.body.shares,
      viewsCount: req.body.viewsCount,
      owner: req.params.userId,
    });

    const post = await doc.save();

    res.json({
      success: true,
      data: { ...post.toJSON(), owner: { ...user.toJSON() } },
    });
  } catch (err: any) {
    handleError(res, err);
  }
};

export const getPosts = async (
  req: Request & { query: { skip: number } },
  res: Response,
) => {
  try {
    const posts = await PostsModel.find()
      .sort({ createdAt: -1 })
      .skip(req.query.skip)
      .limit(20);

    const preparedPosts = await Promise.all(
      posts.map(async post => {
        const user = await UserModel.findById(post.owner);
        return { ...post.toJSON(), owner: { ...user?.toJSON() } };
      }),
    );

    res.json(preparedPosts);
  } catch (err: any) {
    handleError(res, err);
  }
};
