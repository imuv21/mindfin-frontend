import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helpers/Api";
// import api from "../helper/Api";
// import { toast } from "react-toastify";
// import Toastify from "../helper/Toastify";

const initialState = {
    isLoggedIn: false,
    user: {},
    verifyObject: {},
    data: null,
    errorMsg: "",
    isError: false,
    token: null
}

export const getProfile = createAsyncThunk('getProfile', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.WhoAmI()
        console.log('Userdata', data);

        if (status === 200) {
            // return {
            //     userData: data?.data?.data,
            //     verifyObject: data?.data?.verifyObject,
            // };
            dispatch(setUserData(data.data))
        }
    } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

// export const updateProfile = createAsyncThunk('updateProfile', async (body, { rejectWithValue, dispatch }) => {
//     try {
//         const { data, status } = await api.updateProfile(body);

//         if (status === 200) {
//             setUserData(data.data)
//             Toastify.success("Profile update successful")
//             return data.data
//         }
//     } catch (err) {
//         Toastify.error(err.response.data.message || "'Something went wrong. Please try again later.'")
//         return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
//     }
// }
// )


// export const updatePassword = createAsyncThunk('updatePassword', async (body, { rejectWithValue, dispatch }) => {
//     try {
//         const { data, status } = await api.updatePassword(body);

//         if (status === 200) {
//             Toastify.success("Password update successful")
//             return data.data
//         }
//     } catch (err) {
//         Toastify.error(err.response.data.message || "'Something went wrong. Please try again later.'")
//         return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
//     }
// }
// )




// export const getDashboardData = createAsyncThunk('getDashboardData', async (body, { rejectWithValue, dispatch }) => {
//     try {
//         const { data, status } = await api.getDashboardData();

//         if (status === 200) {

//             return data.data
//         }
//     } catch (err) {
//         Toastify.error(err.response.data.message || "'Something went wrong. Please try again later.'")
//         return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
//     }
// }
// )


// export const getGraphData = createAsyncThunk('getGraphData', async (body, { rejectWithValue, dispatch }) => {
//     try {
//         const { data, status } = await api.getGraphData(body);

//         if (status === 200) {

//             return data.data
//         }
//     } catch (err) {
//         Toastify.error(err.response.data.message || "'Something went wrong. Please try again later.'")
//         return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
//     }
// }
// )



const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.isLoggedIn = true
            state.user = action.payload
        },
        // setTwoFA: (state, action) => {
        //     state.user["2FA"] = action.payload
        // },
        setLogOut: (state, action) => {
            state.isLoggedIn = false
            state.user = {}
            state.token = ""
        },
        setLoginData: (state, action) => {
            state.data = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
        setUserData: (state, action) => {
            state.user = action.payload
        },
        setVerifyObject: (state, action) => {
            state.verifyObject = action.payload
        }
    },
    
})

export const { setLogin, setTwoFA, setLogOut, setLoginData, setToken, setUserData, setVerifyObject } = userSlice.actions

export default userSlice.reducer