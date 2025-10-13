import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (userId) => {
  const payLoad = userId;
  return jwt.sign(payLoad, process.env.JWT_SECRET);
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Fill All The Fields" });
    }
    const userExiste = await User.findOne({ email });
    if (userExiste) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());
    res.status(200).json({
      success: true,
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.log("Error in register user function" , error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }
    const isMatch = await bcrypt.compare(password , user.password);
    if (!isMatch){
        return res.status(400).json({success : false , 
            message : "Invalid Credentials"
        })
    }

    const token = generateToken(user._id.toString())
    res.status(200).json({
        success : true,
        message : "User Login Successfully",
        token
    })
  } catch (error) {
    console.log("Error in Login User function")
    return res.status(400).json({success : false , message : error.message})
  }
};

// Get User data

export const getUserData = async (req , res) => {
    try {
        const {user} = req;
        res.status(200).json({
            success : true,
            user
        })
    } catch (error) {
        console.log("Error in getUser data" , error.message);
        return res.status(400).json({success : false , message : error.message})
    }
}
