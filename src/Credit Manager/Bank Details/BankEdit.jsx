import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBankDetailById, updateBankDetail, clearBankDetailStates } from '../../redux/creditSlice';
import api from '../../helpers/Api';

const BankEdit = ({ bankId, onClose, onSaveSuccess }) => {
    const dispatch = useDispatch();
    const { selectedBankDetail, loadingBankDetail, updatingBankDetail, bankDetailError } = useSelector(
        (state) => state.creditManager
    );

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
        status: 'In Progress',
        document: null,
        remarks: ''
    });

    const [banks, setBanks] = useState([]);
    const [loanTypes, setLoanTypes] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch banks and loan types on mount
    useEffect(() => {
        const fetchDropdownData = async () => {
            setIsLoading(true);
            try {
                const [banksRes, loanTypesRes] = await Promise.all([
                    api.getAllBanks(),
                    api.getAllLoanTypes()
                ]);

                const banksData = banksRes.data?.data;
                const loanTypesData = loanTypesRes.data?.data?.data;

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
        fetchDropdownData();
    }, []);

    // Fetch bank details when component mounts
    useEffect(() => {
        if (bankId) {
            dispatch(fetchBankDetailById(bankId));
        }

        // Cleanup on unmount
        return () => {
            dispatch(clearBankDetailStates());
        };
    }, [dispatch, bankId]);

    // Populate form with fetched data
    useEffect(() => {
        if (selectedBankDetail && !isInitialized && banks.length > 0 && loanTypes.length > 0) {
            const formatDate = (dateString) => {
                if (!dateString) return '';
                try {
                    const date = new Date(dateString);
                    return date.toISOString().split('T')[0];
                } catch {
                    return '';
                }
            };

            // Get the bank ID (handle both object and string cases)
            let bankId = '';
            if (selectedBankDetail.bankName) {
                if (typeof selectedBankDetail.bankName === 'object' && selectedBankDetail.bankName._id) {
                    bankId = selectedBankDetail.bankName._id;
                } else if (typeof selectedBankDetail.bankName === 'string') {
                    bankId = selectedBankDetail.bankName;
                }
            }

            // Get the loan type ID (handle both object and string cases)
            let loanTypeId = '';
            if (selectedBankDetail.loanType) {
                if (typeof selectedBankDetail.loanType === 'object' && selectedBankDetail.loanType._id) {
                    loanTypeId = selectedBankDetail.loanType._id;
                } else if (typeof selectedBankDetail.loanType === 'string') {
                    loanTypeId = selectedBankDetail.loanType;
                }
            }

            setFormData({
                bankName: bankId,
                bankerName: selectedBankDetail.bankerName || '',
                phone: selectedBankDetail.phone || '',
                emailId: selectedBankDetail.emailId || '',
                loanAmountRequested: selectedBankDetail.loanAmountRequested || '',
                rateOfInterest: selectedBankDetail.rateOfInterest || '',
                pf: selectedBankDetail.pf || '',
                tenure: selectedBankDetail.tenure || '',
                insuranceAmount: selectedBankDetail.insuranceAmount || '',
                loanType: loanTypeId,
                scheduledDate: formatDate(selectedBankDetail.scheduledDate),
                followUpDate: formatDate(selectedBankDetail.followUpDate),
                status: selectedBankDetail.status || 'In Progress',
                document: null, // File inputs should be null initially
                remarks: selectedBankDetail.remarks || ''
            });
            setIsInitialized(true);
        }
    }, [selectedBankDetail, isInitialized, banks, loanTypes]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            // For bankName and loanType, store the ObjectId directly
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Create FormData for file upload if document is present
            const updateData = { ...formData };

            // Remove document from regular data if it's a file
            if (formData.document) {
                // Handle file upload separately if needed
                // For now, we'll exclude it from the update
                delete updateData.document;
            } else {
                delete updateData.document;
            }

            // Dispatch the update action
            const result = await dispatch(updateBankDetail({
                bankId,
                updateData
            })).unwrap();

            console.log('Bank details updated successfully:', result);

            // Call success callback
            if (onSaveSuccess) {
                onSaveSuccess();
            }
        } catch (error) {
            console.error('Failed to update bank details:', error);
            setError(error.message || 'Failed to update bank details');
        }
    };

    const handleClose = () => {
        dispatch(clearBankDetailStates());
        onClose();
    };

    if (loadingBankDetail || isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span>Loading bank details...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (bankDetailError) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="text-red-600 mb-4">
                        <strong>Error:</strong> {bankDetailError}
                    </div>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm px-4">
            <div className="relative bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg z-50">
                <h2 className="text-[20px] font-medium text-[#0F172A] mb-4">Edit Bank Details</h2>

                {/* Show error messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

                        {/* Bank Name Dropdown */}
                        <div>
                            <label className="block text-[14px] font-medium mb-1">Bank Name</label>
                            <select
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full"
                                disabled={loadingBankDetail}
                                required
                            >
                                <option value="">Select Bank</option>
                                {Array.isArray(banks) && banks.map(bank => (
                                    <option key={bank._id} value={bank._id}>
                                        {bank.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[14px] font-medium mb-1">Banker Name</label>
                            <input
                                name="bankerName"
                                value={formData.bankerName}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full"
                                disabled={loadingBankDetail}
                            />
                        </div>

                        <div>
                            <label className="block text-[14px] font-medium mb-1">Phone</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full"
                                disabled={loadingBankDetail}
                            />
                        </div>

                        <div>
                            <label className="block text-[14px] font-medium mb-1">Email Id</label>
                            <input
                                name="emailId"
                                type="email"
                                value={formData.emailId}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full"
                                disabled={loadingBankDetail}
                            />
                        </div>

                        <div>
                            <label className="block text-[14px] font-medium mb-1">Loan Amount Requested</label>
                            <input
                                name="loanAmountRequested"
                                type="number"
                                value={formData.loanAmountRequested}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full"
                                disabled={loadingBankDetail}
                            />
                        </div>

                        <div>
                            <label className="block text-[14px] font-medium mb-1">Rate Of Interest (%)</label>
                            <input
                                name="rateOfInterest"
                                type="number"
                                step="0.1"
                                value={formData.rateOfInterest}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full"
                                disabled={loadingBankDetail}
                            />
                        </div>

                        <div>
                            <label className="block text-[14px] font-medium mb-1">PF</label>
                            <input
                                name="pf"
                                type="number"
                                value={formData.pf}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full"
                                disabled={loadingBankDetail}
                            />
                        </div>

                        <div>
                            <label className="block text-[14px] font-medium mb-1">Tenure (Months)</label>
                            <input
                                name="tenure"
                                type="number"
                                value={formData.tenure}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full"
                                disabled={loadingBankDetail}
                            />
                        </div>

                        <div>
                            <label className="block text-[14px] font-medium mb-1">Insurance Amount</label>
                            <input
                                name="insuranceAmount"
                                type="number"
                                value={formData.insuranceAmount}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full"
                                disabled={loadingBankDetail}
                            />
                        </div>

                        {/* Loan Type Dropdown */}
                        <div>
                            <label className="block text-[14px] font-medium mb-1">Loan Type</label>
                            <select
                                name="loanType"
                                value={formData.loanType}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full"
                                disabled={loadingBankDetail}
                                required
                            >
                                <option value="">Select Loan Type</option>
                                {Array.isArray(loanTypes) && loanTypes.map(type => (
                                    <option key={type._id} value={type._id}>
                                        {type.loanName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[14px] font-medium mb-1">Scheduled Date</label>
                            <input
                                name="scheduledDate"
                                type="date"
                                value={formData.scheduledDate}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full"
                                disabled={loadingBankDetail}
                            />
                        </div>

                        <div>
                            <label className="block text-[14px] font-medium mb-1">Follow-up Date</label>
                            <input
                                name="followUpDate"
                                type="date"
                                value={formData.followUpDate}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full"
                                disabled={loadingBankDetail}
                            />
                        </div>

                        <div>
                            <label className="block text-[14px] font-medium mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full"
                                disabled={loadingBankDetail}
                            >
                                <option value="Confirmed">Confirmed</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Declined">Declined</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[14px] font-medium mb-1">Upload Documents</label>
                            <input
                                name="document"
                                type="file"
                                onChange={handleInputChange}
                                className="border px-3 py-2 rounded w-full"
                                disabled={loadingBankDetail}
                            />
                            <small className="text-gray-500">
                                Note: Document upload functionality may need additional backend support
                            </small>
                        </div>

                        <div className="col-span-2 mb-4">
                            <label className="block text-[14px] font-medium mb-1">Remark</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded"
                                rows={4}
                                disabled={loadingBankDetail}
                            ></textarea>
                        </div>

                    </div>

                    {bankDetailError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                            <strong>Error:</strong> {bankDetailError}
                        </div>
                    )}

                    <div className="flex justify-start gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                            disabled={updatingBankDetail}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#2563EB] text-white rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center space-x-2"
                            disabled={updatingBankDetail || loadingBankDetail}
                        >
                            {updatingBankDetail && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            )}
                            <span>{updatingBankDetail ? 'Updating...' : 'Update'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BankEdit;