import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../helpers/Api';
import Toastify from '../../helpers/Toastify';
import { CircularProgress } from '@mui/material';
import { setRefresh } from '../../redux/jobSlice';

const EditJobModal = ({ isOpen, onClose, id }) => {
  if (!isOpen) return null;


  console.log(id,"idd!!!");
  
  const dispatch = useDispatch();
  const { designations } = useSelector((state) => state.employee);

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const schema = yup.object().shape({
    designation: yup.string().required('Designation is required'),
    jobTitle: yup.string().required('Job Title is required'),
    noOfVacancies: yup.number().required('Number of vacancies is required').positive('Number of vacancies must be a positive number'),
    salaryAmount: yup.number().required('Salary amount is required').positive('Salary amount must be a positive number'),
    description: yup.string().required('Description is required'),
    jobType: yup.string().required('Job Type is required'),
    jobStatus: yup.string().required('Job status is required'),
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: {
      designation: '',
      jobTitle: '',
      noOfVacancies: '',
      salaryAmount: '',
      description: '',
      jobType: '',
      jobStatus: '',
      _id: id,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { data, status } = await api.updateJob({...values,_id:id});

        if (status === 200) {
          Toastify.success("Job Edited successfully");
          resetForm();
          dispatch(setRefresh());
          onClose();
        }
      } catch (error) {
        Toastify.error(error.response.data.message || `something went wrong`);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const { data, status } = await api.getAJob(id);

      if (status === 200) {
        setValues({
          designation: data?.data?.designation?._id || '',
          jobTitle: data?.data?.jobTitle || '',
          noOfVacancies: data?.data?.noOfVacancies || '',
          salaryAmount: data?.data?.salaryAmount || '',
          description: data?.data?.description || '',
          jobType: data?.data?.jobType || '',
          jobStatus: data?.data?.jobStatus || '',
        });
      }
    } catch (error) {
      Toastify.error(error.response.data.message || `something went wrong`);
    } finally {
      setDataLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl px-6 py-4 relative">
        <h2 className="text-lg font-semibold text-[#14151C] mb-4">
          <span className="text-[#16151C] ">Edit Job</span>
        </h2>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>

        {dataLoading ? (
          <div className="flex items-center justify-center h-full">
            <CircularProgress />
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative w-full">
                <select
                  className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-gray-400"
                  name="designation"
                  value={values.designation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="" disabled>
                    Select Designation
                  </option>
                  {/* {designations &&
                    designations.map((designation, index) => (
                      <option key={designation._id} value={designation._id}>
                        {designation.designation}
                      </option>
                    ))} */}
                     {designations &&
                  designations
                    .filter((d) => d.designation !== "SUPERADMIN")
                    .map((designation, index) => (
                      <option key={index} value={designation._id}>
                        {designation.designation}
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
                {touched.designation && errors.designation && (
                  <div className="text-red-500 text-sm mt-1">{errors.designation}</div>
                )}
              </div>

              <div className="w-full">
                <input
                  type="text"
                  placeholder="Enter Job Title"
                  className="w-full border border-[#A2A1A833] rounded-md p-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="jobTitle"
                  value={values.jobTitle}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.jobTitle && errors.jobTitle && (
                  <div className="text-red-500 text-sm mt-1">{errors.jobTitle}</div>
                )}
              </div>

              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Enter No of Vacancies"
                  className="w-full border border-[#A2A1A833] rounded-md p-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="noOfVacancies"
                  value={values.noOfVacancies}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.noOfVacancies && errors.noOfVacancies && (
                  <div className="text-red-500 text-sm mt-1">{errors.noOfVacancies}</div>
                )}
              </div>

              <div className="w-full">
                <input
                  type="text"
                  placeholder="Enter Salary amount (monthly)"
                  className="w-full border border-[#A2A1A833] rounded-md p-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="salaryAmount"
                  value={values.salaryAmount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.salaryAmount && errors.salaryAmount && (
                  <div className="text-red-500 text-sm mt-1">{errors.salaryAmount}</div>
                )}
              </div>

              <div className="relative w-full">
                <select
                  className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-gray-400"
                  name="jobStatus"
                  value={values.jobStatus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="" disabled>
                    Select job Status
                  </option>
                  <option value="ACTIVE" disabled>
                    Active
                  </option>
                  <option value="COMPLETED" disabled>
                    Completed
                  </option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
                {touched.jobStatus && errors.jobStatus && (
                  <div className="text-red-500 text-sm mt-1">{errors.jobStatus}</div>
                )}
              </div>
            </div>

            <div className="w-full">
              <textarea
                rows={3}
                placeholder="Description"
                className="w-full border border-[#A2A1A833] rounded-md p-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
              ></textarea>
              {touched.description && errors.description && (
                <div className="text-red-500 text-sm mt-1">{errors.description}</div>
              )}
            </div>

            <div>
              <label className="block font-semibold text-[16px] mb-2">Select Type</label>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 text-[16px]">
                  <input
                    type="radio"
                    name="jobType"
                    value="WFO"
                    className="accent-blue-500"
                    checked={values.jobType === 'WFO'}
                    onChange={handleChange}
                  />
                  Office
                </label>
                <label className="flex items-center gap-2 text-[16px]">
                  <input
                    type="radio"
                    name="jobType"
                    value="WFH"
                    className="accent-blue-500"
                    checked={values.jobType === 'WFH'}
                    onChange={handleChange}
                  />
                  Work from Home
                </label>
                <label className="flex items-center gap-2 text-[16px]">
                  <input
                    type="radio"
                    name="jobType"
                    value="HYBRID"
                    className="accent-blue-500"
                    checked={values.jobType === 'HYBRID'}
                    onChange={handleChange}
                  />
                  Hybrid
                </label>
              </div>
              {touched.jobType && errors.jobType && (
                <div className="text-red-500 text-sm mt-1">{errors.jobType}</div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-sm border border-[#A2A1A833] rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm bg-[#2563EB] text-white rounded-md hover:bg-blue-700"
              >
                {loading ? <CircularProgress color='white' size={25} /> : `Update`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditJobModal;