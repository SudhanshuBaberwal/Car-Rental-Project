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
} from "../controllers/userController.js";
import isAuth from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/verifyEmail", verifyEmail);
authRouter.post("/forgot-password", forgotPassword);
authRouter.get("/logout", logout);
authRouter.post("/reset-password/:token", resetPassword);
authRouter.get("/getCurrentUser" , isAuth , getCurrentUser)
authRouter.get("/cars" , isAuth , getCars)

export default authRouter;
