import React, { useEffect, useState } from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCreditManagerLeads} from '../../redux/creditSlice';

// Updated headers (only the required ones)
const tableHeaders = [
  { label: "Lead Name", key: "leadName" },
  { label: "Lead Number", key: "phone" },
  { label: "Lead Email Id", key: "email" },
  { label: "Lead Location", key: "location" }, 
  { label: "Applied Banks", key: "bankName" },
  { label: "Options", key: "options" },
];

export default function BankFollowUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { leadsData, loading, error } = useSelector(
    (state) => state.creditManager || {}
  );

  // Fetch leads on component mount
  useEffect(() => {
    dispatch(fetchCreditManagerLeads({ page: 1, limit: 1000 }));
  }, [dispatch]);

  const handleEdit = (id) => {
    console.log(`Edit clicked for lead ID: ${id}`);
    alert(`Edit action for lead ID: ${id}`);
  };

  const handleView = (id) => {
    console.log(`View clicked for lead ID: ${id}`);
    navigate(`/follow-up-history/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete clicked for lead ID: ${id}`);
    if (window.confirm(`Are you sure you want to delete lead ID: ${id}?`)) {
      alert(`Delete action confirmed for lead ID: ${id}`);
    }
  };

  // Fixed data access based on your log structure
  const allLeads = Array.isArray(leadsData?.data?.leads)
    ? leadsData.data.leads
    : [];

  console.log("Leads Data followup:", leadsData);
  console.log("All Leads followup:", allLeads);

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
            {loading ? (
              <tr>
                <td
                  colSpan={tableHeaders.length + 1}
                  className="text-center py-4"
                >
                  Loading...
                </td>
              </tr>
            ) : allLeads.length > 0 ? (
              allLeads.map((row) => (
                <tr
                  key={row._id}
                  className="h-11 leading-[44px] text-[14px] font-normal text-[#575757] hover:bg-gray-50 border-b border-gray-100"
                >
                  <td className="w-12 text-center p-0">
                    <input type="checkbox" className="w-4 h-4 cursor-pointer" />
                  </td>
                  <td className="h-11 px-3">{row.leadName || "-"}</td>
                  <td className="h-11 px-3">{row.phone || "-"}</td>
                  <td className="h-11 px-3">{row.email || "-"}</td>
                  <td className="h-11 px-3">{row.location || "-"}</td>
                  <td className="h-11 px-3">
                    {row.bankDetails && row.bankDetails.length > 0 
                      ? row.bankDetails.map(bank => bank.bankName || bank.bankNameText).filter(Boolean).join(", ") || "-"
                      : "-"}
                  </td>
                  <td className="h-11 px-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(row._id)}
                        className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:text-blue-800 disabled:opacity-50 transition-opacity"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleView(row._id)}
                        className="w-8 h-8 flex items-center justify-center rounded  text-gray-600 hover:text-green-800 disabled:opacity-50 transition-opacity"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(row._id)}
                        className="w-8 h-8 flex items-center justify-center rounded  text-gray-600 hover:text-red-800 disabled:opacity-50 transition-opacity"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeaders.length + 1}
                  className="text-center py-4"
                >
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}