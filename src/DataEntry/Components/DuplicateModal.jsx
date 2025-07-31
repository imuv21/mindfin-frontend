import React, { useState } from 'react';

const DuplicateModal = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOkay = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 4000); // 4 seconds
  };
  

  return (
    <div
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }} 
    className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center shadow-lg">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
            <svg width="110" height="95" viewBox="0 0 110 95" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 95H110L55 0L0 95ZM60 80H50V70H60V80ZM60 60H50V40H60V60Z" fill="#F45B69" />
            </svg>

        </div>

        {/* Title */}
        <h2 className="text-[30px] font-semibold text-[#16151C]">Duplicate Data Found!</h2>

        {/* Subtext */}
        <p className="text-[16px] text-[#A2A1A8] mt-1">
          Proceed to remove the duplicate leads by press following okey button
        </p>

        {/* Button */}
        {/* <button
          onClick={onClose}
          className="mt-6 w-full bg-[#F45B69] text-white font-medium py-2 rounded-lg hover:bg-red-600 transition"
        >
          Okay
        </button> */}

<button
          onClick={handleOkay}
          disabled={isLoading}
          className={`mt-6 w-full text-white font-medium py-2 rounded-lg transition ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#F45B69] hover:bg-red-600'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Loading...
            </div>
          ) : (
            'Okay'
          )}
        </button>
      </div>
    </div>
  );
};

export default DuplicateModal;
