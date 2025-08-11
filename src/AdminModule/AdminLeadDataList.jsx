import React, { useState, useEffect } from 'react';
import {
  styled,
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Checkbox, IconButton, Typography,
  Dialog, DialogContent, DialogActions, Button
} from '@mui/material';
import { Edit, Delete, Visibility, Warning } from '@mui/icons-material';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import Filterbar from '../AdminModule/Components/Filterbar';
import CustomPagination from '../AdminModule/Components/Pagination';
import AssignTelecallerModal from '../AdminModule/AssignTeleModal';
import DuplicateModal from '../AdminModule/DuplicateModal'; 
import { useNavigate } from 'react-router-dom';
import api from '../helpers/Api';

const StyledTableRow = styled(TableRow)(() => ({
  height: 44,
  lineHeight: '44px',
  fontSize: '14px',
  color: '#363636',
  borderBottom: 'none'
}));

const StyledTableCell = styled(TableCell)(() => ({
  padding: 0,
  height: 44,
  lineHeight: '44px',
  fontSize: '14px',
  color: "#818181",
}));

export default function AdminLeadDataList() {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Duplicate detection states
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateLeads, setDuplicateLeads] = useState([]);
  const [duplicateCount, setDuplicateCount] = useState(0);
  
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLeads: 0,
    leadsPerPage: 10
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    representative: '',
    telecaller: ''
  });

  // Function to detect duplicates by email and phone
  const detectDuplicates = (leadsData) => {
    const emailMap = new Map();
    const phoneMap = new Map();
    const duplicates = new Set();

    leadsData.forEach((lead, index) => {
      // Check for duplicate emails
      if (lead.email && lead.email.trim()) {
        const email = lead.email.toLowerCase().trim();
        if (emailMap.has(email)) {
          duplicates.add(emailMap.get(email));
          duplicates.add(index);
        } else {
          emailMap.set(email, index);
        }
      }

      // Check for duplicate phones
      if (lead.phone && lead.phone.trim()) {
        const phone = lead.phone.trim();
        if (phoneMap.has(phone)) {
          duplicates.add(phoneMap.get(phone));
          duplicates.add(index);
        } else {
          phoneMap.set(phone, index);
        }
      }

      // Check for duplicate alternative phones
      if (lead.alternativePhone && lead.alternativePhone.trim()) {
        const altPhone = lead.alternativePhone.trim();
        if (phoneMap.has(altPhone)) {
          duplicates.add(phoneMap.get(altPhone));
          duplicates.add(index);
        } else {
          phoneMap.set(altPhone, index);
        }
      }
    });

    const duplicateLeadsArray = Array.from(duplicates).map(index => ({
      ...leadsData[index],
      duplicateIndex: index
    }));

    return {
      duplicates: duplicateLeadsArray,
      count: duplicates.size
    };
  };

  const fetchLeads = async (currentPage = page, limit = rowsPerPage, currentFilters = filters) => {
    try {
      setIsLoading(true);
      
      // Build query string with filters
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(currentFilters.search && { search: currentFilters.search }),
        ...(currentFilters.date && { date: currentFilters.date }),
        ...(currentFilters.representative && { representative: currentFilters.representative }),
        ...(currentFilters.telecaller && { telecaller: currentFilters.telecaller })
      });

      const { data, status } = await api.getAllLeads(queryParams.toString());
      if (status === 200) {
        const leadsData = data?.data?.leads || [];
        setLeads(leadsData);
        setPagination(data?.data?.pagination || {
          currentPage: currentPage,
          totalPages: 1,
          totalLeads: 0,
          leadsPerPage: limit
        });

        // Detect duplicates in the current page data
        const { duplicates, count } = detectDuplicates(leadsData);
        setDuplicateLeads(duplicates);
        setDuplicateCount(count);

        // Show duplicate modal if duplicates are found
        if (count > 0) {
          setShowDuplicateModal(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch leads", error);
      setLeads([]);
      setDuplicateLeads([]);
      setDuplicateCount(0);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalLeads: 0,
        leadsPerPage: rowsPerPage
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes from Filterbar
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
    setSelected([]); // Clear selections
    fetchLeads(1, rowsPerPage, newFilters);
  };

  useEffect(() => {
    fetchLeads(page, rowsPerPage, filters);
  }, [page, rowsPerPage]);

  const handleSelectAll = (event) => {
    const currentPageLeadIds = leads.map((row) => row._id);
    setSelected(event.target.checked ? currentPageLeadIds : []);
  };

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    setSelected([]); // Clear selections when changing page
  };

  const handleRowsPerPageChange = (newRows) => {
    setRowsPerPage(newRows);
    setPage(1); // Reset to first page
    setSelected([]); // Clear selections
  };

  const handleOpenModal = (id) => {
    setSelectedLeadId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLeadId(null);
  };

  const handleAssignTelecaller = () => {
    fetchLeads(page, rowsPerPage, filters); // Refresh current page after assignment
  };

  // Delete functionality
  const handleDeleteClick = (lead) => {
    setLeadToDelete(lead);
    setShowDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setLeadToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;

    try {
      setIsDeleting(true);
      const { status } = await api.deleteALead(leadToDelete._id);

      if (status === 200) {
        // Remove from selected if it was selected
        setSelected(prev => prev.filter(id => id !== leadToDelete._id));

        // Refresh the current page data
        await fetchLeads(page, rowsPerPage, filters);

        // If current page becomes empty after deletion, go to previous page
        const newTotalPages = Math.ceil((pagination.totalLeads - 1) / rowsPerPage);
        if (page > newTotalPages && newTotalPages > 0) {
          setPage(newTotalPages);
        }

        console.log('Lead deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete lead:', error);
      // You can add a toast notification or error message here
    } finally {
      setIsDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  // Handle duplicate modal close
  const handleCloseDuplicateModal = () => {
    setShowDuplicateModal(false);
  };

  // Function to check if a lead is duplicate
  const isDuplicateLead = (leadId) => {
    return duplicateLeads.some(duplicate => duplicate._id === leadId);
  };

  // Helper function to highlight search terms in lead names
  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} style={{ backgroundColor: '#ffeb3b', fontWeight: 'bold' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <MainLayout>
      <ProfileHeader name='Leads Data' />
      <Box p={2}>
        <Filterbar onFiltersChange={handleFiltersChange} />

        {/* Duplicate Warning Banner */}
        {duplicateCount > 0 && (
          <Box
            sx={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: 1,
              padding: 2,
              marginTop: 2,
              marginBottom: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Warning color="warning" />
            <Typography variant="body2" sx={{ color: '#856404' }}>
              <strong>Warning:</strong> {duplicateCount} duplicate lead(s) detected on this page based on email/phone number.
              <Button 
                size="small" 
                onClick={() => setShowDuplicateModal(true)}
                sx={{ ml: 1, textTransform: 'none' }}
              >
                View Details
              </Button>
            </Typography>
          </Box>
        )}

        <TableContainer elevation={1} sx={{ borderRadius: 2, marginTop: "20px", background: "white", padding: '10px' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1400 }}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell padding="checkbox" sx={{ border: 'none', background: "#F8FAFC" }}>
                    <Checkbox
                      checked={selected.length === leads.length && leads.length > 0}
                      onChange={handleSelectAll}
                      indeterminate={selected.length > 0 && selected.length < leads.length}
                    />
                  </StyledTableCell>
                  {['Lead Name', 'Phone Number', 'Alternate Number', 'Gmail', 'Location', 'Loan Amount', 'Loan Type', 'Lead Created Date', 'Representatives', 'Assign Telecaller', 'Option'].map((label) => (
                    <StyledTableCell key={label} sx={{ fontWeight: 600, color: "#363636", border: 'none', background: "#F8FAFC" }}>
                      {label}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <StyledTableRow>
                    <StyledTableCell colSpan={12} sx={{ textAlign: 'center', padding: '20px' }}>
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <Typography>Loading leads...</Typography>
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                ) : leads.length === 0 ? (
                  <StyledTableRow>
                    <StyledTableCell colSpan={12} sx={{ textAlign: 'center', padding: '20px' }}>
                      <Typography>
                        {filters.search || filters.date || filters.representative || filters.telecaller 
                          ? 'No leads found matching your filters' 
                          : 'No leads found'
                        }
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                ) : (
                  leads.map((row) => (
                    <StyledTableRow 
                      key={row._id}
                      sx={{
                        backgroundColor: isDuplicateLead(row._id) ? '#ffebee' : 'transparent',
                        border: isDuplicateLead(row._id) ? '2px solid #f44336' : 'none'
                      }}
                    >
                      <StyledTableCell padding="checkbox">
                        <Box display="flex" alignItems="center">
                          <Checkbox
                            checked={selected.includes(row._id)}
                            onChange={() => handleSelectRow(row._id)}
                          />
                          {isDuplicateLead(row._id) && (
                            <Warning 
                              fontSize="small" 
                              sx={{ color: '#f44336', ml: 1 }} 
                              titleAccess="Duplicate Lead"
                            />
                          )}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.leadName ? highlightSearchTerm(row.leadName, filters.search) : '-'}
                      </StyledTableCell>
                      <StyledTableCell>{row.phone || '-'}</StyledTableCell>
                      <StyledTableCell>{row.alternativePhone || '-'}</StyledTableCell>
                      <StyledTableCell>{row.email || '-'}</StyledTableCell>
                      <StyledTableCell>{row.location || '-'}</StyledTableCell>
                      <StyledTableCell>{row.loanAmount || '-'}</StyledTableCell>
                      <StyledTableCell>{row.loanType?.loanName || '-'}</StyledTableCell>
                      <StyledTableCell>{row.LeadCreatedDate ? new Date(row.LeadCreatedDate).toLocaleDateString() : '-'}</StyledTableCell>
                      <StyledTableCell>{row.assignedTo || '-'}</StyledTableCell>
                      <StyledTableCell>
                        <button
                          className="text-blue-600 font-semibold underline"
                          onClick={() => handleOpenModal(row._id)}
                        >
                          Assign
                        </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <IconButton onClick={() => navigate(`/adminViewDataList/${row._id}`)}>
                          <Visibility fontSize="small" />
                        </IconButton>

                        <IconButton onClick={() => navigate(`/adminEditDataList/${row._id}`)}>
                          <Edit fontSize="small" />
                        </IconButton>

                        <IconButton onClick={() => handleDeleteClick(row)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>

          <CustomPagination
            page={page}
            count={pagination.totalPages}
            rowsPerPage={rowsPerPage}
            onChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </TableContainer>

        {/* Show pagination info with filter status */}
        <Box sx={{ mt: 1, color: '#666', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">
            Showing {((page - 1) * rowsPerPage) + 1} to {Math.min(page * rowsPerPage, pagination.totalLeads)} of {pagination.totalLeads} leads
            {(filters.search || filters.date || filters.representative || filters.telecaller) && (
              <span style={{ fontStyle: 'italic' }}> (filtered)</span>
            )}
            {/* {duplicateCount > 0 && (
              <span style={{ color: '#f44336', fontWeight: 'bold' }}> - {duplicateCount} duplicates found</span>
            )} */}
          </Typography>
          
          {/* Active filters display */}
          {(filters.search || filters.date || filters.representative || filters.telecaller) && (
            <Box display="flex" gap={1} flexWrap="wrap">
              {filters.search && (
                <Typography variant="caption" sx={{ bgcolor: '#e3f2fd', px: 1, py: 0.5, borderRadius: 1 }}>
                  Search: "{filters.search}"
                </Typography>
              )}
              {filters.date && (
                <Typography variant="caption" sx={{ bgcolor: '#e8f5e8', px: 1, py: 0.5, borderRadius: 1 }}>
                  Date: {filters.date}
                </Typography>
              )}
              {filters.representative && (
                <Typography variant="caption" sx={{ bgcolor: '#fff3e0', px: 1, py: 0.5, borderRadius: 1 }}>
                  Rep: {filters.representative}
                </Typography>
              )}
              {filters.telecaller && (
                <Typography variant="caption" sx={{ bgcolor: '#fce4ec', px: 1, py: 0.5, borderRadius: 1 }}>
                  Telecaller: {filters.telecaller}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Assign Modal */}
      <AssignTelecallerModal
        isOpen={showModal}
        onClose={handleCloseModal}
        leadId={selectedLeadId}
        onAssigned={handleAssignTelecaller}
      />

      {/* Duplicate Modal */}
      {showDuplicateModal && (
        <DuplicateModal 
          onClose={handleCloseDuplicateModal}
          duplicateLeads={duplicateLeads}
          duplicateCount={duplicateCount}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
      >
        <DialogContent>
          <Typography>
            Do you really want to delete this lead?
            {leadToDelete && (
              <Box mt={1} sx={{ fontWeight: 'bold' }}>
                Lead: {leadToDelete.leadName || 'Unknown'}
              </Box>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            color="inherit"
            disabled={isDeleting}
          >
            No
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}