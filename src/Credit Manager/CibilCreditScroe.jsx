
import React, { useEffect, useState } from 'react';
import {
    styled,
    Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Checkbox, IconButton, Typography,
    CircularProgress, Select, MenuItem
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import TelecalelrSection from './components/TelecallersSection';
import Filterbar from './components/Filterbar';
import CustomPagination from './components/Pagination';
import DeleteModal from '@/components/employee/DeleteModal';
import Toastify from '../helpers/Toastify';
import api from '../helpers/Api';
import { fetchCreditManagerLeads, setFilterValues, setRefresh, updateLeadStatus } from '../redux/creditSlice';

const StyledTableRow = styled(TableRow)(() => ({
    height: 44,
    lineHeight: '44px',
    fontSize: '14px',
    color: '#363636'
}));

const StyledTableCell = styled(TableCell)(() => ({
    padding: 0,
    height: 44,
    lineHeight: '44px',
    fontSize: '14px',
    color: "#818181",
}));

export default function CibilCreditScroe() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { leadsData, filterOptions, loading, error, isRefresh } = useSelector(
        (state) => state.creditManager
    );

    const [selected, setSelected] = useState([]);
    const [leadId, setLeadId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [opendeleteModal, setOpenDeleteModal] = useState(false);
    const [localCibilScores, setLocalCibilScores] = useState({});

    // Load local scores from localStorage on mount
    useEffect(() => {
        const savedScores = JSON.parse(localStorage.getItem('localCibilScores') || '{}');
        setLocalCibilScores(savedScores);
    }, []);

    // Listen for storage changes and focus (when navigating back)
    useEffect(() => {
        const handleStorageChange = () => {
            const savedScores = JSON.parse(localStorage.getItem('localCibilScores') || '{}');
            setLocalCibilScores(savedScores);
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('focus', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleStorageChange);
        };
    }, []);

    // Check updated scores when location changes
    useEffect(() => {
        const savedScores = JSON.parse(localStorage.getItem('localCibilScores') || '{}');
        if (JSON.stringify(savedScores) !== JSON.stringify(localCibilScores)) {
            setLocalCibilScores(savedScores);
        }
    }, [location?.pathname]);

    // Fetch leads - only fetch once, then filter on frontend
    useEffect(() => {
        // Only fetch if don't have data or if refresh is triggered
        if (!leadsData?.data?.data?.length || isRefresh) {
            dispatch(fetchCreditManagerLeads({ page: 1, limit: 1000 }));
        }
    }, [dispatch, isRefresh]);

    // Pagination handlers - updated for frontend filtering
    const handlePageChange = (event, newPage) => {
        dispatch(setFilterValues({ page: newPage }));
        setSelected([]);
    };

    const handleLimitChange = (newRows) => {
        dispatch(setFilterValues({ limit: newRows, page: 1 }));
        setSelected([]);
    };

    const handleSelectAll = (event) => {
        const currentPageLeadIds = (leadsData?.leads || []).map((row) => row._id);
        setSelected(event.target.checked ? currentPageLeadIds : []);
    };

    const handleSelectRow = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleDeleteLead = (id) => {
        setLeadId(id);
        setOpenDeleteModal(true);
    };

    const handleDeleteSubmit = async () => {
        try {
            setDeleteLoading(true);
            const { status } = await api.deleteALead(leadId);
            if (status === 200) {
                Toastify.success("Lead deleted successfully");
                dispatch(setRefresh());
                setOpenDeleteModal(false);

                // Remove from local storage
                const savedScores = JSON.parse(localStorage.getItem('localCibilScores') || '{}');
                delete savedScores[leadId];
                localStorage.setItem('localCibilScores', JSON.stringify(savedScores));
                setLocalCibilScores(savedScores);

                const existingHistory = JSON.parse(localStorage.getItem('cibilHistory') || '{}');
                delete existingHistory[leadId];
                localStorage.setItem('cibilHistory', JSON.stringify(existingHistory));
            }
        } catch (error) {
            Toastify.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Get all leads from API
    const allLeads = Array.isArray(leadsData?.data?.data)
        ? leadsData.data.data
        : Array.isArray(leadsData?.data)
            ? leadsData.data
            : Array.isArray(leadsData?.leads)
                ? leadsData.leads
                : [];

    // Apply frontend filtering based on filter options
    const filteredLeads = React.useMemo(() => {
        let filtered = [...allLeads];

        // Filter by status
        if (filterOptions?.status && filterOptions.status !== "") {
            filtered = filtered.filter(lead => lead.status === filterOptions.status);
        }

        // Filter by search
        if (filterOptions?.search && filterOptions.search !== "") {
            const searchTerm = filterOptions.search.toLowerCase();
            filtered = filtered.filter(lead =>
                lead.leadName?.toLowerCase().includes(searchTerm) ||
                lead.phone?.toLowerCase().includes(searchTerm) ||
                lead.email?.toLowerCase().includes(searchTerm)
            );
        }

        // Filter by date
        if (filterOptions?.date && filterOptions.date !== "") {
            const filterDate = new Date(filterOptions.date).toDateString();
            filtered = filtered.filter(lead => {
                const leadDate = new Date(lead.LeadCreatedDate).toDateString();
                return leadDate === filterDate;
            });
        }

        return filtered;
    }, [allLeads, filterOptions]);

    // Apply pagination to filtered results
    const paginatedLeads = React.useMemo(() => {
        const startIndex = (filterOptions.page - 1) * filterOptions.limit;
        const endIndex = startIndex + filterOptions.limit;
        return filteredLeads.slice(startIndex, endIndex);
    }, [filteredLeads, filterOptions.page, filterOptions.limit]);

    // Calculate pagination for filtered results
    const pagination = React.useMemo(() => ({
        currentPage: filterOptions.page,
        totalPages: Math.ceil(filteredLeads.length / filterOptions.limit),
        leadsPerPage: filterOptions.limit,
        totalLeads: filteredLeads.length
    }), [filteredLeads.length, filterOptions.page, filterOptions.limit]);

    // Use paginated leads for display
    const leads = paginatedLeads;

    console.log("Leads Data:", leadsData);
    console.log("Leads Array:", leads);

    return (
        <MainLayout>
            <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
                <ProfileHeader
                    name="CIBIL / CREDIT SCORE"
                    sx={{ fontSize: "24px", fontWeight: "bold" }}
                />
            </Box>

            <Box p={2}>
                <TelecalelrSection />
                <Filterbar />

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                        <CircularProgress />
                    </Box>
                ) : leads.length === 0 ? (
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="300px" bgcolor="#f5f5f5" borderRadius="4px" p={3}>
                        <Typography variant="h6" gutterBottom>No Leads Found</Typography>
                        <Typography variant="body1" color="textSecondary">
                            Try adjusting your filters or check back later
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <TableContainer sx={{ borderRadius: 2, mt: 2, background: "white", p: '10px' }}>
                            <Box sx={{ overflowX: 'auto' }}>
                                <Table sx={{ minWidth: 1400 }}>
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selected.length === leads.length && leads.length > 0}
                                                    indeterminate={selected.length > 0 && selected.length < leads.length}
                                                    onChange={handleSelectAll}
                                                />
                                            </StyledTableCell>
                                            {['Lead Name', 'Phone Number', 'Alternate Number', 'Gmail', 'Loan Amount', 'Loan Type', 'Cibil Score', 'Status', 'Option'].map((label) => (
                                                <StyledTableCell key={label} sx={{ fontWeight: 600, color: "#363636" }}>
                                                    {label}
                                                </StyledTableCell>
                                            ))}
                                        </StyledTableRow>
                                    </TableHead>

                                    <TableBody>
                                        {leads.map((row) => {
                                            const statusStyles = {
                                                PENDING: { bg: '#fde2e1', color: '#f44336' },
                                                INPROGRESS: { bg: '#e3f2fd', color: '#2196f3' },
                                                CLOSED: { bg: '#e8f5e9', color: '#4caf50' },
                                                DROPPED: { bg: '#fce4ec', color: '#e91e63' }
                                            };
                                            const currentStatusStyle = statusStyles[row?.status] || { bg: '#eee', color: '#555' };
                                            const displayCibilScore = localCibilScores[row._id] || row?.cibilScore;

                                            return (
                                                <StyledTableRow key={row._id}>
                                                    <StyledTableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selected.includes(row._id)}
                                                            onChange={() => handleSelectRow(row._id)}
                                                        />
                                                    </StyledTableCell>
                                                    <StyledTableCell>{row?.leadName || 'N/A'}</StyledTableCell>
                                                    <StyledTableCell>{row?.phone || 'N/A'}</StyledTableCell>
                                                    <StyledTableCell>{row?.alternativePhone || 'N/A'}</StyledTableCell>
                                                    <StyledTableCell>{row?.email || 'N/A'}</StyledTableCell>
                                                    <StyledTableCell>{row?.loanAmount || 'N/A'}</StyledTableCell>
                                                    <StyledTableCell>
                                                        {(() => {
                                                            // Store the original loan type info to prevent loss during status updates
                                                            const originalLoanType = row?.loanType?.loanName || row?.loanName;

                                                            console.log('Row data for loan type:', {
                                                                fullRow: row,
                                                                loanType: row?.loanType,
                                                                loanName: row?.loanType?.loanName,
                                                                directLoanName: row?.loanName,
                                                                originalLoanType
                                                            });

                                                            return originalLoanType || 'No loan type found';
                                                        })()}
                                                    </StyledTableCell>

                                                    <StyledTableCell>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            {displayCibilScore ? (
                                                                <>
                                                                    <Typography variant="body2" fontWeight={400} sx={{ fontSize: '14px', color: '#818181', fontStyle: 'normal' }}>
                                                                        {displayCibilScore}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{ color: '#2563EB', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', fontSize: '0.85rem' }}
                                                                        onClick={() => navigate(`/cibil-check-score/${row._id}`)}
                                                                    >
                                                                        Recheck
                                                                    </Typography>
                                                                </>
                                                            ) : (
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{ color: '#2563EB', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                                                                    onClick={() => navigate(`/cibil-check-score/${row._id}`)}
                                                                >
                                                                    Check
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </StyledTableCell>

                                                    <StyledTableCell>
                                                        {/* <Select
                              size="small"
                              value={row?.status || "PENDING"}
                              onChange={(e) => {
                                // Fixed: Pass leadId correctly and add status to payload
                                dispatch(updateLeadStatus({ leadId: row._id, status: e.target.value }))
                                  .unwrap()
                                  .then(() => Toastify.success("Status updated"))
                                  .catch((err) => Toastify.error(err));
                              }}
                              sx={{
                                fontSize: "12px",
                                fontWeight: 600,
                                bgcolor: currentStatusStyle.bg,
                                color: currentStatusStyle.color,
                                borderRadius: "12px",
                                px: 1.5,
                                py: 0.5,
                                minWidth: 120,
                                border: 'none',
                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                              }}
                            >
                              <MenuItem value="INPROGRESS">INPROGRESS</MenuItem>
                              <MenuItem value="PENDING">PENDING</MenuItem>
                              <MenuItem value="CLOSED">CLOSED</MenuItem>
                              <MenuItem value="DROPPED">DROPPED</MenuItem>
                            </Select> */}
                                                        <Select
                                                            size="small"
                                                            value={row?.status || "PENDING"}
                                                            onChange={async (e) => {
                                                                try {
                                                                    // Store original loan type before update
                                                                    const originalLoanType = row?.loanType?.loanName || row?.loanName;

                                                                    await dispatch(updateLeadStatus({
                                                                        leadId: row._id,
                                                                        status: e.target.value
                                                                    })).unwrap();

                                                                    Toastify.success("Status updated");

                                                                    // Optional: If API doesn't return proper loan type, you can update local state
                                                                    // or trigger a refresh of the specific lead

                                                                } catch (err) {
                                                                    Toastify.error(err);
                                                                }
                                                            }}
                                                            sx={{
                                                                fontSize: "12px",
                                                                fontWeight: 600,
                                                                bgcolor: currentStatusStyle.bg,
                                                                color: currentStatusStyle.color,
                                                                borderRadius: "12px",
                                                                px: 1.5,
                                                                py: 0.5,
                                                                minWidth: 120,
                                                                border: 'none',
                                                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                                                            }}
                                                        >
                                                            <MenuItem value="INPROGRESS">INPROGRESS</MenuItem>
                                                            <MenuItem value="PENDING">PENDING</MenuItem>
                                                            <MenuItem value="CLOSED">CLOSED</MenuItem>
                                                            <MenuItem value="DROPPED">DROPPED</MenuItem>
                                                        </Select>
                                                    </StyledTableCell>

                                                    <StyledTableCell>
                                                        <IconButton onClick={() => navigate(`/credit-manager-edit-lead/${row._id}`)}><Edit fontSize="small" /></IconButton>
                                                        <IconButton
                                                            onClick={() => {
                                                                navigate(`/credit-manager-view-lead/${row._id}`);
                                                            }}>
                                                            <Visibility fontSize="small" />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleDeleteLead(row._id)}><Delete fontSize="small" /></IconButton>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Box>
                        </TableContainer>

                        <DeleteModal
                            isOpen={opendeleteModal}
                            close={() => setOpenDeleteModal(false)}
                            handleSubmit={handleDeleteSubmit}
                            heading="Confirm Deletion"
                            description="Are you sure you want to delete this Lead?"
                            loading={deleteLoading}
                        />

                        <CustomPagination
                            page={pagination?.currentPage}
                            count={pagination?.totalPages}
                            rowsPerPage={pagination?.leadsPerPage}
                            onChange={handlePageChange}
                            onRowsPerPageChange={handleLimitChange}
                        />
                    </>
                )}
            </Box>
        </MainLayout>
    );
}