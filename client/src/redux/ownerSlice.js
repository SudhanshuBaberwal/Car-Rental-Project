import { createSlice } from "@reduxjs/toolkit";

const carSlice = createSlice({
    name : "Car",
    initialState : {
        ownerData : null,
        ownerCars : []
    },
    reducers : {
        setOwnerData : (state,action) => {
            state.ownerData = action.payload;
        },
        setOwnerCars : (state,action) => {
            state.ownerCars = action.payload;
        }
    }
})

export const {setOwnerCars , setOwnerData} = carSlice.actions;
export default carSlice.reducer;