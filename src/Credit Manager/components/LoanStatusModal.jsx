import React, { useState } from 'react';

const LoanStatusModal = ({ onClose, onConfirm }) => {
    const [selectedReason, setSelectedReason] = useState('');

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg">
                <h2 className="text-[20px] font-semibold mb-1" style={{ color: '#16151C' }}> Loan Status</h2>
                <select
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-[#EFF6FF]"
                >
                    <option
                        value="lead"
                        style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8' }}
                    >
                        Approved
                    </option>
                    <option
                        value="bank"
                        style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8' }}
                    >
                        Rejected
                    </option>
                    <option
                        value="bank"
                        style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8' }}
                    >
                        Follow-up
                    </option>
                </select>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-[16px] font-normal text-[#16151C] hover:bg-gray-200">
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(selectedReason)}
                        disabled={!selectedReason}
                        className={`px-4 py-2 rounded-lg text-white text-[16px] font-normal ${selectedReason
                            ? 'bg-[#2563EB] hover:bg-blue-700'
                            : 'bg-[#2563EB] cursor-not-allowed'
                            }`}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoanStatusModal;
