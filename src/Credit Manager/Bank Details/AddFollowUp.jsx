import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFollowUp, getFollowUpsByBankDetail } from '../../redux/creditSlice';
import api from '../../helpers/Api';
import Toastify from "../../helpers/Toastify";

const AddFollowUp = ({ onClose, bankDetailId, leadId, onSuccess }) => {
  const dispatch = useDispatch();
  const { addingFollowUp, followUpError } = useSelector((state) => state.creditManager);

  const [formData, setFormData] = useState({
    bankDetail: bankDetailId || '',
    loanAmountRequested: '',
    rateOfInterest: '',
    pf: '',
    tenure: '',
    insuranceAmount: '',
    loanType: '',
    date: '',
    followUpDate: '',
    status: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});
  const [loanTypes, setLoanTypes] = useState([]);
  const [loadingLoanTypes, setLoadingLoanTypes] = useState(true);
  const [loanTypeError, setLoanTypeError] = useState('');
  const [bankerInfo, setBankerInfo] = useState({
    bankName: '',
    bankerName: ''
  });

  // Set bankDetailId when it changes
  useEffect(() => {
    if (bankDetailId) {
      setFormData(prev => ({
        ...prev,
        bankDetail: bankDetailId
      }));
    }
  }, [bankDetailId]);

  // Fetch loan types from API
  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        setLoadingLoanTypes(true);
        setLoanTypeError('');

        const response = await api.getAllLoanTypes();
        console.log('Loan Types API Response:', response);

        if (response && response.data) {
          // Match the same structure as BankAdd.jsx
          const loanTypesData = response.data?.data?.data;
          console.log('Extracted Loan Types Data:', loanTypesData);

          if (Array.isArray(loanTypesData)) {
            setLoanTypes(loanTypesData);
          } else {
            throw new Error('Invalid response format - not an array');
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching loan types:', error);
        setLoanTypeError('Failed to load loan types. Please try again.');

        // Fallback to static data if API fails
        setLoanTypes([
          { _id: '68888b94f13529214fd2cd6f', loanName: 'Personal Loan' },
          { _id: '68888b94f13529214fd2cd70', loanName: 'Home Loan' },
          { _id: '68888b94f13529214fd2cd71', loanName: 'Car Loan' },
          { _id: '68888b94f13529214fd2cd72', loanName: 'Business Loan' }
        ]);
      } finally {
        setLoadingLoanTypes(false);
      }
    };

    fetchLoanTypes();

    // Mock banker info - replace with actual data from props or API
    setBankerInfo({
      bankName: 'HDFC Bank',
      bankerName: 'John Doe'
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bankDetail) {
      newErrors.bankDetail = 'Bank detail ID is required';
    }

    if (!formData.loanAmountRequested) {
      newErrors.loanAmountRequested = 'Loan amount is required';
    } else if (isNaN(formData.loanAmountRequested) || Number(formData.loanAmountRequested) <= 0) {
      newErrors.loanAmountRequested = 'Please enter a valid loan amount';
    }

    if (!formData.rateOfInterest) {
      newErrors.rateOfInterest = 'Interest rate is required';
    } else if (isNaN(formData.rateOfInterest) || Number(formData.rateOfInterest) <= 0) {
      newErrors.rateOfInterest = 'Please enter a valid interest rate';
    }

    if (!formData.tenure) {
      newErrors.tenure = 'Tenure is required';
    }

    if (!formData.loanType) {
      newErrors.loanType = 'Loan type is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.followUpDate) {
      newErrors.followUpDate = 'Follow-up date is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    // Validate that follow-up date is not before the scheduled date
    if (formData.date && formData.followUpDate) {
      const scheduleDate = new Date(formData.date);
      const followUpDate = new Date(formData.followUpDate);
      if (followUpDate < scheduleDate) {
        newErrors.followUpDate = 'Follow-up date cannot be before scheduled date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Save Follow-up button clicked!');
    console.log('Form Data before validation:', formData);
    console.log('Bank Detail ID:', formData.bankDetail);
    console.log('Lead ID:', leadId);
    console.log('Available Loan Types:', loanTypes);
    console.log('Selected Loan Type:', formData.loanType);

    // Find and log the selected loan type details
    const selectedLoanType = loanTypes.find(type => type._id === formData.loanType);
    console.log('Selected Loan Type Details:', selectedLoanType);

    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      console.log('Validation errors details:', Object.keys(errors).map(key => `${key}: ${errors[key]}`));
      return;
    }

    console.log('Form validation passed!');

    // Prepare data for submission - match the working Postman structure exactly
    const submitData = {
      bankDetail: formData.bankDetail,
      loanAmountRequested: Number(formData.loanAmountRequested),
      rateOfInterest: Number(formData.rateOfInterest),
      pf: formData.pf ? Number(formData.pf) : 0,
      tenure: formData.tenure,
      insuranceAmount: formData.insuranceAmount ? Number(formData.insuranceAmount) : 0,
      loanType: formData.loanType,
      date: formData.date,
      followUpDate: formData.followUpDate,
      status: formData.status,
      remarks: formData.remarks || ''
    };

    console.log('Final Submit Data being sent to API:', submitData);
    console.log('Loan Amount (converted):', Number(formData.loanAmountRequested));
    console.log('Rate of Interest (converted):', Number(formData.rateOfInterest));
    console.log('Loan Type ID being sent:', formData.loanType);
    console.log('Dates being sent:', { date: formData.date, followUpDate: formData.followUpDate });

    try {
      console.log('Dispatching addFollowUp action...');
      const result = await dispatch(addFollowUp(submitData)).unwrap();
      console.log('Follow-up added successfully:', result);
      console.log('Success result details:', JSON.stringify(result, null, 2));

      // Close modal first
      if (onSuccess) {
        onSuccess();
      } else {
        // Fallback if no onSuccess provided
        onClose();
        Toastify.success("Follow-up added successfully!");

        // Refresh the follow-ups list after a small delay to ensure state is updated
        if (bankDetailId) {
          console.log('Refreshing follow-ups list for bankDetailId:', bankDetailId);
          setTimeout(() => {
            dispatch(getFollowUpsByBankDetail(bankDetailId));
          }, 500);
        }
      }

   } catch (error) {
      console.error('Error adding follow-up:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Show error message with Toastify
      Toastify.error(`Failed to add follow-up: ${error.message || error}`);
    }
  }

  const retryLoadingLoanTypes = () => {
    // Trigger re-fetch of loan types
    const fetchLoanTypes = async () => {
      try {
        setLoadingLoanTypes(true);
        setLoanTypeError('');

        const response = await api.getAllLoanTypes();
        console.log('Retry - Loan Types API Response:', response);

        if (response && response.data) {
          // Match the same structure as BankAdd.jsx
          const loanTypesData = response.data?.data?.data;
          console.log('Retry - Extracted Loan Types Data:', loanTypesData);

          if (Array.isArray(loanTypesData)) {
            setLoanTypes(loanTypesData);
          } else {
            throw new Error('Invalid response format - not an array');
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching loan types:', error);
        setLoanTypeError('Failed to load loan types. Please try again.');
      } finally {
        setLoadingLoanTypes(false);
      }
    };

    fetchLoanTypes();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div
        className="relative bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[20px] font-medium text-[#0F172A] mb-4">Add Follow-up</h2>

        <form onSubmit={handleSubmit}>
          {/* Display bank and banker info */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Bank Detail ID</label>
              <div className="text-[16px] font-medium text-[#0F172A]">{formData.bankDetail || 'Not provided'}</div>
            </div>
            <div>
              <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Banker Name</label>
              <div className="text-[16px] font-medium text-[#0F172A]">{bankerInfo.bankerName}</div>
            </div>
          </div> */}

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Loan Amount Requested */}
            <div>
              <label className="block text-[14px] font-medium text-[#1D2026] mb-1">
                Loan Amount Requested *
              </label>
              <input
                type="number"
                name="loanAmountRequested"
                value={formData.loanAmountRequested}
                onChange={handleInputChange}
                placeholder="Enter amount"
                className={`border px-3 py-2 rounded w-full text-[16px] font-medium ${errors.loanAmountRequested ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:outline-none`}
              />
              {errors.loanAmountRequested && (
                <p className="text-red-500 text-sm mt-1">{errors.loanAmountRequested}</p>
              )}
            </div>

            {/* Rate Of Interest */}
            <div>
              <label className="block text-[14px] font-medium text-[#1D2026] mb-1">
                Rate Of Interest (%) *
              </label>
              <input
                type="number"
                step="0.01"
                name="rateOfInterest"
                value={formData.rateOfInterest}
                onChange={handleInputChange}
                placeholder="Enter rate"
                className={`border px-3 py-2 rounded w-full text-[16px] font-medium ${errors.rateOfInterest ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:outline-none`}
              />
              {errors.rateOfInterest && (
                <p className="text-red-500 text-sm mt-1">{errors.rateOfInterest}</p>
              )}
            </div>

            {/* PF */}
            <div>
              <label className="block text-[14px] font-medium text-[#1D2026] mb-1">PF</label>
              <input
                type="number"
                step="0.01"
                name="pf"
                value={formData.pf}
                onChange={handleInputChange}
                placeholder="Enter PF"
                className="border border-gray-300 px-3 py-2 rounded w-full text-[16px] font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Tenure */}
            <div>
              <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Tenure *</label>
              <input
                type="text"
                name="tenure"
                value={formData.tenure}
                onChange={handleInputChange}
                placeholder="e.g., 5 years"
                className={`border px-3 py-2 rounded w-full text-[16px] font-medium ${errors.tenure ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:outline-none`}
              />
              {errors.tenure && (
                <p className="text-red-500 text-sm mt-1">{errors.tenure}</p>
              )}
            </div>

            {/* Insurance Amount */}
            <div>
              <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Insurance Amount</label>
              <input
                type="number"
                name="insuranceAmount"
                value={formData.insuranceAmount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                className="border border-gray-300 px-3 py-2 rounded w-full text-[16px] font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Loan Type */}
            <div>
              <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Loan Type *</label>
              <select
                name="loanType"
                value={formData.loanType}
                onChange={handleInputChange}
                disabled={loadingLoanTypes}
                className={`border px-3 py-2 rounded w-full text-[16px] font-medium ${errors.loanType ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:outline-none ${loadingLoanTypes ? 'bg-gray-100' : ''}`}
              >
                <option value="">
                  {loadingLoanTypes ? 'Loading loan types...' : 'Select loan type'}
                </option>
                {loanTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.loanName}
                  </option>
                ))}
              </select>
              {errors.loanType && (
                <p className="text-red-500 text-sm mt-1">{errors.loanType}</p>
              )}
              {loanTypeError && (
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-red-500 text-sm">{loanTypeError}</p>
                  <button
                    type="button"
                    onClick={retryLoadingLoanTypes}
                    className="text-blue-500 text-sm underline hover:text-blue-700"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Scheduled Date */}
            <div>
              <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Scheduled Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`border px-3 py-2 rounded w-full text-[16px] font-medium ${errors.date ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:outline-none`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Follow-up Date *</label>
              <input
                type="date"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleInputChange}
                className={`border px-3 py-2 rounded w-full text-[16px] font-medium ${errors.followUpDate ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:outline-none`}
              />
              {errors.followUpDate && (
                <p className="text-red-500 text-sm mt-1">{errors.followUpDate}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`border px-3 py-2 rounded w-full text-[16px] font-medium ${errors.status ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:outline-none`}
              >
                <option value="">Select status</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Declined">Declined</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status}</p>
              )}
            </div>

            {/* Upload Documents */}
            <div>
              <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Upload Documents</label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="border border-gray-300 px-3 py-2 rounded w-full text-[16px] font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Remark Field */}
          <div className="mb-4">
            <label className="block text-[14px] font-medium text-[#1D2026] mb-1">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              placeholder="Enter remarks"
              className="w-full border border-gray-300 px-3 py-2 rounded text-[16px] font-medium focus:border-blue-500 focus:outline-none"
              rows={4}
            />
          </div>

          {/* Error Message */}
          {followUpError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              {followUpError}
            </div>
          )}

          {/* Debug Info
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-gray-100 border border-gray-300 text-gray-700 rounded text-xs">
              <strong>Debug Info:</strong><br/>
              Bank Detail ID: {formData.bankDetail || 'Missing'}<br/>
              Lead ID: {leadId || 'Missing'}<br/>
              Loan Types Loaded: {loanTypes.length}
            </div>
          )} */}

          {/* Buttons */}
          <div className="flex justify-start gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={addingFollowUp}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-[16px] font-medium text-[#000000] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={addingFollowUp || loadingLoanTypes}
              className="px-4 py-2 bg-[#2563EB] text-[16px] font-medium text-[#FFFFFF] rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {addingFollowUp ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : loadingLoanTypes ? (
                'Loading...'
              ) : (
                'Save Follow-up'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFollowUp;