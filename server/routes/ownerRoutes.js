import express from "express";
import isAuth from "../middleware/auth.js";
import {
  addCar,
  changeRoleToOwner,
  deleteCar,
  getDeshboardData,
  getOwnerCars,
  getOwnerData,
  toggleCarAvailability,
  updateUserImage,
} from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", isAuth, changeRoleToOwner);
ownerRouter.post("/add-car", isAuth, upload.single("image"), addCar);
ownerRouter.get("/cars", isAuth, getOwnerCars);
ownerRouter.post("/toggle-car", isAuth, toggleCarAvailability);
ownerRouter.post("/delete-car", isAuth, deleteCar);
ownerRouter.get("/get-owner-data" , isAuth , getOwnerData)
ownerRouter.get("/deshboard", isAuth, getDeshboardData);
ownerRouter.post(
  "/update-image",
  isAuth,
  upload.single("image"),
  updateUserImage,
);
export default ownerRouter;
