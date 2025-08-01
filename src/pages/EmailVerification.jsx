import { useState } from 'react';
import CoverImage from '@/components/auth/CoverImage';
import Toastify from '../helpers/Toastify';
import api from '../helpers/Api';
import { useNavigate } from 'react-router-dom';

const EmailVerificationUI = () => {

  const navigate = useNavigate()

  //   function getCookie(name) {
  //     const value = `; ${document.cookie}`;
  //     const parts = value.split(`; ${name}=`);
  //     if (parts.length === 2) return parts.pop().split(';').shift();
  // }

  // Call this function to get the email from the cookie
  // const email = getCookie('email');
  // console.log('Email from cookie:', email);

  const email = localStorage.getItem('email')

  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false)
  const [recentOtpLoading, setRecentOtpLoading] = useState(false)
  // const [email] = useState('robertteller@example.com');

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input if current one is filled
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const inputs = e.target.form.elements;
      inputs[index - 1].focus();
    }
  };

  const resendOTP = async () => {
    // Placeholder for resend functionality
    setRecentOtpLoading(true)
    try {
      const { data, status } = await api.resentOtpGeneratePassword({ email: email })

      if (status === 200) {
        Toastify.success("OTP sent to your registered Email")
        localStorage.setItem("email", data.data)
        setOtp(['', '', '', '']);
      }

    } catch (error) {
      Toastify.error(error.response.data.message || `something went wrong`);

    } finally {
      setRecentOtpLoading(false)
    }
  };

  const verifyOTP = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const otpValue = otp.join('');

      const body = {
        otp: otpValue,
        email: email
      };

      const response = await api.verifyOtp(body); // wait for full response

      if (response?.status === 200) {
        Toastify.success("OTP verification successful");

        // Use `email` not `values.email` since `values` is not defined anywhere
        // localStorage.setItem('verifiedEmail', email);
        localStorage.setItem("verifiedEmail", email.trim().toLowerCase());
        console.log("📥 Email stored in localStorage after verify:", email.trim().toLowerCase());

        navigate("/set-new-password");
        console.log("OTP Verify Response:", response);

      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Something went wrong";
      Toastify.error(errorMessage);
    } finally {
      setLoading(false);
    }
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

      {/* Right side: OTP Verification */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <button className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back
            </button>
          </div>

          <h1 className="text-3xl font-bold mb-2">Enter OTP</h1>
          <p className="text-gray-500 mb-8">
            We have share a code of your registered email address<br />
            <span className="text-gray-600">{email}</span>
          </p>

          <form onSubmit={verifyOTP}>
            <div className="flex gap-2 mb-8">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  disabled={loading}

                />
              ))}
            </div>

            <button
              type="submit"
              // className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
              disabled={otp.some(digit => digit === '')}  // Disable if any input is empty
              className={`w-full py-3 rounded-md transition-colors ${otp.some(digit => digit === '')
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                }`}
            >
              {/* Verify */}

              {loading ? (
                <div className="flex items-center justify-center">

                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : (
                'Verify'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-600">Don't receive an email? </span>
            <button
              className="text-blue-500 font-medium hover:underline"
              onClick={resendOTP}
            >
              {recentOtpLoading ? (
                <div className="flex items-center justify-center">

                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : (
                'Resend'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationUI