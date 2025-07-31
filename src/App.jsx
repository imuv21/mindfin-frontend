
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GeneratePassword from "./pages/GeneratePassword";
import EmailVerificationUI from "./pages/EmailVerification";
import SetPasswordUI from "./pages/SetPasswordUI";
import SetForgotPassword from "./pages/SetForgotPassword";
import ForgotPassword from "./pages/ForgotPassword";
import { ToastContainer } from 'react-toastify'
import OtpVerification from "./pages/OtpVerification";

import NewEmployee from "./components/employee/NewEmployee";
import AllEmployee from "./components/employee/AllEmployee";
import ViewEmployee from "./components/employee/ViewEmployee";
import AllAttendance from "./pages/Attendance/AllAttendance";
import DailyAttendance from "./pages/Attendance/DailyAttendance";
import EditEmployee from "./components/employee/EditEmployee";
import AllDepartments from "./pages/Departments/AllDepartments";
import AllBranches from "./pages/Departments/AllBranches";
import AllDesignations from "./pages/Departments/AllDesignations";
import MonthlyAttendance from "./pages/Attendance/MonthlyAttendance";
import AllEmployeePayroll from "./pages/Payroll/AllEmployeePayroll";
import EmployeesSalary from "./pages/Payroll/EmployeesSalary";
import SalaryDefnition from "./pages/Payroll/SalaryDefnition";
import AllEmployeeLeaves from "./pages/Leaves/AllEmployeeLeaves";
import AllJobs from "./pages/Jobs/AllJobs";
import AllCandidates from "./pages/Candidates/AllCandidates";
import CreatePayslip from "./pages/Payroll/CreatePayslip";
import PayslipView from "./pages/Payroll/PayslipView";
import GeneratePayroll from "./pages/Payroll/GeneratePayroll";
import AllHolidayLists from "./pages/Holidays/AllHolidayLists";
import MyProfile from "./pages/Profile/MyProfile";
import Notification from "./pages/Notification/Notification";
import { useAuth } from "./context/AuthContext";
import EditPayslip from "./pages/Payroll/EditPayslip";
import ViewLeadData from "./DataEntry/ViewLeadData";
import EditLeadForm from "./DataEntry/EditLeadForm";
import UploadDocumnet from "./DataEntry/UploadDocumnet";
import LeadDataList from "./DataEntry/LeadDataList";
import AdminLeadDataList from "./AdminModule/AdminLeadDataList";
// Import other pages here and there




// const checkAuthentication = () => {
//   const token = localStorage.getItem('accessToken');
//   console.log(token,"from app");

//   return !!token; // Returns true if token exists, false otherwise
// };


