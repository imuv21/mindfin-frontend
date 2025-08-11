import React, { useState, useEffect } from 'react';
import api from '../helpers/Api';
import Toastify from '../helpers/Toastify';

const AssignTelecallerModal = ({ isOpen, onClose, leadId, onAssigned }) => {
    const [selectedTelecaller, setSelectedTelecaller] = useState('');
    const [telecallers, setTelecallers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchTelecallers();
        }
    }, [isOpen]);

    const fetchTelecallers = async () => {
        try {
            const { status, data } = await api.getAllTelecallers();
            if (status === 200) {
                setTelecallers(data?.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch telecallers", error);
        }
    };

    const handleAssign = async () => {
        if (!selectedTelecaller) {
            alert("Please select a telecaller");
            return;
        }
        try {
            setLoading(true);
            const payload = {
                leadId: leadId,
                employeeId: selectedTelecaller
            };
            const { status } = await api.assignLeadToEmployee(payload);
            if (status === 200) {
                Toastify.success("Lead assigned successfully");
                onAssigned(); // Refresh leads list in parent
                onClose();
            }
        } catch (error) {
            console.error("Failed to assign telecaller", error);
            Toastify.error("Assignment failed");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                <h2 className="font-semibold mb-4 text-start text-lg">Assign Telecaller</h2>

                <select
                    value={selectedTelecaller}
                    onChange={(e) => setSelectedTelecaller(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="">Select Telecaller</option>
                    {telecallers.map(tc => (
                        <option key={tc._id} value={tc._id}>
                            {tc.firstName} {tc.lastName}
                        </option>
                    ))}
                </select>

                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {loading ? "Assigning..." : "Assign"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignTelecallerModal;

