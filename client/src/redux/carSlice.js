import { createSlice } from "@reduxjs/toolkit";

const carSlice = createSlice({
    name : "Cars",
    initialState : {
        CarsBox : []
    },
    reducers : {
        setBoxCars : (state,action)=>{
            state.CarsBox=action.payload
        }
    }
})

export const {setBoxCars} = carSlice.actions;
export default carSlice.reducer;