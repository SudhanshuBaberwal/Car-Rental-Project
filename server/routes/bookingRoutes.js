import express from "express"
import { changeBookingStatus, checkAvailability, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";
import isAuth from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability" , checkAvailability)
bookingRouter.post("/create" , isAuth , createBooking)
bookingRouter.get("/user" , isAuth , getUserBookings)
bookingRouter.get("/owner" , isAuth , getOwnerBookings)
bookingRouter.post("/change-status" , isAuth , changeBookingStatus)

export default bookingRouter;