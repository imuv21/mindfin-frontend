import MainLayout from "@/components/layout/MainLayout";
import ProfileHeader from "@/components/layout/ProfileHeader";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../helpers/Api";
import { CircularProgress, Alert, Box } from "@mui/material";
import { getProfile } from "../../redux/userSlice";
import Toastify from "../../helpers/Toastify";
import { unwrapResult } from "@reduxjs/toolkit";

const MyProfile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [propic, setPropic] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [imageError, setImageError] = useState(false);

  const user = useSelector((state) => state.user.user);
  console.log(user, "profileUser");

  const handleImageUpload = async ({
    e,
    allowedTypes = ["image/jpeg", "image/png", "image/jpg"],
  }) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Start loading
    setLoading(true);
    setAlertMessage(null);

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      //   alert("Invalid file format. Supported formats: .jpg, .jpeg, .png");.
      setAlertMessage({
        severity: "error",
        message: "Invalid file format. Supported formats: .jpg, .jpeg, .png",
      });
      setShowAlert(true);
      setLoading(false);
      return;
    }

    // Validate file size (< 1MB)
    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      setAlertMessage({
        severity: "error",
        message: "File size must be less than 1MB.",
      });
      setShowAlert(true);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.set("image", file);

      const { data, status } = await api.fileUpload(formData);
      console.log(data, "Uploaded image data");

      if (status === 200) {
        setPropic(data.data);

        const body = {
          _id: user?._id,
          profileImg: data?.data,
        };

        const { status } = await api.changeProPic(body);

        // if (status === 200) {
        //   const response = dispatch(getProfile());
        //   await unwrapResult(response);
        //   Toastify.success("Profile picture updated successfully");
        // }
      }
    } catch (error) {
      Toastify.error(error.response.data.message || `something went wrong`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <ProfileHeader name="My Profile" />
      <div className="flex flex-col md:flex-row gap-6 w-full p-6">
        {/* Left Section - General Info */}
        <div className="flex-1 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">
            General info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Full name
              </label>
              <input
                type="text"
                defaultValue="Jay Hargudson"
                className="w-full border border-[#A2A1A833] rounded-md p-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={`${user?.firstName} ${user?.lastName}`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email id
              </label>
              <input
                type="email"
                defaultValue="jayhargudson@gmail.com"
                className="w-full border border-[#A2A1A833] rounded-md p-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={user?.professionalEmail}
              />
            </div>

            {/* Phone Number */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Phone number
              </label>
              <input
                type="text"
                defaultValue="+91-9876543210"
                className="w-full border border-[#A2A1A833] rounded-md p-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={user?.phone}
              />
            </div>
          </div>
        </div>

        {/* Right Section - Photo Upload */}

        <div className="w-full md:w-60 flex flex-col items-center gap-2 border border-gray-200 rounded-xl p-4">
          <img
            src={
              user?.profileImg?.length > 0
                ? user?.profileImg[0]
                : "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
            }
            alt="Profile"
            className="w-32 h-32 rounded-md object-cover"
          />

          {/* Hidden input to trigger file upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload({ e })}
            className="hidden"
            id="upload-photo-input"
          />

          {/* Label as trigger for the file input */}

          {loading ? (
            <div className="mt-2 text-sm text-gray-600">
              <CircularProgress size={25} />
            </div>
          ) : (
            <>
              <label
                htmlFor="upload-photo-input"
                className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer"
              >
                Upload Photo
              </label>
            </>
          )}

          {/* Validation message */}
          <p className="text-[12px] text-gray-400 text-center mt-1">
            Image size should be under 1MB and <br /> image ratio needs to be
            1:1
          </p>

          {/* Alert component */}
          {showAlert && alertMessage && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <Alert
                severity={alertMessage.severity}
                onClose={() => setShowAlert(false)}
              >
                {alertMessage.message}
              </Alert>
            </Box>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MyProfile;
