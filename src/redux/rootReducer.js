import { combineReducers } from '@reduxjs/toolkit';

import userSlice from "./userSlice";
import employeeSlice from "./employeeSlice";
import attendenceSlice from "./attedenceSlice";
import jobSlice from "./jobSlice";
import holidaySlice from "./holidaySlice";
import leaveSlice from "./leaveSlice";
import payrollSlice from "./payrollSlice";
import leadsSlice from "./leadSlice";
import teleCallerSlice from "./telecallerSlice";
import creditManagerSlice from "./creditManagerSlice";
import dataEntrySlice from "./dataEntrySlice";
import creditSlice from "./creditSlice";


const rootReducer = combineReducers({

    user: userSlice,
    employee: employeeSlice,
    attendence: attendenceSlice,
    jobs: jobSlice,
    holidays: holidaySlice,
    leave: leaveSlice,
    payroll: payrollSlice,
    leads: leadsSlice,
    telecaller: teleCallerSlice,
    credit: creditManagerSlice,
    creditManager: creditSlice,
    dataEntry: dataEntrySlice,

});

export default rootReducer;


