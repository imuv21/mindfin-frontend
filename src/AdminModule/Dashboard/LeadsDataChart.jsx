import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Admin', leads: 956, color: '#5584E7' },
  { name: 'Data Entry', leads: 766, color: '#38BDF8' },
  { name: 'Digital Marketing', leads: 556, color: '#78AFC7' },
];

const LeadsDataChart = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold" style={{ fontSize: '16px' }}>Leads Data</h2>
        <select className="text-sm text-[#4A5154] rounded px-2 py-1 bg-[#F5F6F7]">
          <option>This Month</option>
        </select>
      </div>
      <div className="h-64" style={{ fontSize: '11px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="leads" fill="#8884d8">
              {data.map((entry, index) => (
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
