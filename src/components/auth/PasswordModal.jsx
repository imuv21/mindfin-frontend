import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PartyPopperIcon = () => (
  <svg width="120" height="120" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cone base shape */}
    <path d="M100 140L65 80L135 80L100 140Z" fill="#FFD54F" stroke="#FFB300" strokeWidth="3"/>
    {/* Cone stripes */}
    <path d="M83 80L100 120M117 80L100 120" stroke="#EC407A" strokeWidth="5" strokeLinecap="round"/>
    {/* Confetti and streamers */}
    <path d="M140 60C140 60 160 50 170 70" stroke="#4285F4" strokeWidth="4" strokeLinecap="round"/>
    <path d="M60 60C60 60 40 50 30 70" stroke="#EA4335" strokeWidth="4" strokeLinecap="round"/>
    <path d="M120 40C120 40 140 30 150 40" stroke="#EA4335" strokeWidth="4" strokeLinecap="round"/>
    <path d="M80 40C80 40 60 30 50 40" stroke="#4285F4" strokeWidth="4" strokeLinecap="round"/>
    {/* Confetti dots */}
    <circle cx="150" cy="90" r="5" fill="#FBBC05"/>
    <circle cx="130" cy="110" r="4" fill="#34A853"/>
    <circle cx="50" cy="90" r="5" fill="#4285F4"/>
    <circle cx="70" cy="110" r="4" fill="#EA4335"/>
    <circle cx="160" cy="60" r="3" fill="#34A853"/>
    <circle cx="40" cy="60" r="3" fill="#FBBC05"/>
    <circle cx="110" cy="50" r="4" fill="#EA4335"/>
    <circle cx="90" cy="50" r="4" fill="#4285F4"/>
  </svg>
);

export const PasswordSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const navigate = useNavigate()
  
const handlelogin =()=>{
  navigate("/login")
  onClose()
}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xl flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full py-10 px-6 flex flex-col items-center">
        <div className="mb-4">
          <PartyPopperIcon />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-2 text-center">
          Password Update Successfully
        </h2>
        
        <p className="text-gray-500 text-center mb-8">
          Your password has been update successfully
        </p>
        
        <button 
          onClick={handlelogin}
          className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

