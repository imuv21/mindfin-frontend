// src/components/auth/OTPButton.jsx
import React from "react";
// import { Button } from "@/components/ui/button";
import { Button } from "@/components/ui/Button";

const OTPButton = ({ onClick, loading = false,children }) => {
  return (
    <Button 
    className={`w-full py-3 bg-blue-500 text-white rounded font-medium text-sm ${loading ? 'opacity-70' : 'hover:bg-blue-600'}`}
    onClick={onClick}
    disabled={loading}
  >
    {loading ? 'Sending...' : children}
    </Button>
  );
};

export default OTPButton;