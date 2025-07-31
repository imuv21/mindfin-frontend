import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helpers/Api"
import Toastify from "../helpers/Toastify";






const initialState = {
    isLoading: false,
    isEmployeeAddLoading:false,
    isRefresh: false,
    filterOptions:{
        page:1,
        name:"",
        designation:"",
        status:""
    },
    departmentFilterOptions:{
        page:1,
        name:"",
        designation:"",
    },
    deparmentEmployees:[],
    AllEmployees :[],
    userData: {},
    addUserData: {},
    designations:[],
    branches:[],
    editUserData: {},
    deleteUsersData: {},
    errorMsg: "",
    isError: false
}


export const getEmployees = createAsyncThunk('getEmployees', async (body, { rejectWithValue, dispatch }) => {
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
        const { data, status } = await api.getEmployees(queryParams);

        console.log(data,"initail employees");
        
        if (status === 200) {

           
            //get categories data
            dispatch(setUsers(data.data))

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

export const getAllDesignations =  createAsyncThunk('getDesignations', async (body, { rejectWithValue, dispatch }) => {
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

        // const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getDesignations();

        console.log(data.data,"designations");
        
        if (status === 200) {

           
            //get categories data
            // dispatch(setUsers(data.data))
            dispatch(setDesignations(data.data))

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

export const getAllBranches =  createAsyncThunk('getDesignations', async (body, { rejectWithValue, dispatch }) => {
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
        // dispatch(setLoading(true))

        // const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getBranches();

        // console.log(data.data,"designations");
        
        if (status === 200) {

           
            //get categories data
            // dispatch(setUsers(data.data))
            dispatch(setBranches(data.data))

        }
        return data.data
    } catch (err) {

        
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
    finally{
        // dispatch(setLoading(false))

    }
}
)

export const AddEmployee =  createAsyncThunk('add-employee', async (body, { rejectWithValue, dispatch }) => {
    try {

          dispatch(setEmployeeLoading(true))
        const { data, status } = await api.addEmployee(body);

        // console.log(data.data,"designations");
        
        if (status === 200) {          
            Toastify.success("New Employee Added Successfully")
            dispatch(setRefresh())

        }
        return data.data
    } catch (error) {

            Toastify.error(error.response.data.message || `something went wrong`);
        
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
    finally{
        dispatch(setEmployeeLoading(false))

    }
}
)

export const editEmployee =  createAsyncThunk('edit-employee', async (body, { rejectWithValue, dispatch }) => {
    try {

          dispatch(setEmployeeLoading(true))
        const { data, status } = await api.editEmployee(body);

        // console.log(data.data,"designations");
        
        if (status === 200) {          
            Toastify.success("Employee edited Successfully")
            dispatch(setRefresh())

        }
        return data.data
    } catch (error) {

            Toastify.error(error.response.data.message || `something went wrong`);
        
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
    finally{
        dispatch(setEmployeeLoading(false))

    }
}
)

export const getSpecificDepartmentEmployees =  createAsyncThunk('get-specificDepartmentEmployees', async (body, { rejectWithValue, dispatch }) => {
    try {
        console.log("getspacific deparmanr");
        
          dispatch(setLoading(true))
        const queryParams = new URLSearchParams(body).toString();

        const { data, status } = await api.getSpecificDepartmentEmployees(queryParams);
        console.log(data.data,"specific department employee");
        
        if (status === 200) {          
             dispatch(
            setData({
              name: "deparmentEmployees",
              value: data.data,
            })
          );
        }
        return data.data
    } catch (error) {

            Toastify.error(error.response.data.message || `something went wrong`);
        
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
    finally{
        dispatch(setLoading(false))

    }
}
)


export const getAllEmployeesWithOutpagination =  createAsyncThunk('getAllEmployeesWithOutpagination', async (body, { rejectWithValue, dispatch }) => {
    try {
        
        //   dispatch(setLoading(true))
        // const queryParams = new URLSearchParams(body).toString();

        const { data, status } = await api.getAllEmployees();
        // console.log(data.data,"specific department employee");
        
        if (status === 200) {          
             dispatch(
            setData({
              name: "AllEmployees",
              value: data.data,
            })
          );
        }
        return data.data
    } catch (error) {

            // Toastify.error(error.response.data.message || `something went wrong`);
        
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
    finally{
        // dispatch(setLoading(false))

    }
}
)





export const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.userData = action.payload
        },
        setCoursesDetails: (state, action) => {
            state.courseDetailsData = action.payload
        },
       
        setAddNewUser: (state, action) => {
            state.addNewCourseData = action.payload
        },
        setEditNewUser: (state, action) => {
            state.editUserData = action.payload
        },
        setDeleteUsers: (state, action) => {
            state.deleteUsersData = action.payload
        },
        setRefresh: (state) => {
            state.isRefresh = !state.isRefresh
        },
        setFilterValues: (state, action) => {
            state.filterOptions = { ...state.filterOptions, ...action.payload }
        },
        setDeparmentFilterValues: (state, action) => {
            state.departmentFilterOptions = { ...state.departmentFilterOptions, ...action.payload }
        },
          setData: (state, action) => {
            state[action.payload.name] = action.payload.value;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
          },
        setEmployeeLoading: (state, action) => {
            state.isEmployeeAddLoading = action.payload
          },
          setDesignations :(state,action) =>{
            state.designations = action.payload
          },
          setBranches :(state,action)=>{
            state.branches = action.payload
          }
          
    },
   
})

export const {
    setUsers,
    setAddNewUser,
    setEditNewUser,
    setDeleteUsers,
    setRefresh,
    setFilterValues,
    setData,
    setLoading,
    setDesignations,
    setBranches,
    setEmployeeLoading,
    setDeparmentFilterValues
    
} = employeeSlice.actions

export default employeeSlice.reducer;