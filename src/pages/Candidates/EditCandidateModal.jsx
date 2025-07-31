
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ChevronDown } from 'lucide-react';
import api from '../../helpers/Api';
import CircularProgress from '@mui/material/CircularProgress';
import PDFIMAGE  from "../../../public/pdf-image2.png"
import DatePicker from "react-datepicker";
import { format } from 'date-fns';
import Toastify from '../../helpers/Toastify';



const EditCandidateModal = ({ isOpen, onClose ,id }) => {
  if (!isOpen) return null;

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [resumeFiles, setResumeFiles] = useState([]);
  const [resumeLoading, setResumeLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [loading,setLoading] = useState(false)


  // Formik validation schema
  const schema = yup.object().shape({
    appliedFor: yup.string().required("Applied for is required"),
    AppliedDate: yup.date().required("Applied date is required"),
    name: yup.string().required("Candidate name is required"),
    email: yup.string().email("Invalid email address").required("Email address is required"),
    phone: yup.string().required("Phone number is required"),
    type: yup.string().required("Job type is required").oneOf(["WFH", "WFO", "HYBRID"]),
    resume: yup.array().of(yup.string()).min(1, "Resume is required"),
    applicationStatus: yup.string().required("Application status is required").oneOf(["INPROGRESS", "SELECTED", "REJECTED"]),
  });

  // Formik setup
  const {
    errors,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    touched,
    resetForm,
    setValues
  } = useFormik({
    initialValues: {
      appliedFor: '',
      AppliedDate: '',
      name: '',
      email: '',
      phone: '',
      type: '',
      resume: [],
      applicationStatus: '',
      _id: ''
    },
    validationSchema: schema,
    onSubmit:async (values) => {
      setLoading(true)
      try {
        const {data,status} = await api.updateACandidate(values)
        if(status === 200){
          Toastify.success("candidated Edited successfully")
          resetForm()
          onClose()
        }
      } catch (error) {
        Toastify.error(error.response.data.message || `something went wrong`);
        
      }finally{
        setLoading(false)
      }

   


      

    },
  });


  
  const fetchData = async () => {
    setJobsLoading(true);
    try {
      const { data, status } = await api.getJobsForModal();
      if (status === 200) {
        setJobs(data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setJobsLoading(false);
    }
  };

  const fetChcandidateData = async() =>{
    setLoading(true)
    try {

        const {data,status} = await api.getACandidate(id)

        if(status === 200){
            setValues({
                appliedFor: data.data.appliedFor._id || '' ,
                AppliedDate: data.data.AppliedDate || null ,
                name: data.data.name || '',
                email : data.data.email || '',
                phone : data.data.phone || '',
                type: data.data.type || '',
                resume : data.data.resume || [],
                applicationStatus : data.data.applicationStatus || '',
                _id:data.data._id || ''

            })
        }

        
    } catch (error) {
        console.log(error);
        
    }finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchData();
    fetChcandidateData()
  }, [id]);

 

  const handleImageUpload = async ({
    e,
    fieldPath,
    setFieldValue,
    setLoading,
    allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
  }) => {

    console.log("hyyyyhyyyhyhhy");
    
    const file = e.target.files?.[0];
  
    if (!file) return;
  
    // Start loading

    console.log(file,"hii");
    
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
        setResumeFiles([data.data]);
        setFieldValue(fieldPath, data.data,false);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      // if (setLoading) setLoading(prev => ({ ...prev, [fieldPath]: false }));
      if (setLoading) setLoading(false);

    }
  };


  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFiles([URL.createObjectURL(file)]);
      setFieldValue('resume', [URL.createObjectURL(file)]);
    }
  };

  const handleRemoveResume = () => {
    setResumeFiles([]);
    setFieldValue('resume', []);
  };

  const handleResumeUpload = () => {
    console.log("hi");
    
    if (fileInputRef.current) {
      console.log("hello");
      
      fileInputRef.current.value = null; // Reset value before click
      fileInputRef.current.click();
    }
  };


  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl px-6 py-4 relative">
        <h2 className="text-lg font-semibold text-[#14151C] mb-4">
          <span className="text-[#16151C]">Edit Candidate</span>
        </h2>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl cursor-pointer"
        >
          &times;
        </button>

        {/* <form onSubmit={handleSubmit} className="space-y-4"> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative w-full">
              <select
                className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-gray-400 "
                name="appliedFor"
                value={values.appliedFor}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={jobsLoading}
              >
                <option value="" disabled>Applied for</option>
                {!jobsLoading && jobs
                  ?.filter(job => job.jobStatus === "ACTIVE")
                  .map(job => (
                    <option key={job._id} value={job._id}>
                      {job.jobTitle}
                    </option>
                  ))}
              </select>
              {jobsLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-md">
                  <CircularProgress size={24} />
                </div>
              )}
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
              {touched.appliedFor && errors.appliedFor && (
                <div className="text-red-500 text-sm mt-1">{errors.appliedFor}</div>
              )}
            </div>


            <div className='w-full'>
           
             <DatePicker
                                    selected={values.AppliedDate ? new Date(values.AppliedDate) : null}
                                    onChange={(date) => setFieldValue("AppliedDate", format(date, 'yyyy-MM-dd'))}
                                    onBlur={handleBlur}
                                    placeholderText="Select Applied Date"
                                    dateFormat="dd/MM/yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    className="w-full p-2 pl-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-gray-500"
                                  />
            {touched.AppliedDate && errors.AppliedDate && (
              <div className="text-red-500 text-sm mt-1">{errors.AppliedDate}</div>
            )}
            </div>
            
            <div className='w-full'>
            <input
              type="text"
              placeholder="Candidate name"
              className="w-full border border-[#A2A1A833] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.name && errors.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            )}
            </div>

            <div className='w-full'>

            <input
              type="text"
              placeholder="Email address"
              className="w-full border border-[#A2A1A833] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            )}
            </div>

            <div className='w-full'>

            <input
              type="text"
              placeholder="Phone number"
              className="w-full border border-[#A2A1A833] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.phone && errors.phone && (
              <div className="text-red-500 text-sm mt-1">{errors.phone}</div>
            )}

            </div>
            <div className="relative w-full">
              <select
                className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-gray-400"
                name="applicationStatus"
                value={values.applicationStatus}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="" disabled>Select Application Status</option>
                <option value="INPROGRESS">In Progress</option>
                <option value="SELECTED">Selected</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
              {touched.applicationStatus && errors.applicationStatus && (
                <div className="text-red-500 text-sm mt-1">{errors.applicationStatus}</div>
              )}
            </div>

            <div className="w-full">
              <label className="block font-semibold text-[16px] mb-2">Select Type</label>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 text-[16px]">
                  <input
                    type="radio"
                    name="type"
                    value="WFH"
                    className="accent-blue-500"
                    checked={values.type === 'WFH'}
                    onChange={handleChange}
                  />
                  WFH
                </label>
                <label className="flex items-center gap-2 text-[16px]">
                  <input
                    type="radio"
                    name="type"
                    value="WFO"
                    className="accent-blue-500"
                    checked={values.type === 'WFO'}
                    onChange={handleChange}
                  />
                  WFO
                </label>
                <label className="flex items-center gap-2 text-[16px]">
                  <input
                    type="radio"
                    name="type"
                    value="HYBRID"
                    className="accent-blue-500"
                    checked={values.type === 'HYBRID'}
                    onChange={handleChange}
                  />
                  HYBRID
                </label>
              </div>
              {touched.type && errors.type && (
                <div className="text-red-500 text-sm mt-1">{errors.type}</div>
              )}
            </div>
          </div>

       

<div className="w-full mt-5">
  {resumeLoading ? (
    <div className="w-full flex justify-center mt-4">
      <CircularProgress size={35} />
    </div>
  ) : (
    <>
      {values.resume.length === 0 ? (
        <div className="flex items-center rounded-md border border-[#E2E2EA] overflow-hidden">
          <label
            className="flex-1 px-4 py-2 text-sm text-gray-400 bg-white cursor-pointer"
            onClick={handleResumeUpload}
          >
            Attach a resume
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
  <p className="text-sm text-gray-500 mb-1.5">Uploaded Resume:</p>
  <div className="flex items-center">
    {values.resume[0]?.toLowerCase().endsWith('.pdf') ? (
      <img
        src={PDFIMAGE} // your PDF placeholder image
        alt="PDF"
        className="w-50 h-40 object-cover"
      />
    ) : (
      <img
        src={values.resume[0]}
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
      Change Resume
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
        fieldPath: "resume",
        setFieldValue,
        setLoading: setResumeLoading,
      })
    }
  />

  {touched.resume && errors.resume && (
    <div className="text-red-500 text-sm mt-1">{errors.resume}</div>
  )}
</div>


          <div className="flex justify-end gap-3 pt-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm border border-[#A2A1A833] rounded-md hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 text-sm bg-[#2563EB] text-white rounded-md hover:bg-blue-700 cursor-pointer"
              onClick={handleSubmit}
            >

              {
                loading ? <CircularProgress color='white' size={25}/> : `Edit`
              }
              
            </button>
          </div>
        {/* </form> */}
      </div>
    </div>
  );
};

export default EditCandidateModal;
