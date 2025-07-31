// src/components/auth/EmailInput.jsx
import React from "react";
// import { Input } from "@/components/ui/input";
// import { EnvelopeIcon } from "lucide-react";

const EmailInput = ({ value, onChange, name,placeholder = "Enter Registered Email" }) => {
  return (
    // <div className="relative">
    //   <Input
    //     type="email"
    //     value={value}
    //     onChange={onChange}
    //     placeholder={placeholder}
    //     className="pl-10"
    //   />
    // </div>

    <div className='mb-4'>
    <div className='flex items-center border border-gray-300 rounded px-3 py-2'>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <input
        type="email"
        placeholder="Enter Registered Email"
        className='w-full outline-none text-sm'
        value={value}
        onChange={onChange}
        name={name}
      />
    </div>
  </div>
  );
};

export default EmailInput;