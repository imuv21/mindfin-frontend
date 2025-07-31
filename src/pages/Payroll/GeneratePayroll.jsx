import MainLayout from '@/components/layout/MainLayout';
import ProfileHeader from '@/components/layout/ProfileHeader';
import { ChevronDown, Calendar } from 'lucide-react';

export default function GeneratePayroll() {
    return (
        <MainLayout>
            <ProfileHeader />
            <div className="p-6 max-w-7xl mx-auto text-[#16151C] text-sm">

                {/* Back */}
                <div className="mb-4 flex items-center text-blue-600 cursor-pointer">
                    <span className="mr-1">&larr;</span> Back
                </div>

                {/* Generate Payroll Form */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <h2 className="text-lg font-semibold mb-4">Generate Payroll</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Payment Name */}
                        <div>
                            <label className="block text-sm mb-1">Payment name</label>
                            <input
                                type="text"
                                placeholder="Enter payment name"
                                className="w-full border border-gray-200 rounded-md p-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Designation */}
                        <div>
                            <label className="block text-sm mb-1">Designation</label>
                            <div className="relative w-full">
                                <select
                                    className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-[#A3A3A3]"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select designation</option>
                                    <option value="Managing Director">Managing Director</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
                            </div>
                        </div>

                        {/* Date Generated */}
                        <div>
                            <label className="block text-sm mb-1">Date generated</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    defaultValue="2022-11-15"
                                    className="w-full border border-gray-200 rounded-md p-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Calendar className="absolute right-2 top-2.5 h-5 w-5 text-[#A3A3A3]" />
                            </div>
                        </div>

                        {/* Payment Month */}
                        <div>
                            <label className="block text-sm mb-1">Payment month</label>
                            <div className="relative w-full">
                                <select className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-[#A3A3A3]">
                                    <option value="">Select payment month</option>
                                    <option value="January">January</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
                            </div>
                        </div>

                        {/* Payment Year */}
                        <div>
                            <label className="block text-sm mb-1">Payment Year</label>
                            <div className="relative w-full">
                                <select className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-[#A3A3A3]">
                                    <option value="">Select year</option>
                                    <option value="2023">2023</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex gap-4">
                        <button className="px-4 py-2 border rounded-md text-gray-700">Cancel</button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
                    </div>
                </div>

                {/* Staff Details Table */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Staff Details</h2>
                    <div className="overflow-auto">
                        <table className="w-full border border-gray-200 text-sm text-left">
                            <thead className="bg-[#F5F5F5] text-gray-600">
                                <tr>
                                    {[
                                        "S/N", "Staff Name", "Title", "Branch", "Basic Salary", "Allowances",
                                        "Gross Salary", "Deduction", "Net Salary", "Action"
                                    ].map((header, i) => (
                                        <th key={i} className="px-4 py-2 whitespace-nowrap">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-[#14151C]">
                                {Array.from({ length: 9 }, (_, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="px-4 py-2">0{idx + 1}</td>
                                        <td className="px-4 py-2">Abubakar Alghazali</td>
                                        <td className="px-4 py-2">Managing Director</td>
                                        <td className="px-4 py-2">Name</td>
                                        <td className="px-4 py-2">₦ 445,331</td>
                                        <td className="px-4 py-2">₦ 66,800</td>
                                        <td className="px-4 py-2">₦ 524,531</td>
                                        <td className="px-4 py-2">₦ 20,000</td>
                                        <td className="px-4 py-2 font-semibold text-blue-600">₦ 504,531</td>
                                        <td className="px-4 py-2">
                                            <button className="text-blue-500 hover:underline">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
