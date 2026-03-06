import {configureStore} from "@reduxjs/toolkit"
import bookingSlice from "./bookingSlice"
import ownerSlice from "./ownerSlice"
import userSlice from "./userSlice"
import carSlice from "./carSlice"

export const store = configureStore({
    reducer : {
        user : userSlice,
        bookings : bookingSlice,
        owner : ownerSlice,
        Cars : carSlice
    }   
})