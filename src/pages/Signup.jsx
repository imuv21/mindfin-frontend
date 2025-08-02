import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Email, Phone, Person, Work, Badge, BusinessCenter, ArrowDropDown, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import * as yup from 'yup';
import api from '../helpers/Api';
import Toastify from '../helpers/Toastify';
import CoverImage from "@/components/auth/CoverImage";
import styles from './auth.module.css';


const Signup = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleShowPassword = () => setShowPassword(!showPassword);

    const schema = yup.object().shape({
        firstName: yup.string().required("First Name is required").min(2, "First Name must be at least 2 characters"),
        lastName: yup.string().required("Last Name is required").min(2, "Last Name must be at least 2 characters"),
        email: yup.string().email("Enter a valid email").required("Email is required"),
        phone: yup
            .string()
            .required("Phone Number is required")
            .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits"),
        password: yup
            .string()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters"),
        designation: yup
            .string()
            .required("Designation is required"),
        employeeId: yup
            .string()
            .required("Employee ID is required"),
        professionalEmail: yup
            .string()
            .email("Enter a valid professional email")
            .required("Professional Email is required"),
    });

    const {
        errors,
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        touched
    } = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            designation: '',
            employeeId: '',
            professionalEmail: '',
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const { data, status } = await api.login(values);
                console.log(data, "DATA");
            } catch (error) {
                Toastify.error(error.response.data.message || `something went wrong`);
            } finally {
                setLoading(false);
            }
        },
    });


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
                    <h2 className={styles.heading}>Create your Account</h2>
                    <p className={styles.description}>Welcome! Please enter your details.</p>


                    <form onSubmit={handleSubmit} className={styles.form}>

                        <div className={styles.errorWrapper}>
                            <div className={styles.iconWrapper}>
                                <input
                                    type="text"
                                    name="firstName"
                                    className={styles.input}
                                    placeholder="First Name"
                                    autoComplete="given-name"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Person className={styles.icon} />
                            </div>
                            {errors.firstName && touched.firstName && <p className={styles.errorText}>{errors.firstName}</p>}
                        </div>

                        <div className={styles.errorWrapper}>
                            <div className={styles.iconWrapper}>
                                <input
                                    type="text"
                                    name="lastName"
                                    className={styles.input}
                                    placeholder="Last Name"
                                    autoComplete="family-name"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Person className={styles.icon} />
                            </div>
                            {errors.lastName && touched.lastName && <p className={styles.errorText}>{errors.lastName}</p>}
                        </div>

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
                                <input
                                    type="tel"
                                    name="phone"
                                    autoComplete="tel"
                                    className={styles.input}
                                    placeholder="Phone Number"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Phone className={styles.icon} />

                            </div>
                            {errors.phone && touched.phone && <p className={styles.errorText}>{errors.phone}</p>}
                        </div>

                        <div className={styles.errorWrapper}>
                            <div className={styles.iconWrapper}>
                                <input type={showPassword ? "text" : "password"} name="password" className={styles.input} placeholder="Password" autoComplete="new-password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
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

                        <div className={styles.errorWrapper}>
                            <div className={styles.iconWrapper}>
                                <select
                                    name="designation"
                                    className={styles.input}
                                    value={values.designation}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="">Select Designation</option>
                                    <option value="686e32e8bd7f2ab6cedef790">Software Engineer</option>
                                    <option value="someOtherId">Product Manager</option>
                                </select>
                                <Work className={styles.icon} /> <ArrowDropDown className={styles.icon} />
                            </div>
                            {errors.designation && touched.designation && <p className={styles.errorText}>{errors.designation}</p>}
                        </div>

                        <div className={styles.errorWrapper}>
                            <div className={styles.iconWrapper}>
                                <input
                                    type="text"
                                    name="employeeId"
                                    className={styles.input}
                                    placeholder="Employee ID"
                                    autoComplete="off"
                                    value={values.employeeId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Badge className={styles.icon} />
                            </div>
                            {errors.employeeId && touched.employeeId && <p className={styles.errorText}>{errors.employeeId}</p>}
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={loading}>
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>

                        <p className={styles.text} style={{ textAlign: "center" }}>
                            Already have an account? <a href="/login" className={styles.link}>Clink here</a>
                        </p>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Signup