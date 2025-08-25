import React from 'react';
import { useSelector } from 'react-redux';

const ViewFollowUp = ({ onClose, followUpData }) => {
  const { 
    selectedFollowUpDetails, 
    loadingFollowUpDetails, 
    followUpDetailsError 
  } = useSelector((state) => state.creditManager);

  // Use detailed data if available, otherwise fall back to basic data
  const displayData = selectedFollowUpDetails || followUpData;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm px-4">
      {/* Clickable background */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal content */}
      <div
        className="relative bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[20px] font-medium text-[#0F172A] mb-4">View Follow-up History</h2>

        {/* Loading State */}
        {loadingFollowUpDetails && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading follow-up details...</p>
          </div>
        )}

        {/* Error State */}
        {followUpDetailsError && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-sm text-red-800">
              Error: {followUpDetailsError}
            </div>
          </div>
        )}

        {/* Form Fields */}
        {!loadingFollowUpDetails && displayData && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Scheduled Date */}
              <div>
                <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Date</label>
                <input
                  type="text"
                  value={formatDate(displayData.date)}
                  readOnly
                  className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3] bg-gray-50"
                />
              </div>

              {/* Follow-up Date */}
              <div>
                <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Follow-up Date</label>
                <input
                  type="text"
                  value={formatDate(displayData.followUpDate)}
                  readOnly
                  className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3] bg-gray-50"
                />
              </div>

              {/* Loan Amount Requested */}
              <div>
                <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Loan Amount Requested</label>
                <input
                  type="text"
                  value={formatCurrency(displayData.loanAmountRequested)}
                  readOnly
                  className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3] bg-gray-50"
                />
              </div>

              {/* Rate Of Interest */}
              <div>
                <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Rate Of Interest</label>
                <input
                  type="text"
                  value={`${displayData.rateOfInterest || 0}%`}
                  readOnly
                  className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3] bg-gray-50"
                />
              </div>

              {/* PF */}
              <div>
                <label className="block text-[14px] font-medium text-[#1D2026] mb-1">PF</label>
                <input
                  type="text"
                  value={`${displayData.pf || 0}%`}
                  readOnly
                  className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3] bg-gray-50"
                />
              </div>

              {/* Tenure */}
              <div>
                <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Tenure</label>
                <input
                  type="text"
                  value={displayData.tenure ? `${displayData.tenure}M` : 'N/A'}
                  readOnly
                  className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3] bg-gray-50"
                />
              </div>

              {/* Insurance Amount */}
              <div>
                <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Insurance Amount</label>
                <input
                  type="text"
                  value={formatCurrency(displayData.insuranceAmount)}
                  readOnly
                  className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3] bg-gray-50"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Status</label>
                <input
                  type="text"
                  value={displayData.status || 'N/A'}
                  readOnly
                  className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3] bg-gray-50"
                />
              </div>

              {/* Loan Type */}
              <div>
                <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Loan Type</label>
                <input
                  type="text"
                  value={
                    displayData.loanType?.loanName || 
                    displayData.loanType?.name || 
                    (typeof displayData.loanType === 'string' ? displayData.loanType : 'N/A')
                  }
                  readOnly
                  className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3] bg-gray-50"
                />
              </div>
            </div>

            {/* Remark Field */}
            <div className="col-span-2">
              <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Remarks</label>
              <textarea
                value={displayData.remarks || 'No remarks available'}
                readOnly
                className="w-full border px-3 py-2 rounded mb-4 text-[16px] font-medium text-[#8C94A3] bg-gray-50"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </>
        )}

        {/* No Data State */}
        {!loadingFollowUpDetails && !displayData && !followUpDetailsError && (
          <div className="text-center py-8 text-gray-500">
            <p>No follow-up details available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewFollowUp;