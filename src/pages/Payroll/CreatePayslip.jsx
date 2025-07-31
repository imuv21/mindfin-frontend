import MainLayout from "@/components/layout/MainLayout";
import ProfileHeader from "@/components/layout/ProfileHeader";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { useState } from "react";
import api from "../../helpers/Api";
import Toastify from "../../helpers/Toastify";
import { setRefresh } from "../../redux/payrollSlice";
import { CircularProgress } from "@mui/material";

export default function CreatePayslip() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {AllEmployees} = useSelector((state)=>state.employee)
    const {taxes} =  useSelector((state)=>state.payroll)
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading,setLoading] = useState(false)


   
    

    const formik = useFormik({
        initialValues: {
            employee: "",
            title: "",
            level: "",
            basicSalary: "",
            housingAllowence: "",
            transportAllowence: "",
            utilityAllowence: "",
            productivityAllowence: "",
            communicationAllowence: "",
            inconvenienceAllowence: "",
            tax: "",
            employeePension: "",
            grossSalary:0,
            netSalary:0,
            month:"",
            year:"",
            totalDeduction:0,
            taxAmount:''
        },
        validationSchema: Yup.object({
            employee: Yup.string().required("Staff name is required"),
            // title: Yup.string().required("Title is required"),
            // level: Yup.string().required("Level is required"),
            month: Yup.string().required("Month is required"),
            year: Yup.string().required("year is required"),
            basicSalary: Yup.number().typeError("Enter valid amount").required(" Basic Salary is Required"),
            housingAllowence: Yup.number().typeError("Enter valid amount").required("Housing Allowance isRequired"),
            transportAllowence: Yup.number().typeError("Enter valid amount").required(" Transport Allowance is Required"),
            utilityAllowence: Yup.number().typeError("Enter valid amount").required(" Utility Allowance Required"),
            productivityAllowence: Yup.number().typeError("Enter valid amount").required(" Productivity Allowance Required"),
            communicationAllowence: Yup.number().typeError("Enter valid amount").required(" Communication Allowance is Required"),
            inconvenienceAllowence: Yup.number().typeError("Enter valid amount").required(" Inconvenience Allowance is Required"),
            tax: Yup.string().required("tax is Required"),
            employeePension: Yup.number().typeError("Enter valid amount").required("pension is Required"),
        }),
        onSubmit: async(values) => {
            console.log(values,"values");
            try {
                setLoading(true)

                const {data,status} = await api.addSalarySlip(values)

                if(status === 200){
                    Toastify.success("Payslip Added successfully")
                    dispatch(setRefresh())
                    navigate("/employeesSalary")
                }
                
            } catch (error) {
                    Toastify.error(error.response.data.message || `something went wrong`);
                
            }finally{
                setLoading(false)
            }


            
        }
    });

    


    useEffect(() => {
        const {
          basicSalary,
          housingAllowence,
          transportAllowence,
          utilityAllowence,
          productivityAllowence,
          communicationAllowence,
          inconvenienceAllowence
        } = formik.values;
      
        const toNumber = (val) => parseFloat(val) || 0;
      
        const total =
          toNumber(basicSalary) +
          toNumber(housingAllowence) +
          toNumber(transportAllowence) +
          toNumber(utilityAllowence) +
          toNumber(productivityAllowence) +
          toNumber(communicationAllowence) +
          toNumber(inconvenienceAllowence);
      
        formik.setFieldValue('grossSalary', total);
      }, [
        formik.values.basicSalary,
        formik.values.housingAllowence,
        formik.values.transportAllowence,
        formik.values.utilityAllowence,
        formik.values.productivityAllowence,
        formik.values.communicationAllowence,
        formik.values.inconvenienceAllowence
      ]);
      

      useEffect(() => {
        const { grossSalary, tax, employeePension } = formik.values;
      
        const taxvalue = taxes.filter((taxitem)=>taxitem._id === tax)
        
        const taxAmount = (Number(grossSalary) * Number(taxvalue[0]?.value || 0)) / 100;
        const totalDeduction = taxAmount + Number(employeePension);
        const netSalary = Number(grossSalary) - totalDeduction;
      
        formik.setFieldValue("taxAmount", isNaN(taxAmount) ? 0 : taxAmount);
        formik.setFieldValue("totalDeduction", isNaN(totalDeduction) ? 0 : totalDeduction);
        formik.setFieldValue("netSalary", isNaN(netSalary) ? 0 : netSalary);
      }, [formik.values.grossSalary, formik.values.tax, formik.values.employeePension]);
      

      const handleDateChange = (date) => {
        setSelectedDate(date);
        const month = date.toLocaleString('default', { month: 'long' }); 
        const year = date.getFullYear().toString();                      
      
        formik.setFieldValue("month", month);
        formik.setFieldValue("year", year);
      };

    return (
        <MainLayout>
            <ProfileHeader 
            name="Payroll"
            breadcrumbs={["Generate and send payroll to account."]}
            />
            {/* Back Button */}
            <div className="px-4 mb-6 flex items-center text-sm text-blue-600 cursor-pointer" onClick={() => navigate("/employeesSalary")}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span>Back</span>
            </div>

            <form onSubmit={formik.handleSubmit} className="px-6 py-4 max-w-6xl border border-[#D9D9D9] rounded-[8px] m-4">
                <h2 className="text-[16px] font-semibold mb-6">Create Payslip</h2>

                {/* Basic Info */}
                <div className="mb-8">
                    <h3 className="text-[16px] font-semibold text-[#16151C] mb-3">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Staff */}
                        <div>
                            <label className="block text-sm text-[#16151C] mb-1">Staff Name</label>
                            <div className="relative w-full">
                                <select
                                    name="employee"
                                    value={formik.values.employee}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none appearance-none bg-white"
                                >
                                    <option value="" disabled>Select staff</option>
                                    {AllEmployees &&
                                   AllEmployees.map((designation, index) => (
                          <option key={designation._id} value={designation._id}>
                           {designation.firstName}  {designation.lastName}
                         </option>
                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
                                {formik.touched.employee && formik.errors.employee && <p className="text-red-500 text-xs mt-1">{formik.errors.employee}</p>}
                            </div>
                        </div>

                        {/* Title */}
                        {/* <div>
                            <label className="block text-sm mb-1">Title</label>
                            <select
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full p-2 pl-4 border  border-gray-200 rounded-md focus:outline-none bg-white"
                            >
                                <option value="" disabled>Select title</option>
                                <option value="mr">Mr</option>
                                <option value="ms">Ms</option>
                            </select>
                            {formik.touched.title && formik.errors.title && <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>}
                        </div> */}

                        {/* Level */}
                        {/* <div>
                            <label className="block text-sm mb-1">Level</label>
                            <select
                                name="level"
                                value={formik.values.level}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none bg-white"
                            >
                                <option value="" disabled>Select level</option>
                                <option value="1">Level 1</option>
                                <option value="2">Level 2</option>
                            </select>
                            {formik.touched.level && formik.errors.level && <p className="text-red-500 text-xs mt-1">{formik.errors.level}</p>}
                        </div> */}

                        {/* Month */}
                        <div>
                            <label className="block text-sm mb-1">Month</label>
                            <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MM/yyyy"
        showMonthYearPicker
        className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none bg-white"
        placeholderText="Select Month & Year"
      />
      {(formik.touched.month && formik.errors.month) || (formik.touched.year && formik.errors.year) ? (
        <p className="text-red-500 text-xs mt-1">
          {formik.errors.month || formik.errors.year}
        </p>
      ) : null}
                        </div>
                    </div>
                </div>

                {/* Salary Inputs */}
                <div className="mb-8">
                    <h3 className="text-[16px] font-semibold mb-3">Salary Structure</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { name: "basicSalary", label: "Basic Salary" },
                            { name: "housingAllowence", label: "Housing Allowance" },
                            { name: "transportAllowence", label: "Transport Allowance" },
                            { name: "utilityAllowence", label: "Utility Allowance" },
                            { name: "productivityAllowence", label: "Productivity Allowance" },
                            { name: "communicationAllowence", label: "Communication Allowance" },
                            { name: "inconvenienceAllowence", label: "Inconvenience Allowance" }
                        ].map(({ name, label }) => (
                            <div key={name}>
                                <label className="block text-sm mb-1">{label}</label>
                                <input
                                    type="text"
                                    name={name}
                                    value={formik.values[name]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter amount"
                                    className="w-full border  border-gray-200 rounded-md p-2"
                                />
                                {formik.touched[name] && formik.errors[name] && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
                                )}
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm mb-1">Gross Salary</label>
                            <input type="text" disabled   value={formik?.values?.grossSalary} className="w-full border bg-gray-200 rounded-md p-2 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Deductions */}
                {/* <div className="mb-8">
                    <h3 className="text-[16px] font-semibold mb-3">Deductions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { name: "tax", label: "TAX/PAYE" },
                            { name: "employeePension", label: "Employee Pension" }
                        ].map(({ name, label }) => (
                            <div key={name}>
                                <label className="block text-sm mb-1">{label}</label>
                                <input
                                    type="text"
                                    name={name}
                                    value={formik.values[name]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter amount"
                                    className="w-full border   border-gray-200 rounded-md p-2"
                                />
                                {formik.touched[name] && formik.errors[name] && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
                                )}
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm mb-1">Total Deduction</label>
                            <input type="text" disabled value={formik?.values?.totalDeduction} className="w-full border bg-gray-100 p-2 text-gray-500" />
                        </div>
                    </div>
                </div> */}


<div className="mb-8">
  <h3 className="text-[16px] font-semibold mb-3">Deductions</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[
      { name: "tax", label: "TAX/PAYE", type: "select" },
      { name: "employeePension", label: "Employee Pension", type: "input" }
    ].map(({ name, label, type }) => (
      <div key={name}>
        <label className="block text-sm mb-1">{label}</label>
        {type === "select" ? (
          <select
            name={name}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border border-gray-200 rounded-md p-2 bg-white"
          >
            <option disabled value="">Select TAX</option>
            {taxes &&
                                   taxes.map((tax, index) => (
                          <option key={tax._id} value={tax._id}>
                           {tax.taxType} 
                         </option>
                    ))}
          </select>
        ) : (
          <input
            type="text"
            name={name}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter amount"
            className="w-full border border-gray-200 rounded-md p-2"
          />
        )}
        {formik.touched[name] && formik.errors[name] && (
          <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
        )}
      </div>
    ))}
    <div>
      <label className="block text-sm mb-1">Total Deduction</label>
      <input
        type="text"
        disabled
        value={formik?.values?.totalDeduction}
        className="w-full border bg-gray-200 p-2 rounded-md text-gray-500"
      />
    </div>
  </div>
</div>


                {/* Net Salary */}
                <div className="mb-8">
                    <h3 className="text-[16px] font-semibold mb-3">Net Salary</h3>
                    <input type="text" disabled value={formik?.values?.netSalary} className="w-full md:w-1/3 border bg-gray-200 p-2 rounded-md text-gray-500" />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium">
                       {
                        loading ? <CircularProgress color='white' size={25}/> : `Create Payslip`               
                       } 
                    </button>
                    <button type="button" className="border px-6 py-2 rounded-md text-sm font-medium">
                        Cancel
                    </button>
                </div>
            </form>
        </MainLayout>
    );
}
