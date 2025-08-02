

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CoverImage from '@/components/auth/CoverImage';
import { PasswordSuccessModal } from '@/components/auth/PasswordModal';
import api from '../helpers/Api';
import Toastify from '@/helpers/Toastify';
import { useNavigate } from 'react-router-dom';

const SetPasswordUI = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  // Load email from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('verifiedEmail');
    console.log(" Email on mount storedEmail:", storedEmail);
    if (!storedEmail) {
      Toastify.error('No verified email found. Please go back.');
      navigate('/verify-otp');
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const schema = yup.object().shape({
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: yup
      .string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log("🟡 Submitting set-password form...");
        setLoading(true);
        // const email = localStorage.getItem('verifiedEmail');
        const email = localStorage.getItem("verifiedEmail")?.trim().toLowerCase();
        console.log("📤 Email retrieved for set-password:", email);
        console.log("📦 Retrieved email from localStorage:", email);
        console.log("🔐 Password entered:", values.password);
        if (!email) {
          console.error("❌ Email is missing in localStorage.");
          Toastify.error("Email not found. Please verify your email again.");
          return;
        }
        const payload = {
          email: email.toLowerCase(),
          password: values.password,
        };
        console.log("📤 Sending payload to backend:", payload);
        const { status } = await api.setPassword(payload);
        console.log("✅ Backend responded with status:", status);
        if (status === 200) {
          Toastify.success('Password set successfully');
          setShowModal(true);
          resetForm();
          localStorage.removeItem('verifiedEmail');
          console.log("🧹 localStorage cleaned. Redirecting to login...");

          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } catch (error) {
        console.error("❌ Error occurred while setting password:", error);
        console.error("🔴 Full error response:", error.response?.data);
        console.log("❌ URL causing error:", error.config?.url);
        Toastify.error(error.response?.data?.message || 'Something went wrong');
      } finally {
        console.log("🟢 Finished set-password submission");
        setLoading(false);
      }
    },

  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 flex flex-col items-center bg-blue-600 text-white p-8">
        <CoverImage />
        <h1 className="text-2xl font-bold mt-4">Dashboard</h1>
        <p className="text-sm text-center max-w-sm mt-2">
          Everything you need in an easily customizable dashboard.
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Set Your Password</h1>
          <p className="text-gray-500 mb-8">Enter your password below</p>

          <form onSubmit={formik.handleSubmit}>
            {/* Password */}
            <div className="mb-6 relative">
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 mb-2 text-sm">{formik.errors.password}</div>
              )}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                />
                {/* Eye Icon */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6 relative">
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="text-red-500 mb-2 text-sm">{formik.errors.confirmPassword}</div>
              )}
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                />
                {/* Eye Icon */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <PasswordSuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default SetPasswordUI;
