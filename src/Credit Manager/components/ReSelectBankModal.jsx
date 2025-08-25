import React, { useState, useEffect } from 'react';

const ReSelectBankModal = ({ onClose, onConfirm }) => {
    const [selectedReason, setSelectedReason] = useState('');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl z-60">
                <h2 className="text-[20px] font-semibold mb-1 text-[#16151C]">Reselect Bank for loan</h2>

                <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-[#EFF6FF]"
                >
                    <option value="">Select a Bank</option>
                    <option value="ICICI" className="text-sm text-gray-600 font-medium">ICICI</option>
                    <option value="SBI" className="text-sm text-gray-600 font-medium">SBI</option>
                </select>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-[16px] font-normal text-[#16151C] hover:bg-gray-200"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onConfirm(selectedReason)}
                        disabled={!selectedReason}
                        className={`px-4 py-2 rounded-lg text-white text-[16px] font-normal ${selectedReason
                            ? 'bg-[#2563EB] hover:bg-blue-700'
                            : 'bg-[#2563EB] cursor-not-allowed'
                            }`}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReSelectBankModal;
