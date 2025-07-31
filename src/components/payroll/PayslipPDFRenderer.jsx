import React from "react";
import { convertNumberToWords } from "../../helpers/conversion";

const PayslipPDFRenderer = ({ payslipData }) => {
  return (
    <div className="p-6" id="payslip-pdf">
      {payslipData && (
        <div className="w-[210mm] min-h-[297mm] p-8 bg-white text-black text-sm  border-none">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4 border-none">
            <div className="border-none">
              <h2 className="text-lg font-semibold border-none">
                {`${payslipData?.employee?.firstName} ${payslipData?.employee?.lastName}`}
              </h2>
              <p className="text-gray-500 text-sm border-none">
                {payslipData?.employee?.designation?.designation}
              </p>
            </div>
          </div>

          {/* Month/Year */}
          <div className="flex gap-8 mb-6 text-sm border-none">
            <p  className="border-none">
              <strong  className="border-none">Month:</strong> {payslipData?.month}
            </p>
            <p  className="border-none">
              <strong  className="border-none">Year:</strong> {payslipData?.year}
            </p>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-none">
            {/* Salary Structure Table */}
            <div className="col-span-2 border-none">
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#16151C", color: "white",border:"none" }}>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      Salary Structure
                    </th>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Basic Salary", `${payslipData?.basicSalary}`],
                    ["Housing Allowance", `${payslipData?.housingAllowence}`],
                    ["Transport Allowance", `${payslipData?.transportAllowence}`],
                    ["Utility Allowance", `${payslipData?.utilityAllowence}`],
                    ["Productivity Allowance", `${payslipData?.productivityAllowence}`],
                    ["Communication Allowance", `${payslipData?.communicationAllowence}`],
                    ["Inconvenience Allowance", `${payslipData?.inconvenienceAllowence}`],
                  ].map(([label, value], i) => (
                    <tr key={i}>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        {label}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        {value}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      Gross Salary
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      {payslipData?.grossSalary}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Deductions Table */}
            <div className="border-none">
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#16151C", color: "white",border:"none" }}>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      Deductions
                    </th>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Tax/PAYE
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      {payslipData?.taxAmount || `-`}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Employee Pension
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      {payslipData?.employeePension || `-`}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      Total Deduction
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      {payslipData?.totalDeduction || `-`}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      Net Salary
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        fontWeight: "bold",
                        color: "#16151C",
                      }}
                    >
                      {payslipData?.netSalary || `-`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Salary in Words */}
          <div className="mt-9 border-none" style={{ borderTop: "1px solid #ddd", padding: "10px 0" }}>
            <p className="border-none">
              <strong  className="border-none">Net Salary in Words:</strong> {convertNumberToWords(Number(payslipData?.netSalary))} rupees Only
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayslipPDFRenderer;