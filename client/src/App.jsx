import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import Cars from "./pages/Cars";
import MyBookings from "./pages/MyBookings";
import Layout from "./pages/owner/Layout";
import Dashboard from "./pages/owner/Dashboard";
import AddCar from "./pages/owner/AddCar";
import ManageCars from "./pages/owner/ManageCars";
import ManageBookings from "./pages/owner/ManageBookings";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import Signup from "./components/Signup";
import VerifyEmail from "./components/VerifyEmail";
import MainLayout from "./utils/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserData } from "./redux/userSlice";
import { changeRole } from "./middleware/api";
import { setIsOwner, setOwnerData } from "./redux/ownerSlice";
import { setBoxCars } from "./redux/carSlice";
import Profile from "./components/Profile";
import ProtectedRoute from "./utils/ProtectedRoute";
import OwnerRoute from "./utils/OwnerRoute";
import CarLoader from "./utils/PremiumCarLoader";
axios.defaults.withCredentials = true;

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const isOwner = useSelector((state) => state.owner.IsOwner);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initApp = async () => {
      try {
        // ✅ Fetch user
        const { data } = await axios.get(
          "http://localhost:3000/api/user/getCurrentUser",
        );

        dispatch(setUserData(data.userData));

        // ✅ Fetch owner only if user exists
        if (data.userData) {
          try {
            const ownerRes = await axios.get(
              "http://localhost:3000/api/owner/get-owner-data",
            );

            dispatch(setOwnerData(ownerRes.data.owner));
            dispatch(setIsOwner(true));
          } catch {
            dispatch(setIsOwner(false));
          }
        }
      } catch {
        dispatch(setUserData(null));
      }

      // ✅ Fetch cars (independent)
      try {
        const res = await axios.get("http://localhost:3000/api/user/cars");
        dispatch(setBoxCars(res.data.cars));
      } catch (error) {
        console.log("Error fetching cars");
      }

      setLoading(false);
    };

    initApp();
  }, [dispatch]);


  return (
    <>
      <Toaster />

      <Routes>
        {/* ❌ Auth pages WITHOUT layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verifyEmail" element={<VerifyEmail />} />

        {/* ✅ ALL pages WITH Navbar + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/car-details/:id" element={<CarDetails />} />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute user={user}>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 🚗 Owner Routes */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute user={user}>
                <OwnerRoute isOwner={isOwner}>
                  <Layout />
                </OwnerRoute>
              </ProtectedRoute>
            }
          >
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
