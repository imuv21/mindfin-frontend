import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useAuth } from "../context/AuthContext";
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import * as yup from 'yup';
import api from '../helpers/Api';
import Toastify from '../helpers/Toastify';
import MultiBranchModal from "../components/auth/MultiBranchModal";
import CoverImage from "@/components/auth/CoverImage";
import styles from './auth.module.css';



const Login = () => {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMultiBranch, setIsMultiBranch] = useState(false);
  const [branches, setBranches] = useState([]);
  const [branchLoading, setBranchLoading] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const schema = yup.object().shape({
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  // Formik setup
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
      email: '',
      password: '',
      // rememberMe: false,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { data, status } = await api.login(values);
        console.log(data, "DATA");

        if (status === 200) {
          // Toastify.success("Login successful");
          // navigate('/dashboard');
          console.log(data, "data");

          if (data.data.isMultipleBranch) {
            console.log("hi");

            setIsMultiBranch(true);
            setBranches(data.data.branches);
          } else {
            console.log("hello");

            localStorage.setItem('accessToken', data.data.token);
            Toastify.success("Login successful");
            login();

            navigate('/myProfile');
          }
        }
      } catch (error) {
        Toastify.error(error.response.data.message || `something went wrong`);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleBranchSelect = async (branch) => {
    setBranchLoading(true);

    try {
      const { data, status } = await api.branchLogin({ email: values.email, branch: branch });
      // console.log(response.data, "Branch Selection Response");

      if (status === 200) {
        localStorage.setItem('accessToken', data.data.token);
        Toastify.success("Login successful");
        setIsMultiBranch(false);
        login();
        navigate('/myProfile');
      }


    } catch (error) {
      Toastify.error(error.response.data.message || `something went wrong`);
    } finally {
      setBranchLoading(false);

    }
  };


  return (
    <div className={styles.container}>

      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <CoverImage />
        <h1 className={styles.heading} style={{ color: 'white' }}>Dashboard</h1>
        <p className={styles.description} style={{ color: 'white' }}>
          Everything you need in an easily customizable dashboard.
        </p>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <h2 className={styles.heading}>Login to your Account</h2>
          <p className={styles.description}>Welcome back! Please enter your details.</p>

          <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.errorWrapper}>
              <div className={styles.iconWrapper}>
                <input type="email" name="email" autoComplete="email" className={styles.input} placeholder="Email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
                <Email className={styles.icon} />
              </div>
              {errors.email && touched.email && (
                <p className={styles.errorText}>{errors.email}</p>
              )}
            </div>

            <div className={styles.errorWrapper}>
              <div className={styles.iconWrapper}>
                <input type={showPassword ? "text" : "password"} name="password" className={styles.input} placeholder="Password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
                <Lock className={styles.icon} />
                <button type="button" onClick={toggleShowPassword} className={styles.eyeCon}>
                  {showPassword ? (
                    <Visibility className={styles.eyeConIcon} />
                  ) : (
                    <VisibilityOff className={styles.eyeConIcon} />
                  )}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className={styles.errorText}>{errors.password}</p>
              )}
            </div>


            <div className={styles.checkboxRow}>
              <label className={`${styles.checkboxLabel} ${styles.text}`}>
                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                Remember me
              </label>
              <a href="/forget-password" className={`${styles.link} ${styles.text}`}>
                Forgot Password?
              </a>
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? "Loging in..." : "Login"}
            </button>

            <p className={styles.text} style={{ textAlign: "center" }}>
              Don't have an account? <a href="/signup" className={styles.link}>Click here</a>
            </p>
          </form>
        </div>
      </div>

      {/* Multi Branch Modal */}
      {isMultiBranch && (
        <MultiBranchModal
          branches={branches}
          onSelect={handleBranchSelect}
          onClose={() => setIsMultiBranch(false)}
          loading={branchLoading}
        />
      )}
    </div>
  );
};

export default Login;
