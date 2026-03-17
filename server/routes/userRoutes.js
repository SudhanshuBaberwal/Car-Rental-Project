import express from "express";
import {
  getCars,
  getCurrentUser,
  login,
  signup,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updateProfile,
} from "../controllers/userController.js";
import isAuth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/verifyEmail", verifyEmail);
authRouter.post("/forgot-password", forgotPassword);
authRouter.get("/logout", logout);
authRouter.post("/reset-password/:token", resetPassword);
authRouter.get("/getCurrentUser", isAuth, getCurrentUser);
authRouter.get("/cars", isAuth, getCars);
authRouter.post(
  "/update-profile",
  isAuth,
  upload.single("image"),
  updateProfile,
);

export default authRouter;
