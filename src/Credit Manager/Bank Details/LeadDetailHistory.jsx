import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchLeadById } from '../../redux/creditSlice';
import BankAdd from "./BankAdd";
import { Box } from '@mui/material';
import MainLayout from '../../components/layout/MainLayout';
import ProfileHeader from '../../components/layout/ProfileHeader';

const LeadDetailHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showBankModal, setShowBankModal] = useState(false);

  const { selectedLead, loadingLead, error } = useSelector((state) => state.creditManager);

  useEffect(() => {
    if (id) {
      dispatch(fetchLeadById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedLead) {
      console.log("Fetched Lead Details:", selectedLead);
    }
  }, [selectedLead]);

  const handleAddBankClick = () => {
    setShowBankModal(true);
  };

  const handleCloseBankModal = () => {
    setShowBankModal(false);
  };

  const handleBankSaveSuccess = () => {
    setShowBankModal(false);
    dispatch(fetchLeadById(id));
  };

  // Helper function to get status badge styling
  const getStatusBadge = (status) => {
    if (!status) return <span className="text-gray-500">-</span>;

    let badgeClass = "px-2 py-1 rounded-full text-xs font-medium ";
    switch (status) {
      case "Confirmed":
        badgeClass += "bg-green-100 text-green-800";
        break;
      case "In Progress":
        badgeClass += "bg-yellow-100 text-yellow-800";
        break;
      case "Declined":
        badgeClass += "bg-red-100 text-red-800";
        break;
      default:
        badgeClass += "bg-gray-100 text-gray-800";
    }

    return <span className={badgeClass}>{status}</span>;
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Fixed getTableData function to handle different loanType formats
  const getTableData = () => {
    if (!selectedLead) return [];

    // Handle loanType - it can be a string or an object
    const getLoanType = () => {
      if (typeof selectedLead.loanType === 'string') {
        return selectedLead.loanType;
      } else if (selectedLead.loanType?.loanName) {
        return selectedLead.loanType.loanName;
      } else if (selectedLead.typeOfLoan) {
        return selectedLead.typeOfLoan;
      }
      return "-";
    };

    return [
      { label: "Lead Name", value: selectedLead.leadName || "-" },
      { label: "Phone", value: selectedLead.phone || "-" },
      { label: "Email", value: selectedLead.email || "-" },
      { label: "Lead Location", value: selectedLead.location || "-" },
      { label: "Location", value: selectedLead.location || "-" },
      { label: "Type of Loan", value: getLoanType() },
      { label: "Loan Amount", value: selectedLead.loanAmount ? `₹${selectedLead.loanAmount.toLocaleString()}` : "-" },
    ];
  };

  return (
    <MainLayout>
      <Box
        sx={{
          display: {
            xs: "none",
            sm: "none",
            md: "block",
          },
        }}
      >
        <ProfileHeader
          name="Uday Kumar"
          sx={{
            fontSize: "24px",
            fontWeight: "bold",
          }}
        />
      </Box>

      {/* Lead Details Content */}
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-blue-600 mb-1">
              Lead Detailed History
            </h1>
            <div className="flex flex-wrap items-center text-sm text-gray-500">
              <span className="text-sm font-medium text-[#667085]">CIBIL / CREDIT SCORE</span>
              <span className="mx-2">→</span>
              <span className="text-sm font-medium text-black">Lead detailed history</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-200 text-gray-600 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>

            <button
              onClick={handleAddBankClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {selectedLead?.bankDetails ? 'Update Bank Details' : 'Add Bank'}
            </button>
          </div>
        </div>

        {/* Content */}
        {loadingLead ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading lead details...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : selectedLead ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Personal Information
            </h2>

            {/* Table Format Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
              {getTableData().map((item, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 mb-1">
                    {item.label}
                  </span>
                  {item.isComponent ? (
                    <div className="text-base text-gray-900">{item.value}</div>
                  ) : (
                    <span className="text-base text-gray-900">{item.value}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Documents Section (if exists) */}
            {selectedLead.bankDetails?.document && selectedLead.bankDetails.document.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Documents</h3>
                <div className="space-y-2">
                  {selectedLead.bankDetails.document.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                        {doc.name || `Document ${index + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-500 mb-2">Lead Not Found</h3>
            <p className="text-gray-400">The requested lead could not be found.</p>
          </div>
        )}

        {/* Bank Add Modal */}
        {showBankModal && (
          <BankAdd
            leadId={id}
            onClose={handleCloseBankModal}
            onSaveSuccess={handleBankSaveSuccess}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default LeadDetailHistory;