// src/pages/Dashboard.jsx
import React, { useEffect , useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
// import StatCard from "@/components/dashboard/StatCard";
// import ActivityChart from "@/components/dashboard/ActivityChart";
// import EmployeeCounter from "@/components/employee/EmployeeCounter";
// import { Users, DollarSign, Clock, Briefcase } from "lucide-react";
import AttendanceOverview from "../components/dashboard/AttendanceOverview";
import DashboardCards from "../components/dashboard/DashboardCards";
import HolidayCalendar from "../components/dashboard/HolidayCalendar";
import AttendanceOverviewTable from "../components/dashboard/AttendanceOverviewTable";
import { getProfile } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
/* import { Calendar } from "@/components/ui/calendar"; */
import { addDays, format } from "date-fns"
import ProfileHeader from "@/components/layout/ProfileHeader";

const Dashboard = () => {

  const dispatch = useDispatch()

  const user = useSelector((state) => state.user);
  const name = user?.user.firstName 

  console.log(user,"myr");
  


  const [date, setDate] = useState({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })

  // Sample activity data
  const activityData = [
    { day: "Mo", value: 40 },
    { day: "Tu", value: 30 },
    { day: "We", value: 20 },
    { day: "Th", value: 60 },
    { day: "Fr", value: 80 },
    { day: "Sa", value: 90 },
    { day: "Su", value: 40 },
  ];

    useEffect(()=>{
      console.log("hi from dash..");
      
     dispatch(getProfile()) 
    },[])


    const  getGreetingInIST =() =>{
      const now = new Date();
    
      const istOffset = 5.5 * 60 * 60 * 1000; 
      const istTime = new Date(now.getTime() + istOffset);
    
      const hours = istTime.getUTCHours();
    
      if (hours >= 5 && hours < 12) {
        return "Good Morning";
      } else if (hours >= 12 && hours < 17) {
        return "Good Afternoon";
      } else if (hours >= 17 && hours < 21) {
        return "Good Evening";
      } else {
        return "Good Night";
      }
    }
    

  return (
    <MainLayout>
      
    <ProfileHeader
     name={`Hello ${name } 👋🏻`}
     breadcrumbs={[getGreetingInIST()]}
    
    />
      <div className="space-y-6 mx-6">

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">

          <div className="lg:col-span-4">
            <DashboardCards />
            <AttendanceOverview />
          </div>

          <div className="lg:col-span-2">
            <HolidayCalendar />
            {/* <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
             /> */}
          </div>
        </div>
        <AttendanceOverviewTable/>

       
      </div>
    </MainLayout>
  );
};

export default Dashboard;