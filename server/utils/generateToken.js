import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret){
    return res.status(500).json({success : false , message : "Secret Key is not provided"})
  }
  console.log( "secret : " + secret)
  const token = jwt.sign(
    { userId }, 
    secret,
    { expiresIn: "7d" }
  );
  if (!token) {
    return res
      .status(500)
      .json({ success: false, message: "Invalid or Expired Token" });
  }
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
