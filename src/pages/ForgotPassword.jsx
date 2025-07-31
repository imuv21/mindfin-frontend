import React, { useState } from "react";
import CoverImage from "@/components/auth/CoverImage";
import EmailInput from "@/components/auth/EmailInput";
import OTPButton from "@/components/auth/OTPButton";
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../helpers/Api';
import Toastify from '../helpers/Toastify';
import { useNavigate } from 'react-router-dom';



const ForgotPassword = () => {

  const navigate = useNavigate()
  const [email, setEmail] = useState("");
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
        // await dispatch(login(values));
        // // console.log("hii logged in successfully")
        // navigate('/dashboard');
        const { data, status } = await api.forgotPassword(values)
        console.log(data, "DATA");

        if (status === 200) {
          Toastify.success("OTP sent to your registered Email")
          localStorage.setItem("professtionalEmail", data.data)
          navigate("/otp-verification")
          resetForm()
        }

      } catch (error) {
        Toastify.error(error.response.data.message || `something went wrong`);

      } finally {
        setLoading(false);
      }
    }
  });

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel */}
      <div className="w-1/2  flex flex-col flex-start items-center bg-blue-600 text-white p-8">
        <CoverImage />
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-sm text-center max-w-sm">
          Everything you need in an easily customizable dashboard.
        </p>
      </div>
      {/* Right Side - Password Reset Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
          <p className="text-gray-600 mb-6">
            Enter the email address associated with your account and we will
            send you a link to reset your password.
          </p>

          {/* <div className="mb-6">
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none"
                placeholder="Email address"
              />
            </div>
          </div>
          
          <button 
            className="w-full py-3 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 mb-4"
            onClick={handleContinue}
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"}
          </button> */}

          {/* Email Input Component */}
          {/* <EmailInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /> */}
          <EmailInput
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            name="email"
          />
          {touched.email && errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email}</p>
          )}

          {/* OTP Button Component */}
          <div className="mt-6">
            <OTPButton onClick={handleSubmit} loading={loading}>
              Continue
            </OTPButton>
          </div>

          <div className="text-center mt-4">
            <a href="/login" className="text-blue-500 text-sm hover:underline" >
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
