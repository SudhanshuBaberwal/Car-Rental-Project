import  { uploadOnCloudinary } from "../configs/imageKit.js";
import User from "../models/user.model.js";
import Car from "../models/car.model.js";
import Booking from "../models/Booking.model.js";

export const changeRoleToOwner = async (req, res) => {
  try {
    const { id } = req.id;
    await User.findByIdAndUpdate(id, {
      role: "owner",
    });
    res.status(200).json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.log("Error in changeRoleToOwner function : ", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const addCar = async (req, res) => {
  try {
    const  _id  = req.id;
    if (!req.body.carData) {
      return res.status(400).json({
        success: false,
        message: "Car data is required",
      });
    }

    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    console.log(_id);
    // console.log(car);
    // console.log(imageFile);

    let image;
    if (imageFile) {
      image = await uploadOnCloudinary(req.file.path);
    }

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Image is Required" });
    }
    await Car.create({ ...car, owner: _id, image });
    res.status(200).json({ success: true, message: "Car Added" });
  } catch (error) {
    console.log("Error in addcar function : ", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.id;
    const cars = await Car.find({ owner: _id });
    res.status(200).json({
      success: true,
      cars,
    });
  } catch (error) {
    console.log("Error in getOwnerCars function : ", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const toggleCarAvailability = async (req, res) => {
  try {
    const  _id  = req.id;
    const { carId } = req.body;
    const car = await Car.findById(carId);
    console.log(_id)

    // checking is car belong to the user
    if (car.owner.toString() !== _id.toString()) {
      return res.status(400).json({ success: false, message: "Unauthorized" });
    }

    car.isAvaliable = !car.isAvaliable;
    await car.save();

    res.status(200).json({
      success: true,
      message: "Availability toggled",
    });
  } catch (error) {
    console.log("Error in toggleCarAvailability function : ", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const  _id  = req.id;
    const { carId } = req.body;
    const car = await Car.findById(carId);
    // console.log(car)

    // check car is belongs to the user
    if (car.owner.toString() !== _id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }

    car.owner = null;
    car.isAvaliable = false;
    console.log(car)

    res.status(200).json({
      success: true,
      message: "Car Removed",
    });
  } catch (error) {
    console.log("Error in deleteCar function : ", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getDeshboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role != "owner") {
      return res.status(400).json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });
    const pendingBookings = await Booking.find({
      owner: _id,
      status: "pending",
    });
    const completedBookings = await Booking.find({
      owner: _id,
      status: "confirmed",
    });

    // calculate monthlyRevenue from booking where status is confirmed
    const monthlyRevenue = bookings
      .slice()
      .filter((booking) => booking.status === "confirmed")
      .reduce((acc, booking) => acc + booking.price, 0);

    const deshboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    res.status(200).json({ success: true, deshboardData });
  } catch (error) {
    console.log("Error in getDeshboardData function : ", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;

    const imageFile = req.file;

    // const fileBuffer = fs.readFileSync(imageFile.path);
    // const response = (imageKit.FileUploadParams = {
    //   file: fileBuffer,
    //   fileName: imageFile.originalname,
    //   folder: "/cars",
    // });

    // const optimizedImageUrl = client.helper.buildSrc({
    //   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    //   src: imageFile.originalname,
    //   path : response.filePath,
    //   transformation : [
    //     {width : '400'},
    //     {quality : 'auto'},
    //     {format : 'webp'}
    //   ]
    // });

    let image;

    if (imageFile) {
      image = await uploadOnCloudinary(imageFile.path);
    }

    await User.findByIdAndUpdate(_id, { image });
    res.status(200).json({ seccess: true, message: "Image Updated" });
  } catch (error) {
    console.log("Error in updateUserImage function", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};