const App = () => {
  // Simple auth check - in a real app, you'd use a proper auth system
  const { isAuthenticated } = useAuth();

  // useEffect(() => {
  //   const token = localStorage.getItem('accessToken');
  //   console.log("app.jsx");

  //   setIsAuthenticated(!!token);
  // }, []);

  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     setIsAuthenticated(checkAuthentication());
  //   };

  //   // Add event listener for storage changes
  //   window.addEventListener('storage', handleStorageChange);

  //   // Clean up the event listener on component unmount
  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //   };
  // }, []);


  return (

    // <AuthProvider>
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme='dark'
        style={{ width: "350px" }}
      >

      </ToastContainer>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/generate-password"
          element={<GeneratePassword />}
        />
        <Route
          path="/email-verification"
          element={<EmailVerificationUI />}
        />
        <Route
          path="/otp-verification"
          element={<OtpVerification />}
        />
        <Route
          path="/set-new-password"
          element={<SetPasswordUI />}
        />
        <Route
          path="/reset-password"
          element={<SetForgotPassword />}
        />
        <Route
          path="/forget-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/newEmployee"
          element={isAuthenticated ? <NewEmployee /> : <Navigate to="/newEmployee" />}
        />
        <Route
          path="/allEmployee"
          element={isAuthenticated ? <AllEmployee /> : <Navigate to="/allEmployee" />}
        />
        <Route
          path="/viewEmployee/:id"
          element={isAuthenticated ? <ViewEmployee /> : <Navigate to="/viewEmployee" />}
        />
        <Route
          path="/editEmployee/:id"
          element={isAuthenticated ? <EditEmployee /> : <Navigate to="/editEmployee" />}
        />
        <Route
          path="/allAttendance"
          element={isAuthenticated ? <AllAttendance /> : <Navigate to="/allAttendance" />}
        />
        <Route
          path="/dailyAttendance"
          element={isAuthenticated ? <DailyAttendance /> : <Navigate to="/dailyAttendance" />}
        />
        <Route
          path="/allBranches"
          element={isAuthenticated ? <AllBranches /> : <Navigate to="/allBranches" />}
        />
        <Route 
          path="/allDepartments/:id" 
          element={isAuthenticated ? <AllDepartments /> : <Navigate to="/allDepartments" />} 
        />
        <Route
          path="/allDesignations"
          element={isAuthenticated ? <AllDesignations /> : <Navigate to="/allDesignations" />}
        />
        <Route
          path="/monthlyAttendance"
          element={isAuthenticated ? <MonthlyAttendance /> : <Navigate to="/monthlyAttendance" />}
        />
        <Route 
          path="/allPayroll" 
          element={isAuthenticated ? <AllEmployeePayroll /> : <Navigate to="/allPayroll" />} 
        />
        <Route
          path="/createPayslip"
          element={isAuthenticated ? <CreatePayslip /> : <Navigate to="/createPayslip" />}
        />
        <Route 
          path="/editPayslip/:id" 
          element={isAuthenticated ? <EditPayslip /> : <Navigate to="/editPayslip/:id" />} 
        />
        <Route 
          path="/generatePayroll" 
          element={isAuthenticated ? <GeneratePayroll /> : <Navigate to="/generatePayroll" />} 
        />
        <Route
          path="/employeesSalary"
          element={isAuthenticated ? <EmployeesSalary /> : <Navigate to="/employeesSalary" />}
        />
        <Route 
          path="/payslipView/:id" 
          element={isAuthenticated ? <PayslipView /> : <Navigate to="/payslipView/:id" />} 
        />
        <Route
          path="/salaryDefnition"
          element={isAuthenticated ? <SalaryDefnition /> : <Navigate to="/salaryDefnition" />}
        />
        <Route
          path="/allEmployeeLeaves"
          element={isAuthenticated ? <AllEmployeeLeaves /> : <Navigate to="/allEmployeeLeaves" />}
        />
        <Route
          path="/allJobs"
          element={isAuthenticated ? <AllJobs /> : <Navigate to="/allJobs" />}
        />
        <Route
          path="/allCandidates"
          element={isAuthenticated ? <AllCandidates /> : <Navigate to="/allCandidates" />}
        />
        <Route
          path="/allHolidayLists"
          element={isAuthenticated ? <AllHolidayLists /> : <Navigate to="/allHolidayLists" />}
        />
        <Route
          path="/myProfile"
          element={isAuthenticated ? <MyProfile /> : <Navigate to="/myProfile" />}
        />
        <Route
          path="/notification"
          element={isAuthenticated ? <Notification /> : <Navigate to="/notification" />}
        />
        <Route
          path="/leadDataList"
          element={isAuthenticated ? <LeadDataList /> : <Navigate to="/leadDataList" />}
        />
        <Route
          path="/viewLeadData/:id"
          element={isAuthenticated ? <ViewLeadData /> : <Navigate to="/viewLeadData/:id" />}
        />
        <Route
          path="/editLeadForm/:id"
          element={isAuthenticated ? <EditLeadForm /> : <Navigate to="/editLeadForm/:id" />}
        />
        <Route
          path="/uploadDocument"
          element={isAuthenticated ? <UploadDocumnet /> : <Navigate to="/uploadDocument" />}
        />
        <Route
          path="/adminLeadDataList"
          element={isAuthenticated ? <AdminLeadDataList /> : <Navigate to="/adminLeadDataList" />}
        />
      </Routes>
    </Router>

    // </AuthProvider>
  );
};

export default App;
