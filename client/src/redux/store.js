import {configureStore} from "@reduxjs/toolkit"
import bookingSlice from "./bookingSlice"
import ownerSlice from "./ownerSlice"
import userSlice from "./userSlice"

export const store = configureStore({
    reducer : {
        user : userSlice,
        booking : bookingSlice,
        owner : ownerSlice
    }
})