import Booking from "../models/Booking.model.js";
import Car from "../models/car.model.js";


export const checkAvailability = async (car, pickupDate, returnDate) => {
  const booking = await Booking.find({
    car,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });
  return booking.length === 0;
};


export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    // fetch all the cars available on the given location
    const cars = await Car.find({ location, isAvaliable: true });

    // check car availability for the given date and range using promise
    const availableCarsPromise = cars.map(async (car) => {
      const isAvailable = await checkAvailability(
        car._id,
        pickupDate,
        returnDate
      );
      return { ...car._doc, isAvailable: isAvailable };
    });

    let availableCars = await Promise.all(availableCarsPromise);
    availableCars = availableCars.filter((car) => car.isAvailable === true);

    res
      .status(200)
      .json({ sucess: true, message: "Car is Availble or Not", availableCars });
  } catch (error) {
    console.log("Error in checkavailabilityofcar function", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;
    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res
        .status(400)
        .json({ success: false, message: "Car is Not available" });
    }

    const carData = await Car.findById(car);

    // calculate price based on pickup and return date
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const price = carData.pricePerDay * noOfDays;

    await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
    });
    return res.status(200).json({ success: true, message: "Booking Created" });
  } catch (error) {
    console.log("Error in createBooking function", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true , bookings });
  } catch (error) {
    console.log("Error in getUsersBookings function", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

//API to get owner bookings

export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res
        .status(400)
        .json({ success: false, message: "Not Authorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.log("Error in getOwnerBookings function", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// API to change to change booking status
export const changeBookingStatus = async (req , res) => {
    try {
        const {_id} = req.user;
        const {bookingId , status} = req.body;
        const booking = await Booking.findById(bookingId)

        if (!booking.owner.toString() !== _id.toString()){
            return res.status(400).json({success : false , message : "Not authorized"})
        }

        booking.status = status;
        await booking.save()
        return res.status(200).json({success : true , message : "Stauts Updated"})
    } catch (error) {
        console.log("Error in getOwnerBookings function" , error.message)
        return res.status(400).json({success : false , message : error.message})
    }
}