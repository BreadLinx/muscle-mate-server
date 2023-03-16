import UserModel from "../modules/AuthModule/user-model.js";

export const getUserFromDB = async (userId: string) => {
  const user = await UserModel.findById(userId).lean();

  if (!user) {
    return null;
  }

  return user;
};
