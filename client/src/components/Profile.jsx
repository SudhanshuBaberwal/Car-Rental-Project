import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import axios from "axios"; // Make sure axios is imported
// import { setUserData } from "../redux/userSlice"; // Import your action

const Profile = () => {
  const userdata = useSelector((state) => state.user);
  const isOwner = useSelector((state) => state.owner);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local state for image preview and upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Redirect to login if not logged in
  // 1. Handle File Selection & Show Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a temporary local URL for preview
    }
  };

  // 2. Cancel Upload
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // 3. Confirm & Upload to API
  const handleConfirm = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile); // Ensure "image" matches your backend multer/upload setup

    try {
      // Replace with your actual API endpoint
      const { data } = await axios.post(
        "http://localhost:3000/api/user/update-profile", 
        formData, 
        { withCredentials: true }
      );

      // Update Redux state so the new image shows instantly across the app (Navbar, etc.)
      // dispatch(setUserData(data.user)); 

      toast.success("Profile picture updated!");
      
      // Clear preview states after successful upload
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to update profile picture.");
    } finally {
      setIsUploading(false);
    }
  };

  // Determine which image to show: Preview first, then Redux Data, then Initials fallback
  const displayImage = previewUrl || userdata?.userData?.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-6 md:px-16 lg:px-24 xl:px-32 py-10 bg-gray-50 flex justify-center items-start"
    >
      <div className="w-full max-w-3xl bg-white border border-borderColor rounded-2xl shadow-sm overflow-hidden">
        {/* Profile Header Background */}
        <div className="h-32 bg-gray-200 w-full relative mb-8">
          
          {/* Editable Avatar */}
          <div className="absolute -bottom-12 left-8 flex flex-col items-center z-10">
            <div className="w-24 h-24 bg-white rounded-full p-1 border border-borderColor flex items-center justify-center overflow-hidden group">
              <label htmlFor="profile-upload" className="w-full h-full cursor-pointer relative flex items-center justify-center rounded-full overflow-hidden">
                
                {/* Image or Initials */}
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt="Profile Preview"
                    className={`w-full h-full object-cover ${previewUrl ? 'opacity-80' : ''}`}
                  />
                ) : (
                  <span className="text-gray-600 font-bold text-3xl uppercase bg-gray-100 w-full h-full flex items-center justify-center">
                    {userdata?.userData?.fullname ? userdata.userData.fullname.charAt(0) : "U"}
                  </span>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                  <span className="text-white text-xs font-semibold">Change</span>
                </div>
              </label>

              {/* Hidden File Input */}
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            
            {/* Confirm / Cancel Buttons (Only visible when previewing) */}
            {previewUrl && (
              <div className="mt-3 flex gap-2 absolute top-24 -left-2 bg-white p-2 rounded-lg shadow-md border border-borderColor">
                <button 
                  onClick={handleCancel}
                  disabled={isUploading}
                  className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={isUploading}
                  className="px-3 py-1 text-xs bg-black text-white rounded hover:bg-gray-800 font-medium disabled:opacity-50"
                >
                  {isUploading ? "Saving..." : "Confirm"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="pt-8 pb-8 px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {userdata?.userData?.fullname || "User Name"}
            </h1>
            <p className="text-gray-500 mt-1">
              {userdata?.userData?.email || "user@example.com"}
            </p>

            {/* Account Status Badge */}
            <div className="mt-3 inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-borderColor">
              {isOwner?.IsOwner ? "Car Owner / Host" : "Standard User"}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full sm:w-auto mt-4 sm:mt-0">
            {isOwner?.IsOwner && (
              <button
                onClick={() => navigate("/owner")}
                className="w-full sm:w-auto px-6 py-2 bg-black border border-borderColor hover:bg-gray-800 transition-all text-white rounded-lg cursor-pointer"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Extra Information Section */}
        <div className="border-t border-borderColor p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Account Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <p className="font-medium text-gray-800">Phone Number</p>
              <p className="mt-1">{userdata?.userData?.phone || "Not provided"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-800">Joined</p>
              <p className="mt-1">
                {userdata?.userData?.createdAt
                  ? new Date(userdata.userData.createdAt).toLocaleDateString()
                  : "Recently"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;