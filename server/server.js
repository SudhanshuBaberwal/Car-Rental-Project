import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./configs/db.js"
import userRouter from "./routes/userRoutes.js"
import ownerRouter from "./routes/ownerRoutes.js"

// Initialize express app
const app = express()
await connectDB()
dotenv.config();

// Middleware
app.use(cors())
app.use(express.json())

app.get("/" , (req , res) => {
    res.send("Hello")
})
app.use("/api/user" ,  userRouter);
app.use("/api/owner" , ownerRouter)

const PORT = process.env.PORT || 3000;
app.listen( PORT || 3000 , () => {
    console.log(`Server running on ${PORT} port`)
})