import { combineReducers } from '@reduxjs/toolkit';

import userSlice from "./userSlice";
import employeeSlice from "./employeeSlice";
import attendenceSlice from "./attedenceSlice";
import jobSlice from "./jobSlice";
import holidaySlice from "./holidaySlice";
import leaveSlice from "./leaveSlice";
import payrollSlice from "./payrollSlice";
import leadsSlice from "./leadSlice";


const rootReducer = combineReducers({
    user: userSlice,
    employee: employeeSlice,
    attendence: attendenceSlice,
    jobs: jobSlice,
    holidays: holidaySlice,
    leave: leaveSlice,
    payroll: payrollSlice,
    leads: leadsSlice
});

export default rootReducer;


