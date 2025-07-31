import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice"
import employeeSlice  from "./employeeSlice";
import attendenceSlice  from "./attedenceSlice";
import jobSlice from "./jobSlice"
import holidaySlice from "./holidaySlice";
import  leaveSlice  from "./leaveSlice";
import  payrollSlice  from "./payrollSlice";
import  leadsSlice  from "./leadSlice";



export const store = configureStore({
    reducer: {
        // login: loginSlice,
        user:userSlice,
        employee:employeeSlice,
        attendence : attendenceSlice,
        jobs:jobSlice,
        holidays : holidaySlice,
        leave:leaveSlice,
        payroll:payrollSlice,
        leads:leadsSlice
        // categories:categoriesSlice,
        // subCategories:subCategoriesSlice,
        // course:courseSlice,
        // adminUser: adminUserSlice,
        // assignments: assignmentSlice,
        // certificates: certificateSlice,
        // notification:notificationSlice ,
        // students: studentsSlice,
        // chat:chatSlice,
        // liveSessions: liveSessionSlice,
        // leads: leadsSlice,
        // payments: paymentSlice,
        // quiz: quizSlice,
        // webinar :webinarSlice
    }
})


