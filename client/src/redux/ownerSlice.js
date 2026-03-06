import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
    name : "owner",
    initialState : {
        ownerData : null,
        ownerCars : [],
        IsOwner : false
    },
    reducers : {
        setOwnerData : (state,action) => {
            state.ownerData = action.payload;
        },
        setOwnerCars : (state,action) => {
            state.ownerCars = action.payload;
        },
        setIsOwner : (state,action)=> {
            state.IsOwner = action.payload;
        }
    }
})

export const {setOwnerCars , setOwnerData , setIsOwner} = ownerSlice.actions;
export default ownerSlice.reducer;