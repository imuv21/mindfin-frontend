import React, { useState } from 'react';

const DuplicateModal = ({ onClose, duplicateLeads }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOkay = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 2000);
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
        <h2 className="text-[24px] font-semibold text-[#16151C]">
          Duplicate Data Found!
        </h2>

        {/* Subtext */}
        <p className="text-[16px] text-[#A2A1A8] mt-1">
          {duplicateLeads?.length || 0} duplicate lead(s) detected.
          They were not added to the system.
        </p>

        {/* Optional: List duplicates */}
        {duplicateLeads?.length > 0 && (
          <div className="mt-3 text-left max-h-32 overflow-y-auto text-sm text-gray-700">
            {duplicateLeads.map((lead, i) => (
              <div key={i} className="border-b py-1">
                {lead.leadName} - {lead.email}
              </div>
            ))}
          </div>
        )}

        {/* Button */}
        <button onClick={handleOkay} disabled={isLoading}
          className={`mt-6 w-full text-white font-medium py-2 rounded-lg transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#F45B69] hover:bg-red-600'
            }`}
        >
          {isLoading ? 'Loading...' : 'Okay'}
        </button>
      </div>
    </div>
  );
};

export default DuplicateModal;
