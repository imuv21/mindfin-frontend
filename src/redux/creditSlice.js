import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../helpers/Api';

export const fetchCreditManagerLeads = createAsyncThunk(
  'creditManager/fetchLeads',
  async (params, thunkAPI) => {
    try {
      const response = await api.getFilteredCreditManagerLeads(params);
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

//Fetch Single Lead (view only)
export const fetchLeadById = createAsyncThunk(
  'creditManager/fetchLeadById',
  async (id, thunkAPI) => {
    try {
      const response = await api.getALeadByID(id);
      return response.data.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

//Update a specific lead
export const updateCreditManagerLead = createAsyncThunk(
  'creditManager/updateLead',
  async ({ id, updateData }, thunkAPI) => {
    try {
      const response = await api.updateLead(id, updateData);
      return response.data.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

//Update lead status - corrected match API
export const updateLeadStatus = createAsyncThunk(
  "creditManager/updateLeadStatus",
  async ({ leadId, status }, { rejectWithValue }) => {
    try {
      const res = await api.updateLeadStatus(leadId, { status });
      console.log(res, "status res");
      return res.data.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

//Add bank details to a specific lead
export const addBankDetails = createAsyncThunk(
  'creditManager/addBankDetails',
  async (bankData, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await api.addBankDetails(bankData);
      const { creditManager } = getState();
      const currentParams = creditManager.filterOptions;
      dispatch(fetchCreditManagerLeads(currentParams));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add bank details');
    }
  }
);

const creditSlice = createSlice({
  name: 'creditManager',
  initialState: {
    leadsData: {
      leads: [],
      pagination: { currentPage: 1, totalPages: 1, leadsPerPage: 10, totalLeads: 0 }
    },
    filterOptions: { page: 1, limit: 10 },
    loading: false,
    loadingLead: false,
    error: null,
    isRefresh: false,
    selectedLead: null,
    addingBankDetails: false,
    bankOperationError: null,
  },
  reducers: {
    setFilterValues: (state, action) => {
      state.filterOptions = { ...state.filterOptions, ...action.payload };
    },
    setRefresh: (state) => {
      state.isRefresh = !state.isRefresh;
    },
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    },
    clearBankOperationError: (state) => {
      state.bankOperationError = null;
    },
    clearBankOperationStates: (state) => {
      state.addingBankDetails = false;
      state.bankOperationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Fetch All Leads
      .addCase(fetchCreditManagerLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreditManagerLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leadsData = action.payload;
      })
      .addCase(fetchCreditManagerLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle addBankDetails
      .addCase(addBankDetails.pending, (state) => {
        state.addingBankDetails = true;
        state.bankOperationError = null;
      })
      .addCase(addBankDetails.fulfilled, (state, action) => {
        state.addingBankDetails = false;
      })
      .addCase(addBankDetails.rejected, (state, action) => {
        state.addingBankDetails = false;
        state.bankOperationError = action.payload;
      })
      
      //Fetch Single Lead
      .addCase(fetchLeadById.pending, (state) => {
        state.loadingLead = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.loadingLead = false;
        state.selectedLead = action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.loadingLead = false;
        state.error = action.payload;
      })

      //Update Lead
      .addCase(updateCreditManagerLead.pending, (state) => {
        state.loadingLead = true;
        state.error = null;
      })
      .addCase(updateCreditManagerLead.fulfilled, (state, action) => {
        state.loadingLead = false;

        console.log("UPDATE FULFILLED PAYLOAD:", action.payload);
        console.log("CURRENT LEADS BEFORE UPDATE:", state.leadsData.leads);

        if (action.payload) {
          state.selectedLead = action.payload;
          const leadsArray = state.leadsData?.data?.data || state.leadsData?.data || state.leadsData?.leads || [];

          if (Array.isArray(leadsArray)) {
            const index = leadsArray.findIndex(
              (lead) => lead._id === action.payload._id
            );
            console.log("FOUND INDEX:", index);

            if (index !== -1) {
              leadsArray[index] = action.payload;
            }
          }
        }
      })
      .addCase(updateCreditManagerLead.rejected, (state, action) => {
        state.loadingLead = false;
        state.error = action.payload;
      })

      //Update Lead Status
      .addCase(updateLeadStatus.pending, (state) => {
      })

      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        const updatedLead = action.payload;
        const leadsArray = state.leadsData?.data?.data || state.leadsData?.data || state.leadsData?.leads || [];

        if (Array.isArray(leadsArray)) {
          const index = leadsArray.findIndex(
            (lead) => lead._id === updatedLead._id
          );
          if (index !== -1) {
            const existingLead = leadsArray[index];
            const mergedLead = {
              ...existingLead,
              ...updatedLead,
              loanType: updatedLead.loanType || existingLead.loanType,
              loanName: updatedLead.loanName || existingLead.loanName
            };

            leadsArray[index] = mergedLead;
          }
        }
      })
      .addCase(updateLeadStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setFilterValues, setRefresh, clearSelectedLead, clearBankOperationError, clearBankOperationStates } = creditManagerSlice.actions;
export default creditSlice.reducer;
