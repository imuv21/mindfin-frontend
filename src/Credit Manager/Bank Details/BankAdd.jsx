import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import api from '../../helpers/Api'
import { addBankDetails, clearBankOperationStates } from '../../redux/creditSlice';

const BankAdd = ({ leadId, onClose, onSaveSuccess }) => {
    const dispatch = useDispatch();

    //Get loading and error states from Redux
    const { addingBankDetails, bankOperationError } = useSelector(state => state.creditManager);

    const [formData, setFormData] = useState({
        bankName: '',
        bankerName: '',
        phone: '',
        emailId: '',
        loanAmountRequested: '',
        rateOfInterest: '',
        pf: '',
        tenure: '',
        insuranceAmount: '',
        loanType: '',
        scheduledDate: '',
        followUpDate: '',
        status: '',
        document: null,
        remarks: ''
    });

    const [banks, setBanks] = useState([]);
    const [loanTypes, setLoanTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    //  Clear any previous bank operation states when component mounts
    useEffect(() => {
        dispatch(clearBankOperationStates());
    }, [dispatch]);

    //  Handle Redux error state
    useEffect(() => {
        if (bankOperationError) {
            setError(bankOperationError);
        }
    }, [bankOperationError]);

    // Fetch banks and loan types on mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [banksRes, loanTypesRes] = await Promise.all([
                    api.getAllBanks(),
                    api.getAllLoanTypes()
                ]);

                const banksData = banksRes.data?.data;
                console.log(banksData, "hello bankData")
                const loanTypesData = loanTypesRes.data?.data?.data;
                console.log(loanTypesData, "hello loanTypesData")

                setBanks(Array.isArray(banksData) ? banksData : []);
                setLoanTypes(Array.isArray(loanTypesData) ? loanTypesData : []);

            } catch (err) {
                console.error("Error fetching dropdown data:", err);
                setError("Failed to load banks or loan types");
                setBanks([]);
                setLoanTypes([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        //  Clear error when user starts typing
        if (error) {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        console.log("Save button clicked");
        console.log("Current Form Data:", formData);
        console.log("Lead ID passed:", leadId);

        try {
            //  Prepare the data for submission (no FormData needed for regular JSON)
            const submitData = {
                lead: leadId,
                ...formData
            };

            //  Use Redux action to add bank details
            const resultAction = await dispatch(addBankDetails(submitData));
            console.log("Final submitData being sent to API/Redux:", submitData);

            if (addBankDetails.fulfilled.match(resultAction)) {
                console.log(" Bank details saved successfully!");
                onSaveSuccess();
            } else {
                //  Handle rejection
                throw new Error(resultAction.payload || 'Failed to save bank details');
            }

        } catch (err) {
            console.error('Error saving bank details:', err);
            setError(err.message || 'Failed to save bank details');
        }
    };

    const handleClose = () => {
        //  Clear any operation states before closing
        dispatch(clearBankOperationStates());
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm px-4">
            <div className="relative bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg z-50">
                <h2 className="text-[20px] font-medium text-[#0F172A] mb-4">Add Bank Details</h2>

                {/*  Show loading state while fetching initial data */}
                {isLoading && (
                    <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                        Loading banks and loan types...
                    </div>
                )}

                {/*  Show error messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

                        {/* Bank Name Dropdown */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Bank Name</label>
                            <select
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                                required
                                disabled={isLoading}
                            >
                                <option value="">Select Bank</option>
                                {Array.isArray(banks) && banks.map(bank => (
                                    <option key={bank._id} value={bank._id}>
                                        {bank.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Banker Name */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Banker Name</label>
                            <input
                                name="bankerName"
                                value={formData.bankerName}
                                onChange={handleInputChange}
                                placeholder="Enter"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                                required
                                disabled={addingBankDetails}
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Phone</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                                required
                                disabled={addingBankDetails}
                            />
                        </div>

                        {/* Email Id */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Email Id</label>
                            <input
                                name="emailId"
                                type="email"
                                value={formData.emailId}
                                onChange={handleInputChange}
                                placeholder="Enter"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                                required
                                disabled={addingBankDetails}
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
                                placeholder="Enter"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                                required
                                disabled={addingBankDetails}
                            />
                        </div>

                        {/* Rate Of Interest */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Rate Of Interest</label>
                            <input
                                name="rateOfInterest"
                                type="number"
                                step="0.01"
                                value={formData.rateOfInterest}
                                onChange={handleInputChange}
                                placeholder="Enter"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                                required
                                disabled={addingBankDetails}
                            />
                        </div>

                        {/* PF */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">PF</label>
                            <input
                                name="pf"
                                value={formData.pf}
                                onChange={handleInputChange}
                                placeholder="Enter"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                                required
                                disabled={addingBankDetails}
                            />
                        </div>

                        {/* Tenure */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Tenure</label>
                            <input
                                name="tenure"
                                type="number"
                                value={formData.tenure}
                                onChange={handleInputChange}
                                placeholder="Enter"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                                required
                                disabled={addingBankDetails}
                            />
                        </div>

                        {/* Insurance Amount */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Insurance Amount</label>
                            <input
                                name="insuranceAmount"
                                type="number"
                                value={formData.insuranceAmount}
                                onChange={handleInputChange}
                                placeholder="Enter"
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                                required
                                disabled={addingBankDetails}
                            />
                        </div>

                        {/* Loan Type Dropdown */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Loan Type</label>
                            <select
                                name="loanType"
                                value={formData.loanType}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                                required
                                disabled={addingBankDetails}
                            >
                                <option value="">Select Loan Type</option>
                                {Array.isArray(loanTypes) && loanTypes.map(type => (
                                    <option key={type._id} value={type._id}>
                                        {type.loanName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Scheduled Date */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Scheduled Date</label>
                            <input
                                name="scheduledDate"
                                type="date"
                                value={formData.scheduledDate}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                                required
                                disabled={addingBankDetails}
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
                                required
                                disabled={addingBankDetails}
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
                                required
                                disabled={addingBankDetails}
                            >
                                <option value="">Select Status</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Declined">Declined</option>
                            </select>
                        </div>

                        {/* Upload Documents */}
                        <div>
                            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Upload Documents</label>
                            <input
                                name="document"
                                type="file"
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full text-[16px] font-medium text-[#8C94A3]"
                                disabled={addingBankDetails}
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
                            placeholder="Enter"
                            className="w-full border px-3 py-2 rounded text-[16px] font-medium text-[#8C94A3]"
                            rows={4}
                            disabled={addingBankDetails}
                        ></textarea>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-start gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100 text-[16px] font-medium text-[#000000]"
                            disabled={addingBankDetails}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#2563EB] text-[16px] font-medium text-[#FFFFFF] rounded hover:bg-blue-700 disabled:opacity-50"
                            disabled={addingBankDetails}
                        >
                            {addingBankDetails ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BankAdd;