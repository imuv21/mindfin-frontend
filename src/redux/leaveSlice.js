import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helpers/Api"


const initialState = {
    isLoading: false,
    isRefresh: false,
    filterOptions:{
        page:1,
        name:"",
        status:''
       
    },
   
    leaveData:[],
    

}


export const getAllLeaves =  createAsyncThunk('get--all-leaves', async (body, { rejectWithValue, dispatch }) => {
    try {

        dispatch(
            setData({
              name: "isLoading",
              value: true,
            })
          );
        

        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getAllLeaves(queryParams);

        console.log(data,"leaves");
        
        if (status === 200) {

           
            //get categories data
            dispatch(dispatch(
                    setData({
                      name: "leaveData",
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


export const leaveSlice = createSlice({
    name: "leave",
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
    
} = leaveSlice.actions

export default leaveSlice.reducer;