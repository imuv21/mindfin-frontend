// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// const pieData = [
//     { name: 'Telecaller 1', value: 914, color: '#3B82F6' },
//     { name: 'Telecaller 2', value: 574, color: '#9CA3AF' },
//     { name: 'Telecaller 3', value: 447, color: '#D1D5DB' },
//     { name: 'Telecaller 4', value: 271, color: '#7DD3FC' },
// ];

// const TotalLeadsAssigned = () => {
//     const total = pieData.reduce((sum, item) => sum + item.value, 0);

//     return (
//         <div className="bg-white p-6 rounded-xl shadow">
//             {/* Main heading */}
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="font-medium" style={{ fontSize: '16px' }}>Total Leads Assigned</h2>
//                 <select className="text-sm text-[#4A5154] rounded px-2 py-1 bg-[#F5F6F7]">
//                     <option>This Month</option>
//                 </select>
//             </div>

//             <div className="flex flex-col md:flex-row gap-8">
//                 {/* Left side: Pie Chart with center text */}
//                 <div className="w-full md:w-1/2" >
//                     <div className="relative h-64">
//                         <ResponsiveContainer width="100%" height="100%" style={{ fontSize: '14px' }}>
//                             <PieChart>
//                                 <Pie
//                                     data={pieData}
//                                     innerRadius={60}
//                                     outerRadius={80}
//                                     paddingAngle={5}
//                                     dataKey="value"
                                    
//                                 >
//                                     {pieData.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={entry.color} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip />
//                             </PieChart>
//                         </ResponsiveContainer>
//                         <div className="absolute inset-0 flex flex-col items-center justify-center">
//                             <span className="text-xs text-gray-500 font-medium">TOTAL LEADS</span>
//                             <span className="text-2xl font-bold">{total}</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right side: Telecaller list with heading */}
//                 <div className="w-full md:w-1/2">
//                     <div className="grid grid-cols-2 border-b border-gray-200 pb-3 mb-4">
//                         <h3 className="text-gray-500 uppercase" style={{ fontSize: '10px' }}>TELECALLER ASSIGNED</h3>
//                         <h3 className="text-gray-500 uppercase text-right" style={{ fontSize: '10px' }}>TOTAL LEADS</h3>
//                     </div>

//                     <div className="space-y-4">
//                         {pieData.map((item, index) => (
//                             <div key={index} className="grid grid-cols-2 items-center">
//                                 <div className="flex items-center gap-2">
//                                     <span
//                                         className="w-3 h-3 rounded-full"
//                                         style={{ backgroundColor: item.color }}
//                                     ></span>
//                                     <span className="text-base font-medium text-gray-700">{item.name}</span>
//                                 </div>
//                                 <div className="text-right text-base font-semibold text-gray-800">
//                                     {item.value}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TotalLeadsAssigned;



// with api testing
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../../helpers/Api'; 

const COLORS = ['#3B82F6', '#9CA3AF', '#D1D5DB', '#7DD3FC', '#FACC15', '#4ADE80'];

const TotalLeadsAssigned = () => {
    const [pieData, setPieData] = useState([]);

    const fetchLeadData = async () => {
        try {
            const { data } = await api.getBranchTelecallerLeadCounts(); 
            const leads = data?.data || [];

            // Assign a color to each telecaller dynamically
            const formattedData = leads.map((item, index) => ({
                name: item.name,
                value: item.leadCount,
                color: COLORS[index % COLORS.length],
            }));

            setPieData(formattedData);
        } catch (error) {
            console.error("Failed to fetch telecaller leads", error);
        }
    };

    useEffect(() => {
        fetchLeadData();
    }, []);

    const total = pieData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            {/* Main heading */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-medium text-lg">Total Leads Assigned</h2>
                <select className="text-sm text-[#4A5154] rounded px-2 py-1 bg-[#F5F6F7]">
                    <option>This Month</option>
                </select>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Pie Chart */}
                <div className="w-full md:w-1/2 relative h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs text-gray-500 font-medium">TOTAL LEADS</span>
                        <span className="text-2xl font-bold">{total}</span>
                    </div>
                </div>

                {/* Telecaller List */}
                <div className="w-full md:w-1/2">
                    <div className="grid grid-cols-2 border-b border-gray-200 pb-3 mb-4">
                        <h3 className="text-gray-500 uppercase text-xs">TELECALLER</h3>
                        <h3 className="text-gray-500 uppercase text-xs text-right">TOTAL LEADS</h3>
                    </div>

                    <div className="space-y-4">
                        {pieData.map((item, index) => (
                            <div key={index} className="grid grid-cols-2 items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                                    <span className="text-base font-medium text-gray-700">{item.name}</span>
                                </div>
                                <div className="text-right text-base font-semibold text-gray-800">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalLeadsAssigned;

