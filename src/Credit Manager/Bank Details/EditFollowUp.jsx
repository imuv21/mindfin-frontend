import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFollowUp, fetchBankDetailById } from '../../redux/creditSlice';
import Toastify from "../../helpers/Toastify";

const EditFollowUp = ({ onClose, followUpData, bankDetailId, onSuccess }) => {
    const dispatch = useDispatch();
    const { updatingFollowUp, followUpError, selectedBankDetail } = useSelector(state => state.creditManager);

    // Form state
    const [formData, setFormData] = useState({
        bankName: '',
        bankerName: '',
        loanAmountRequested: '',
        rateOfInterest: '',
        pf: '',
        tenure: '',
        insuranceAmount: '',
        loanType: '',
        date: '',
        followUpDate: '',
        status: '',
        remarks: '',
        documents: null
    });

    // Fetch bank details when component mounts
    useEffect(() => {
        if (followUpData?.bankDetail) {
            console.log('Fetching bank details for ID:', followUpData.bankDetail);
            dispatch(fetchBankDetailById(followUpData.bankDetail));
        }
    }, [dispatch, followUpData?.bankDetail]);

    // Populate form with existing follow-up data
    useEffect(() => {
        if (followUpData && selectedBankDetail) {
            console.log('Populating EditFollowUp form with followUpData:', followUpData);
            console.log('Populating EditFollowUp form with selectedBankDetail:', selectedBankDetail);

            // Helper function to extract bank name
            const getBankName = (bankDetail) => {
                if (!bankDetail) return '';

                // Try bankName as object with name property
                if (bankDetail.bankName && typeof bankDetail.bankName === 'object' && bankDetail.bankName.name) {
                    return bankDetail.bankName.name;
                }

                // Try bankName as string
                if (typeof bankDetail.bankName === 'string') {
                    return bankDetail.bankName;
                }

                return '';
            };

            setFormData({
                bankName: getBankName(selectedBankDetail),
                bankerName: selectedBankDetail.bankerName || '',
                loanAmountRequested: followUpData.loanAmountRequested || '',
                rateOfInterest: followUpData.rateOfInterest || '',
                pf: followUpData.pf || '',
                tenure: followUpData.tenure || '',
                insuranceAmount: followUpData.insuranceAmount || '',
                loanType: followUpData.loanType?._id || followUpData.loanType || '',
                date: followUpData.date ? new Date(followUpData.date).toISOString().split('T')[0] : '',
                followUpDate: followUpData.followUpDate ? new Date(followUpData.followUpDate).toISOString().split('T')[0] : '',
                status: followUpData.status || '',
                remarks: followUpData.remarks || '',
                documents: null
            });

            console.log('Form populated with bankName:', getBankName(selectedBankDetail));
            console.log('Form populated with bankerName:', selectedBankDetail.bankerName);
        }
    }, [followUpData, selectedBankDetail]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!followUpData?._id) {
            console.error('No follow-up ID provided');
            return;
        }

        // Prepare update data (only send changed/non-empty fields)
        const updateData = {};

        // Add fields that have values
        if (formData.loanAmountRequested) updateData.loanAmountRequested = parseFloat(formData.loanAmountRequested);
        if (formData.rateOfInterest) updateData.rateOfInterest = parseFloat(formData.rateOfInterest);
        if (formData.pf) updateData.pf = parseFloat(formData.pf);
        if (formData.tenure) updateData.tenure = formData.tenure;
        if (formData.insuranceAmount) updateData.insuranceAmount = parseFloat(formData.insuranceAmount);
        if (formData.loanType) updateData.loanType = formData.loanType;
        if (formData.date) updateData.date = formData.date;
        if (formData.followUpDate) updateData.followUpDate = formData.followUpDate;
        if (formData.status) updateData.status = formData.status;
        if (formData.remarks) updateData.remarks = formData.remarks;

        console.log('Submitting follow-up update:', {
            followUpId: followUpData._id,
            updateData
        });

        try {
            await dispatch(updateFollowUp({
                followUpId: followUpData._id,
                updateData
            })).unwrap();

            console.log('Follow-up updated successfully');

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            } else {
                // Fallback if no onSuccess provided
                onClose();
                Toastify.success("Follow-up updated successfully!");
            }
        } catch (error) {
            console.error('Failed to update follow-up:', error);

            // Show error message with Toastify
            Toastify.error(`Failed to update follow-up: ${error.message || error}`);
        }
    };

    // Show loading while fetching bank details
    if (followUpData?.bankDetail && !selectedBankDetail) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm px-4">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span>Loading bank details...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm px-4">
            {/* Modal content */}
            <div className="relative bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg z-50">
                <h2 className="text-[20px] font-medium text-[#0F172A] mb-4">Edit Followup</h2>

                {/* Error Message */}
                {followUpError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{followUpError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {/* Bank Name */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Bank Name</label>
                            <input
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleInputChange}
                                placeholder="Enter bank name"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                                disabled
                            />
                        </div>

                        {/* Banker Name */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Banker Name</label>
                            <input
                                name="bankerName"
                                value={formData.bankerName}
                                onChange={handleInputChange}
                                placeholder="Enter banker name"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                                disabled
                            />
                        </div>

                        {/* Loan Amount Requested */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Loan Amount Requested</label>
                            <input
                                name="loanAmountRequested"
                                type="number"
                                value={formData.loanAmountRequested}
                                onChange={handleInputChange}
                                placeholder="Enter loan amount"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                            />
                        </div>

                        {/* Rate Of Interest */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Rate Of Interest (%)</label>
                            <input
                                name="rateOfInterest"
                                type="number"
                                step="0.01"
                                value={formData.rateOfInterest}
                                onChange={handleInputChange}
                                placeholder="Enter rate of interest"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                            />
                        </div>

                        {/* PF */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">PF</label>
                            <input
                                name="pf"
                                type="number"
                                step="0.01"
                                value={formData.pf}
                                onChange={handleInputChange}
                                placeholder="Enter PF"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                            />
                        </div>

                        {/* Tenure */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Tenure</label>
                            <input
                                name="tenure"
                                value={formData.tenure}
                                onChange={handleInputChange}
                                placeholder="Enter tenure"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                            />
                        </div>

                        {/* Insurance Amount */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Insurance Amount</label>
                            <input
                                name="insuranceAmount"
                                type="number"
                                step="0.01"
                                value={formData.insuranceAmount}
                                onChange={handleInputChange}
                                placeholder="Enter insurance amount"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                            />
                        </div>

                        {/* Loan Type - Disabled since it's linked to bank detail */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Loan Type</label>
                            <input
                                value={followUpData?.loanType?.loanName || followUpData?.loanType || 'N/A'}
                                placeholder="Loan type"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                                disabled
                            />
                        </div>

                        {/* Scheduled Date */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Date</label>
                            <input
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                            />
                        </div>

                        {/* Follow-up Date */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Follow-up Date</label>
                            <input
                                name="followUpDate"
                                type="date"
                                value={formData.followUpDate}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                            />
                        </div>

                        {/* Status Dropdown */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                            >
                                <option value="">Select Status</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Declined">Declined</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>

                        {/* Upload Documents */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Upload Documents</label>
                            <input
                                name="documents"
                                type="file"
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                            />
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="col-span-2 mb-4">
                        <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Remark</label>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleInputChange}
                            placeholder="Enter remarks"
                            className="w-full border px-3 py-2 rounded text-[16px] font-medium text-[#8C94A3]"
                            rows={4}
                        ></textarea>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-start gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={updatingFollowUp}
                            className="px-4 py-2 border rounded hover:bg-gray-100 text-[16px] font-medium text-[#000000] disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={updatingFollowUp}
                            className="px-4 py-2 bg-[#2563EB] text-[16px] font-medium text-[#FFFFFF] rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
                        >
                            {updatingFollowUp ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Updating...
                                </>
                            ) : (
                                'Save changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFollowUp;