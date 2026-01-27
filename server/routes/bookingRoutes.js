import express from "express"
import { changeBookingStatus, checkAvailability, checkAvailabilityOfCar, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";
import isAuth from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability" , checkAvailabilityOfCar)
bookingRouter.post("/create-booking" , isAuth , createBooking)
bookingRouter.get("/my-bookings" , isAuth , getUserBookings)
bookingRouter.get("/owner-bookings" , isAuth , getOwnerBookings)
bookingRouter.post("/change-status" , isAuth , changeBookingStatus)

export default bookingRouter;