import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helpers/Api"
import Toastify from "../helpers/Toastify";

const initialState = {
    isLoading: false,
    isRefresh: false,
    isPayrollRefresh:false,
    isPayrollLoading: false,

    filterOptions:{
        page:1,
        search:"",
        designation:"",
    },
    payRollFillterOptions :{
      page:1,

    },
    
    paySlipData:[],
    taxes :[],
    payRollData:[]
    
}



export const getAllPayslips =  createAsyncThunk('get--all-payslips', async (body, { rejectWithValue, dispatch }) => {
    try {

        dispatch(
            setData({
              name: "isLoading",
              value: true,
            })
          );
        

        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getAllPaySlip(queryParams);

        console.log(data,"payslip");
        
        if (status === 200) {

           
            //get categories data
            dispatch(dispatch(
                    setData({
                      name: "paySlipData",
                      value: data?.data,
                    })
                  ))

        }
        return data.data
    } catch (err) {

        
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
    finally{
        dispatch(
            setData({
              name: "isLoading",
              value: false,
            })
          );
    }
}
)



export const getAllPayrolls =  createAsyncThunk('get--all-payrolls', async (body, { rejectWithValue, dispatch }) => {
  try {

      dispatch(
          setData({
            name: "isPayrollLoading",
            value: true,
          })
        );
      

      const queryParams = new URLSearchParams(body).toString();
      const { data, status } = await api.getAllPayRoll(queryParams);

      console.log(data,"payroll");
      
      if (status === 200) {

         
          //get categories data
          dispatch(dispatch(
                  setData({
                    name: "payRollData",
                    value: data?.data,
                  })
                ))

      }
      return data.data
  } catch (err) {

      
      return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
  }
  finally{
      dispatch(
          setData({
            name: "isPayrollLoading",
            value: false,
          })
        );
  }
}
)

export const getAllTaxes =  createAsyncThunk('get--all-taxes', async (body, { rejectWithValue, dispatch }) => {
    try {

        dispatch(
            setData({
              name: "isLoading",
              value: true,
            })
          );
        

        const { data, status } = await api.getAllBranchTaxes();

        console.log(data,"tax");
        
        if (status === 200) {

           
            //get categories data
            dispatch(dispatch(
                    setData({
                      name: "taxes",
                      value: data?.data?.data,
                    })
                  ))

        }
        return data.data
    } catch (err) {

        
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
    finally{
        dispatch(
            setData({
              name: "isLoading",
              value: false,
            })
          );
    }
}
)









export const payrollSlice = createSlice({
    name: "payroll",
    initialState,
    reducers: {
        
        setRefresh: (state) => {
            state.isRefresh = !state.isRefresh
        },
        setPayrollRefresh: (state) => {
            state.isPayrollRefresh = !state.isPayrollRefresh
        },
        setFilterValues: (state, action) => {
            state.filterOptions = { ...state.filterOptions, ...action.payload }
        },      
        setPayroleFilterValues: (state, action) => {
            state.payRollFillterOptions = { ...state.payRollFillterOptions, ...action.payload }
        },      
          setData: (state, action) => {
            state[action.payload.name] = action.payload.value;
        },
       
       
       
          
    },
   
})

export const {
    setRefresh,
    setFilterValues,
    setData,
    setPayroleFilterValues,
    setPayrollRefresh
    
} = payrollSlice.actions

export default payrollSlice.reducer;