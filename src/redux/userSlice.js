import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../helpers/Api";


export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.login(userData);
            console.log(response.data);
            return response.data.data;

        } catch (error) {
            if (error.response && error.response.data) {
                const message = error.response.data.message || 'Login failed';
                return rejectWithValue({ message });
            }
            return rejectWithValue({ message: "Something went wrong" });
        }
    }
);

export const getProfile = createAsyncThunk(
    'user/getProfile',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const { data, status } = await api.WhoAmI();
            if (status === 200) {
                dispatch(setUserData(data.data));
            }
        } catch (err) {
            return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
        }
    }
);

const initialState = {

    user: null,
    token: null,
    logLoading: false,
    logError: null,

};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setEmailData: (state, action) => {
            state.emailData = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        },
        setUserData: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.logLoading = true;
                state.logError = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.logLoading = false;
                state.logError = null;
                state.user = action.payload?.employee || null;
                state.token = action.payload?.token || null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.logLoading = false;
                state.logError = action.payload?.message || "Something went wrong!";
            })
    }
});

export const { setEmailData, logout } = userSlice.actions;
export default userSlice.reducer;
