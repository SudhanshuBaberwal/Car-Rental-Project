// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";

// export const protect = async (req, res, next) => {
//   const token = req.cookies.token ||  req.headers.authorization;
//   console.log(token)
//   if (!token) {
//     return res.status(400).json({
//       success: false,
//       message: "not authorized",
//     });
//   }
//   try {
//     const userId = jwt.decode(token, process.env.JWT_SECRET);
//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "Not Authorized",
//       });
//     }
//     req.user = await User.findById(userId).select("-password");
//     next();
//   } catch (error) {
//     console.log("error in protect function", error.message);
//     return res.status(400).json({
//       success: false,
//       message: "Not Authorized",
//     });
//   }
// };


import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Token not provided",
        });
    }
    let verifyToken = await jwt.verify(token , process.env.MYSECRET)
    if (!verifyToken?.userId){
        return res.status(400).json({
            success: false,
            message : "Not Authorized"
        })
    }
    // console.log(verifyToken.userId)
    req.id = verifyToken.userId;
    next();
  } catch (error) {
    console.log("Error in Auth function : ", error);
    return res.status(500).json({success : false, message : error.message})
  }
};

export default isAuth;