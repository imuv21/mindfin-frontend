import React, { useEffect, useState } from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCreditManagerLeads, deleteBankDetail } from '../../redux/creditSlice';
import SelectBankModal from "../components/SelectBankModal";
import ReSelectBankModal from "../components/ReSelectBankModal";
import BankAdd from "../Bank Details/BankAdd";
import BankEdit from "../Bank Details/BankEdit";
import { useNavigate } from "react-router-dom";
import Toastify from "../../helpers/Toastify";
import api from '../../helpers/Api';

// Delete Confirmation Modal Component
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title || "Confirm Delete"}
        </h3>
        <p className="text-gray-600 mb-6">
          {message || "Are you sure you want to delete this item? This action cannot be undone."}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isDeleting}
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isDeleting}
          >
            {isDeleting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated table headers definition
const tableHeaders = [
  { key: "leadName", label: "Lead Name", width: "150px" },
  { key: "phone", label: "Phone", width: "120px" },
  { key: "email", label: "Email", width: "180px" },
  { key: "location", label: "Lead Location", width: "140px" },
  { key: "approvedBank", label: "Approved Bank", width: "160px" },
  { key: "selectBank", label: "Select Bank", width: "140px" },
  { key: "bankerName", label: "Bank Employee", width: "160px" },
  { key: "emailId", label: "Bank Employee Email", width: "200px" },
  { key: "panNumber", label: "PAN Number", width: "140px" },
  { key: "location", label: "Location", width: "140px" },
  { key: "typeOfLoan", label: "Type of Loan", width: "150px" },
  { key: "bankName", label: "Bank Name", width: "180px" },
  { key: "rateOfInterest", label: "Rate of Interest", width: "140px" },
  { key: "pf", label: "PF", width: "100px" },
  { key: "tenure", label: "Tenure", width: "120px" },
  { key: "insuranceAmount", label: "Insurance Amount", width: "160px" },
  { key: "status", label: "Status", width: "120px" },
  { key: "remarks", label: "Remarks", width: "200px" },
  { key: "actions", label: "Actions", width: "160px" },
];

export default function BankApproved() {
  const dispatch = useDispatch();
  const {
    leadsData,
    loading,
    error,
    filterOptions,
    deletingBankDetail,
    bankDetailError
  } = useSelector((state) => state.creditManager);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isReselectMode, setIsReselectMode] = useState(false);
  const [isBankAddModalOpen, setIsBankAddModalOpen] = useState(false);
  const [isBankEditModalOpen, setIsBankEditModalOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState(null);

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteType, setDeleteType] = useState(''); // 'bank' or 'lead'

  // Local state for lead deletion (since we're using direct API call)
  const [deletingLead, setDeletingLead] = useState(false);

  const navigate = useNavigate();

  //refresh leads data
  const refreshLeads = () => {
    dispatch(fetchCreditManagerLeads(filterOptions));
  };

  useEffect(() => {
    refreshLeads();
  }, [dispatch]);

  // Show error with Toastify
  useEffect(() => {
    if (bankDetailError) {
      Toastify.error(bankDetailError);
    }
  }, [bankDetailError]);

  const handleSelect = (id, isReselect = false) => {
    setSelectedLeadId(id);
    setIsReselectMode(isReselect);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLeadId(null);
  };

  const handleModalConfirm = (reason) => {
    console.log(
      `Confirmed selection for lead ID ${selectedLeadId} with reason: ${reason}`
    );
    Toastify.success(`Bank selection updated for lead: ${selectedLeadId}`);
    handleModalClose();
    refreshLeads();
  };

  const handleBankAddClose = () => {
    setIsBankAddModalOpen(false);
    setSelectedLeadId(null);
  };

  const handleBankAddSaveSuccess = () => {
    setIsBankAddModalOpen(false);
    setSelectedLeadId(null);
    refreshLeads();
    Toastify.success("Bank details saved successfully!");
  };

  // New handlers for bank detail editing
  const handleEditBankDetail = (bankId) => {
    if (!bankId) {
      console.error('No bank ID provided for editing');
      Toastify.error('Invalid bank ID for editing');
      return;
    }
    console.log('Opening edit modal for bank ID:', bankId);
    setSelectedBankId(bankId);
    setIsBankEditModalOpen(true);
  };

  const handleBankEditClose = () => {
    setIsBankEditModalOpen(false);
    setSelectedBankId(null);
  };

  const handleBankEditSaveSuccess = () => {
    setIsBankEditModalOpen(false);
    setSelectedBankId(null);
    refreshLeads();
    Toastify.success("Bank details updated successfully!");
  };

  // Open delete confirmation modal for bank details
  const handleDeleteBankDetailConfirm = (bankId) => {
    if (!bankId) {
      console.error('No bank ID provided for deletion');
      Toastify.error('Invalid bank ID for deletion');
      return;
    }
    console.log('Setting up bank deletion for ID:', bankId);
    setDeleteTargetId(bankId);
    setDeleteType('bank');
    setIsDeleteModalOpen(true);
  };

  // Open delete confirmation modal for lead
  const handleDeleteLeadConfirm = (leadId) => {
    if (!leadId) {
      console.error('No lead ID provided for deletion');
      Toastify.error('Invalid lead ID for deletion');
      return;
    }
    console.log('Setting up lead deletion for ID:', leadId);
    setDeleteTargetId(leadId);
    setDeleteType('lead');
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
    setDeleteType('');
  };

  // Perform actual deletion
  const handleDeleteConfirm = async () => {
    try {
      if (!deleteTargetId) {
        console.error('No target ID available for deletion');
        Toastify.error('No valid ID for deletion');
        return;
      }

      console.log(`Attempting to delete ${deleteType} with ID:`, deleteTargetId);

      if (deleteType === 'bank') {
        // Pass only the bankId to Redux action
        console.log('Dispatching deleteBankDetail with bankId:', deleteTargetId);
        await dispatch(deleteBankDetail(deleteTargetId)).unwrap();
        Toastify.success("Bank details deleted successfully!");
        console.log("Bank detail deleted:", deleteTargetId);
      } else if (deleteType === 'lead') {
        // Direct API call for lead deletion
        setDeletingLead(true);
        try {
          console.log('Making direct API call to delete lead:', deleteTargetId);
          const response = await api.deleteALead(deleteTargetId);
          console.log('Lead deletion API response:', response);
          Toastify.success("Lead deleted successfully!");
          // Refresh leads data after successful deletion
          refreshLeads();
        } catch (leadDeleteError) {
          console.error("Lead deletion API error:", leadDeleteError);
          const errorMessage = leadDeleteError?.response?.data?.message || leadDeleteError?.message || 'Failed to delete lead';
          Toastify.error(`Failed to delete lead: ${errorMessage}`);
          return; // Exit early on error
        } finally {
          setDeletingLead(false);
        }
      }

      handleDeleteModalClose();
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      Toastify.error(`Failed to delete ${deleteType}: ${errorMessage}`);
      console.error("Delete error:", error);
    }
  };

  const handleView = (id) => navigate(`/lead-detail-history/${id}`);

  const getStatusBadge = (status) => {
    if (!status) return <span className="text-gray-500">-</span>;

    let badgeClass =
      "inline-flex items-center whitespace-nowrap px-2 py-1 rounded-full text-xs font-medium ";

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

  // Helper function to safely get bank ID
  const getBankDetailsId = (bankDetails) => {
    if (!bankDetails) {
      console.log('No bank details provided');
      return null;
    }

    // Check if bankDetails is an array
    if (Array.isArray(bankDetails)) {
      if (bankDetails.length === 0) {
        console.log('Bank details array is empty');
        return null;
      }
      // Get the first bank detail's ID
      const firstBankDetail = bankDetails[0];
      const id = firstBankDetail._id || firstBankDetail.id || firstBankDetail.bankId;
      console.log('Bank details array (first item):', firstBankDetail);
      console.log('Extracted bank ID from array:', id);
      return id;
    } else {
      // Handle case where bankDetails is a single object
      const id = bankDetails._id || bankDetails.id || bankDetails.bankId;
      console.log('Bank details object:', bankDetails);
      console.log('Extracted bank ID:', id);
      return id;
    }
  };

  const getBankDetailData = (bankDetails) => {
    if (!bankDetails) return null;
    if (Array.isArray(bankDetails)) {
      return bankDetails.length > 0 ? bankDetails[0] : null;
    }
    return bankDetails;
  };


  const leadsArray = leadsData?.leads || leadsData?.data?.leads || [];
  console.log("📊 Leads data for table:", leadsArray);

  return (
    <div className="bg-white rounded-lg mt-4 p-2.5 shadow-md">
      <div className="overflow-x-auto border rounded-lg">
        {loading ? (
          <p className="p-4">Loading leads...</p>
        ) : error ? (
          <p className="p-4 text-red-600">Error: {error}</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-gray-100 z-10 shadow-sm">
              <tr>
                <th className="w-12 text-center px-2 py-2 border-b">
                  <input type="checkbox" className="w-4 h-4 cursor-pointer" />
                </th>
                {tableHeaders.map((header) => (
                  <th
                    key={header.key}
                    style={{ width: header.width }}
                    className="px-3 py-2 text-left font-semibold text-gray-700 border-b whitespace-nowrap"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leadsArray.length > 0 ? (
                leadsArray.map((row, index) => {
                  // Get bank details ID safely
                  const bankDetailsId = getBankDetailsId(row.bankDetails);
                  // Create unique key using row._id and index as fallback
                  const uniqueKey = row._id || `row-${index}`;

                  return (
                    <tr
                      key={uniqueKey}
                      className="odd:bg-white even:bg-gray-50 border-b hover:bg-gray-100"
                    >
                      <td className="text-center px-2 py-2">
                        <input type="checkbox" className="w-4 h-4 cursor-pointer" />
                      </td>
                      <td className="px-3 py-2 truncate">{row.leadName || "-"}</td>
                      <td className="px-3 py-2 truncate">{row.phone || "-"}</td>
                      <td className="px-3 py-2 truncate">{row.email || "-"}</td>
                      <td className="px-3 py-2 truncate">{row.location || "-"}</td>
                      <td className="px-3 py-2 truncate">{row.approvedBank || "-"}</td>
                      <td className="px-3 py-2">
                        {row.selectBank === "Reselect" ? (
                          <span
                            className="text-blue-600 cursor-pointer font-medium underline hover:no-underline"
                            onClick={() => handleSelect(row._id, true)}
                          >
                            {row.approvedBank?.split(",")[0] || "-"}{" "}
                            <strong>Reselect</strong>
                          </span>
                        ) : (
                          <span
                            className="text-blue-600 cursor-pointer font-medium underline hover:no-underline"
                            onClick={() => handleSelect(row._id, false)}
                          >
                            {row.selectBank || "Select"}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 truncate">
                        {getBankDetailData(row.bankDetails)?.bankerName || "-"}
                      </td>
                      <td className="px-3 py-2 truncate">
                        {getBankDetailData(row.bankDetails)?.emailId || "-"}
                      </td>
                      <td className="px-3 py-2 truncate">{getBankDetailData(row.panNumber) || "-"}</td>
                      <td className="px-3 py-2 truncate">{getBankDetailData(row.location) || "-"}</td>
                      <td className="px-3 py-2 truncate">
                        {row.typeOfLoan || row.loanType?.loanName || "-"}
                      </td>
                      <td className="px-3 py-2 truncate">
                        {getBankDetailData(row.bankDetails)?.bankNameText ||
                          getBankDetailData(row.bankDetails)?.bankName ||
                          "-"}
                      </td>
                      <td className="px-3 py-2">
                        {getBankDetailData(row.bankDetails)?.rateOfInterest
                          ? `${getBankDetailData(row.bankDetails).rateOfInterest}%`
                          : "-"}
                      </td>
                      <td className="px-3 py-2">{getBankDetailData(row.bankDetails)?.pf || "-"}</td>
                      <td className="px-3 py-2">
                        {getBankDetailData(row.bankDetails)?.tenure
                          ? `${getBankDetailData(row.bankDetails).tenure}`
                          : "-"}
                      </td>
                      <td className="px-3 py-2">
                        {getBankDetailData(row.bankDetails)?.insuranceAmount
                          ? `₹${getBankDetailData(row.bankDetails).insuranceAmount}`
                          : "-"}
                      </td>
                      <td className="px-3 py-2">
                        {getStatusBadge(getBankDetailData(row.bankDetails)?.status)}
                      </td>
                      <td className="px-3 py-2 max-w-[200px] truncate" title={getBankDetailData(row.bankDetails)?.remarks || row.remarks || "-"}>
                        {getBankDetailData(row.bankDetails)?.remarks || row.remarks || "-"}
                      </td>

                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          {/* Edit Bank Details button - only show if bank details exist */}
                          {bankDetailsId && (
                            <button
                              onClick={() => {
                                console.log('Editing bank detail with ID:', bankDetailsId);
                                handleEditBankDetail(bankDetailsId);
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:text-blue-800 disabled:opacity-50 transition-opacity"
                              title="Edit Bank Details"
                              disabled={deletingBankDetail || deletingLead}
                            >
                              <Edit size={16} />
                            </button>
                          )}

                          <button
                            onClick={() => handleView(row._id)}
                            className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:text-green-800 disabled:opacity-50 transition-opacity"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Delete Bank Details button - only show if bank details exist */}
                          {bankDetailsId ? (
                            <button
                              onClick={() => {
                                console.log('Deleting bank detail with ID:', bankDetailsId);
                                console.log('Full bank details object:', row.bankDetails);
                                handleDeleteBankDetailConfirm(bankDetailsId);
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:text-red-800 disabled:opacity-50 transition-opacity"
                              title="Delete Bank Details"
                              disabled={deletingBankDetail || deletingLead}
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            // If no bank details exist, show lead deletion button
                            <button
                              onClick={() => {
                                console.log('Deleting lead with ID:', row._id);
                                handleDeleteLeadConfirm(row._id);
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded text-red-600 hover:bg-gray-100 disabled:opacity-50 transition-opacity"
                              title="Delete Lead"
                              disabled={deletingBankDetail || deletingLead}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={tableHeaders.length + 1}
                    className="p-4 text-center text-gray-500"
                  >
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title={deleteType === 'bank' ? 'Delete Bank Details' : 'Delete Lead'}
        message={
          deleteType === 'bank'
            ? 'Are you sure you want to delete these bank details? This action cannot be undone.'
            : 'Are you sure you want to delete this lead? This action cannot be undone.'
        }
        isDeleting={deleteType === 'bank' ? deletingBankDetail : deletingLead}
      />

      {/* Select/Reselect Bank Modals */}
      {isModalOpen &&
        (isReselectMode ? (
          <ReSelectBankModal
            onClose={handleModalClose}
            onConfirm={handleModalConfirm}
          />
        ) : (
          <SelectBankModal
            onClose={handleModalClose}
            onConfirm={handleModalConfirm}
          />
        ))}

      {/* BankAdd Modal */}
      {isBankAddModalOpen && (
        <BankAdd
          leadId={selectedLeadId}
          onClose={handleBankAddClose}
          onSaveSuccess={handleBankAddSaveSuccess}
        />
      )}

      {/* BankEdit Modal */}
      {isBankEditModalOpen && (
        <BankEdit
          bankId={selectedBankId}
          onClose={handleBankEditClose}
          onSaveSuccess={handleBankEditSaveSuccess}
        />
      )}
    </div>
  );
}