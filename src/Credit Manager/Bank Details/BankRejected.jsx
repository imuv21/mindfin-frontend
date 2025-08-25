import React, { useState } from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import BankAdd from './BankAdd';

const staticLeadsData = [
  {
    id: 1,
    leadName: 'Uday',
    phone: '985475213',
    email: 'lead@gmail.com',
    leadLocation: 'Bangalore',
    appliedBanks: 'HDFC',
  },
  {
    id: 2,
    leadName: 'Uday',
    phone: '985475213',
    email: 'lead@gmail.com',
    leadLocation: 'Bangalore',
    appliedBanks: 'HDFC, SBI',
  },
  {
    id: 3,
    leadName: 'Uday',
    phone: '985475213',
    email: 'lead@gmail.com',
    leadLocation: 'Bangalore',
    appliedBanks: 'HDFC',
  }
];

const tableHeaders = [
  { label: 'Lead Name', key: 'leadName' },
  { label: 'Lead Number', key: 'phone' },
  { label: 'Lead Email Id', key: 'email' },
  { label: 'Lead Location', key: 'leadLocation' },
  { label: 'Applied Banks', key: 'appliedBanks' },
  { label: 'Options', key: 'options' }
];

export default function BankRejected() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const handleEdit = (id) => {
    console.log(`Edit clicked for lead ID: ${id}`);
  };

  const handleView = (id) => {
    console.log(`View clicked for lead ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete clicked for lead ID: ${id}`);
    if (window.confirm(`Are you sure you want to delete lead ID: ${id}?`)) {
      alert(`Delete action confirmed for lead ID: ${id}`);
    }
  };

  const openModal = (leadId) => {
    setSelectedLeadId(leadId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLeadId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg mt-4 p-2.5 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="h-16 text-sm text-gray-700 bg-gray-50">
              <th className="w-12 text-center p-0 align-top pt-2">
                <input type="checkbox" className="w-4 h-4 cursor-pointer" />
              </th>
              {tableHeaders.map((header) => (
                <th
                  key={header.key}
                  className="h-11 px-3 text-left font-semibold text-[#363636] text-[14px] border-b leading-tight align-top pt-2 whitespace-nowrap"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staticLeadsData.map((row) => (
              <tr
                key={row.id}
                className="h-11 leading-[44px] text-[14px] font-normal text-[#575757] hover:bg-gray-50 border-b border-gray-100"
              >
                <td className="w-12 text-center p-0">
                  <input type="checkbox" className="w-4 h-4 cursor-pointer" />
                </td>
                <td className="h-11 px-3">{row.leadName}</td>
                <td className="h-11 px-3">{row.phone}</td>
                <td className="h-11 px-3">{row.email}</td>
                <td className="h-11 px-3">{row.leadLocation}</td>
                <td className="h-11 px-3">{row.appliedBanks}</td>

                {/* <td className="h-11 px-3">
                  {row.appliedBanks === 'Add Bank' ? (
                    <span
                      onClick={() => openModal(row.id)}
                      className="text-[#2563EB] underline cursor-pointer"
                    >
                      Add Bank
                    </span>
                  ) : (
                    row.appliedBanks
                  )}
                </td> */}
                <td className="h-11 px-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(row.id)}
                      className="w-8 h-8 flex items-center justify-center rounded text-[#818181]"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleView(row.id)}
                      className="w-8 h-8 flex items-center justify-center rounded text-[#818181]"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="w-8 h-8 flex items-center justify-center rounded text-[#818181]"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal only shown when "Add Bank" is clicked */}
      {isModalOpen && (
        <BankAdd onClose={closeModal} leadId={selectedLeadId} />
      )}
    </div>
  );
}
