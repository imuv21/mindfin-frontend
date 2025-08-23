import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../helpers/Api";
import { handleApiError } from '@/components/utils';


export const getAllDataEntryLeads = createAsyncThunk(
    'dataEntry/getAllDataEntryLeads',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.getAllDataEntryLeads(params);
            return response.data.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const getADataEntryLead = createAsyncThunk(
    'dataEntry/getADataEntryLead',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.getADataEntryLead(id);
            return response.data.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const addDataEntryLeads = createAsyncThunk(
    'dataEntry/addDataEntryLeads',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.addDataEntryLeads(data);
            return response.data.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const updateDataEntryLead = createAsyncThunk(
    'dataEntry/updateDataEntryLead',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.updateDataEntryLead(id, data);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const deleteDataEntryLead = createAsyncThunk(
    'dataEntry/deleteDataEntryLead',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.deleteDataEntryLead(id);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);



const initialState = {

    dataEntryLeadLoading: false,
    dataEntryLeadError: null,
    dataEntryLeads: [],
    dataEntryLeadPagination: {
        total: 0,
        totalPages: 0,
        page: 1,
        pageLeads: 0,
        isFirst: true,
        isLast: true,
        hasNext: false,
        hasPrevious: false
    },

    dataEntrySingleLead: null,
    dataEntrySingleLeadLoading: false,
    dataEntrySingleLeadError: null,

    addDataEntryLeadsLoading: false,
    addDataEntryLeadsError: null,
    insertedLeads: [],
    duplicateLeads: [],
    hasDuplicates: false,

    updateDataEntryLeadLoading: false,
    updateDataEntryLeadError: null,
    updateDataEntryLeadMessage: null,

    deleteDataEntryLeadLoading: false,
    deleteDataEntryLeadError: null,
    deleteDataEntryLeadMessage: null,


};

const dataEntrySlice = createSlice({
    name: "dataEntry",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllDataEntryLeads.pending, (state) => {
                state.dataEntryLeadLoading = true;
                state.dataEntryLeadError = null;
            })
            .addCase(getAllDataEntryLeads.fulfilled, (state, action) => {
                state.dataEntryLeadLoading = false;
                state.dataEntryLeads = action.payload.leads;
                state.dataEntryLeadPagination = {
                    total: action.payload.total,
                    totalPages: action.payload.totalPages,
                    page: action.payload.page,
                    pageLeads: action.payload.pageLeads,
                    isFirst: action.payload.isFirst,
                    isLast: action.payload.isLast,
                    hasNext: action.payload.hasNext,
                    hasPrevious: action.payload.hasPrevious
                };
            })
            .addCase(getAllDataEntryLeads.rejected, (state, action) => {
                state.dataEntryLeadLoading = false;
                state.dataEntryLeadError = action.payload || "Something went wrong";
            })

            .addCase(getADataEntryLead.pending, (state) => {
                state.dataEntrySingleLeadLoading = true;
                state.dataEntrySingleLeadError = null;
            })
            .addCase(getADataEntryLead.fulfilled, (state, action) => {
                state.dataEntrySingleLeadLoading = false;
                state.dataEntrySingleLead = action.payload;
            })
            .addCase(getADataEntryLead.rejected, (state, action) => {
                state.dataEntrySingleLeadLoading = false;
                state.dataEntrySingleLeadError = action.payload || "Something went wrong";
            })

            .addCase(addDataEntryLeads.pending, (state) => {
                state.addDataEntryLeadsLoading = true;
                state.addDataEntryLeadsError = null;
            })
            .addCase(addDataEntryLeads.fulfilled, (state, action) => {
                state.addDataEntryLeadsLoading = false;
                state.addDataEntryLeadsError = null;

                state.insertedLeads = action.payload.insertedLeads || [];
                state.duplicateLeads = action.payload.duplicateLeads || [];
                state.hasDuplicates = action.payload.hasDuplicates || false;
            })
            .addCase(addDataEntryLeads.rejected, (state, action) => {
                state.addDataEntryLeadsLoading = false;
                state.addDataEntryLeadsError = action.payload || "Something went wrong";
            })

            .addCase(updateDataEntryLead.pending, (state) => {
                state.updateDataEntryLeadLoading = true;
                state.updateDataEntryLeadError = null;
                state.updateDataEntryLeadMessage = null;
            })
            .addCase(updateDataEntryLead.fulfilled, (state, action) => {
                state.updateDataEntryLeadLoading = false;
                state.updateDataEntryLeadMessage = action.payload.message || "Lead updated successfully";
                state.dataEntrySingleLead = action.payload.data;
            })
            .addCase(updateDataEntryLead.rejected, (state, action) => {
                state.updateDataEntryLeadLoading = false;
                state.updateDataEntryLeadError = action.payload || "Something went wrong";
            })

            .addCase(deleteDataEntryLead.pending, (state) => {
                state.deleteDataEntryLeadLoading = true;
                state.deleteDataEntryLeadError = null;
                state.deleteDataEntryLeadMessage = null;
            })
            .addCase(deleteDataEntryLead.fulfilled, (state) => {
                state.deleteDataEntryLeadLoading = false;
                state.deleteDataEntryLeadError = null;
                state.deleteDataEntryLeadMessage = "Lead deleted successfully";
            })
            .addCase(deleteDataEntryLead.rejected, (state, action) => {
                state.deleteDataEntryLeadLoading = false;
                state.deleteDataEntryLeadError = action.payload || "Something went wrong";
            });


    }
});

export default dataEntrySlice.reducer;