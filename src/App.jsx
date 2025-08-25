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

// Data Entry
import EditLeadForm from "./DataEntry/EditLeadForm";
import AddLeads from "./DataEntry/AddLeads";
import LeadDataList from "./DataEntry/LeadDataList";
import ViewLeadData from "./DataEntry/ViewLeadData";

// Admin
import AdminDashboard from "./AdminModule/AdminDashboard";
import AdminUploadLeadList from "./AdminModule/AdminUploadLead";
import AdminLeadDataList from "./AdminModule/AdminLeadDataList";
import AdminViewLeadList from "./AdminModule/AdminViewLeadData";
import AdminEditLeadForm from "./AdminModule/AdminEditLeadForm";
import AdminDuplicateLeadList from "./AdminModule/DuplicateModal";
import AdminDeleteLeadForm from "./AdminModule/AdminLeadDataList";

// Telecaller
import TelecallerOverview from "./Telecaller/Overview";
import TelecallerLeadsData from "./Telecaller/LeadsData";
import ViewLeadDetails from "./Telecaller/ViewLeadDetails";
import EditLeadData from './Telecaller/EditLeadData';

// Credit Manager
import CreditOverview from './Credit Manager/Overview';
import CreditLeadData from "./Credit Manager/CreditLeadData";
import CreditViewLeadData from './Credit Manager/ViewLeadData';
import CreditEditLeadData from './Credit Manager/EditLeadData';
import DocumentVerificationData from './Credit Manager/DocumentVerificationData';
import DocumentVerification from './Credit Manager/DocumentVerification';
import LoanDisbursal from './Credit Manager/LoanDisbursal';
import LoanDisbursalDetail from './Credit Manager/LoanDisbursalDetail';
import Topup from './Credit Manager/Topup';
import TopupDetail from './Credit Manager/TopupDetail';

import CibilCreditScroe from "./Credit Manager/CibilCreditScroe";
import UploadCibilScore from "./Credit Manager/UploadCibilScore";
import CheckCibilScore from "./Credit Manager/CheckCibilScore";

// Not Found
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

          {/* Data Entry */}
          <Route path="/data-entry-leads-data" element={<LeadDataList />} />
          <Route path="/data-entry-view-lead-data/:id" element={<ViewLeadData />} />
          <Route path="/data-entry-edit-lead-form/:id" element={<EditLeadForm />} />
          <Route path="/data-entry-add-leads" element={<AddLeads />} />

          {/* Admin */}
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/adminUploadDataList" element={<AdminUploadLeadList />} />
          <Route path="/adminLeadDataList" element={<AdminLeadDataList />} />
          <Route path="/adminViewDataList/:id" element={<AdminViewLeadList />} />
          <Route path="/adminEditDataList/:id" element={<AdminEditLeadForm />} />
          <Route path="/adminDeleteDataList/:id" element={<AdminDeleteLeadForm />} />
          <Route path="/adminDuplicateDataList" element={<AdminDuplicateLeadList />} />

          {/* Telecaller */}
          <Route path="/telecaller-overview" element={<TelecallerOverview />} />
          <Route path="/telecaller-leads-data" element={<TelecallerLeadsData />} />
          <Route path="/telecaller-view-lead-details/:id" element={<ViewLeadDetails />} />
          <Route path="/telecaller-edit-lead-data/:id" element={<EditLeadData />} />

          {/* Credit Manager */}
          <Route path="/credit-manager-overview" element={<CreditOverview />} />
          <Route path="/credit-manager-lead-data" element={<CreditLeadData />} />
          <Route path="/credit-manager-view-lead-data/:id" element={<CreditViewLeadData />} />
          <Route path="/credit-manager-edit-lead-data/:id" element={<CreditEditLeadData />} />
          <Route path="/document-verification-data" element={<DocumentVerificationData />} />
          <Route path="/document-verification/:id" element={<DocumentVerification />} />
          <Route path="/loan-disbursal" element={<LoanDisbursal />} />
          <Route path="/loan-disbursal-detail/:id/:bankId" element={<LoanDisbursalDetail />} />

          <Route path="/top-up" element={<Topup />} />
          <Route path="/top-up-detail/:id" element={<TopupDetail />} />

          <Route path="/cibil-credit-score" element={<CreditCibilScore />} />
          <Route path="/cibil-check-score/:leadId" element={<CibilCheckScore />} />
          <Route path="/cibil-history-score" element={<CibilHistoryScore />} />


        </Route>

        {/* Redirect all unknown paths */}
        <Route path="*" element={<NotFound />} />

      </Routes>

    </Router>
  );
};

export default App;
