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



export const addTopup = createAsyncThunk(
    'credit/addTopup',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.addTopup(data);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const updateTopup = createAsyncThunk(
    'credit/updateTopup',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.updateTopup(id, data);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const getAllTopups = createAsyncThunk(
    'credit/getAllTopups',
    async (applicantId, { rejectWithValue }) => {
        try {
            const response = await api.getAllTopups(applicantId);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const deleteTopup = createAsyncThunk(
    'credit/deleteTopup',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.deleteTopup(id);
            return { id, ...response.data };
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);



const initialState = {

    creditLoading: false,
    creditError: null,
    creditLeads: [],
    total: 0,
    totalPages: 0,
    page: 1,
    pageLeads: 0,
    isFirst: true,
    isLast: true,
    hasNext: false,
    hasPrevious: false,

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
    deleteFollowUpError: null,



    topups: [],
    topupsLoading: false,
    topupsError: null,

    addTopupLoading: false,
    addTopupError: null,

    updateTopupLoading: false,
    updateTopupError: null,

    deleteTopupLoading: false,
    deleteTopupError: null

};

const creditManagerSlice = createSlice({
    name: "credit",
    initialState,
    reducers: {
        resetFollowUpsState: (state) => {
            state.currentBankId = null;
            state.followUps = [];
        },
        resetTopupsState: (state) => {
            state.topups = [];
            state.topupsError = null;
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
                
                state.total = action.payload.total || 0;
                state.totalPages = action.payload.totalPages || 0;
                state.page = action.payload.page || 1;
                state.pageLeads = action.payload.pageLeads || 0;
                state.isFirst = action.payload.isFirst ?? true;
                state.isLast = action.payload.isLast ?? true;
                state.hasNext = action.payload.hasNext ?? false;
                state.hasPrevious = action.payload.hasPrevious ?? false;
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



            .addCase(getAllTopups.pending, (state) => {
                state.topupsLoading = true;
                state.topupsError = null;
            })
            .addCase(getAllTopups.fulfilled, (state, action) => {
                state.topupsLoading = false;
                if (action.payload.success) {
                    state.topups = action.payload.data;
                }
            })
            .addCase(getAllTopups.rejected, (state, action) => {
                state.topupsLoading = false;
                state.topupsError = action.payload?.message || "Failed to fetch topups";
            })

            .addCase(addTopup.pending, (state) => {
                state.addTopupLoading = true;
                state.addTopupError = null;
            })
            .addCase(addTopup.fulfilled, (state, action) => {
                state.addTopupLoading = false;
                if (action.payload.success) {
                    state.topups.push(action.payload.data);
                }
            })
            .addCase(addTopup.rejected, (state, action) => {
                state.addTopupLoading = false;
                state.addTopupError = action.payload?.message || "Failed to add topup";
            })

            .addCase(updateTopup.pending, (state) => {
                state.updateTopupLoading = true;
                state.updateTopupError = null;
            })
            .addCase(updateTopup.fulfilled, (state, action) => {
                state.updateTopupLoading = false;
                if (action.payload.success) {
                    const index = state.topups.findIndex(topup => topup._id === action.payload.data._id);
                    if (index !== -1) {
                        state.topups[index] = action.payload.data;
                    }
                }
            })
            .addCase(updateTopup.rejected, (state, action) => {
                state.updateTopupLoading = false;
                state.updateTopupError = action.payload?.message || "Failed to update topup";
            })

            .addCase(deleteTopup.pending, (state) => {
                state.deleteTopupLoading = true;
                state.deleteTopupError = null;
            })
            .addCase(deleteTopup.fulfilled, (state, action) => {
                state.deleteTopupLoading = false;
                if (action.payload.success) {
                    state.topups = state.topups.filter(topup => topup._id !== action.payload.id);
                }
            })
            .addCase(deleteTopup.rejected, (state, action) => {
                state.deleteTopupLoading = false;
                state.deleteTopupError = action.payload?.message || "Failed to delete topup";
            })

    }
});

export const { resetFollowUpsState, resetTopupsState } = creditManagerSlice.actions;
export default creditManagerSlice.reducer;
