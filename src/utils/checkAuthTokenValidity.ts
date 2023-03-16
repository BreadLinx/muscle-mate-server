import ExpiredTokenModel from "../modules/AuthModule/expiredToken-model.js";

export const checkAuthTokenValidity = async (token: string) => {
  const checkedToken = await ExpiredTokenModel.findOne({
    type: "auth",
    token,
  });

  if (checkedToken) {
    return false;
  }
  return true;
};
