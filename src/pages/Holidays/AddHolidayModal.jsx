import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarDays } from 'lucide-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../../helpers/Api';
import Toastify from '../../helpers/Toastify';
import { useDispatch } from 'react-redux';
import { setRefresh } from '../../redux/holidaySlice';
import { CircularProgress } from '@mui/material';

const AddHolidayModal = ({ isOpen, onClose }) => {

  if (!isOpen) return null;

  const dispatch = useDispatch()
 const [loading,setLoading] =useState(false)

  const schema = yup.object().shape({
    holidayName: yup.string()
      .required("Holiday name is required"),
    holidayDate: yup.date()
      .required("Date is required")
  });

  const {
    errors,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    touched
  } = useFormik({
    initialValues: {
      holidayName: '',
      holidayDate: null,
    },
    validationSchema: schema,
    onSubmit: async(values) => {
      try {
        setLoading(true)
        const {data,status} = await api.addHoliday(values)

        if(status === 200){
          Toastify.success("Holiday Added successfully")
          dispatch(setRefresh())
          onClose();
        }
      } catch (error) {
            Toastify.error(error.response.data.message || `something went wrong`);
        
      }
      finally{
        setLoading(false)

      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white  rounded-xl shadow-xl px-6 py-4 relative">
        <h2 className="text-lg font-semibold text-[#14151C] mb-4">
          <span className="text-[#16151C] ">Add New Holiday</span>
        </h2>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl cursor-pointer"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              id="holidayName"
              placeholder="Holiday Name"
              className="w-[340px] border border-[#A2A1A833] rounded-md p-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={values.holidayName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.holidayName && touched.holidayName && (
              <p className="text-red-500 text-sm mb-2">{errors.holidayName}</p>
            )}

            <div className="relative w-full">
              <DatePicker 
                selected={values.holidayDate}
                onChange={(date) => setFieldValue('holidayDate', date)}
                placeholderText="Select Date"
                dateFormat="dd/MM/yyyy"
                className="w-[340px] border border-[#A2A1A833] rounded-md p-2 pr-10 text-[16px] text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <CalendarDays className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              {errors.holidayDate && touched.holidayDate && (
                <p className="text-red-500 text-sm mb-2 mt-2">{errors.holidayDate}</p>
              )}
            </div>
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
              {loading ? <CircularProgress color='white' size={22}/> : `Add Holiday`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHolidayModal;