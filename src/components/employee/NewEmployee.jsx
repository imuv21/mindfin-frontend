import { useState } from 'react';
import {
  User, Briefcase, FileText, Key, Upload, Calendar, Camera, Plus, Pencil,
  ChevronDown
  // BriefcaseBusiness,
  // BriefcaseBusiness,
  // CreditCard
} from 'lucide-react';
import MainLayout from '../layout/MainLayout';
import ProfileHeader from '../layout/ProfileHeader';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../helpers/Api';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import { format } from 'date-fns';
import PDFIMAGE from "../../../public/pdf-image2.png"
import { CircularProgress } from '@mui/material';
import { AddEmployee } from '../../redux/employeeSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';




export default function NewEmployee() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('personal');
    const {designations,branches,isEmployeeAddLoading}= useSelector((state)=>state.employee)
    const [loading, setLoading] = useState({});
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [employeeTab, setEmployeeTab] = useState("personal"); // start with the first tab
    const [completedEmployeeTabs, setCompletedEmployeeTabs] = useState({
      personal: false,
      professional: false,
      documents: false,
      access: false,
    });
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');
    

  console.log(designations, "employee sdesignations");
  console.log(branches, "employee branches");

  const branchOptions = branches?.map(branch => ({
    value: branch._id,
    label: branch.name,
  }));


  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: <User size={18} /> },
    { id: 'professional', label: 'Professional Information', icon: <Briefcase size={18} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={18} /> },
    { id: 'access', label: 'Branches account & invite', icon: <Key size={18} /> },
  ];

  const schema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    phone: yup.number().required('Phone number is required').typeError('Phone number must be a number'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    profileImg: yup.array().of(yup.string()).min(1, "Atlist one picture is required"),
    DOB: yup.date().required('Date of Birth is required'),
    maritalStatus: yup.string().required('Marital Status is required').oneOf(['MARRIED', 'SINGLE'], 'Invalid marital status'),
    gender: yup.string().required('Gender is required').oneOf(['MALE', 'FEMALE', 'OTHER'], 'Invalid gender'),
    nationality: yup.string().required('Nationality is required'),
    familyMember: yup.string().required('familyMember is required'),
    bloodgroup: yup.string().required('Blood group is required'),
    emergencyNumber: yup.string().required('energency contact number is required'),
    aadharNumber: yup.string().required('aadhar number is required'),
    address: yup.string().required('Address is required'),
    state: yup.string().required('State is required'),
    city: yup.string().required('City is required'),
    zipCode: yup.number().required('ZIP Code is required').typeError('ZIP Code must be a number'),
    employeeId: yup.string().required('employeeId is required'),
    userName: yup.string().required('userName is required'),
    employeeType: yup.string().required('employeeType is required'),
    professionalEmail: yup.string().email('Invalid professional email address').required(' Professional Email is required'),
    branch: yup.array().of(yup.string()).min(1, "Branch is required"),
    designation: yup.string().required('designation is required'),
    workingDays: yup.string().required('Working days is required'),
    workingHours: yup.string().required('Working hours is required'),
    jobType: yup.string().required('Job Type is required'),
    dateOfJoin: yup.date().nullable(),
    dateOfLeave: yup.date().nullable(),
    officeLocation: yup.string(),
    salary: yup.number().required('salary is required'),
    salaryStartDate: yup.date().nullable(),
    salaryEndDate: yup.date().nullable(),
    attendenceLoacation: yup.string().required('Location is required'),
    bankName: yup.string().required('Bank name is required'),
    bankBranchName: yup.string().required('Bank branch name is required'),
    accountName: yup.string().required('Account name is required'),
    accountNo: yup.string().required('Account number is required'),
    IFSC: yup.string().required('IFSC is required'),
    SWIFT: yup.string().required('SWIFT is required'),
    IBAN: yup.string().required('IBAN is required'),
    bioMetricIp: yup.string(),
    appointmentLetter: yup.array().of(yup.string()),
    salarySlip: yup.array().of(yup.string()),
    relivingLetter: yup.array().of(yup.string()),
    experienceLetter: yup.array().of(yup.string()),
    aadharCard: yup.array().of(yup.string()).min(1, "Aadhar card is required"),
    panCard: yup.array().of(yup.string()).min(1, "Pan card is required"),
    // status: yup.string().required('Status is required').oneOf(['PERMENENT', 'TEMPORARARY', 'INTERN', 'NOTICEPERIOD'], 'Invalid status'),
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setErrors,
    resetForm,
           setFieldTouched
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      profileImg: [],
      DOB: null,
      maritalStatus: '',
      gender: '',
      nationality: '',
      emergencyNumber: '',
      aadharNumber: '',
      familyMember: '',
      bloodgroup: '',
      address: '',
      state: '',
      city: '',
      zipCode: '',
      employeeId: '',
      userName: '',
      employeeType: '',
      professionalEmail: '',
      branch: [],
      designation: '',
      workingDays: '',
      workingHours: '',
      dateOfJoin: null,
      dateOfLeave: null,
      jobType:'',
      officeLocation: '',
      salary: '',
      salaryStartDate: null,
      salaryEndDate: null,
      bankName: '',
      bankBranchName: '',
      accountName: '',
      accountNo: '',
      IFSC: '',
      SWIFT: '',
      IBAN: '',
      attendenceLoacation: '',
      bioMetricIp: '',
      appointmentLetter: [],
      salarySlip: [],
      relivingLetter: [],
      experienceLetter: [],
      aadharCard: [],
      panCard: [],
      // status: '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {

        const response = await dispatch(AddEmployee(values))

        await unwrapResult(response)

        navigate('/allEmployee')

      } catch (error) {
        Toastify.error(error.response?.data?.message || 'Something went wrong');
      }
    },
  });

  console.log(values, "values");

        //  const handleImageUpload = async ({ e, fieldPath, setFieldValue, allowedTypes = ["image/jpeg", "image/png", "image/webp"] }) => {
        //     const file = e.target.files?.[0];
          
        //     if (!file) return;
          
        //     // Validate file type
        //     if (!allowedTypes.includes(file.type)) {
        //       alert("Invalid file format. Supported formats: .jpg, .jpeg, .png, .webp");
        //       return;
        //     }
          
        //     try {
        //       const formData = new FormData();
        //       formData.set("image", file);
          
        //       const { data, status } = await api.fileUpload(formData);
        //       console.log(data, "Uploaded image data");
          
        //       if (status === 200) {
        //         setFieldValue(fieldPath, data.data);
        //       }
        //     } catch (error) {
        //       console.error("Image upload failed:", error);
        //     }
        //   };
          
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
            if (setLoading) setLoading(prev => ({ ...prev, [fieldPath]: true }));
          
            // Validate file type
            if (!allowedTypes.includes(file.type)) {
              alert("Invalid file format. Supported formats: .jpg, .jpeg, .png, .webp");
              if (setLoading) setLoading(prev => ({ ...prev, [fieldPath]: false }));
              return;
            }
          
            try {
              const formData = new FormData();
              formData.set("image", file);
          
              const { data, status } = await api.fileUpload(formData);
              console.log(data, "Uploaded image data");
          
              if (status === 200) {
                setFieldValue(fieldPath, data.data);
              }
            } catch (error) {
              console.error("Image upload failed:", error);
            } finally {
              if (setLoading) setLoading(prev => ({ ...prev, [fieldPath]: false }));
            }
          };

          const showAlert = (message, severity = 'error') => {
            setAlertMessage(message);
            setAlertSeverity(severity);
            setAlertOpen(true);
        };

          // const handleNext = () => {
          //   const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
          
          //   if (tabs[currentIndex].id === 'access') {
          //     handleSubmit(); 
          //   } else if (currentIndex < tabs.length - 1) {
          //     setActiveTab(tabs[currentIndex + 1].id);
          //   }
          // };

          const handleNext = async () => {
            const tabFieldsMap = {
                personal: [
                    'firstName', 'lastName', 'phone', 'email', 'profileImg', 'DOB',
                    'maritalStatus', 'gender', 'nationality', 'familyMember',
                    'emergencyNumber', 'aadharNumber', 'address', 'state', 'city', 'zipCode',"bloodgroup"
                ],
                professional: [
                    'employeeId', 'userName', 'employeeType', 'professionalEmail', 'branch',
                    'designation', 'workingDays', 'workingHours', 'dateOfJoin', 'dateOfLeave',
                    'officeLocation', 'salary', 'salaryStartDate', 'salaryEndDate', 'attendenceLoacation',
                    'bankName', 'bankBranchName', 'accountName', 'accountNo', 'IFSC', 'SWIFT',
                    'IBAN', 'bioMetricIp','jobType'

                ],
                documents: [
                    , 'appointmentLetter', 'salarySlip', 'relivingLetter',
                    'experienceLetter', 'aadharCard', 'panCard', 'status'
                ],
                access: [] // Optional
            };
        
            console.log("Current Tab:", employeeTab);
        
            try {
                const currentTabFields = tabFieldsMap[employeeTab];
                const partialSchema = yup.object().shape(
                    currentTabFields.reduce((acc, field) => {
                        acc[field] = schema.fields[field];
                        return acc;
                    }, {})
                );
        
                await partialSchema.validate(values, { abortEarly: false });
        
                setCompletedEmployeeTabs(prev => ({
                    ...prev,
                    [employeeTab]: true,
                }));
        
                const tabKeys = Object.keys(tabFieldsMap);
                console.log("Tab Keys:", tabKeys);
        
                const currentTabIndex = tabKeys.indexOf(employeeTab);
                console.log("Current Tab Index:", currentTabIndex);
        
                if (currentTabIndex < tabKeys.length - 1) {
                    const nextTab = tabKeys[currentTabIndex + 1];
                    console.log("Next Tab:", nextTab);
        
                    setEmployeeTab(nextTab);
                    setActiveTab(nextTab);
                } else {
                    await handleSubmit();
                }
            } catch (error) {
                console.log("Unexpected error during employee tab validation:", error);
                if (error instanceof yup.ValidationError) {
                    error.inner.forEach(err => {
                        setFieldTouched(err.path, true, false);
                        setFieldValue(err.path, values[err.path]); // re-trigger validation
                    });
                }
            }
        };
          
          
        
          // const handleCancel = () => {
          //   const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
          
          //   if (tabs[currentIndex].id === 'personal') {
          //     resetForm(); // Resets the form to initial values
          //   } else if (currentIndex > 0) {
          //     setActiveTab(tabs[currentIndex - 1].id); // Go to the previous tab
          //   }
          // };
          const handleCancel = () => {
            const tabKeys = Object.keys(tabFieldsMap);
            const currentTabIndex = tabKeys.indexOf(employeeTab);
        
            if (currentTabIndex > 0) {
                // If not on the first tab, go to the previous tab
                const previousTab = tabKeys[currentTabIndex - 1];
                setEmployeeTab(previousTab);
                setActiveTab(previousTab);
            } else {
                // If on the first tab, reset the form
                resetForm(); // Resets the form to initial values
            }
        };


          const tabFieldsMap = {
            personal: [
              'firstName', 'lastName', 'phone', 'email', 'profileImg', 'DOB',
              'maritalStatus', 'gender', 'nationality', 'familyMember',
              'emergencyNumber', 'aadharNumber', 'address', 'state', 'city', 'zipCode',"bloodgroup"
            ],
            professional: [
              'employeeId', 'userName', 'employeeType', 'professionalEmail', 'branch',
              'designation', 'workingDays', 'workingHours', 'dateOfJoin', 'dateOfLeave',
              'officeLocation', 'salary', 'salaryStartDate', 'salaryEndDate', 'attendenceLoacation',
              'bankName', 'bankBranchName', 'accountName', 'accountNo', 'IFSC', 'SWIFT',
              'IBAN', 'bioMetricIp','jobType'
            ],
            documents: [
              'appointmentLetter', 'salarySlip', 'relivingLetter',
              'experienceLetter', 'aadharCard', 'panCard', 'status'
            ],
            access: [] // optional or account/invite-related fields
          };
          
          
          // const handleNext = async () => {
          //   const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
          //   const currentTabId = tabs[currentIndex].id;
          
          //   if (currentTabId === 'access') {
          //     handleSubmit(); // Final submission
          //     return;
          //   }
          
           
          // };
          

        //   const handleTabClick = (tabId, tabIndex) => {
        //     console.log(tabId,tabIndex);
            
        //     const tabKeys = Object.keys(tabFieldsMap);
        //     const currentTabIndex = tabKeys.indexOf(employeeTab);
    
        //     if (tabIndex > currentTabIndex && !completedEmployeeTabs[tabKeys[currentTabIndex]]) {
        //       showAlert("Please complete the current tab before moving to the next one.", 'warning');                return;
        //     }
    
        //     setActiveTab(tabId);
        //     setEmployeeTab(tabId);
        // };


        const handleTabClick = async (tabId, tabIndex) => {
          console.log(tabId, tabIndex);
      
          const tabKeys = Object.keys(tabFieldsMap);
          const currentTabIndex = tabKeys.indexOf(employeeTab);
      
          if (tabIndex > currentTabIndex) {
              try {
                  const currentTabFields = tabFieldsMap[employeeTab];
                  const partialSchema = yup.object().shape(
                      currentTabFields.reduce((acc, field) => {
                          acc[field] = schema.fields[field];
                          return acc;
                      }, {})
                  );
      
                  await partialSchema.validate(values, { abortEarly: false });
      
                  setCompletedEmployeeTabs(prev => ({
                      ...prev,
                      [employeeTab]: true,
                  }));
              } catch (error) {
                  if (error instanceof yup.ValidationError) {
                      error.inner.forEach(err => {
                          setFieldTouched(err.path, true, false);
                          setFieldValue(err.path, values[err.path]); // re-trigger validation
                      });
                  }
                  showAlert("Please complete the current tab before moving to the next one.", 'warning');
                  return;
              }
          }
      
          setActiveTab(tabId);
          setEmployeeTab(tabId);
      };
    return (
        <MainLayout>
            <ProfileHeader
            name="Add New Employee"
            breadcrumbs={["All Employees", "Add New Employee"]}
            
            />
            <div className="mx-4 bg-white border border-[#D9D9D9] rounded-[8px] p-4">
                {/* Tab Navigation */}
                <div className="flex overflow-x-auto mb-8 border-b border-gray-200 ">
                    {tabs.map((tab,index) => (
                        <button
                            key={tab.id}
                            className={`flex items-center px-4 py-3 text-sm mr-2 border-b-2 whitespace-nowrap ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-500 font-medium'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            // onClick={() => setActiveTab(tab.id)}
                            onClick={() => handleTabClick(tab.id, index)}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
                <Stack spacing={2} sx={{ width: '100%' }}>
                {alertOpen && (
                        <Alert
                            severity={alertSeverity}
                            onClose={() => setAlertOpen(false)}
                        >
                            {alertMessage}
                        </Alert>
                    )}
                </Stack>
                {/* Personal Information Form (Tab 1) */}
              

        {activeTab === 'personal' && (
          <div className="p-2">

            {/* Photo Upload Section */}
            <div className="flex justify-start items-start mb-6">
              <div className="relative w-32 h-32 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 group">
                {loading["profileImg"] ? (
                  <span className="text-[#A3A3A3] text-sm">Uploading...</span>
                ) : values.profileImg[0] ? (
                  <img
                    src={
                      values.profileImg[0]
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={32} className="text-[#A3A3A3]" />
                )}

                {/* File input */}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) =>
                    handleImageUpload({
                      e,
                      fieldPath: "profileImg",
                      setFieldValue,
                      setLoading,
                    })
                  }
                />

                {/* Overlay when image is present */}
                {values.profileImg[0] && !loading["profileImg"] && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium z-0">
                    <div className="flex flex-col items-center">
                      <Pencil size={20} className="mb-1" />
                      <span>Change Photo</span>
                    </div>
                  </div>
                )}
              </div>
              {errors.profileImg && touched.profileImg && (
                <div className="text-red-500 text-sm">{errors.profileImg}</div>
              )}

            </div>




            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  {/* <label className="block text-sm text-gray-500 mb-1">First Name</label> */}
                  <input
                    type="text"
                    className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder='First Name'
                    name='firstName'
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.firstName && touched.firstName && (
                    <div className="text-red-500 text-sm">{errors.firstName}</div>
                  )}
                </div>
                <div>
                  {/* <label className="block text-sm text-gray-500 mb-1">Last Name</label> */}
                  <input
                    type="text"
                    className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder='Last Name'
                    name='lastName'
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}

                  />
                  {errors.lastName && touched.lastName && (
                    <div className="text-red-500 text-sm">{errors.lastName}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 ">
                <div>
                  {/* <label className="block text-sm text-gray-500 mb-1">Mobile Number</label> */}
                  <input
                    type="tel"
                    className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder='Mobile Number'
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.phone && touched.phone && (
                    <div className="text-red-500 text-sm">{errors.phone}</div>
                  )}
                </div>
                <div>
                  {/* <label className="block text-sm text-gray-500 mb-1">Email Address</label> */}
                  <input
                    type="email"
                    className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    name="email"
                    placeholder='email'
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  )}
                </div>
              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 w-full">
                <div className="flex flex-col w-full">
                  <div className="relative w-full">
                    <div className="border border-gray-200 rounded-md overflow-hidden">
                      <DatePicker
                        selected={values.DOB ? new Date(values.DOB) : null}
                        onChange={(date) => setFieldValue("DOB", format(date, 'yyyy-MM-dd'))}
                        onBlur={handleBlur}
                        placeholderText="Date of Birth"
                        dateFormat="dd/MM/yyyy"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="w-full p-2 pl-4 pr-10 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="absolute right-2 top-2 text-[#A3A3A3] pointer-events-none">
                        <Calendar size={18} />
                      </div>
                    </div>
                  </div>
                  {errors.DOB && touched.DOB && (
                    <div className="text-red-500 text-sm mt-1">{errors.DOB}</div>
                  )}
                </div>

                <div className="flex flex-col w-full relative">
                  <div className="relative w-full">
                    <select
                      className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-[#A3A3A3]"
                      value={values.maritalStatus}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="maritalStatus"
                    >
                      <option value="">Marital Status</option>
                      <option value="SINGLE">Single</option>
                      <option value="MARRIED">Married</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
                  </div>
                  {errors.maritalStatus && touched.maritalStatus && (
                    <div className="text-red-500 text-sm mt-1">{errors.maritalStatus}</div>
                  )}
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <div className="relative w-full">
                    <select className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white  text-[#A3A3A3]"
                      name="gender"
                      value={values.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value=''>Gender</option>
                      <option value='MALE'>Male</option>
                      <option value='FEMALE'>Female</option>
                      <option value='OTHER'>Other</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
                  </div>
                  {errors.gender && touched.gender && (
                    <div className="text-red-500 text-sm">{errors.gender}</div>
                  )}
                </div>

                <div>
                  <div className="relative w-full">
                    <select className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white  text-[#A3A3A3]"
                      name="nationality"
                      value={values.nationality}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value=''>Nationality</option>
                      <option value='India'>India</option>
                      <option value='Canada'>Canada</option>
                      <option value='United Kingdom'>United Kingdom</option>
                      <option value='United States'>United States</option>
                  </select>
                      {errors.nationality && touched.nationality && (
                        <div className="text-red-500 text-sm">{errors.nationality}</div>
                      )}
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  {/* <label className="block text-sm text-gray-500 mb-1">Aadhar Number</label> */}
                  <input
                    type="tel"
                    className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder='Aadhar Number'
                    name="aadharNumber"
                    value={values.aadharNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.aadharNumber && touched.aadharNumber && (
                    <div className="text-red-500 text-sm">{errors.aadharNumber}</div>
                  )}
                </div>
                <div>
  <select
    className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-[#A3A3A3]"
    name="bloodgroup"
    value={values.bloodgroup}
    onChange={handleChange}
    onBlur={handleBlur}
  >
    <option value="">Select Blood Group</option>
    <option value="A+">A+</option>
    <option value="A-">A-</option>
    <option value="B+">B+</option>
    <option value="B-">B-</option>
    <option value="AB+">AB+</option>
    <option value="AB-">AB-</option>
    <option value="O+">O+</option>
    <option value="O-">O-</option>
  </select>

  {errors.bloodgroup && touched.bloodgroup && (
    <div className="text-red-500 text-sm">{errors.bloodgroup}</div>
  )}
</div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  {/* <label className="block text-sm text-gray-500 mb-1">Family Member</label> */}
                  <input
                    type="text"
                    className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder='Family Member'
                    name="familyMember"
                    value={values.familyMember}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.familyMember && touched.familyMember && (
                    <div className="text-red-500 text-sm">{errors.familyMember}</div>
                  )}
                </div>
                <div>
                  {/* <label className="block text-sm text-gray-500 mb-1">Emergency Contact Number</label> */}
                  <input
                    type="tel"
                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder='Emergency Contact Number'
                    name="emergencyNumber"
                    value={values.emergencyNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.emergencyNumber && touched.emergencyNumber && (
                    <div className="text-red-500 text-sm">{errors.emergencyNumber}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-5">
                <div>
                  {/* <label className="block text-sm text-gray-500 mb-1">Address</label> */}
                  <input
                    type="text"
                    className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder='Address'
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.address && touched.address && (
                    <div className="text-red-500 text-sm">{errors.address}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  {/* <label className="block text-sm text-gray-500 mb-1">City</label> */}
                  <input
                    type="text"
                    className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder='City'
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  {errors.city && touched.city && (
                    <div className="text-red-500 text-sm">{errors.city}</div>
                  )}
                </div>
                <div>
                  <div className="relative w-full">
                    <select className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white  text-[#A3A3A3]"
                      name="state"
                      value={values.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select State</option>
                      <option value="andhra-pradesh">Andhra Pradesh</option>
                      <option value="arunachal-pradesh">Arunachal Pradesh</option>
                      <option value="assam">Assam</option>
                      <option value="bihar">Bihar</option>
                      <option value="chhattisgarh">Chhattisgarh</option>
                      <option value="goa">Goa</option>
                      <option value="gujarat">Gujarat</option>
                      <option value="haryana">Haryana</option>
                      <option value="himachal-pradesh">Himachal Pradesh</option>
                      <option value="jharkhand">Jharkhand</option>
                      <option value="karnataka">Karnataka</option>
                      <option value="kerala">Kerala</option>
                      <option value="madhya-pradesh">Madhya Pradesh</option>
                      <option value="maharashtra">Maharashtra</option>
                      <option value="manipur">Manipur</option>
                      <option value="meghalaya">Meghalaya</option>
                      <option value="mizoram">Mizoram</option>
                      <option value="nagaland">Nagaland</option>
                      <option value="odisha">Odisha</option>
                      <option value="punjab">Punjab</option>
                      <option value="rajasthan">Rajasthan</option>
                      <option value="sikkim">Sikkim</option>
                      <option value="tamil-nadu">Tamil Nadu</option>
                      <option value="telangana">Telangana</option>
                      <option value="tripura">Tripura</option>
                      <option value="uttar-pradesh">Uttar Pradesh</option>
                      <option value="uttarakhand">Uttarakhand</option>
                      <option value="west-bengal">West Bengal</option>
                      <option value="andaman-and-nicobar-islands">Andaman and Nicobar Islands</option>
                      <option value="chandigarh">Chandigarh</option>
                      <option value="dadra-and-nagar-haveli-and-daman-and-diu">Dadra and Nagar Haveli and Daman and Diu</option>
                      <option value="delhi">Delhi</option>
                      <option value="jammu-and-kashmir">Jammu and Kashmir</option>
                      <option value="ladakh">Ladakh</option>
                      <option value="lakshadweep">Lakshadweep</option>
                      <option value="puducherry">Puducherry</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
                  </div>
                  {errors.state && touched.state && (
                    <div className="text-red-500 text-sm">{errors.state}</div>
                  )}
                </div>
                <div>
                  {/* <label className="block text-sm text-gray-500 mb-1">ZIP Code</label> */}
                  <input
                    type="text"
                    className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder='ZIP code'
                    name="zipCode"
                    value={values.zipCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.zipCode && touched.zipCode && (
                    <div className="text-red-500 text-sm">{errors.zipCode}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8 space-x-3">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50" onClick={handleCancel}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#2563EB] text-white rounded hover:bg-blue-600" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* Professional Information Form (Tab 2) */}


        {activeTab === 'professional' && (
          <>
            <div className="p-2 mb-8">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm mr-2">
                  <Briefcase size={14} />
                </div>
                <h3 className="font-medium">Professional Info</h3>
              </div>
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Employee ID"
                      name="employeeId"
                      value={values.employeeId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.employeeId && touched.employeeId && (
                      <div className="text-red-500 text-sm mt-1">{errors.employeeId}</div>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="User Name"
                      name="userName"
                      value={values.userName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.userName && touched.userName && (
                      <div className="text-red-500 text-sm mt-1">{errors.userName}</div>
                    )}
                  </div>

                  <div>
                    <select
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white  text-[#A3A3A3]"
                      name="employeeType"
                      value={values.employeeType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select Employee Type</option>
                      <option value="PERMENENT">Full-time</option>
                      <option value="TEMPORARARY">Part-time</option>
                      <option value="INTERN">Intern</option>
                      <option value="NOTICEPERIOD">Notice Period</option>
                    </select>
                    {errors.employeeType && touched.employeeType && (
                      <div className="text-red-500 text-sm mt-1">{errors.employeeType}</div>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Email Address"
                      name="professionalEmail"
                      value={values.professionalEmail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.professionalEmail && touched.professionalEmail && (
                      <div className="text-red-500 text-sm mt-1">{errors.professionalEmail}</div>
                    )}
                  </div>


                  <div>
                    <Select
                      isMulti
                      name="branch"
                      options={branchOptions}
                      className="basic-multi-select"
                      placeholder='Select Branch'
                      classNamePrefix="select"
                      value={branchOptions.filter(option => values.branch.includes(option.value))}
                      onChange={(selected) => {
                        const selectedValues = selected.map(opt => opt.value);
                        setFieldValue('branch', selectedValues);
                      }}
                      onBlur={handleBlur}
                    />
                    {errors.branch && touched.branch && (
                      <div className="text-red-500 text-sm mt-1">{errors.branch}</div>
                    )}
                  </div>

                  <div>
                    <select
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white  text-[#A3A3A3]"
                      name="designation"
                      value={values.designation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select Designation</option>
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
                    {errors.designation && touched.designation && (
                      <div className="text-red-500 text-sm mt-1">{errors.designation}</div>
                    )}
                  </div>

                  <div>
                    <select
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white  text-[#A3A3A3]"
                      name="workingDays"
                      value={values.workingDays}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select Working Days</option>
                      <option value="Monday - Friday">Monday - Friday</option>
                      <option value="Sunday - Thursday">Sunday - Thursday</option>
                      <option value="Weekend Shift">Weekend Shift</option>
                    </select>
                    {errors.workingDays && touched.workingDays && (
                      <div className="text-red-500 text-sm mt-1">{errors.workingDays}</div>
                    )}
                  </div>

                  <div>
                    <select
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white  text-[#A3A3A3]"
                      name="workingHours"
                      value={values.workingHours}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select working hours</option>
                      <option value="9:00 AM - 5:00 PM">9:00 AM - 5:00 PM</option>
                      <option value="8:00 AM - 4:00 PM">8:00 AM - 4:00 PM</option>
                      <option value="10:00 AM - 6:00 PM">10:00 AM - 6:00 PM</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                    {errors.workingHours && touched.workingHours && (
                      <div className="text-red-500 text-sm mt-1">{errors.workingHours}</div>
                    )}
                  </div>

                  <div>

                    <div className="relative">
                      <DatePicker
                        selected={values.dateOfJoin ? new Date(values.dateOfJoin) : null}
                        onChange={(date) => setFieldValue('dateOfJoin', format(date, 'yyyy-MM-dd'))}
                        onBlur={handleBlur}
                        placeholderText="Select Joining Date"
                        className="w-full p-2 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        dateFormat="dd/MM/yyyy"
                      />
                      <div className="absolute right-3 top-2.5 text-[#A3A3A3] pointer-events-none">
                        <Calendar size={18} />
                      </div>
                    </div>
                    {errors.dateOfJoin && touched.dateOfJoin && (
                      <div className="text-red-500 text-sm mt-1">{errors.dateOfJoin}</div>
                    )}
                  </div>

                  <div>
                    <div className="relative">

                      <DatePicker
                        selected={values.dateOfLeave ? new Date(values.dateOfLeave) : null}
                        onChange={(date) => setFieldValue('dateOfLeave', format(date, 'yyyy-MM-dd'))}
                        onBlur={handleBlur}
                        placeholderText="Select Joining Date"
                        className="w-full p-2 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        dateFormat="yyyy-MM-dd"
                      />
                      <div className="absolute right-2 top-2 text-[#A3A3A3]">
                        <Calendar size={18} />
                      </div>
                    </div>
                    {errors.dateOfLeave && touched.dateOfLeave && (
                      <div className="text-red-500 text-sm mt-1">{errors.dateOfLeave}</div>
                    )}
                  </div>

                  <div>
                    <select
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white  text-[#A3A3A3]"
                      name="jobType"
                      value={values.jobType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select Job Type</option>
                      <option value="REMOTE">Remote</option>
                      <option value="WFH">Work From Office</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                    {errors.jobType && touched.jobType && (
                      <div className="text-red-500 text-sm mt-1">{errors.jobType}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2 mb-8">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm mr-2">
                  <Briefcase size={14} />
                </div>
                <h3 className="font-medium">Bank account info</h3>
              </div>
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>

                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Bank name"
                      name="bankName"
                      value={values.bankName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.bankName && touched.bankName && (
                      <div className="text-red-500 text-sm mt-1">{errors.bankName}</div>
                    )}
                  </div>

                  <div>

                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Bank  Branch name"
                      name="bankBranchName"
                      value={values.bankBranchName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.bankBranchName && touched.bankBranchName && (
                      <div className="text-red-500 text-sm mt-1">{errors.bankBranchName}</div>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Account name"
                      name="accountName"
                      value={values.accountName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.accountName && touched.accountName && (
                      <div className="text-red-500 text-sm mt-1">{errors.accountName}</div>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Account number"
                      name="accountNo"
                      value={values.accountNo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.accountNo && touched.accountNo && (
                      <div className="text-red-500 text-sm mt-1">{errors.accountNo}</div>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="IFSC code"
                      name="IFSC"
                      value={values.IFSC}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.IFSC && touched.IFSC && (
                      <div className="text-red-500 text-sm mt-1">{errors.IFSC}</div>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="SWIFT/BIC"
                      name="SWIFT"
                      value={values.SWIFT}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.SWIFT && touched.SWIFT && (
                      <div className="text-red-500 text-sm mt-1">{errors.SWIFT}</div>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="IBAN"
                      name="IBAN"
                      value={values.IBAN}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.IBAN && touched.IBAN && (
                      <div className="text-red-500 text-sm mt-1">{errors.IBAN}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm mr-2">
                  <Briefcase size={14} />
                </div>
                <h3 className="font-medium">Salary info</h3>
              </div>
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Salary"
                      name="salary"
                      value={values.salary}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.salary && touched.salary && (
                      <div className="text-red-500 text-sm mt-1">{errors.salary}</div>
                    )}
                  </div>

                  <div className="col-span-1"></div>

                  <div>
                    <div className="relative">
                      <DatePicker
                        selected={values.salaryStartDate ? new Date(values.salaryStartDate) : null}
                        onChange={(date) => setFieldValue('salaryStartDate', format(date, 'yyyy-MM-dd'))}
                        onBlur={handleBlur}
                        placeholderText="Select salary start Date"
                        className="w-full p-2 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        dateFormat="dd/MM/yyyy"
                      />
                      <div className="absolute right-2 top-2 text-[#A3A3A3]">
                        <Calendar size={18} />
                      </div>
                    </div>
                    {errors.salaryStartDate && touched.salaryStartDate && (
                      <div className="text-red-500 text-sm mt-1">{errors.salaryStartDate}</div>
                    )}
                  </div>

                  <div>
                    <div className="relative">

                      <DatePicker
                        selected={values.salaryEndDate ? new Date(values.salaryEndDate) : null}
                        onChange={(date) => setFieldValue('salaryEndDate', format(date, 'yyyy-MM-dd'))}
                        onBlur={handleBlur}
                        placeholderText="Select salary end Date"
                        className="w-full p-2 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        dateFormat="yyyy-MM-dd"
                      />
                      <div className="absolute right-2 top-2 text-[#A3A3A3]">
                        <Calendar size={18} />
                      </div>
                    </div>
                    {errors.salaryEndDate && touched.salaryEndDate && (
                      <div className="text-red-500 text-sm mt-1">{errors.salaryEndDate}</div>
                    )}
                  </div>

                  <div>
                    <select
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white  text-[#A3A3A3]"
                      name="attendenceLoacation"
                      value={values.attendenceLoacation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Attendance location</option>
                      <option value="Main Office">Main Office</option>
                      <option value="Branch Office">Branch Office</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    {errors.attendenceLoacation && touched.attendenceLoacation && (
                      <div className="text-red-500 text-sm mt-1">{errors.attendenceLoacation}</div>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Biometric/IP ID"
                      name="bioMetricIp"
                      value={values.bioMetricIp}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.bioMetricIp && touched.bioMetricIp && (
                      <div className="text-red-500 text-sm mt-1">{errors.bioMetricIp}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8 space-x-3">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50" onClick={handleCancel}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleNext}>
                Next
              </button>
            </div>
          </>
        )}

        {/* Documents Upload (Tab 3) */}
        {activeTab === 'documents' && (
          <div className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Appointment Letter', key: 'appointmentLetter' },
                { label: 'Salary Slip', key: 'salarySlip' },
                { label: 'Relieving Letter', key: 'relivingLetter' },
                { label: 'Experience Letter', key: 'experienceLetter' },
                { label: 'Aadhar Card *', key: 'aadharCard' },
                { label: 'PAN Card *', key: 'panCard' },
              ].map(({ label, key }) => {
                const uploadedFileUrl = values[key]?.[0]; // Get the first string URL
                const isPdf = uploadedFileUrl?.endsWith('.pdf');
                const isImage = uploadedFileUrl && !isPdf;
                const showPreview = !!uploadedFileUrl;

                return (
                  <div key={key} className="border border-gray-200 rounded-md p-4">
                    <div className="text-sm font-medium mb-3">Upload {label}</div>

                    <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center justify-center relative">
                      {loading[key] ? (
                        // <p className="text-sm text-blue-500">Uploading...</p>
                        <CircularProgress />
                      ) : showPreview ? (
                        <>
                          {isImage ? (
                            <img
                              src={uploadedFileUrl}
                              alt="Uploaded"
                              className="w-100 h-30 object-contain rounded mb-2"
                            />
                          ) : (
                            <img
                              src={PDFIMAGE}
                              alt="PDF"
                              className="w-100 h-30 object-contain mb-2"
                            />
                          )}
                          <p className="text-sm text-gray-700 truncate w-full text-center">
                            {/* {uploadedFileUrl?.split('/').pop()} */}
                            {label}
                          </p>
                          <button
                            className="text-blue-500 text-sm mt-2"
                            onClick={(e) =>
                              handleImageUpload({
                                e,
                                fieldPath: key,
                                setFieldValue,
                                setLoading,
                                allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
                              })}
                          >
                            Change
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-md mb-2">
                            <Upload size={20} />
                          </div>
                          <p className="text-sm text-center text-gray-600 mb-1">
                            Drag & Drop or <span className="text-blue-500">choose file</span> to upload
                          </p>
                          <p className="text-xs text-center text-[#A3A3A3]">
                            Supported formats: JPEG, PNG, PDF
                          </p>
                        </>
                      )}

                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) =>
                          handleImageUpload({
                            e,
                            fieldPath: key,
                            setFieldValue,
                            setLoading,
                            allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
                          })
                        }
                      />
                      {errors[key] && touched[key] && (
                        <div className="text-red-500 text-sm mt-2 text-center">{errors[key]}</div>
                      )}
                    </div>
                  </div>
                );
              })}


            </div>


            <div className="flex justify-end mt-8 space-x-3">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50" onClick={handleCancel}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#2563EB] text-white rounded hover:bg-blue-600" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* Branches account & invite (Tab 4) */}


        {activeTab === 'access' && (
          <div className="border border-[#D9D9D9] rounded-[8px] p-6">
            <div className="space-y-4">
              {/* Assigned branches summary */}
              <div className="flex items-center">
                <div className="w-36 text-gray-500 text-sm font-medium">Branch assigned</div>
                <div className="flex-1 text-gray-800 text-sm font-medium">
                  {values.branch
                    .map((id) => {
                      const branch = branches?.find((b) => b._id === id);
                      return branch?.name || 'Unknown';
                    })
                    .join(', ')}
                </div>
              </div>

              {/* Dynamic branch name rows */}
              {values.branch.map((id, index) => {
                const branch = branches?.find((b) => b._id === id);
                return (
                  <div key={id} className="flex items-center">
                    <div className="w-36 text-gray-500 text-sm font-medium">Branch {index + 1} name</div>
                    <div className="flex-1 text-gray-800 text-sm">
                      {branch?.name || 'Unknown'}
                    </div>
                  </div>
                );
              })}

              {/* Invite button */}
              <div className="pt-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out w-full sm:w-auto">
                  Invite to create password
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-8 space-x-3">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50" onClick={handleCancel}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#2563EB] text-white rounded hover:bg-blue-600" onClick={handleNext}>

                {isEmployeeAddLoading ? <CircularProgress color='white' /> : `Create employee`}

              </button>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}