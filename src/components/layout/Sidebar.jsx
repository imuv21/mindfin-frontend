// src/components/layout/Sidebar.jsx
import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Clock,
  Banknote,
  Briefcase,
  UserPlus,
  CalendarDays,
  CalendarClock,
  Settings,
  Workflow
} from "lucide-react";
import { Notifications, Person } from "@mui/icons-material";
import { getProfile } from "../../redux/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBranches, getAllDesignations } from "../../redux/employeeSlice.js";

const navItemsByDesignation = {
  HR: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", matchPaths: ["/dashboard"] },
    { icon: Users, label: "All Employees", href: "/allEmployee", matchPaths: ["/allEmployee", "/newEmployee", "/viewEmployee", "/editEmployee"] },
    { icon: Workflow, label: "All Department", href: "/allDesignations", matchPaths: ["/allDesignations", "/allDepartments"] },
    { icon: Clock, label: "Attendance", href: "/allAttendance", matchPaths: ["/allAttendance", "/monthlyAttendance"] },
    { icon: Banknote, label: "Payroll", href: "/employeesSalary", matchPaths: ["/allPayroll", "/salaryDefnition", "/employeesSalary"] },
    { icon: Briefcase, label: "Jobs", href: "/allJobs", matchPaths: ["/allJobs"] },
    { icon: UserPlus, label: "Candidates", href: "/allCandidates", matchPaths: ["/allCandidates"] },
    { icon: CalendarDays, label: "Leaves", href: "/allEmployeeLeaves", matchPaths: ["/allEmployeeLeaves"] },
    { icon: CalendarClock, label: "Holidays", href: "/allHolidayLists", matchPaths: ["/allHolidayLists"] },
    { icon: Settings, label: "Settings", href: "/myProfile", matchPaths: ["/myProfile"] }
  ],
  ADMIN: [
    { icon: LayoutDashboard, label: "Admin Overview", href: "/adminDashboard", matchPaths: ["/adminDashboard"] },
    {
      icon: LayoutDashboard, label: "Admin Leads", href: "/adminLeadDataList", matchPaths: ["/adminLeadDataList", "/adminUploadDataList", "/adminViewDataList",
        "/adminEditDataList", "/adminDuplicateDataList"]
    },
  ],
  SUPERADMIN: [], // same as HR
  TELECALLER: [
    { icon: LayoutDashboard, label: "Overview", href: "/telecaller-overview", matchPaths: ["/telecaller-overview"] },
    { icon: Users, label: "Leads Data", href: "/telecaller-leads-data", matchPaths: ["/telecaller-leads-data", "/telecaller-view-lead-details/:id", "/telecaller-edit-lead-data/:id"] },
    { icon: Settings, label: "Notifications", href: "/notifications", matchPaths: ["/notifications"] }
  ],
  DATAENTRY: [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard", matchPaths: ["/dashboard"] },
    { icon: Person, label: "Leads", href: "/leadDataList", matchPaths: ["/leadDataList", "/uploadDocument", "/viewLeadData", "/editLeadForm"] },
    { icon: Notifications, label: "Notifications", href: "/notifications", matchPaths: ["/notifications"] },
    { icon: Settings, label: "Setting", href: "/myProfile", matchPaths: ["/myProfile"] },
  ],
  BRANCHMANAGER: [
    { icon: LayoutDashboard, label: "Branch Overview", href: "/branchDashboard", matchPaths: ["/branchDashboard"] },
    { icon: Users, label: "Team", href: "/branchTeam", matchPaths: ["/branchTeam"] }
  ],
  CREDITMANAGER: [
    { icon: LayoutDashboard, label: "Credit Dashboard", href: "/credit-manager-overview", matchPaths: ["/credit-manager-overview"] },
    {
      icon: Briefcase,
      label: "Business Loan",
      href: "#",
      matchPaths: [],
      children: [
        { label: "Leads Data", href: "/credit-manager-lead-data", matchPaths: ["/credit-manager-lead-data", "/credit-manager-view-lead-data/:id", "/credit-manager-edit-lead-data/:id"] },
        { label: "Document Verification", href: "/document-verification-data", matchPaths: ["/document-verification-data", "/document-verification/:id"] },
        { label: "Bank Login", href: "/bank-login", matchPaths: ["/bank-login"] },
        { label: "Disbursal", href: "/loan-disbursal", matchPaths: ["/loan-disbursal", "/loan-disbursal-detail/:id/:bankId"] },
        { label: "Top Up", href: "/top-up", matchPaths: ["/top-up", "/top-up-detail/:id"] },
      ]
    },
    { icon: Settings, label: "Notifications", href: "/notifications", matchPaths: ["/notifications"] }
  ]
};

navItemsByDesignation.SUPERADMIN = navItemsByDesignation.HR;


const Sidebar = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  const isPathMatch = (matchPaths, currentPath) => {
    return matchPaths.some((path) => currentPath.startsWith(path));
  };

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getAllDesignations());
    dispatch(getAllBranches());
  }, []);

  const user = useSelector((state) => state.user.user);
  const role = user?.designation?.designation;

  return (
    <div className="flex flex-col h-full rounded-[20px] border-gray-200 bg-[#A2A1A80D] m-4">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-600">MINDFIN</h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {(navItemsByDesignation[role] || []).map((item) => {
          const isActive = isPathMatch(item.matchPaths, currentPath);

          return (
            <div key={item.label}>
              <NavLink to={item.href !== "#" ? item.href : ""}
                className={cn(
                  "flex items-center px-4 py-3 text-sm rounded-md",
                  isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </NavLink>

              {item.children && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <NavLink key={child.href} to={child.href}
                      className={cn(
                        "block text-sm py-1",
                        isPathMatch(child.matchPaths, currentPath)
                          ? "text-blue-600 font-medium"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;