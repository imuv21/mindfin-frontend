import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Grid,
    Box
} from '@mui/material';
import { ChevronDown } from 'lucide-react';

const designations = [
    'Managing Director',
    'Finance Officer',
    'HR Manager',
    'IT Specialist',
];

const inputStyle = {
    border: '1px solid #E0E0E0',
    borderRadius: 2,
    px: 2,
    py: 1.2,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
};

const CreateSalaryPopup = ({ open, handleClose }) => {
    const [formData, setFormData] = useState({
        designation: '',
        basicSalary: '',
        allowance: '',
        grossSalary: '',
        deduction: '',
        netSalary: '',
    });

    const handleChange = (field) => (event) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleSubmit = () => {
        console.log('Submitted:', formData);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ borderBottom: '1px solid #A2A1A81A', fontSize: '20x', color: "#16151C", fontWeight: "600" }}>
                Create Salary Definition
            </DialogTitle>
            <DialogContent >
                <Box pt={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 ">
                        <div className="relative w-full">
                            <select
                                className="w-full p-2 pl-4 pr-8 text-[16px] border border-[#A2A1A833] text-[#A2A1A833]  rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-gray-700"
                                name="designation"
                                defaultValue=""
                            >
                                <option value="" disabled className="text-[16px] ">
                                    Select Designation
                                </option>
                                <option value="MALE">designation</option>
                                <option value="FEMALE">designation</option>
                                <option value="OTHER">Other</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
                        </div>

                        <input
                            type="text"
                            className="w-full p-2 pl-4 text-[16px]  border border-[#A2A1A833] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter basic salary"
                            name="address"
                        />

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 ">
                        <input
                            type="text"
                            className="w-full p-2 pl-4  text-[16px] border border-[#A2A1A833] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter Allowance"
                            name="Enter Allowance"
                        />
                        <input
                            type="text"
                            className="w-full p-2 pl-4  text-[16px] border border-[#A2A1A833] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter Gross Salary"
                            name=""
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4  ">
                        <input
                            type="text"
                            className="w-full p-2 pl-4  text-[16px] border border-[#A2A1A833] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter Deduction"
                            name=""
                        />
                        <input
                            type="text"
                            className="w-full p-2 pl-4  text-[16px] border border-[#A2A1A833] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter Net salary"
                            name=""
                        />
                    </div>
                </Box>
            </DialogContent>

            <DialogActions sx={{ display: "flex", justifyContent: 'center' }}>
                <div className="flex justify-center space-x-3 mb-4">
                    <button className="px-10 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                        Cancel
                    </button>
                    <button className="px-10 py-2 bg-[#2563EB] text-white rounded hover:bg-blue-600">

                        Submit

                    </button>
                </div>
            </DialogActions>
        </Dialog>
    );
};

export default CreateSalaryPopup;
