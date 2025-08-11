import React, { useState } from 'react';

const DuplicateModal = ({ onClose, duplicateLeads = [], duplicateCount = 0 }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOkay = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }); 
  };

  return (
    <div
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }} 
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-lg text-center shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <svg width="110" height="95" viewBox="0 0 110 95" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 95H110L55 0L0 95ZM60 80H50V70H60V80ZM60 60H50V40H60V60Z" fill="#F45B69" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-[30px] font-semibold text-[#16151C]">
          Duplicate Data Found!
        </h2>

        {/* Subtext */}
        <p className="text-[16px] text-[#A2A1A8] mt-1 mb-4">
          {duplicateCount > 0 
            ? `Found ${duplicateCount} duplicate lead(s) based on email/phone number matches.`
            : 'Proceed to remove the duplicate leads by pressing the okay button.'
          }
        </p>

        {/* Duplicate Details (if provided)
        {duplicateLeads && duplicateLeads.length > 0 && (
          <div className="text-left mb-4 max-h-60 overflow-y-auto bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-800">Duplicate Leads:</h3>
            {duplicateLeads.slice(0, 10).map((lead, index) => (
              <div key={lead._id || index} className="mb-2 p-2 bg-white rounded-lg border-l-4 border-red-400">
                <div className="text-sm">
                  <strong>Name:</strong> {lead.leadName || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Email:</strong> {lead.email || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Phone:</strong> {lead.phone || 'N/A'}
                </div>
                {lead.alternativePhone && (
                  <div className="text-sm text-gray-600">
                    <strong>Alt Phone:</strong> {lead.alternativePhone}
                  </div>
                )}
              </div>
            ))}
            {duplicateLeads.length > 10 && (
              <div className="text-sm text-gray-500 text-center mt-2">
                ... and {duplicateLeads.length - 10} more duplicates
              </div>
            )}
          </div>
        )} */}


        {/* Button */}
        <button
          onClick={handleOkay}
          disabled={isLoading}
          className={`mt-2 w-full text-white font-medium py-2 rounded-lg transition ${
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
            'I Understand'
          )}
        </button>

        {/* Close button (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={isLoading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DuplicateModal;