import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../helpers/Api";
import { handleApiError } from '@/components/utils';


export const getAllCreditManagerLeads = createAsyncThunk(
    'credit/getAllCreditManagerLeads',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.getAllCreditManagerLeads(params);
            return response?.data?.data;

        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const creditUpdateLead = createAsyncThunk(
    'credit/creditUpdateLead',
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await api.updateTeleLead(id, updatedData);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const getAllTelecallers = createAsyncThunk(
    'credit/getAllTelecallers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.getAllTelecallers();
            return response?.data?.data || [];
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);


export const addFollowUp = createAsyncThunk(
    'credit/addFollowUp',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.addFollowUp(data);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const updateFollowUp = createAsyncThunk(
    'credit/updateFollowUp',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.updateFollowUp(id, data);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const getAllFollowUps = createAsyncThunk(
    'credit/getAllFollowUps',
    async (bankDetailId, { rejectWithValue }) => {
        try {
            const response = await api.getAllFollowUps(bankDetailId);
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue({ message: response.data.message });
            }
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const deleteFollowUp = createAsyncThunk(
    'credit/deleteFollowUp',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.deleteFollowUp(id);
            return { ...response.data, id };
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);



const initialState = {

    creditLoading: false,
    creditError: null,
    creditLeads: [],
    creditPagination: {
        total: 0,
        totalPages: 0,
        page: 1,
        pageLeads: 0,
        isFirst: true,
        isLast: true,
        hasNext: false,
        hasPrevious: false
    },

    singleLeadUpdateLoading: false,
    singleLeadUpdateError: null,

    telecallers: [],
    telecallersLoading: false,
    telecallersError: null,



    currentBankId: null,
    followUps: [],
    loadingFollowUps: false,
    followUpsError: null,

    addingFollowUp: false,
    addFollowUpError: null,

    updatingFollowUp: false,
    updateFollowUpError: null,

    deletingFollowUp: false,
    deleteFollowUpError: null
};

const creditManagerSlice = createSlice({
    name: "credit",
    initialState,
    reducers: {
        resetFollowUpsState: (state) => {
            state.currentBankId = null;
            state.followUps = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllCreditManagerLeads.pending, (state) => {
                state.creditLoading = true;
                state.creditError = null;
            })
            .addCase(getAllCreditManagerLeads.fulfilled, (state, action) => {
                state.creditLoading = false;
                state.creditError = null;
                state.creditLeads = action.payload.leads || [];
                state.creditPagination = {
                    total: action.payload.total || 0,
                    totalPages: action.payload.totalPages || 0,
                    page: action.payload.page || 1,
                    pageLeads: action.payload.pageLeads || 0,
                    isFirst: action.payload.isFirst ?? true,
                    isLast: action.payload.isLast ?? true,
                    hasNext: action.payload.hasNext ?? false,
                    hasPrevious: action.payload.hasPrevious ?? false
                };
            })
            .addCase(getAllCreditManagerLeads.rejected, (state, action) => {
                state.creditLoading = false;
                state.creditError = action.payload?.message || "Something went wrong!";
            })

            .addCase(creditUpdateLead.pending, (state) => {
                state.singleLeadUpdateLoading = true;
                state.singleLeadUpdateError = null;
            })
            .addCase(creditUpdateLead.fulfilled, (state, action) => {
                state.singleLeadUpdateLoading = false;
                state.singleLeadUpdateError = null;
                if (action.payload.success) {
                    const updatedLead = action.payload.data;
                    const index = state.creditLeads.findIndex(lead => lead._id === updatedLead._id);

                    if (index !== -1) {
                        state.creditLeads[index] = updatedLead;
                    }
                }
            })
            .addCase(creditUpdateLead.rejected, (state, action) => {
                state.singleLeadUpdateLoading = false;
                state.singleLeadUpdateError = action.payload?.message || "Failed to update lead";
            })

            .addCase(getAllTelecallers.pending, (state) => {
                state.telecallersLoading = true;
                state.telecallersError = null;
            })
            .addCase(getAllTelecallers.fulfilled, (state, action) => {
                state.telecallersLoading = false;
                state.telecallersError = null;
                state.telecallers = action.payload;
            })
            .addCase(getAllTelecallers.rejected, (state, action) => {
                state.telecallersLoading = false;
                state.telecallersError = action.payload?.message || "Failed to fetch telecallers";
            })



            .addCase(getAllFollowUps.pending, (state) => {
                state.loadingFollowUps = true;
                state.followUpsError = null;
            })
            .addCase(getAllFollowUps.fulfilled, (state, action) => {
                state.loadingFollowUps = false;
                state.followUps = action.payload;
                state.currentBankId = action.meta.arg;
            })
            .addCase(getAllFollowUps.rejected, (state, action) => {
                state.loadingFollowUps = false;
                state.followUpsError = action.payload?.message || "Failed to fetch follow-ups";
            })

            .addCase(addFollowUp.pending, (state) => {
                state.addingFollowUp = true;
                state.addFollowUpError = null;
            })
            .addCase(addFollowUp.fulfilled, (state, action) => {
                state.addingFollowUp = false;
                if (action.payload.success) {
                    state.followUps.unshift(action.payload.data);
                }
            })
            .addCase(addFollowUp.rejected, (state, action) => {
                state.addingFollowUp = false;
                state.addFollowUpError = action.payload?.message || "Failed to add follow-up";
            })

            .addCase(updateFollowUp.pending, (state) => {
                state.updatingFollowUp = true;
                state.updateFollowUpError = null;
            })
            .addCase(updateFollowUp.fulfilled, (state, action) => {
                state.updatingFollowUp = false;
                if (action.payload.success) {
                    const index = state.followUps.findIndex(
                        fu => fu._id === action.payload.data._id
                    );
                    if (index !== -1) {
                        state.followUps[index] = action.payload.data;
                    }
                }
            })
            .addCase(updateFollowUp.rejected, (state, action) => {
                state.updatingFollowUp = false;
                state.updateFollowUpError = action.payload?.message || "Failed to update follow-up";
            })

            .addCase(deleteFollowUp.pending, (state) => {
                state.deletingFollowUp = true;
                state.deleteFollowUpError = null;
            })
            .addCase(deleteFollowUp.fulfilled, (state, action) => {
                state.deletingFollowUp = false;
                if (action.payload.success) {
                    state.followUps = state.followUps.filter(
                        fu => fu._id !== action.meta.arg
                    );
                }
            })
            .addCase(deleteFollowUp.rejected, (state, action) => {
                state.deletingFollowUp = false;
                state.deleteFollowUpError = action.payload?.message || "Failed to delete follow-up";
            })
    }
});

export const { resetFollowUpsState } = creditManagerSlice.actions;
export default creditManagerSlice.reducer;
