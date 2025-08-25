import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Edit, Eye, Trash2 } from 'lucide-react';
import {
  fetchLeadById,
  getFollowUpsByBankDetail,
  clearFollowUps,
  fetchBankDetailsByLeadId,
  clearLeadBankDetails,
  updateFollowUp,
  clearFollowUpStates,
  fetchFollowUpById,
  clearSelectedFollowUpDetails,
  deleteFollowUp
} from '../../redux/creditSlice';
import MainLayout from '../../components/layout/MainLayout';
import ProfileHeader from '../../components/layout/ProfileHeader';
import BankAdd from '../Bank Details/BankAdd';
import LoanStatusModal from '../components/LoanStatusModal';
import EditFollowUp from '../Bank Details/EditFollowUp';
import AddFollowUp from '../Bank Details/AddFollowUp';
import ViewFollowUp from '../Bank Details/viewFollowUp';
import CancelFollowUp from '../components/FollowUpCancelModal';
import Toastify from "../../helpers/Toastify";


const FollowUpHistory = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Original FollowUpHistory states
  const [showModal, setShowModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);

  // FollowUpBankerDetails states
  const [activeBank, setActiveBank] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);

  // Delete confirmation modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [followUpToDelete, setFollowUpToDelete] = useState(null);

  const {
    selectedLead,
    loadingLead,
    error,
    followUps,
    loadingFollowUps,
    followUpError,
    leadBankDetails,
    loadingLeadBankDetails,
    leadBankDetailsError,
    updateFollowUp,
    deletingFollowUp
  } = useSelector((state) => state.creditManager);

  // Fetch lead and bank details when component mounts
  useEffect(() => {
    if (id) {
      console.log('🔍 Fetching lead and bank details for ID:', id);
      dispatch(fetchLeadById(id));
      dispatch(fetchBankDetailsByLeadId(id));
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearLeadBankDetails());
      dispatch(clearFollowUps());
      if (typeof clearFollowUpStates === 'function') {
        dispatch(clearFollowUpStates());
      }
    };
  }, [id, dispatch]);

  // Show error with Toastify
  useEffect(() => {
    if (error || followUpError || leadBankDetailsError) {
      const errorMessage = error || followUpError || leadBankDetailsError;
      Toastify.error(errorMessage);
    }
  }, [error, followUpError, leadBankDetailsError]);

  const uploadedDocuments = [
    { name: 'Overview.pdf', size: '50 Kb' },
    { name: 'Contract.pdf', size: '50 Kb' },
    { name: 'Contract.pdf', size: '50 Kb' },
    { name: 'Overview.pdf', size: '50 Kb' },
  ];

  const handleBack = () => navigate(-1);

  const getLeadData = () => {
    if (!selectedLead) return {};

    return {
      leadName: selectedLead.leadName || "-",
      emailAddress: selectedLead.email || "-",
      phoneNumber: selectedLead.phone || "-",
      alternateNumber: selectedLead.alternativePhone || selectedLead.alternatePhone || "-",
      location: selectedLead.leadLocation || selectedLead.location || "-",
      loanType: selectedLead.loanType?.loanName || selectedLead.typeOfLoan || selectedLead.loanName || selectedLead.loanType || "-",
      loanAmount: selectedLead.loanAmount ? `₹${selectedLead.loanAmount.toLocaleString()}` : "-",
      leadCreatedDate: selectedLead.LeadCreatedDate
        ? new Date(selectedLead.LeadCreatedDate).toLocaleDateString('en-IN')
        : selectedLead.createdAt
          ? new Date(selectedLead.createdAt).toLocaleDateString('en-IN')
          : "-",
      representatives: selectedLead.representatives || selectedLead.representative || "Data Entry",
      assignedTo: selectedLead.assignedTo || selectedLead.telecaller || "Telecaller",
    };
  };

  const leadData = getLeadData();

  // Helper function to safely extract bank name from different possible structures
  const getBankName = (bank) => {
    if (!bank) return 'Unknown Bank';

    // If bankName is a string, return it
    if (typeof bank.bankName === 'string') {
      return bank.bankName;
    }

    // If bankName is an object with name property
    if (bank.bankName && typeof bank.bankName === 'object' && bank.bankName.name) {
      return bank.bankName.name;
    }

    // Try bankInfo
    if (bank.bankInfo && typeof bank.bankInfo === 'object' && bank.bankInfo.name) {
      return bank.bankInfo.name;
    }

    // Try bank property
    if (bank.bank && typeof bank.bank === 'object' && bank.bank.name) {
      return bank.bank.name;
    }

    // Try name property directly
    if (bank.name && typeof bank.name === 'string') {
      return bank.name;
    }

    return 'Unknown Bank';
  };

  // Helper function to safely extract loan type name
  const getLoanTypeName = (bank) => {
    if (!bank) return 'Unknown Loan Type';

    // Try loanType with loanName
    if (bank.loanType && typeof bank.loanType === 'object' && bank.loanType.loanName) {
      return bank.loanType.loanName;
    }

    // Try loanTypeName
    if (bank.loanTypeName && typeof bank.loanTypeName === 'string') {
      return bank.loanTypeName;
    }

    // Try loanType as string
    if (bank.loanType && typeof bank.loanType === 'string') {
      return bank.loanType;
    }

    return 'Unknown Loan Type';
  };

  // Use leadBankDetails from Redux state
  const validBankDetails = React.useMemo(() => {
    console.log('Processing leadBankDetails:', leadBankDetails);

    if (!Array.isArray(leadBankDetails) || leadBankDetails.length === 0) {
      console.log('No valid bank details found in leadBankDetails');
      return [];
    }

    const processed = leadBankDetails.map((bank, index) => {
      console.log(`Processing bank ${index}:`, bank);

      const bankName = getBankName(bank);
      const loanTypeText = getLoanTypeName(bank);

      return {
        _id: bank._id,
        bankName: bankName,
        bankInfo: bank.bankInfo || null,
        loanType: bank.loanType?._id || bank.loanType || null,
        loanTypeText: loanTypeText,
        ...bank
      };
    });

    console.log('Processed bank details:', processed);
    return processed;
  }, [leadBankDetails]);

  console.log("Final validBankDetails:", validBankDetails);

  const bankTabs = validBankDetails.length > 0
    ? validBankDetails.map((bank, index) => {
      return getBankName(bank);
    })
    : ['No Banks Available'];

  const currentBankDetail = validBankDetails[activeBank] || null;

  // Lead Data extraction for follow-ups
  const processedLeadData = React.useMemo(() => {
    const lead = selectedLead;
    if (!lead) return { leadName: 'N/A', email: 'N/A', phone: 'N/A', location: 'N/A' };

    return {
      leadName: lead.leadName || lead.fullName || lead.name || 'N/A',
      email: lead.email || lead.emailAddress || 'N/A',
      phone: lead.phone || lead.phoneNumber || 'N/A',
      location: lead.location || lead.leadLocation || 'N/A',
      leadId: lead._id || null
    };
  }, [selectedLead]);

  // Debug Logs
  console.log("---- FollowUpHistory Debug ----");
  console.log("selectedLead:", selectedLead);
  console.log("leadBankDetails:", leadBankDetails);
  console.log("processedLeadData:", processedLeadData);
  console.log("validBankDetails:", validBankDetails);
  console.log("currentBankDetail:", currentBankDetail);
  console.log("activeBank index:", activeBank);
  console.log("bankTabs:", bankTabs);

  // Reset active bank when bank details change
  useEffect(() => {
    if (validBankDetails.length > 0 && activeBank >= validBankDetails.length) {
      setActiveBank(0);
    }
  }, [validBankDetails, activeBank]);

  // Fetch follow-ups when bank changes
  useEffect(() => {
    if (currentBankDetail?._id) {
      console.log('Fetching follow-ups for bankDetailId:', currentBankDetail._id);
      dispatch(getFollowUpsByBankDetail(currentBankDetail._id));
    } else {
      console.log('No bankDetailId found → clearing followUps');
      dispatch(clearFollowUps());
    }
  }, [dispatch, currentBankDetail?._id]);

  const handleAddFollowUp = () => {
    console.log("Add Follow-up Debug:");
    console.log("currentBankDetail:", currentBankDetail);
    console.log("processedLeadData.leadId:", processedLeadData.leadId);

    if (!currentBankDetail?._id) {
      Toastify.error('Please select a valid bank to add follow-up. No bank details found.');
      console.log("No valid bank detail ID found");
      return;
    }

    if (!processedLeadData.leadId) {
      Toastify.error('Lead ID is missing. Cannot add follow-up.');
      return;
    }

    console.log("Opening Add FollowUp modal with:");
    console.log("LeadId:", processedLeadData.leadId);
    console.log("BankDetailId:", currentBankDetail._id);
    console.log("LoanTypeId:", currentBankDetail.loanType);

    setAddModalOpen(true);
  };

  const handleEditFollowUp = (followUp) => {
    console.log("Edit FollowUp:", followUp);
    console.log("Current Bank Detail:", currentBankDetail);

    setSelectedFollowUp(followUp);
    setEditModalOpen(true);
  };

  const handleViewFollowUp = (followUp) => {
    console.log("View FollowUp:", followUp);

    // Fetch detailed follow-up data by ID
    if (followUp._id) {
      dispatch(fetchFollowUpById(followUp._id));
    }

    setSelectedFollowUp(followUp);
    setViewModalOpen(true);
  };

  const handleDeleteFollowUp = (followUp) => {
    console.log("Delete FollowUp:", followUp);

    if (!followUp._id) {
      Toastify.error('Follow-up ID is missing. Cannot delete.');
      return;
    }

    // Set the follow-up to delete and open confirmation modal
    setFollowUpToDelete(followUp);
    setDeleteModalOpen(true);
  };

  const confirmDeleteFollowUp = async () => {
    if (!followUpToDelete?._id) {
      Toastify.error('Follow-up ID is missing. Cannot delete.');
      return;
    }

    try {
      await dispatch(deleteFollowUp({
        followUpId: followUpToDelete._id,
        bankDetailId: currentBankDetail?._id
      })).unwrap();

      // Success message
      Toastify.success("Follow-up deleted successfully!");

      // Close modal and clear state
      setDeleteModalOpen(false);
      setFollowUpToDelete(null);
    } catch (error) {
      // Error message
      Toastify.error(`Failed to delete follow-up: ${error.message || error}`);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setFollowUpToDelete(null);
  };

  // Add cleanup when closing view modal:
  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedFollowUp(null);
    dispatch(clearSelectedFollowUpDetails()); // Clear the detailed data
  };

  // Handle successful edit - refresh follow-ups
  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setSelectedFollowUp(null);

    // Refresh follow-ups for current bank
    if (currentBankDetail?._id) {
      dispatch(getFollowUpsByBankDetail(currentBankDetail._id));
    }

    // Add Toastify success message
    Toastify.success("Follow-up updated successfully!");
  };

  // Handle successful add follow-up
  const handleAddSuccess = () => {
    setAddModalOpen(false);
    // Refresh follow-ups for current bank
    if (currentBankDetail?._id) {
      dispatch(getFollowUpsByBankDetail(currentBankDetail._id));
    }
    Toastify.success("Follow-up added successfully!");
  };

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'declined': return 'text-red-600 bg-red-100';
      case 'in progress': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Loading state
  if (loadingLead || loadingLeadBankDetails) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading lead details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error || leadBankDetailsError) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex justify-center items-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {error || leadBankDetailsError}</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-200 text-gray-600 bg-white rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // No lead found
  if (!selectedLead) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex justify-center items-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Lead not found</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-200 text-gray-600 bg-white rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Handle bank add success - refresh bank details
  const handleBankAddSuccess = () => {
    setShowModal(false);
    if (id) {
      dispatch(fetchBankDetailsByLeadId(id));
    }

    // Add Toastify success message
    Toastify.success("Bank details added successfully!");
  };

  return (
    <MainLayout>
      {/* Profile Header (desktop only) */}
      <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
        <ProfileHeader name={leadData.leadName} sx={{ fontSize: "24px", fontWeight: "bold" }} />
      </Box>

      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-blue-600 mb-1">Lead detailed history</h1>
            <div className="flex flex-wrap items-center text-sm text-gray-500">
              <span className="text-sm font-medium text-[#667085]">Dashboard</span>
              <span className="mx-2">→</span>
              <span className="text-sm font-medium text-black">Lead detailed history</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-200 text-gray-600 bg-white rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Bank
            </button>
            <button
              onClick={() => setStatusModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              Status
              <svg className="w-4 h-4 text-white ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Lead Info */}
          <div className="w-full lg:flex-1 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-sm font-medium text-[#0F172A] mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {Object.entries(leadData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-light text-[#A2A1A8] capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <div className="text-base font-medium text-[#16151C]">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Documents */}
          <div className="w-full lg:w-80 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-sm font-medium text-[#0F172A] mb-4">Uploaded Documents</h2>
            <div className="space-y-4 overflow-x-auto">
              {uploadedDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#EFF6FF] rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                      <div className="text-xs text-gray-500">{doc.size}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FollowUp Section */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-4 sm:p-6 overflow-x-hidden">

          {/* Loading Bank Details */}
          {loadingLeadBankDetails && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800">
                Loading bank details...
              </div>
            </div>
          )}

          {/* Bank Details Error */}
          {leadBankDetailsError && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-sm text-red-800">
                Error loading bank details: {leadBankDetailsError}
              </div>
            </div>
          )}

          {/* Follow-up Error */}
          {followUpError && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-sm text-red-800">
                Error: {followUpError}
              </div>
            </div>
          )}

          {/* Bank Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              {bankTabs.map((label, index) => (
                <button
                  key={`${label}-${index}`}
                  onClick={() => setActiveBank(index)}
                  className={`px-4 py-2 whitespace-nowrap text-sm font-medium border-b-2 transition-colors ${activeBank === index
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Lead Info for Follow-ups */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Banker Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-500">Lead Name</label>
                <div className="text-base font-medium">{processedLeadData.leadName}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Email</label>
                <div className="text-base font-medium">{processedLeadData.email}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Phone</label>
                <div className="text-base font-medium">{processedLeadData.phone}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Location</label>
                <div className="text-base font-medium">{processedLeadData.location}</div>
              </div>
            </div>
          </div>

          {/* Follow-up Buttons */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold">Follow-up History</h3>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 text-sm text-white rounded hover:opacity-90 ${!currentBankDetail?._id
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                onClick={handleAddFollowUp}
                disabled={!currentBankDetail?._id}
                title={!currentBankDetail?._id ? 'No bank details available' : 'Add new follow-up'}
              >
                Add Next Follow-up
              </button>
              <button
                className="px-4 py-2 text-sm text-white bg-[#F45B69] rounded hover:opacity-90"
                onClick={() => setCancelModalOpen(true)}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Loading Follow-ups */}
          {loadingFollowUps && currentBankDetail && (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500">Loading follow-ups...</p>
            </div>
          )}

          {/* Follow-ups Table */}
          {!loadingFollowUps && currentBankDetail && (
            <div className="overflow-x-auto border rounded-lg">
              {followUps && followUps.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                      <tr>
                        {['Scheduled Date', 'Follow-up Date', 'Loan Amount', 'Rate', 'PF', 'Tenure', 'Insurance', 'Status', 'Loan Type', 'Remarks', 'Action']
                          .map((title) => (
                            <th key={title} className="px-4 py-2 font-semibold whitespace-nowrap">{title}</th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>

                      {followUps.map((item, idx) => (
                        <tr key={item._id || idx} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap">{formatDate(item.date)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{formatDate(item.followUpDate)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{formatCurrency(item.loanAmountRequested)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{item.rateOfInterest}%</td>
                          <td className="px-4 py-2 whitespace-nowrap">{item.pf || 0}%</td>
                          <td className="px-4 py-2 whitespace-nowrap">{item.tenure}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{formatCurrency(item.insuranceAmount)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">{item.loanType?.name || (typeof item.loanType === 'string' ? item.loanType : 'N/A')}</td>
                          <td
                            className="px-4 py-2 whitespace-nowrap max-w-[150px] overflow-hidden text-ellipsis"
                            title={item.remarks}
                          >
                            {item.remarks
                              ? item.remarks.length > 15
                                ? item.remarks.slice(0, 15) + "..."
                                : item.remarks
                              : "No remarks"}
                          </td>

                          <td className="px-4 py-2 flex gap-2 whitespace-nowrap">
                            <button
                              onClick={() => handleEditFollowUp(item)}
                              disabled={updateFollowUp || deletingFollowUp}
                              className="text-gray-600 hover:text-blue-800 disabled:opacity-50 transition-opacity"
                              title="Edit follow-up"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleViewFollowUp(item)}
                              disabled={deletingFollowUp}
                              className="text-gray-600 hover:text-green-800 disabled:opacity-50 transition-opacity"
                              title="View follow-up"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteFollowUp(item)}
                              disabled={deletingFollowUp}
                              className="text-gray-600 hover:text-red-800 disabled:opacity-50 transition-opacity"
                              title="Delete follow-up"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              ) : (
                <div className="text-center py-6 text-gray-500">
                  No follow-ups found. Click "Add Next Follow-up".
                </div>
              )}
            </div>
          )}

          {/* No Bank Details Message */}
          {!loadingLeadBankDetails && validBankDetails.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">No bank details found for this lead.</p>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Bank Details
              </button>
            </div>
          )}
        </div>

        {/* All Modals */}
        {showModal && (
          <BankAdd
            leadId={id}
            onClose={() => setShowModal(false)}
            onSuccess={handleBankAddSuccess}
          />
        )}

        {statusModal && (
          <LoanStatusModal onClose={() => setStatusModal(false)} />
        )}

        {editModalOpen && (
          <EditFollowUp
            onClose={() => {
              setEditModalOpen(false);
              setSelectedFollowUp(null);
            }}
            followUpData={selectedFollowUp}
            bankDetailId={currentBankDetail?._id}
            onSuccess={handleEditSuccess}
          />
        )}

        {addModalOpen && (
          <AddFollowUp
            onClose={() => setAddModalOpen(false)}
            bankDetailId={currentBankDetail?._id}
            leadId={processedLeadData.leadId}
            loanTypeId={currentBankDetail?.loanType}
            bankDetails={currentBankDetail}
            onSuccess={handleAddSuccess}
          />
        )}

        {viewModalOpen && (
          <ViewFollowUp
            onClose={() => {
              setViewModalOpen(false);
              setSelectedFollowUp(null);
              dispatch(clearSelectedFollowUpDetails());
            }}
            followUpData={selectedFollowUp}
          />
        )}

        {cancelModalOpen && (
          <CancelFollowUp onClose={() => setCancelModalOpen(false)} />
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h1 className="text-xl font-semibold text-gray-900 mb-4">
                Delete FollowUp Details
              </h1>
              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this follow-up? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  No
                </button>
                <button
                  onClick={confirmDeleteFollowUp}
                  disabled={deletingFollowUp}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {deletingFollowUp ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};


export default FollowUpHistory;