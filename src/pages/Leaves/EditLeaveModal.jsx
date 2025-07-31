

import PDFIMAGE  from "../../../public/pdf-image2.png"
import { Calendar, ChevronDown } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../helpers/Api';
import { CircularProgress } from '@mui/material';
import { setRefresh } from "../../redux/leaveSlice";
import Toastify from "../../helpers/Toastify";

// Mock employee data (replace with actual API call)


const EditLeaveModal = ({ isOpen, onClose ,id}) => {
  if (!isOpen) return null;
 
  const dispatch = useDispatch()
  const [resumeLoading, setResumeLoading] = useState(false);
  const [loading,setLoading] = useState (false)
  const [fetchLoading,setFetchLoading] = useState (false)
    const fileInputRef = useRef(null);
  
  const { AllEmployees } = useSelector(
    (state) => state.employee
  );
 

  const schema = yup.object().shape({
    employee: yup.string().required('Employee is required'),
    leaveType: yup.string().required('Leave type is required'),
    startDate: yup.date().required('Start date is required'),
    endDate: yup.date()
      .required('End date is required')
      ,
    duration: yup.number().required('Duration is required'),
    reason: yup.string().required('Reason is required'),
    leaveStatus: yup.string().oneOf(['APPROVED', 'PENDING', 'REJECTED']).required('Status is required'),
  });

  const {errors,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues,
    touched} = useFormik({
    initialValues: {
      employee: '',
      leaveType: '',
      startDate: null,
      endDate: null,
      duration: '',
      reason: '',
      leaveStatus: 'PENDING',
      supporingDoc: [],
      _id:''
    },
    validationSchema: schema,
    onSubmit: async(values) => {
      try {
        setLoading(true)
        const {data,status} = await api.updateLeave(values)

        if(status === 200){
          dispatch(setRefresh())
          Toastify.success("Leave Edited successfully")
          onClose();

        }
      } catch (error) {
                Toastify.error(error.response.data.message || `something went wrong`);
        
      }finally{
        setLoading(false)
      }
    }
  });

  console.log(values,"values");
  

  const handleImageUpload = async ({
    e,
    fieldPath,
    setFieldValue,
    setLoading,
    allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
  }) => {

    
    const file = e.target.files?.[0];
  
    if (!file) return;
  
    // Start loading

    
    if (setLoading) setLoading(true)
    //  setLoading(prev => ({ ...prev, [fieldPath]: true }));
    
  
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file format. Supported formats: .jpg, .jpeg, .png, .webp");
      if (setLoading) setLoading(false);
      return;
    }
  
    try {
      const formData = new FormData();
      formData.set("image", file);
  
      const { data, status } = await api.fileUpload(formData);
      console.log(data, "Uploaded image data");
  
      if (status === 200) {
        setFieldValue(fieldPath, data.data,false);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      // if (setLoading) setLoading(prev => ({ ...prev, [fieldPath]: false }));
      if (setLoading) setLoading(false);

    }
  };

  const handleResumeUpload = () => {
    console.log("hi");
    
    if (fileInputRef.current) {
      console.log("hello");
      
      fileInputRef.current.value = null; // Reset value before click
      fileInputRef.current.click();
    }
  };

  const handleRemoveResume = () => {
    setFieldValue('supporingDoc', []);
  };


  const fetchData = async ()=>{

    setFetchLoading(true)
    try {
    
    const {data,status} = await api.getALeave(id)

    if(status === 200){
        setValues({
            employee: data?.data?.employee?._id || '',
            leaveType: data?.data?.leaveType || '',
            startDate: data?.data?.startDate || null,
            endDate: data?.data?.endDate || null,
            duration: data?.data?.duration || '',
            reason: data?.data?.reason || '',
            leaveStatus: data?.data?.leaveStatus || '',
            supporingDoc: data?.data?.supporingDoc || [],
            _id:data?.data?._id || '',

        })
    }

} catch (error) {
    console.log(error);
    
}finally{
    setFetchLoading(false)

}
  
  }


  useEffect(()=>{
    fetchData()
  },[id])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        {
             
                        fetchLoading ?
            
                        <CircularProgress  size={30} /> :

                        <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl px-6 py-4 relative">
        <h2 className="text-lg font-semibold text-[#14151C] mb-4">
        Edit  Leave application
        </h2>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl cursor-pointer"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative w-full">
              <select
                id="employee"
                name="employee"
                value={values.employee}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-2 pl-4 border  border-gray-200
                } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-gray-400`}
              >
                <option value="" disabled>Select Employee</option>
                {AllEmployees?.map(employee => (
                  <option key={employee?._id} value={employee?._id}>
                    {employee?.firstName}{employee?.lastName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
              {touched.employee && errors.employee && (
                <div className="text-red-500 text-sm mt-1">{errors.employee}</div>
              )}
            </div>

            <div className="relative w-full">
              <select
                id="leaveType"
                name="leaveType"
                value={values.leaveType}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-2 pl-4 border border-gray-200
                 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-gray-400`}
              >
                <option value="" disabled>Leave Type</option>
                <option value="ANNUALLEAVE">Annual Leave</option>
                <option value="CASUALLEAVE">Casual Leave</option>
                <option value="SICKLEAVE">Sick Leave</option>
                <option value="OTHER">Other</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
              {touched.leaveType && errors.leaveType && (
                <div className="text-red-500 text-sm mt-1">{errors.leaveType}</div>
              )}
            </div>

            <div className="relative w-full">
              <DatePicker
                id="startDate"
                name="startDate"
                selected={values.startDate}
                onChange={(date) => {
                  setFieldValue('startDate', date || null);
                }}
                onBlur={handleBlur}
                placeholderText="Start date"
                dateFormat="dd/MM/yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className={`w-full p-2 pl-4 pr-10 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-200 rounded-md
                }`}
              />
              <Calendar className="absolute right-8 top-3 text-[#A3A3A3] pointer-events-none" size={18} />
              {touched.startDate && errors.startDate && (
                <div className="text-red-500 text-sm mt-1">{errors.startDate}</div>
              )}
            </div>

            <div className="relative w-full">
              <DatePicker
                id="endDate"
                name="endDate"
                selected={values.endDate}
                onChange={(date) => {
                  setFieldValue('endDate', date || null);
                }}
                onBlur={handleBlur}
                placeholderText="End date"
                dateFormat="dd/MM/yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className={`w-full p-2 pl-4 pr-10 bg-white focus:outline-none focus:ring-1 focus:ring-blue-50 border border-gray-200 rounded-md `}
              />
              <Calendar className="absolute right-8 top-3 text-[#A3A3A3] pointer-events-none" size={18} />
              {touched.endDate && errors.endDate && (
                <div className="text-red-500 text-sm mt-1">{errors.endDate}</div>
              )}
            </div>

            <div className="relative w-full">
              <input
                type="number"
                id="duration"
                name="duration"
                value={values.duration}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Duration (days)"
                className={`w-full p-2 pl-4 border border-gray-200
                 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {touched.duration && errors.duration && (
                <div className="text-red-500 text-sm mt-1">{errors.duration}</div>
              )}
            </div>

            <div className="relative w-full">
              <select
                id="leaveStatus"
                name="leaveStatus"
                value={values.leaveStatus}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-2 pl-4 border  border-gray-200
                 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-gray-400`}
              >
                <option value="" disabled>Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
              {touched.leaveStatus && errors.leaveStatus && (
                <div className="text-red-500 text-sm mt-1">{errors.leaveStatus}</div>
              )}
            </div>

            <input
              type="text"
              id="reason"
              name="reason"
              value={values.reason}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Reason for leave"
              className={`w-full border   border-gray-200
               rounded-md p-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {touched.reason && errors.reason && (
              <div className="text-red-500 text-sm mt-1">{errors.reason}</div>
            )}
          </div>

          {/* File Attachment */}
         

          <div className="w-full mt-5">
            {resumeLoading ? (
              <div className="w-full flex justify-center mt-4">
                <CircularProgress size={35} />
              </div>
            ) : (
              <>
                {values.supporingDoc.length === 0 ? (
                  <div className="flex items-center rounded-md border border-[#E2E2EA] overflow-hidden">
                    <label
                      className="flex-1 px-4 py-2 text-sm text-gray-400 bg-white cursor-pointer"
                      onClick={handleResumeUpload}
                    >
              Attach supporting document
              </label>
                    <div
                      className="bg-blue-600 px-4 py-2 text-white text-sm font-medium cursor-pointer"
                      onClick={handleResumeUpload}
                    >
                      Choose File
                    </div>
                  </div>
                ) : (
                  
          
                  <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1.5">Uploaded Document:</p>
            <div className="flex items-center">
              {values.supporingDoc[0]?.toLowerCase().endsWith('.pdf') ? (
                <img
                  src={PDFIMAGE} // your PDF placeholder image
                  alt="PDF"
                  className="w-50 h-40 object-cover"
                />
              ) : (
                <img
                  src={values.supporingDoc[0]}
                  alt="resume"
                  className="w-50 h-40 object-cover"
                />
              )}
            </div>
          
            <div className="flex mt-2">
              <button
                type="button"
                onClick={handleRemoveResume}
                className="text-red-500 ml-2"
              >
                Remove
              </button>
          
              <button
                type="button"
                onClick={handleResumeUpload}
                className="text-blue-500 ml-2"
              >
                Change Doc
              </button>
            </div>
          </div>
          
                )}
              </>
            )}
          
            {/* Always render the file input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) =>
                handleImageUpload({
                  e,
                  fieldPath: "supporingDoc",
                  setFieldValue,
                  setLoading: setResumeLoading,
                })
              }
            />
          
            {/* {touched.resume && errors.resume && (
              <div className="text-red-500 text-sm mt-1">{errors.resume}</div>
            )} */}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm border border-[#A2A1A833] rounded-md hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm bg-[#2563EB] text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
{
                loading ? <CircularProgress color='white' size={25}/> : `Edit Leave`
              }            </button>
          </div>
        </form>
      </div>
        }
      
    </div>
  );
};

export default EditLeaveModal;