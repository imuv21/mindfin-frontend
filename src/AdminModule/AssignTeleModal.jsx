import React, { useState } from 'react';

const AssignTelecallerModal = ({ isOpen, onClose, onAssign }) => {
    const [selectedTelecaller, setSelectedTelecaller] = useState('');

    if (!isOpen) return null;

    const handleAssign = () => {
        if (selectedTelecaller) {
            onAssign(selectedTelecaller);
            onClose();
        } else {
            alert("Please select a telecaller");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-sm">

            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                <h2 className=" font-semibold mb-4 text-start" style={{ fontSize: '20px' }}>Assign Telecaller</h2>

                <select
                    style={{ fontSize: '14px' }}
                    value={selectedTelecaller}
                    onChange={(e) => setSelectedTelecaller(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                >

                    <option value="Telecaller 1">Telecaller 1</option>
                    <option value="Telecaller 2">Telecaller 2</option>
                    <option value="Telecaller 3">Telecaller 3</option>
                </select>


                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        style={{ fontSize: '16px' }}
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        style={{ fontSize: '16px' }}
                    >
                        Assign
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignTelecallerModal;
