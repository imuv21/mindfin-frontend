
import ProfileHeader from '@/components/layout/ProfileHeader';
import React, { useState } from 'react';
import MainLayout from './layout/MainLayout';
import RoleBreadcrumbs from './layout/RoleBreadcrumbs';

const EditLeadForm = () => {
    const [formData, setFormData] = useState({
        name: 'Shivakumar',
        phone: '9876543210',
        altPhone: '9876543210',
        email: 'shivakumar@gmail.com',
        location: 'Bangalore',
        type: 'Personal',
        amount: '1,200,000',
        date: '2025-03-10',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <MainLayout>
            <ProfileHeader />
            <RoleBreadcrumbs/>
            <div className="bg-white p-6 rounded-xl  m-4">
                <h2 className="text-[16px] font-semibold mb-4">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Number</label>
                        <input
                            type="text"
                            name="altPhone"
                            value={formData.altPhone}
                            onChange={handleChange}
                            className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
                        <input
                            type="text"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
                        <input
                            type="text"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lead Created Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 absolute right-3 top-10 text-gray-400 pointer-events-none"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 3v1.5M17.25 3v1.5M3.375 8.25h17.25M4.5 7.5v11.25a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V7.5M9.75 12h.008v.008H9.75V12zm4.5 0h.008v.008h-.008V12zm-4.5 3h.008v.008H9.75V15zm4.5 0h.008v.008h-.008V15z"
                            />
                        </svg> */}
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-[16px] py-2 px-6 rounded-lg"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default EditLeadForm;
