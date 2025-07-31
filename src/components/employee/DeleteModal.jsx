import { CircularProgress } from '@mui/material';
import React from 'react';

const DeleteModal = ({ isOpen, close, handleSubmit, heading, description ,loading }) => {
  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Handle submit and close the modal
  const onSubmit = () => {
    handleSubmit();
    close();
  };

  // Handle click outside the modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  return (
    // Modal backdrop
    <div 
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }} 
    className="fixed inset-0 flex items-center justify-center z-50"
    onClick={handleBackdropClick}
    >
      {/* Modal container */}
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        {/* Modal header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">{heading}</h2>
          {description && <p className="mt-2 text-gray-600">{description}</p>}
        </div>
        
        {/* Modal content */}
        <div className="mb-6">
          {/* Modal content can be passed as children */}
        </div>
        
        {/* Modal footer with buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={close}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {
                loading ? <CircularProgress color='white'/> : `Submit`
            }
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;