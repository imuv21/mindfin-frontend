import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../helpers/Api";
import { handleApiError } from '@/components/utils';


export const getAllTelecallerLeads = createAsyncThunk(
    'telecaller/getAllTelecallerLeads',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.getAllTelecallerLeads(params);
            console.log(response?.data?.data, "this is lead >> ");
            return response?.data?.data;

        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const getSingleLead = createAsyncThunk(
    'telecaller/getSingleLead',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.getALead(id);
            return response.data.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const updateLead = createAsyncThunk(
    'telecaller/updateLead',
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await api.updateTeleLead(id, updatedData);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const deleteLeadThunk = createAsyncThunk(
    'telecaller/deleteLeadThunk',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.deleteALead(id);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);


export const createLeadHistory = createAsyncThunk(
    'telecaller/createLeadHistory',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.addHistory(data);
            return {
                leadHistory: response.data.data.leadHistory,
                updatedLead: response.data.data.lead
            };
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const getLeadHistories = createAsyncThunk(
    'telecaller/getLeadHistories',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.getHistory(id);
            return response.data.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const updateLeadHistory = createAsyncThunk(
    'telecaller/updateLeadHistory',
    async ({ id, updateData }, { rejectWithValue }) => {
        try {
            const response = await api.updateHistory(id, updateData);
            return {
                updatedHistory: response.data.data.updatedHistory,
                updatedLead: response.data.data.updatedLead
            };
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const deleteLeadHistory = createAsyncThunk(
    'telecaller/deleteLeadHistory',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.deleteHistory(id);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);


export const getAllCreditManagers = createAsyncThunk(
    'telecaller/getAllCreditManagers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.getAllCreditMangers();
            return response.data.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const assignCreditManagerToLead = createAsyncThunk(
    'telecaller/assignCreditManagerToLead',
    async ({ leadId, creditManagerId }, { rejectWithValue }) => {
        try {
            const response = await api.assignCreditManger({
                leadId,
                creditManger: creditManagerId
            });
            return response.data.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);


const initialState = {

    teleLoading: false,
    teleError: null,
    leads: [],
    pagination: {
        total: 0,
        totalPages: 0,
        page: 1,
        pageLeads: 0,
        isFirst: true,
        isLast: true,
        hasNext: false,
        hasPrevious: false
    },

    currentLead: null,
    singleLeadLoading: false,
    singleLeadError: null,

    singleLeadUpdateLoading: false,
    singleLeadUpdateError: null,

    deleteDocLoading: false,
    deleteDocError: null,

    histories: [],
    historyLoading: false,
    historyError: null,

    historyAddLoading: false,
    historyAddError: null,

    historyDeleteLoading: false,
    historyDeleteError: null,

    historyUpdateLoading: false,
    historyUpdateError: null,

    creditManagers: [],
    creditManagersLoading: false,
    creditManagersError: null,

    assignmentLoading: false,
    assignmentError: null
};

const telecallerSlice = createSlice({
    name: "telecaller",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllTelecallerLeads.pending, (state) => {
                state.teleLoading = true;
                state.teleError = null;
            })
            .addCase(getAllTelecallerLeads.fulfilled, (state, action) => {
                state.teleLoading = false;
                state.teleError = null;
                state.leads = action.payload.leads || [];
                state.pagination = {
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
            .addCase(getAllTelecallerLeads.rejected, (state, action) => {
                state.teleLoading = false;
                state.teleError = action.payload?.message || "Something went wrong!";
            })

            .addCase(getSingleLead.pending, (state) => {
                state.singleLeadLoading = true;
                state.singleLeadError = null;
            })
            .addCase(getSingleLead.fulfilled, (state, action) => {
                state.singleLeadLoading = false;
                state.currentLead = action.payload;
            })
            .addCase(getSingleLead.rejected, (state, action) => {
                state.singleLeadLoading = false;
                state.singleLeadError = action.payload?.message || "Something went wrong!";
            })

            .addCase(updateLead.pending, (state) => {
                state.singleLeadUpdateLoading = true;
                state.singleLeadUpdateError = null;
            })
            .addCase(updateLead.fulfilled, (state, action) => {
                state.singleLeadUpdateLoading = false;
                state.singleLeadUpdateError = null;
                if (state.currentLead && state.currentLead._id === action.payload.data._id) {
                    state.currentLead = {
                        ...state.currentLead,
                        ...action.payload.data
                    };
                }
            })
            .addCase(updateLead.rejected, (state, action) => {
                state.singleLeadUpdateLoading = false;
                state.singleLeadUpdateError = action.payload?.message || "Failed to update lead";
            })

            .addCase(deleteLeadThunk.pending, (state) => {
                state.deleteDocLoading = true;
                state.deleteDocError = null;
            })
            .addCase(deleteLeadThunk.fulfilled, (state) => {
                state.deleteDocLoading = false;
                state.deleteDocError = null;
            })
            .addCase(deleteLeadThunk.rejected, (state, action) => {
                state.deleteDocLoading = false;
                state.deleteDocError = action.payload?.message || "Failed to update lead";
            })

            .addCase(createLeadHistory.pending, (state) => {
                state.historyAddLoading = true;
                state.historyAddError = null;
            })
            .addCase(createLeadHistory.fulfilled, (state, action) => {
                state.historyAddLoading = false;
                state.historyAddError = null;
                state.histories.unshift(action.payload.leadHistory);
                if (state.currentLead &&
                    state.currentLead._id === action.payload.leadHistory.lead) {
                    state.currentLead.status = action.payload.updatedLead.status;
                }
            })
            .addCase(createLeadHistory.rejected, (state, action) => {
                state.historyAddLoading = false;
                state.historyAddError = action.payload?.message;
            })

            .addCase(getLeadHistories.pending, (state) => {
                state.historyLoading = true;
                state.historyError = null;
            })
            .addCase(getLeadHistories.fulfilled, (state, action) => {
                state.historyLoading = false;
                state.histories = action.payload;
            })
            .addCase(getLeadHistories.rejected, (state, action) => {
                state.historyLoading = false;
                state.historyError = action.payload?.message;
            })

            .addCase(updateLeadHistory.pending, (state) => {
                state.historyUpdateLoading = true;
                state.historyUpdateError = null;
            })
            .addCase(updateLeadHistory.fulfilled, (state, action) => {
                state.historyUpdateLoading = false;
                state.historyUpdateError = null;
                const { updatedHistory, updatedLead } = action.payload;
                state.histories = state.histories.map(history =>
                    history._id === updatedHistory._id ? updatedHistory : history
                );
                if (state.currentLead &&
                    state.currentLead._id === updatedHistory.lead) {
                    state.currentLead.status = updatedLead.status;
                }
            })
            .addCase(updateLeadHistory.rejected, (state, action) => {
                state.historyUpdateLoading = false;
                state.historyUpdateError = action.payload?.message;
            })

            .addCase(deleteLeadHistory.pending, (state) => {
                state.historyDeleteLoading = true;
                state.historyDeleteError = null;
            })
            .addCase(deleteLeadHistory.fulfilled, (state, action) => {
                state.historyDeleteLoading = false;
                state.historyDeleteError = null;

                const deletedId = action.payload.data.deletedId;
                state.histories = state.histories.filter(
                    history => history._id !== deletedId
                );
            })
            .addCase(deleteLeadHistory.rejected, (state, action) => {
                state.historyDeleteLoading = false;
                state.historyDeleteError = action.payload?.message;
            })

            .addCase(getAllCreditManagers.pending, (state) => {
                state.creditManagersLoading = true;
                state.creditManagersError = null;
            })
            .addCase(getAllCreditManagers.fulfilled, (state, action) => {
                state.creditManagersLoading = false;
                state.creditManagersError = null;
                state.creditManagers = action.payload;
            })
            .addCase(getAllCreditManagers.rejected, (state, action) => {
                state.creditManagersLoading = false;
                state.creditManagersError = action.payload?.message;
            })

            .addCase(assignCreditManagerToLead.pending, (state) => {
                state.assignmentLoading = true;
                state.assignmentError = null;
            })
            .addCase(assignCreditManagerToLead.fulfilled, (state, action) => {
                state.assignmentLoading = false;
                state.assignmentError = null;
                state.leads = state.leads.map(lead =>
                    lead._id === action.payload._id ? action.payload : lead
                );
                if (state.currentLead && state.currentLead._id === action.payload._id) {
                    state.currentLead = action.payload;
                }
                if (state.currentPreviewLead && state.currentPreviewLead._id === action.payload._id) {
                    state.currentPreviewLead = action.payload;
                }
            })
            .addCase(assignCreditManagerToLead.rejected, (state, action) => {
                state.assignmentLoading = false;
                state.assignmentError = action.payload?.message;
            })
    }
});

export default telecallerSlice.reducer;