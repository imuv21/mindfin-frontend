import React from 'react';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import api from '../helpers/Api';
import Toastify from '../helpers/Toastify';

const UploadDocumnet = () => {

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("Selected file:", file);

    const formData = new FormData();
    formData.append("folderName", "telecaller-leads");
    formData.append("image", file);

    try {
      console.log("Uploading file...");

      const res = await api.uploadTelecallerLeads(formData);

      console.log("Upload response:", res);

      if (res.status === 200) {
        Toastify.success("Leads uploaded successfully");
        console.log("Upload successful");
      }
    } catch (err) {
      console.error("Upload error:", err);
      Toastify.error("Upload failed. Try again.");
    } finally {
      event.target.value = null; // reset input
    }
  };

  return (
    <MainLayout>
      <ProfileHeader name='Admin' />
      <div className="container m-auto p-4">
        <div className="flex items-center justify-center flex-col bg-[#fff] rounded-[8px] p-4 h-100">
          <label
            htmlFor="upload-file"
            className="flex items-center gap-2 text-white bg-[#2563EB] rounded-lg px-4 py-2 text-sm font-medium cursor-pointer"
          >
            <svg
              width="19"
              height="18"
              viewBox="0 0 19 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.25 11.25V14.25C16.25 14.6478 16.092 15.0294 15.8107 15.3107C15.5294 15.592 15.1478 15.75 14.75 15.75H4.25C3.85218 15.75 3.47064 15.592 3.18934 15.3107C2.90804 15.0294 2.75 14.6478 2.75 14.25V11.25"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.25 6L9.5 2.25L5.75 6"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.5 2.25V11.25"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Upload Document
          </label>
          <input
            id="upload-file"
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="text-gray-500 text-[16px] pt-2">
            UPLOAD DATA, XLS or CSV
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UploadDocumnet;
