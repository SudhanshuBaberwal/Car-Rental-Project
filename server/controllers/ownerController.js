import ImageKit from "@imagekit/nodejs";
import path, { format } from "path";
import imageKit from "../configs/imageKit.js";
import User from "../models/user.model.js";
import fs from "fs";
import { URLEndpoints } from "@imagekit/nodejs/resources/accounts/url-endpoints.mjs";
import Car from "../models/car.model.js";
// import { ImageKit } from "@imagekit/nodejs/client";

export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, {
      role: "owner",
    });
    res.status(200).json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.log("Error in changeRoleToOwner function : ", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// API to list car

export const addCar = async (req, res) => {
  const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  });

  const { _id } = req.user;
  let car = JSON.parse(req.body.carData);
  const imageFile = req.file;

  const fileBuffer = fs.readFileSync(imageFile.path);
  const response = (imageKit.FileUploadParams = {
    file: fileBuffer,
    fileName: imageFile.originalname,
    folder: "/cars",
  });

  const optimizedImageUrl = client.helper.buildSrc({
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    src: imageFile.originalname,
  });

  const image = optimizedImageUrl;

  if (!image) {
    return res
      .status(400)
      .json({ success: false, message: "Image is Required" });
  }
  await Car.create({ ...car, owner: _id, image });
  res.status(200).json({ success: true, message: "Car Added" });
};

// export const addCar = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     let car = JSON.parse(req.body.carData);
//     const imageFile = req.file;

//     // upload image to imagekit
//     const fileBuffer = fs.readFileSync(imageFile.path);
//     const response =  imageKit.FileUploadParams = {
//       file: fileBuffer,
//       fileName: imageFile.originalname,
//       folder : '/cars'
//     };
//     // const response = await imageKit.upload( {
//     //   file: fileBuffer,
//     //   fileName: imageFile.originalname,
//     //   folder : '/cars'
//     // });

//     var optimizedImageUrl = imageKit.helper.buildSrc({
//       path : response.filepath,
//       transformation : [
//         {width : '1280'},
//         {quality : 'auto'},
//         {format : 'webp'}
//       ]
//     });

//     const image = optimizedImageUrl;

//     if (!image){
//       return res.status(400).json({success : false , message : "Image is Required"})
//     }
//     await Car.create({...car , owner : _id , image})
//     res.status(200).json({success : true , message : "Car Added"})
//   } catch (error) {
//     console.log("Error in addcar function : ", error.message);
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };
