import MainLayout from "@/components/layout/MainLayout";
import ProfileHeader from "@/components/layout/ProfileHeader";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../helpers/Api";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { convertNumberToWords } from "../../helpers/conversion";

export default function PayslipView() {
    const {id} = useParams()
    const navigate = useNavigate()
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)




    const fetchData = async () =>{
        try {
             setLoading(true)
            const {data,status} = await api.getAPaySlip(id)

            if(status === 200){
                setData(data?.data)
            }
            
        } catch (error) {
          Toastify.error(error.response.data.message || `something went wrong`);
            
        }finally{
            setLoading(false)
        }
    }


    useEffect(()=>{
        fetchData()
    },[id])


    



    return (
        <MainLayout>
            <ProfileHeader
            name="Payroll"
            breadcrumbs={["View Payslip."]}
            />
            {/* Back Button */}
            <div className="px-4 mb-6 flex items-center text-sm text-blue-600 cursor-pointer" onClick={()=>navigate("/employeesSalary")}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span>Back</span>
            </div>


            {
                loading ?

                <div className="flex items-center justify-center h-screen">
                    <CircularProgress />
                </div>

                :
                <div className="px-6 py-4 max-w-6xl  border border-[#D9D9D9] rounded-[8px] m-4 ">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">{` ${data?.employee?.firstName} ${data?.employee?.lastName}`}</h2>
                        <p className="text-gray-500 text-sm">{data?.employee?.designation?.designation}</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm  cursor-pointer" onClick={()=>navigate(`/editPayslip/${id}`)} >
                        Edit payslip
                    </button>
                </div>

                {/* Month/Year */}
                <div className="flex gap-8 mb-6 text-sm">
                    <p><strong>Month:</strong> {data?.month}</p>
                    <p><strong>Year:</strong> {data?.year}</p>
                </div>

                {/* Tables */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Salary Structure Table */}
                    <div className="col-span-2">
                        <table className="w-full border border-gray-200">
                            <thead>
                                <tr className="bg-[#16151C] text-white text-left">
                                    <th className="p-2 font-medium">Salary Structure</th>
                                    <th className="p-2 font-medium">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-[#16151C]">
                                {[
                                    ["Basic Salary", `${data?.basicSalary}`],
                                    ["Housing Allowance", `${data?.housingAllowence}`],
                                    ["Transport Allowance", `${data?.transportAllowence}`],
                                    ["Utility Allowance", `${data?.utilityAllowence}`],
                                    ["Productivity Allowance", `${data?.productivityAllowence}`],
                                    ["Communication Allowance", `${data?.communicationAllowence}`],
                                    ["Inconvenience Allowance", `${data?.inconvenienceAllowence}`],
                                ].map(([label, value], i) => (
                                    <tr key={i} className="border-t border-gray-100">
                                        <td className="p-2">{label}</td>
                                        <td className="p-2">{value}</td>
                                    </tr>
                                ))}
                                <tr className="border-t font-semibold">
                                    <td className="p-2">Gross Salary</td>
                                    <td className="p-2">{data?.grossSalary}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Deductions Table */}
                    <div >
                        <table className="w-full border border-gray-200">
                            <thead>
                                <tr className="bg-[#16151C] text-white text-left">
                                    <th className="p-2 font-medium">Deductions</th>
                                    <th className="p-2 font-medium">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-[#16151C]">
                                <tr className="border-t">
                                    <td className="p-2">Tax/PAYE</td>
                                    <td className="p-2">{data?.taxAmount || `-`}</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-2">Employee Pension</td>
                                    <td className="p-2">{data?.employeePension || `-`}</td>
                                </tr>
                                <tr className="border-t font-semibold">
                                    <td className="p-2">Total Deduction</td>
                                    <td className="p-2">{data?.totalDeduction || `-`}</td>
                                </tr>
                                <tr className="border-t border-blue-500 font-semibold">
                                    <td className="p-2">Net Salary</td>
                                    <td className="p-2 text-blue-600">{data?.netSalary || `-`}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Salary in Words */}
                <div className="mt-4 text-sm">
                    <p><strong>Net Salary in Words:</strong> {convertNumberToWords(Number(data?.netSalary))} rupees Only</p>
                </div>
            </div>

            }
           
        </MainLayout>
    );
}
