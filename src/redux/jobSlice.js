import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helpers/Api"



const initialState = {
    isLoading: false,
    isRefresh: false,
    filterOptions:{
        page:1,
        designation:"",
        jobStatus:''
       
    },
    
    jobsData:[],
    candidates:[],
    candidateFilterOptions :{
        page:1,
        name:''

    }

}



export const getAllJobs =  createAsyncThunk('get--all-jobs', async (body, { rejectWithValue, dispatch }) => {
    try {

        dispatch(
            setData({
              name: "isLoading",
              value: true,
            })
          );
        

        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getJobs(queryParams);

        console.log(data,"jobs");
        
        if (status === 200) {

           
            //get categories data
            dispatch(dispatch(
                    setData({
                      name: "jobsData",
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


export const getAllCandidates =  createAsyncThunk('getAllCandidates', async (body, { rejectWithValue, dispatch }) => {
    try {

        dispatch(
            setData({
              name: "isLoading",
              value: true,
            })
          );
        

        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getAllCandidates(queryParams);

        console.log(data,"jobs");
        
        if (status === 200) {

           
            //get categories data
            dispatch(dispatch(
                    setData({
                      name: "candidates",
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





export const jobSlice = createSlice({
    name: "jobs",
    initialState,
    reducers: {
        
        setRefresh: (state) => {
            state.isRefresh = !state.isRefresh
        },
        setFilterValues: (state, action) => {
            state.filterOptions = { ...state.filterOptions, ...action.payload }
        },      
          setData: (state, action) => {
            state[action.payload.name] = action.payload.value;
        },
        setCandidateFilterValues:(state,action) =>{
            state.candidateFilterOptions = {...state.candidateFilterOptions,...action.payload}
        }
       
       
          
    },
   
})


export const {
    setRefresh,
    setFilterValues,
    setData,
    setCandidateFilterValues
    
} = jobSlice.actions

export default jobSlice.reducer;