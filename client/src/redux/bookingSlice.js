import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    myBookings: [],
    pickupLocation : "",
    pickupDate: "",
    returnDate:""
  },
  reducers: {
    setMyBookings: (state, action) => {
      state.myBookings = action.payload;
    },
    setReduxPickupLocation:(state,action)=>{
      state.pickupLocation=action.payload
    },
     setReduxPickupDate:(state,action)=>{
      state.pickupDate=action.payload
    },
     setReduxReturnDate:(state,action)=>{
      state.returnDate=action.payload
    },
  },
});

export const { setMyBookings , setReduxPickupLocation,setReduxPickupDate,setReduxReturnDate } = bookingSlice.actions; // ✅
export default bookingSlice.reducer; // ✅
