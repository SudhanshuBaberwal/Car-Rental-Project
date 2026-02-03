import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import authRouter from "./routes/userRoutes.js";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";

// Initialize express app
const app = express();
// dotenv.config();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

await connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT || 3000, () => {
  console.log(`Server running on ${PORT} port`);
});
