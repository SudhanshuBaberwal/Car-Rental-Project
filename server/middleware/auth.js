import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    // console.log(req)
    // console.log(req.header.cookie)
    // console.log( "token : " + token);

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token not provided",
      });
    }
    let verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken?.userId) {
      return res.status(400).json({
        success: false,
        message: "Not Authorized",
      });
    }
    // console.log(verifyToken)
    req.id = verifyToken.userId;
    // console.log(req.id)
    next();
  } catch (error) {
    console.log("Error in Auth function : ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default isAuth;
