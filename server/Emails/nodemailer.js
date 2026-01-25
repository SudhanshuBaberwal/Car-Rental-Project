import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service : "gmail",
  auth: {
    user:"24bcs147@iiitdwd.ac.in",
    pass: "qbtkegewjfmskcsw",
  },
});

export default transporter;