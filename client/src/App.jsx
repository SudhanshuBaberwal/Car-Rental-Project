import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import Cars from "./pages/Cars";
import MyBookings from "./pages/MyBookings";
import Footer from "./components/Footer";
import Layout from "./pages/owner/Layout";
import Dashboard from "./pages/owner/Dashboard";
import AddCar from "./pages/owner/AddCar";
import ManageCars from "./pages/owner/ManageCars";
import ManageBookings from "./pages/owner/ManageBookings";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import Signup from "./components/Signup";
import VerifyEmail from "./components/VerifyEmail";
import MainLayout from "./utils/MainLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserData } from "./redux/userSlice";
import { changeRole } from "./middleware/api";
import { setIsOwner, setOwnerData } from "./redux/ownerSlice";

const App = () => {

  axios.defaults.withCredentials = true

  const dispatch = useDispatch()
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {data} = await axios.get("http://localhost:3000/api/user/getCurrentUser", {withCredentials: true})
        // console.log(data)
        dispatch(setUserData(data.userData))
      } catch (error) {
        console.log(error)
      }
    }
    const fetchOwner = async () => {
      try {
        const {data} = await axios.get("http://localhost:3000/api/owner/get-owner-data")
        console.log(data)
        dispatch(setOwnerData(data.owner))
        dispatch(setIsOwner(true))
      } catch (error) {
        console.log(error)
      }
    }
    fetchUser()
    fetchOwner()
  } , [dispatch])
  
  return (
    <>
      <Toaster />
      <Routes>
        {/* 🔥 MAIN LAYOUT (Navbar + Footer everywhere) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verifyEmail" element={<VerifyEmail />} />
        <Route element={<MainLayout />}>
          {/* Auth pages (Navbar + Footer INCLUDED) */}

          {/* User pages */}
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/car-details/:id" element={<CarDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          {/* Owner dashboard */}
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-car" element={<AddCar />} />
            <Route path="manage-cars" element={<ManageCars />} />
            <Route path="manage-bookings" element={<ManageBookings />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
