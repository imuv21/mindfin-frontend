import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import RoleBreadcrumbs from './layout/RoleBreadcrumbs';
import { useNavigate, useParams } from 'react-router-dom';
import Toastify from '../helpers/Toastify';
import api from '../helpers/Api';
import { Box, CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setRefresh } from '../redux/leadSlice';

const EditLeadForm = () => {


    const {id} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const [editLoading,setEditLoading] = useState(false)
    


    const formik = useFormik({
        initialValues: {
            leadName: '',
            phone: '',
            alternativePhone: '',
            email: '',
            location: '',
            loanType: '',
            loanAmount: '',
            LeadCreatedDate: '',
            _id:''
        },
        validationSchema: Yup.object({
            leadName: Yup.string().required('Full name is required'),
            phone: Yup.string()
                .matches(/^\d{10}$/, 'Phone number must be 10 digits')
                .required('Phone number is required'),
            alternativePhone: Yup.string()
                .matches(/^\d{10}$/, 'Alternate number must be 10 digits')
                .required('Alternate number is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            location: Yup.string().required('Location is required'),
            loanType: Yup.string().required('Loan type is required'),
            loanAmount: Yup.number().typeError('Loan amount must be a number').required('Loan amount is required'),
            LeadCreatedDate: Yup.date().required('Date is required'),
        }),
        onSubmit:async (values) => {
            // console.log('Submitting lead:', values);
            setEditLoading(true)

            try {

                const {data,status} = await api.updateALead(values)

                if(status === 200){
                    Toastify.success(' Lead Edited successfully')
                    dispatch(setRefresh())
                    navigate("/adminLeadDataList")
                }
                
            } catch (error) {
                Toastify.error(error.response.data.message || `something went wrong`);

            }finally{
                setEditLoading(false)
            }

        },
    });

    const fetchData =async ()=>{
        try {
            setLoading(true)

            const {data,status} = await api.getALead(id)
            
            if(status === 200){
                const lead = data?.data;

                formik.setValues({
                    leadName: lead?.leadName || '',
                    phone: lead?.phone || '',
                    alternativePhone: lead?.alternativePhone || '',
                    email: lead?.email || '',
                    location: lead?.location || '',
                    loanType: lead?.loanType || '',
                    loanAmount: lead?.loanAmount || '',
                    LeadCreatedDate: lead?.LeadCreatedDate ? lead.LeadCreatedDate.slice(0, 10) : '', 
                    // LeadCreatedDate: lead?.LeadCreatedDate || '', 
                    _id: lead?._id || ''
                });
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
             name={loading ? 'Loading...' : formik.values.leadName}

            />
            <RoleBreadcrumbs
            //Edit Lead Personal Information

            name='Edit Lead Personal Information'
            breadcrumbs={['Leads Data' , 'Edit Lead Personal Information']}
            />

          {loading ? (
                      <Box
                          sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: '60vh',
                              width: '100%',
                          }}
                      >
                          <CircularProgress />
                      </Box>
                  ) : (  
                    <>
            <form onSubmit={formik.handleSubmit}>
                <div className="bg-white p-6 rounded-xl m-4">
                    <h2 className="text-[16px] font-semibold mb-4">Personal Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                            <input
                                type="text"
                                name="leadName"
                                value={formik.values.leadName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formik.touched.leadName && formik.errors.leadName && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.leadName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2"
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Number</label>
                            <input
                                type="text"
                                name="alternativePhone"
                                value={formik.values.alternativePhone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2"
                            />
                            {formik.touched.alternativePhone && formik.errors.alternativePhone && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.alternativePhone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
                            <input
                                type="text"
                                name="loanAmount"
                                value={formik.values.loanAmount}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2"
                            />
                            {formik.touched.loanAmount && formik.errors.loanAmount && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.loanAmount}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2"
                            />
                            {formik.touched.location && formik.errors.location && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.location}</p>
                            )}
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
                            <input
                                type="text"
                                name="loanType"
                                value={formik.values.loanType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2"
                            />
                            {formik.touched.loanType && formik.errors.loanType && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.loanType}</p>
                            )}
                        </div> */}

<div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
    <select
        name="loanType"
        value={formik.values.loanType}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-3 py-2 "
    >
        <option value="" disabled>Select Loan Type</option>
        <option value="Personal Loan">Personal</option>
        <option value="Home Loan">Home</option>
        <option value="Business Loan">Business</option>
        <option value="Education Loan">Education</option>
        <option value="Vehicle Loan">Vehicle</option>
        <option value="Gold Loan">Gold</option>
    </select>
    {formik.touched.loanType && formik.errors.loanType && (
        <p className="text-red-500 text-sm mt-1">{formik.errors.loanType}</p>
    )}
</div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lead Created Date</label>
                            <input
                                type="date"
                                name="LeadCreatedDate"
                                value={formik.values.LeadCreatedDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full text-[16px] text-[#8C94A3] rounded-xl border border-gray-300 px-4 py-2"
                            />
                            {formik.touched.LeadCreatedDate && formik.errors.LeadCreatedDate && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.LeadCreatedDate}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-[16px] py-2 px-6 rounded-lg cursor-pointer w-60"
                        >
                          {editLoading ? <CircularProgress size={25} color='white' /> : `Save Changes`}  
                        </button>
                    </div>
                </div>
            </form>
            </>
                  )}
        </MainLayout>
    );
};

export default EditLeadForm;

