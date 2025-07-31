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
import { getProfile } from "../../redux/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBranches, getAllDesignations } from "../../redux/employeeSlice.js";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    matchPaths: ["/dashboard"],

  },
  {
    icon: Users,
    label: "All Employees",
    href: "/allEmployee",
    matchPaths: ["/allEmployee", "/newEmployee","/viewEmployee","/editEmployee"],

  },
  {
    icon: Workflow,
    label: "All Department",
    href: "/allDesignations",
    matchPaths: ["/allDesignations", "/allDepartments"],

  },
  {
    icon: Clock,
    label: "Attendance",
    href: "/allAttendance",
    matchPaths: ["/allAttendance", "/monthlyAttendance"],

  },
  {
    icon: Banknote,
    label: "Payroll",
    href: "/employeesSalary",
    matchPaths: ["/allPayroll","/salaryDefnition","/employeesSalary"],


  },
  {
    icon: Briefcase,
    label: "Jobs",
    href: "/allJobs",
    matchPaths: ["/allJobs"],


  },
  {
    icon: UserPlus,
    label: "Candidates",
    href: "/allCandidates",
    matchPaths: ["/allCandidates"],

  },
  {
    icon: CalendarDays,
    label: "Leaves",
    href: "/allEmployeeLeaves",
    matchPaths: ["/allEmployeeLeaves"],

  },
  {
    icon: CalendarClock,
    label: "Holidays",
    href: "/allHolidayLists",
    matchPaths: ["/allHolidayLists"],

  },
  {
    icon: Settings,
    label: "Settings",
    href: "/myProfile",
    matchPaths: ["/myProfile"],

  },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  const isPathMatch = (matchPaths, currentPath) => {

    // console.log(matchPaths,currentPath,"paths");
    
    return matchPaths.some((path) => currentPath.startsWith(path));
  };

  // console.log(location,"loaction");
  


  useEffect(() => {
    dispatch(getProfile());
    dispatch(getAllDesignations())
    dispatch(getAllBranches())
  }, []);

  const user = useSelector((state) => state.user);

  // console.log("user", user);

  return (
    <div className="flex flex-col h-full rounded-[20px] border-gray-200 bg-[#A2A1A80D] m-4">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-600">MINDFIN</h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          // const isActive =
          //   item.matchPaths
          //     ? item.matchPaths.includes(location.pathname)
          //     : location.pathname === item.href;
          const isActive = item.matchPaths.some((path) =>
            location.pathname.startsWith(path)
          );

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm rounded-md",
                isPathMatch(item.matchPaths, currentPath)
                ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

   {/*    <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full overflow-hidden">
            <img
              src={
                user?.user?.profileImg
                  ? user?.user?.profileImg[0]
                  : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740"
              }
              alt={`${user?.user?.firstName} ${user?.user?.lastName}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">
              {user?.user?.firstName
                ? `${user.user.firstName} ${user.user.lastName}`
                : "user"}
            </p>
            <p className="text-xs text-gray-500">25 Oct - 27 Oct</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;