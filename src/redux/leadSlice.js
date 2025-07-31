import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helpers/Api"



const initialState = {
    isLoading: false,
    isRefresh: false,
    filterOptions:{
        page:1,
        search:"",
        limit:10,
        date:''
       
    },
    
    leadsData:[],
    // candidates:[],
    // candidateFilterOptions :{
    //     page:1,
    //     name:''

    // }

}


export const getAllLeadData =  createAsyncThunk('get--all-jobs', async (body, { rejectWithValue, dispatch }) => {
    try {

        dispatch(
            setData({
              name: "isLoading",
              value: true,
            })
          );
        

        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getAllLeads(queryParams);

        console.log(data,"leads");
        
        if (status === 200) {

           
            //get categories data
            dispatch(dispatch(
                    setData({
                      name: "leadsData",
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



export const leadsSlice = createSlice({
    name: "leads",
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
        
       
       
          
    },
   
})


export const {
    setRefresh,
    setFilterValues,
    setData,
    
} = leadsSlice.actions

export default leadsSlice.reducer;