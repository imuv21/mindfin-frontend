import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../helpers/Api';

//Fetch Credit Manger Leads
export const fetchCreditManagerLeads = createAsyncThunk(
  'creditManager/fetchLeads',
  async (params, thunkAPI) => {
    try {
      const response = await api.getFilteredCreditManagerLeads(params);
      console.log(response, "javad test")
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

// NEW: Fetch Bank Details for a Lead
export const fetchBankDetailsByLeadId = createAsyncThunk(
  'creditManager/fetchBankDetailsByLeadId',
  async (leadId, thunkAPI) => {
    try {
      const response = await api.getAllBankDetails(leadId);
      return response.data;
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

      // Refresh bank details for the current lead
      if (bankData.leadId) {
        dispatch(fetchBankDetailsByLeadId(bankData.leadId));
      }

      const { creditManager } = getState();
      const currentParams = creditManager.filterOptions;
      dispatch(fetchCreditManagerLeads(currentParams));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add bank details');
    }
  }
);

//Fetch Bank Detail by ID
export const fetchBankDetailById = createAsyncThunk(
  'creditManager/fetchBankDetailById',
  async (bankId, { rejectWithValue }) => {
    try {
      const response = await api.getBankDetailById(bankId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bank details');
    }
  }
);

//Update Bank Detail by ID
export const updateBankDetail = createAsyncThunk(
  'creditManager/updateBankDetail',
  async ({ bankId, updateData }, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await api.updateBankDetail(bankId, updateData);

      // Refresh leads data after successful update
      const { creditManager } = getState();
      const currentParams = creditManager.filterOptions;
      dispatch(fetchCreditManagerLeads(currentParams));

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update bank details');
    }
  }
);

//Delete Bank Detail by ID
export const deleteBankDetail = createAsyncThunk(
  'creditManager/deleteBankDetail',
  async (bankId, { rejectWithValue, dispatch, getState }) => {
    try {
      // Validate bankId before making the API call
      if (!bankId) {
        throw new Error('Bank ID is required for deletion');
      }

      console.log('Redux: Attempting to delete bank detail with ID:', bankId);

      // This should match your API method: deleteBankDetail = (id) => this.init().delete(`/credit-manager/delete-bank/${id}`)
      const response = await api.deleteBankDetail(bankId);

      // Refresh leads data after successful deletion
      const { creditManager } = getState();
      const currentParams = creditManager.filterOptions;
      dispatch(fetchCreditManagerLeads(currentParams));

      return { bankId, message: response.data?.message || 'Bank details deleted successfully' };
    } catch (error) {
      console.error('Redux: Bank detail deletion error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete bank details');
    }
  }
);

export const addFollowUp = createAsyncThunk(
  'creditManager/addFollowUp',
  async (followUpData, { rejectWithValue }) => {
    try {
      console.log('Redux: Sending follow-up data:', followUpData);

      // Validate required fields before sending
      if (!followUpData.bankDetail) {
        throw new Error('Bank detail ID is required');
      }

      const response = await api.addFollowUp(followUpData);
      console.log('Redux: Follow-up API response:', response);

      return response.data;
    } catch (error) {
      console.error('Redux: Follow-up error:', error);

      // Better error message handling
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to add follow-up';

      return rejectWithValue(errorMessage);
    }
  }
);

// Get Follow-ups by Bank Detail ID
export const getFollowUpsByBankDetail = createAsyncThunk(
  'creditManager/getFollowUpsByBankDetail',
  async (bankDetailId, { rejectWithValue }) => {
    try {
      const response = await api.getFollowUpsByBankDetail(bankDetailId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch follow-ups');
    }
  }
);

// Update Follow-up by ID
export const updateFollowUp = createAsyncThunk(
  'creditManager/updateFollowUp',
  async ({ followUpId, updateData }, { rejectWithValue, dispatch, getState }) => {
    try {
      console.log('Redux: Updating follow-up with ID:', followUpId, 'Data:', updateData);

      const response = await api.updateFollowUp(followUpId, updateData);

      console.log('Redux: Follow-up update response:', response);

      // Get the current bank detail ID from state to refresh follow-ups
      const { creditManager } = getState();
      const currentBankDetail = creditManager.leadBankDetails[creditManager.activeBank || 0];

      // Refresh follow-ups for the current bank detail
      if (currentBankDetail?._id) {
        dispatch(getFollowUpsByBankDetail(currentBankDetail._id));
      }

      return response.data.data;
    } catch (error) {
      console.error('Redux: Follow-up update error:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to update follow-up';
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch Follow-up by ID
export const fetchFollowUpById = createAsyncThunk(
  'creditManager/fetchFollowUpById',
  async (followUpId, { rejectWithValue }) => {
    try {
      const response = await api.getFollowUpById(followUpId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch follow-up details');
    }
  }
);

// Delete Follow-up by ID
export const deleteFollowUp = createAsyncThunk(
  'creditManager/deleteFollowUp',
  async ({ followUpId, bankDetailId }, { rejectWithValue, dispatch }) => {
    try {
      console.log('Redux: Deleting follow-up with ID:', followUpId);

      const response = await api.deleteFollowUp(followUpId);

      console.log('Redux: Follow-up delete response:', response);

      // Refresh follow-ups for the current bank detail after successful deletion
      if (bankDetailId) {
        dispatch(getFollowUpsByBankDetail(bankDetailId));
      }

      return { followUpId, message: response.data.data?.message || response.data.message || 'Follow-up deleted successfully' };
    } catch (error) {
      console.error('Redux: Follow-up delete error:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to delete follow-up';
      return rejectWithValue(errorMessage);
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
    // NEW: Bank details for current lead
    leadBankDetails: [],
    loadingLeadBankDetails: false,
    leadBankDetailsError: null,
    addingBankDetails: false,
    bankOperationError: null,
    // New state for bank details editing
    selectedBankDetail: null,
    loadingBankDetail: false,
    updatingBankDetail: false,
    bankDetailError: null,
    // New state for bank details deletion
    deletingBankDetail: false,
    // Follow-up related states
    followUps: [],
    addingFollowUp: false,
    loadingFollowUps: false,
    followUpError: null,
    selectedFollowUpDetails: null,
    loadingFollowUpDetails: false,
    followUpDetailsError: null,
    deletingFollowUp: false,
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
      state.leadBankDetails = [];
    },
    clearBankOperationError: (state) => {
      state.bankOperationError = null;
    },
    clearBankOperationStates: (state) => {
      state.addingBankDetails = false;
      state.bankOperationError = null;
    },
    // NEW: Clear lead bank details
    clearLeadBankDetails: (state) => {
      state.leadBankDetails = [];
      state.leadBankDetailsError = null;
    },
    // New reducers for bank details editing
    clearSelectedBankDetail: (state) => {
      state.selectedBankDetail = null;
    },
    clearBankDetailError: (state) => {
      state.bankDetailError = null;
    },
    clearBankDetailStates: (state) => {
      state.selectedBankDetail = null;
      state.loadingBankDetail = false;
      state.updatingBankDetail = false;
      state.bankDetailError = null;
      state.deletingBankDetail = false;
    },
    // Follow-up reducers
    clearFollowUpError: (state) => {
      state.followUpError = null;
    },
    clearFollowUps: (state) => {
      state.followUps = [];
    },
    clearFollowUpStates: (state) => {
      state.followUps = [];
      state.addingFollowUp = false;
      state.loadingFollowUps = false;
      state.followUpError = null;
      state.updatingFollowUp = false;
    },

    clearSelectedFollowUpDetails: (state) => {
      state.selectedFollowUpDetails = null;
      state.followUpDetailsError = null;
    },
    clearFollowUpDetailsError: (state) => {
      state.followUpDetailsError = null;
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

      // NEW: Handle fetchBankDetailsByLeadId
      .addCase(fetchBankDetailsByLeadId.pending, (state) => {
        state.loadingLeadBankDetails = true;
        state.leadBankDetailsError = null;
      })
      .addCase(fetchBankDetailsByLeadId.fulfilled, (state, action) => {
        state.loadingLeadBankDetails = false;
        // Handle different possible response structures
        if (action.payload?.data) {
          state.leadBankDetails = Array.isArray(action.payload.data) ? action.payload.data : [];
        } else if (Array.isArray(action.payload)) {
          state.leadBankDetails = action.payload;
        } else {
          state.leadBankDetails = [];
        }
      })
      .addCase(fetchBankDetailsByLeadId.rejected, (state, action) => {
        state.loadingLeadBankDetails = false;
        state.leadBankDetailsError = action.payload;
        state.leadBankDetails = [];
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
      })

      // Handle fetchBankDetailById
      .addCase(fetchBankDetailById.pending, (state) => {
        state.loadingBankDetail = true;
        state.bankDetailError = null;
      })
      .addCase(fetchBankDetailById.fulfilled, (state, action) => {
        state.loadingBankDetail = false;
        state.selectedBankDetail = action.payload;
      })
      .addCase(fetchBankDetailById.rejected, (state, action) => {
        state.loadingBankDetail = false;
        state.bankDetailError = action.payload;
      })

      // Handle updateBankDetail
      .addCase(updateBankDetail.pending, (state) => {
        state.updatingBankDetail = true;
        state.bankDetailError = null;
      })
      .addCase(updateBankDetail.fulfilled, (state, action) => {
        state.updatingBankDetail = false;
        // Update the selectedBankDetail with the updated data
        state.selectedBankDetail = action.payload;
      })
      .addCase(updateBankDetail.rejected, (state, action) => {
        state.updatingBankDetail = false;
        state.bankDetailError = action.payload;
      })

      // Handle deleteBankDetail
      .addCase(deleteBankDetail.pending, (state) => {
        state.deletingBankDetail = true;
        state.bankDetailError = null;
      })
      .addCase(deleteBankDetail.fulfilled, (state, action) => {
        state.deletingBankDetail = false;
        // The leads data will be refreshed automatically by the thunk
        console.log('Bank detail deleted successfully:', action.payload.message);
      })
      .addCase(deleteBankDetail.rejected, (state, action) => {
        state.deletingBankDetail = false;
        state.bankDetailError = action.payload;
      })

      // Handle addFollowUp
      .addCase(addFollowUp.pending, (state) => {
        state.addingFollowUp = true;
        state.followUpError = null;
      })
      // In your extraReducers, find this case and replace it:
      .addCase(addFollowUp.fulfilled, (state, action) => {
        state.addingFollowUp = false;
        console.log('Redux: addFollowUp fulfilled with payload:', action.payload);

        // The new follow-up will be fetched when getFollowUpsByBankDetail is called
        // So we don't need to manually add it to the state here
        console.log('Redux: Follow-up added successfully, list will be refreshed');
      })
      .addCase(addFollowUp.rejected, (state, action) => {
        state.addingFollowUp = false;
        state.followUpError = action.payload;
        console.error('Redux: Follow-up addition failed:', action.payload);
      })

      // Handle getFollowUpsByBankDetail
      .addCase(getFollowUpsByBankDetail.pending, (state) => {
        state.loadingFollowUps = true;
        state.followUpError = null;
      })
      .addCase(getFollowUpsByBankDetail.fulfilled, (state, action) => {
        state.loadingFollowUps = false;
        console.log('Redux: getFollowUpsByBankDetail fulfilled:', action.payload);

        // Handle the response structure: { success: true, data: [...] }
        if (action.payload?.data) {
          state.followUps = Array.isArray(action.payload.data) ? action.payload.data : [];
        } else if (Array.isArray(action.payload)) {
          state.followUps = action.payload;
        } else {
          state.followUps = [];
        }

        console.log('Redux: Follow-ups set to state:', state.followUps);
      })
      .addCase(getFollowUpsByBankDetail.rejected, (state, action) => {
        state.loadingFollowUps = false;
        state.followUpError = action.payload;
      })

      // Handle updateFollowUp
      .addCase(updateFollowUp.pending, (state) => {
        state.updatingFollowUp = true;
        state.followUpError = null;
      })
      .addCase(updateFollowUp.fulfilled, (state, action) => {
        state.updatingFollowUp = false;
        console.log('Redux: Follow-up updated successfully:', action.payload);
      })
      .addCase(updateFollowUp.rejected, (state, action) => {
        state.updatingFollowUp = false;
        state.followUpError = action.payload;
        console.error('Redux: Follow-up update failed:', action.payload);
      })

      //Handle view followup data 
      .addCase(fetchFollowUpById.pending, (state) => {
        state.loadingFollowUpDetails = true;
        state.followUpDetailsError = null;
      })
      .addCase(fetchFollowUpById.fulfilled, (state, action) => {
        state.loadingFollowUpDetails = false;
        state.selectedFollowUpDetails = action.payload.data; // Extract data from response
      })
      .addCase(fetchFollowUpById.rejected, (state, action) => {
        state.loadingFollowUpDetails = false;
        state.followUpDetailsError = action.payload;
        state.selectedFollowUpDetails = null;
      })

      // Handle deleteFollowUp
      .addCase(deleteFollowUp.pending, (state) => {
        state.deletingFollowUp = true;
        state.followUpError = null;
      })
      .addCase(deleteFollowUp.fulfilled, (state, action) => {
        state.deletingFollowUp = false;
        console.log('Redux: Follow-up deleted successfully:', action.payload.message);
        // The follow-ups list will be refreshed automatically by the thunk
      })
      .addCase(deleteFollowUp.rejected, (state, action) => {
        state.deletingFollowUp = false;
        state.followUpError = action.payload;
        console.error('Redux: Follow-up deletion failed:', action.payload);
      });

  },
});

export const {
  setFilterValues,
  setRefresh,
  clearSelectedLead,
  clearBankOperationError,
  clearBankOperationStates,
  clearLeadBankDetails,
  clearSelectedBankDetail,
  clearBankDetailError,
  clearBankDetailStates,
  clearFollowUpError,
  clearFollowUps,
  clearFollowUpStates,
  clearSelectedFollowUpDetails,
  clearFollowUpDetailsError
} = creditSlice.actions;

export default creditSlice.reducer;