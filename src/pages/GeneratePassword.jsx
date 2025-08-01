// import React, { useState } from 'react'
// import CoverImage from '@/components/auth/CoverImage'
// import EmailInput from '@/components/auth/EmailInput';
// import OTPButton from '@/components/auth/OTPButton';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import api from '../helpers/Api';
// import Toastify from '../helpers/Toastify';
// import { useNavigate } from 'react-router-dom';
// // import Toastify from '../helpers/Toastify';


// const GeneratePassword = () => {

//   const navigate = useNavigate()
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);


//   const schema = yup.object().shape({
//     email: yup.string()
//       .email("Please enter a valid email")
//       .required("Email is required"),

//   });



//   const {
//     errors, values, handleChange, touched, handleBlur, handleSubmit, resetForm
//   } = useFormik({
//     initialValues: {
//       email: '',
//     },
//     validationSchema: schema,
//     onSubmit: async (values) => {
//       setLoading(true);
//       try {
//         // await dispatch(login(values));
//         // // console.log("hii logged in successfully")
//         // navigate('/dashboard');
//         const { data, status } = await api.generatePassword(values)
//         console.log(data, "DATA");

//         if (status === 200) {
//           Toastify.success("OTP sent to your registered Email")
//           localStorage.setItem("email", data.data)
//           navigate("/email-verification")
//           resetForm()
//         }

//       } catch (error) {
//         Toastify.error(error.response.data.message || `something went wrong`);

//       } finally {
//         setLoading(false);
//       }
//     }
//   });

//   const handleGetOTP = () => {
//     setLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setLoading(false);
//     }, 2000);
//   };


//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
//       {/* Left Panel */}
//       <div className="w-1/2  flex flex-col flex-start items-center bg-blue-600 text-white p-8">
//         <CoverImage />
//         <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
//         <p className="text-sm text-center max-w-sm">
//           Everything you need in an easily customizable dashboard.
//         </p>
//       </div>
//       <div className="w-full md:w-1/2">
//         {/* <GeneratePassword /> */}

//         <div className='w-full h-full flex items-center justify-center p-8'>
//           <div className='max-w-md w-full'>
//             <h1 className='text-2xl font-bold mb-2'>Generate Password</h1>
//             <p className='text-gray-500 text-sm mb-6'>Welcome! You've been invited to set your password.</p>

//             {/* <div className='mb-4'>
//           <div className='flex items-center border border-gray-300 rounded px-3 py-2'>
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//             </svg>
//             <input
//               type="email"
//               placeholder="Enter Registered Email"
//               className='w-full outline-none text-sm'
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//         </div>

//         <button 
//           className={`w-full py-3 bg-blue-500 text-white rounded font-medium text-sm ${loading ? 'opacity-70' : 'hover:bg-blue-600'}`}
//           onClick={handleGetOTP}
//           disabled={loading}
//         >
//           {loading ? 'Sending...' : 'Get OTP'}
//         </button> */}

//             <EmailInput
//               value={values.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               name="email"
//             />
//             {touched.email && errors.email && (
//               <p className="text-red-500 text-sm mb-2">{errors.email}</p>
//             )}
//             <OTPButton loading={loading} onClick={handleSubmit} >Get OTP</OTPButton>


//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default GeneratePassword


import React, { useState } from 'react'
import CoverImage from '@/components/auth/CoverImage'
import EmailInput from '@/components/auth/EmailInput';
import OTPButton from '@/components/auth/OTPButton';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../helpers/Api';
import Toastify from '../helpers/Toastify';
import { useNavigate } from 'react-router-dom';
// import Toastify from '../helpers/Toastify';


const GeneratePassword = () => {

  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);


  const schema = yup.object().shape({
    email: yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),

  });



  const {
    errors, values, handleChange, touched, handleBlur, handleSubmit, resetForm
  } = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { data } = await api.getOtp({ email: values.email });
        localStorage.setItem("email", values.email);
        navigate("/email-verification");
        resetForm();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

  });

  const handleGetOTP = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="w-1/2  flex flex-col flex-start items-center bg-blue-600 text-white p-8">
        <CoverImage />
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-sm text-center max-w-sm">
          Everything you need in an easily customizable dashboard.
        </p>
      </div>
      <div className="w-full md:w-1/2">
        {/* <GeneratePassword /> */}

        <div className='w-full h-full flex items-center justify-center p-8'>
          <div className='max-w-md w-full'>
            <h1 className='text-2xl font-bold mb-2'>Generate Password</h1>
            <p className='text-gray-500 text-sm mb-6'>Welcome! You've been invited to set your password.</p>

            {/* <div className='mb-4'>
          <div className='flex items-center border border-gray-300 rounded px-3 py-2'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              type="email"
              placeholder="Enter Registered Email"
              className='w-full outline-none text-sm'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      
        <button 
          className={`w-full py-3 bg-blue-500 text-white rounded font-medium text-sm ${loading ? 'opacity-70' : 'hover:bg-blue-600'}`}
          onClick={handleGetOTP}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Get OTP'}
        </button> */}

            <EmailInput
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              name="email"
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm mb-2">{errors.email}</p>
            )}
            <OTPButton loading={loading} onClick={handleSubmit} >Get OTP</OTPButton>


          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneratePassword