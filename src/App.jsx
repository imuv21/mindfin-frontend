import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import Protector from "./components/auth/Protector";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GeneratePassword from "./pages/GeneratePassword";
import EmailVerificationUI from "./pages/EmailVerification";
import SetPasswordUI from "./pages/SetPasswordUI";
import SetForgotPassword from "./pages/SetForgotPassword";
import ForgotPassword from "./pages/ForgotPassword";
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
import EditPayslip from "./pages/Payroll/EditPayslip";
import ViewLeadData from "./DataEntry/ViewLeadData";
import EditLeadForm from "./DataEntry/EditLeadForm";
import UploadDocumnet from "./DataEntry/UploadDocumnet";
import LeadDataList from "./DataEntry/LeadDataList";

// Admin
import AdminDashboard from "./AdminModule/AdminDashboard";
import AdminUploadLeadList from "./AdminModule/AdminUploadLead";
import AdminLeadDataList from "./AdminModule/AdminLeadDataList";
import AdminViewLeadList from "./AdminModule/AdminViewLeadData";
import AdminEditLeadList from "./AdminModule/AdminEditLeadForm";
import AdminDuplicateLeadList from "./AdminModule/DuplicateModal";


// Telecaller
import TelecallerOverview from "./Telecaller/Overview";
import TelecallerLeadsData from "./Telecaller/LeadsData";
import ViewLeadDetails from "./Telecaller/ViewLeadDetails";


// Not found
import NotFound from "./pages/NotFound";


const App = () => {

  const user = useSelector((state) => state.user.user);

  return (

    <Router>
      <ToastContainer position="top-right" autoClose={2000} theme='dark' style={{ width: "350px" }} />
      <Routes>

        {/* Redirect root path */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

        {/* Public routes - only accessible when not authenticated */}
        <Route element={<Protector user={user} redirectTo="/dashboard" />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/generate-password" element={<GeneratePassword />} />
          <Route path="/email-verification" element={<EmailVerificationUI />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/set-new-password" element={<SetPasswordUI />} />
          <Route path="/reset-password" element={<SetForgotPassword />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
        </Route>

        {/* Private routes - require authentication */}
        <Route element={<Protector isPrivate user={user} redirectTo="/login" />}>

          <Route path="/dashboard" element={<Dashboard />} />

          {/* hr & data entry routes */}
          <Route path="/newEmployee" element={<NewEmployee />} />
          <Route path="/allEmployee" element={<AllEmployee />} />
          <Route path="/viewEmployee/:id" element={<ViewEmployee />} />
          <Route path="/editEmployee/:id" element={<EditEmployee />} />
          <Route path="/allAttendance" element={<AllAttendance />} />
          <Route path="/dailyAttendance" element={<DailyAttendance />} />
          <Route path="/allBranches" element={<AllBranches />} />
          <Route path="/allDepartments/:id" element={<AllDepartments />} />
          <Route path="/allDesignations" element={<AllDesignations />} />
          <Route path="/monthlyAttendance" element={<MonthlyAttendance />} />
          <Route path="/allPayroll" element={<AllEmployeePayroll />} />
          <Route path="/createPayslip" element={<CreatePayslip />} />
          <Route path="/editPayslip/:id" element={<EditPayslip />} />
          <Route path="/generatePayroll" element={<GeneratePayroll />} />
          <Route path="/employeesSalary" element={<EmployeesSalary />} />
          <Route path="/payslipView/:id" element={<PayslipView />} />
          <Route path="/salaryDefnition" element={<SalaryDefnition />} />
          <Route path="/allEmployeeLeaves" element={<AllEmployeeLeaves />} />
          <Route path="/allJobs" element={<AllJobs />} />
          <Route path="/allCandidates" element={<AllCandidates />} />
          <Route path="/allHolidayLists" element={<AllHolidayLists />} />
          <Route path="/myProfile" element={<MyProfile />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/leadDataList" element={<LeadDataList />} />
          <Route path="/viewLeadData/:id" element={<ViewLeadData />} />
          <Route path="/editLeadForm/:id" element={<EditLeadForm />} />
          <Route path="/uploadDocument" element={<UploadDocumnet />} />

          {/* Admin */}
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/adminUploadDataList" element={<AdminUploadLeadList />} />
          <Route path="/adminLeadDataList" element={<AdminLeadDataList />} />
          <Route path="/adminViewDataList" element={<AdminViewLeadList />} />
          <Route path="/adminEditDataList" element={<AdminEditLeadList />} />
          <Route path="/adminDuplicateDataList" element={<AdminDuplicateLeadList />} />

          {/* Telecaller */}
          <Route path="/telecaller-overview" element={<TelecallerOverview />} />
          <Route path="/telecaller-leads-data" element={<TelecallerLeadsData />} />
          <Route path="/telecaller-view-lead-details" element={<ViewLeadDetails />} />

        </Route>

        {/* Redirect all unknown paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
