import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helpers/Api"
import Toastify from "../helpers/Toastify";
// import MonthlyAttendance from "src/pages/Attendance/MonthlyAttendance";




const initialState = {
    isLoading: false,
    isRefresh: false,
    filterOptions:{
        page:1,
        name:"",
       
    },
    attentencefilterOptions:{
        page:1,
        search:"",
        year:'',
        month:''
       
    },
    attendenceData:[],
    MonthlyAttendance:[],
    
    
    errorMsg: "",
    isError: false
}




export const getAttentenceData = createAsyncThunk('getAttendence', async (body, { rejectWithValue, dispatch }) => {
    try {

        // dispatch(
        //     setData({
        //       name: "isLoading",
        //       value: true,
        //     })
        //   );
        //   dispatch(
        //     setData({
        //       name: "isError",
        //       value: null,
        //     })
        //   );
        dispatch(setLoading(true))

        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getAttendence(queryParams);

        console.log(data,"initail attendence");
        
        if (status === 200) {

           
            //get categories data
            dispatch(setAttendence(data))

        }
        return data.data
    } catch (err) {

        
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
    finally{
        dispatch(setLoading(false))

    }
}
)


export const getMonthlyAttentenceData = createAsyncThunk('getMonthlyAttendence', async (body, { rejectWithValue, dispatch }) => {
    try {

        // dispatch(
        //     setData({
        //       name: "isLoading",
        //       value: true,
        //     })
        //   );
        //   dispatch(
        //     setData({
        //       name: "isError",
        //       value: null,
        //     })
        //   );
        dispatch(setLoading(true))

        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getMonthlyAttendence(queryParams);

        
        if (status === 200) {

           
            console.log(data?.data);
            
            //get categories data
            dispatch(setMonthlyAttendence(data.data))

        }
        return data.data
    } catch (err) {

        
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
    finally{
        dispatch(setLoading(false))

    }
}
)






export const attendenceSlice = createSlice({
    name: "attendence",
    initialState,
    reducers: {
        setAttendence: (state, action) => {
            state.attendenceData = action.payload
        },
        setMonthlyAttendence: (state, action) => {
            state.MonthlyAttendance = action.payload
        },
        setRefresh: (state) => {
            state.isRefresh = !state.isRefresh
        },
        setFilterValues: (state, action) => {
            state.filterOptions = { ...state.filterOptions, ...action.payload }
        },
        setAttentenceFilterValues: (state, action) => {
            state.attentencefilterOptions = { ...state.attentencefilterOptions, ...action.payload }
        },
          setData: (state, action) => {
            state[action.payload.name] = action.payload.value;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
          },
       
          
    },
   
})



export const {
    setAttendence,
    setRefresh,
    setFilterValues,
    setData,
    setLoading, 
    setAttentenceFilterValues,
    setMonthlyAttendence
} = attendenceSlice.actions

export default attendenceSlice.reducer;