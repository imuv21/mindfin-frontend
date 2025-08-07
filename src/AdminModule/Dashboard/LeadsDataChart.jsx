// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// const data = [
//   { name: 'Admin', leads: 956, color: '#5584E7' },
//   { name: 'Data Entry', leads: 766, color: '#38BDF8' },
//   { name: 'Digital Marketing', leads: 556, color: '#78AFC7' },
// ];

// const LeadsDataChart = () => {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="font-medium" style={{ fontSize: '16px' }}>Leads Data</h2>
//         <select className="text-sm text-[#4A5154] rounded px-2 py-1 bg-[#F5F6F7]">
//           <option>This Month</option>
//         </select>
//       </div>
//       <div className="h-64" style={{ fontSize: '11px' }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="leads" fill="#8884d8">
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default LeadsDataChart;



// with api testing
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import api from '../../helpers/Api'; 
import Toastify from '../../helpers/Toastify'; 

const LeadsDataChart = () => {
  const [leadData, setLeadData] = useState([
    { name: 'Admin', leads: 0, color: '#5584E7' },
    { name: 'Data Entry', leads: 0, color: '#38BDF8' },
    { name: 'Digital Marketing', leads: 0, color: '#78AFC7' },
  ]);

  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
        const { data, status } = await api.getLeadCountsByMonthAndDesignation();
        if (status === 200 && data?.data) {
          const result = data.data;

          const updatedData = [
            { name: 'Admin', leads: result["Admin"] || 0, color: '#5584E7' },
            { name: 'Data Entry', leads: result["Data entry"] || 0, color: '#38BDF8' },
            { name: 'Digital Marketing', leads: result["Digital Marketing"] || 0, color: '#78AFC7' },
          ];

          setLeadData(updatedData);
        }
      } catch (error) {
        console.error("Failed to fetch leads data", error);
        Toastify.error(error?.response?.data?.message || "Error fetching leads data");
      }
    };

    fetchLeadsData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-base">Leads Data</h2>
        <select className="text-sm text-[#4A5154] rounded px-2 py-1 bg-[#F5F6F7]">
          <option>This Month</option>
        </select>
      </div>
      <div className="h-64 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={leadData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="leads">
              {leadData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeadsDataChart;

