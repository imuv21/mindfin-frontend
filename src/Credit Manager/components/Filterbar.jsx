import React, { useEffect, useState } from "react";
import {
    styled,
    Box,
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    IconButton,
    InputAdornment
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFilterValues } from "../../redux/creditSlice";
import api from "../../helpers/Api";
import * as XLSX from "xlsx";
import { formatDate } from "../../helpers/conversion";
import Toastify from "../../helpers/Toastify";
import SearchIcon from "@mui/icons-material/Search";

// Styled Components
const StyledTextField = styled(TextField)({
    fontSize: '14px',
    '& .MuiOutlinedInput-root': {
        '& fieldset': { border: 'none' },
        '&:hover fieldset': { border: 'none' },
        '&.Mui-focused fieldset': { border: 'none' },
        backgroundColor: '#fff',
        paddingRight: 0,
    },
});

const StyledSelect = styled(Select)(() => ({
    height: 44,
    lineHeight: '44px',
    fontSize: '14px',
    '& .MuiSelect-select': {
        padding: '6px 24px 6px 0',
        backgroundColor: 'transparent',
    },
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    background: 'transparent',
}));

export default function Filterbar({ onFiltersChange }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Fixed: Get filter options from creditManager slice instead of leads slice
    const { filterOptions } = useSelector((state) => state.creditManager);

    // Get the current leads data from Redux store
    const { leadsData } = useSelector((state) => state.creditManager);

    const [date, setDate] = useState(filterOptions?.date || "");
    const [status, setStatus] = useState(filterOptions?.status || "");
    const [telecaller, setTelecaller] = useState(filterOptions?.telecaller || "");
    const [search, setSearch] = useState(filterOptions?.search || "");
    const [loading, setLoading] = useState(false);
    const [telecallerList, setTelecallerList] = useState([]);
    const [searchDebounceTimer, setSearchDebounceTimer] = useState(null);

    // Fetch telecallers for dropdown
    const fetchTelecallers = async () => {
        try {
            const { data, status } = await api.getAllTelecallers();
            if (status === 200) setTelecallerList(data?.data || []);
        } catch (error) {
            console.error("Failed to fetch telecallers", error);
            Toastify.error(error?.response?.data?.message || error.message || "Something went wrong");
        }
    };

    useEffect(() => {
        fetchTelecallers();
        return () => {
            if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
        };
    }, []);

    //Initialize state from Redux store on mount
    useEffect(() => {
        setDate(filterOptions?.date || "");
        setStatus(filterOptions?.status || "");
        setTelecaller(filterOptions?.telecaller || "");
        setSearch(filterOptions?.search || "");
    }, [filterOptions]);

    //Updated: Unified filter update function for frontend filtering
    const updateFilters = (newFilters) => {
        const filters = {
            search: newFilters.search || "",
            date: newFilters.date || "",
            status: newFilters.status || "",
            telecaller: newFilters.telecaller || "",
            page: 1,
            limit: filterOptions.limit || 10
        };

        console.log("Updating filters:", filters);
        dispatch(setFilterValues(filters));
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (searchDebounceTimer) clearTimeout(searchDebounceTimer);

        const timer = setTimeout(() => {
            updateFilters({
                search: value,
                date,
                status,
                telecaller
            });
        }, 300);

        setSearchDebounceTimer(timer);
    };

    const handleDateChange = (e) => {
        const value = e.target.value;
        setDate(value);
        updateFilters({
            search,
            date: value,
            status,
            telecaller
        });
    };

    //Renamed and updated status filter handler
    const handleStatusChange = (e) => {
        const value = e.target.value;
        setStatus(value);
        updateFilters({
            search,
            date,
            status: value,
            telecaller
        });
    };

    const handleTelecallerChange = (e) => {
        const value = e.target.value;
        setTelecaller(value);
        updateFilters({
            search,
            date,
            status,
            telecaller: value
        });
    };

    const handleClearFilters = () => {
        setSearch("");
        setDate("");
        setStatus("");
        setTelecaller("");
        updateFilters({
            search: "",
            date: "",
            status: "",
            telecaller: ""
        });
    };

    // Export Credit Manager Leads - Using filtered data
    const exportCreditManagerData = async () => {
        setLoading(true);
        try {
            // Get all leads data from Redux (unfiltered)
            const allLeads = Array.isArray(leadsData?.data?.data) ? leadsData.data.data : [];

            // Apply same filters as in main component
            let filtered = [...allLeads];

            if (filterOptions?.status && filterOptions.status !== "") {
                filtered = filtered.filter(lead => lead.status === filterOptions.status);
            }

            if (filterOptions?.search && filterOptions.search !== "") {
                const searchTerm = filterOptions.search.toLowerCase();
                filtered = filtered.filter(lead =>
                    lead.leadName?.toLowerCase().includes(searchTerm) ||
                    lead.phone?.toLowerCase().includes(searchTerm) ||
                    lead.email?.toLowerCase().includes(searchTerm)
                );
            }

            if (filterOptions?.date && filterOptions.date !== "") {
                const filterDate = new Date(filterOptions.date).toDateString();
                filtered = filtered.filter(lead => {
                    const leadDate = new Date(lead.LeadCreatedDate).toDateString();
                    return leadDate === filterDate;
                });
            }

            console.log("Exporting filtered leads data:", filtered);

            if (filtered.length === 0) {
                Toastify.error("No data available to export with current filters");
                setLoading(false);
                return;
            }

            const excelData = filtered.map(item => ({
                'Lead Name': item?.leadName || "_",
                'Phone': item?.phone || "_",
                'Alternative Phone': item?.alternativePhone || "_",
                'Email': item?.email || "_",
                'Location': item?.location || "_",
                'Loan Type': item?.loanType?.loanName || "_",
                'Loan Amount': item?.loanAmount || "_",
                'Lead Created Date': formatDate(item?.LeadCreatedDate) || "_",
                'Assigned To': item?.assignedTo?.firstName && item?.assignedTo?.lastName
                    ? `${item.assignedTo.firstName} ${item.assignedTo.lastName}`
                    : item?.assignedTo?.name || "_",
                'Status': item?.status || "_",
                'Credit Manager': item?.creditManger?.firstName && item?.creditManger?.lastName
                    ? `${item.creditManger.firstName} ${item.creditManger.lastName}`
                    : "_",
                'Branch': item?.branch?.name || "_",
                'PAN Card': item?.panCard || "_"
            }));

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'CreditManager Leads');

            // Auto-size columns
            const colCount = Object.keys(excelData[0] || {}).length;
            worksheet['!cols'] = Array(colCount).fill({ width: 20 });

            XLSX.writeFile(workbook, `CreditManager_Leads_Filtered_${new Date().toISOString().split('T')[0]}.xlsx`);
            Toastify.success("Filtered data exported successfully!");

        } catch (error) {
            console.error("Export error:", error);
            Toastify.error("Export failed");
        } finally {
            setLoading(false);
        }
    };

    // Alternative method: Export ALL data with current filters
    const exportAllFilteredData = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                search: search || "",
                date: date || "",
                teleCaller: telecaller || "",
                status: status || "",
                limit: 1000,
                page: 1
            }).toString();

            const { data, status: responseStatus } = await api.exportCreditManagerLeads(query);

            if (responseStatus === 200) {
                const leads = data?.data?.data || [];
                console.log("All filtered leads:", leads);

                if (leads.length === 0) {
                    Toastify.error("No data found with current filters");
                    return;
                }

                const excelData = leads.map(item => ({
                    'Lead Name': item?.leadName || "_",
                    'Phone': item?.phone || "_",
                    'Alternative Phone': item?.alternativePhone || "_",
                    'Email': item?.email || "_",
                    'Location': item?.location || "_",
                    'Loan Type': item?.loanType?.loanName || "_",
                    'Loan Amount': item?.loanAmount || "_",
                    'Lead Created Date': formatDate(item?.LeadCreatedDate) || "_",
                    'Assigned To': item?.assignedTo?.name || "_",
                    'Status': item?.status || "_"
                }));

                const worksheet = XLSX.utils.json_to_sheet(excelData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'CreditManager Leads');

                worksheet['!cols'] = Array(Object.keys(excelData[0] || {}).length).fill({ width: 20 });

                XLSX.writeFile(workbook, `CreditManager_Leads_${new Date().toISOString().split('T')[0]}.xlsx`);
                Toastify.success("Data exported successfully!");
            }
        } catch (error) {
            console.error("Export error:", error);
            Toastify.error(error?.response?.data?.message || "Export failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between"
            bgcolor="#fff" sx={{ borderRadius: '12px', padding: '10px', gap: 2, rowGap: 2, flexDirection: { xs: 'column', sm: 'row' } }}
        >
            {/* Left side filters */}
            <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}
                sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-start' } }}
            >
                <IconButton onClick={handleClearFilters} title="Clear all filters">
                    {/* Clear Icon */}
                    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                        <path d="M10.75 6.55C16.13 6.55 20.5 5.25 20.5 3.66C20.5 2.06 16.13 0.77 10.75 0.77C5.36 0.77 1 2.06 1 3.66C1 5.25 5.36 6.55 10.75 6.55Z" stroke="black" strokeWidth="1.5" />
                        <path d="M1 3.66C1 5.61 2.4 7.4 4.67 8.56C6.73 9.61 8.5 11.47 8.5 13.79C8.5 14.59 9.51 15.23 10.75 15.23C11.99 15.23 13 14.59 13 13.79C13 11.47 14.77 9.61 16.83 8.56C19.09 7.4 20.5 5.61 20.5 3.66" stroke="black" strokeWidth="1.5" />
                    </svg>
                </IconButton>

                <StyledTextField
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    size="small"
                    sx={{ width: { xs: '100%', sm: 160 } }}
                />

                {/*Updated Status Dropdown - This will now filter the leads dynamically*/}
                <FormControl variant="standard" sx={{ minWidth: { xs: '100%', sm: 140 } }}>
                    <StyledSelect
                        value={status}
                        onChange={handleStatusChange}
                        displayEmpty
                        renderValue={(selected) => selected || "Status"}
                    >
                        <MenuItem value="">All Status</MenuItem>
                        <MenuItem value="INPROGRESS">INPROGRESS</MenuItem>
                        <MenuItem value="PENDING">PENDING</MenuItem>
                        <MenuItem value="CLOSED">CLOSED</MenuItem>
                        <MenuItem value="DROPPED">DROPPED</MenuItem>
                    </StyledSelect>
                </FormControl>

                {/* Optional: Add Telecaller Filter */}
            </Box>

            {/* Right side: Search & Export */}
            <Box display="flex" flexWrap="wrap" alignItems="center" gap={1} sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                <Box sx={{ maxWidth: 200 }}>
                    <TextField
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search by name, phone, email"
                        size="small"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Export Current Page Data */}
                <Button
                    variant="contained"
                    sx={{
                        textTransform: 'none',
                        height: 40,
                        bgcolor: '#2563EB',
                        '&:hover': { bgcolor: '#1d4ed8' },
                        '&:disabled': { bgcolor: '#9ca3af' },
                        width: { xs: '100%', sm: 'auto' },
                        fontWeight: 300
                    }}
                    onClick={exportCreditManagerData}
                    disabled={loading}
                >
                    {loading ? "Exporting..." : "Export"}
                </Button>

                <Button
                    variant="contained"
                    sx={{
                        textTransform: 'none',
                        height: 40,
                        bgcolor: '#2563EB',
                        '&:hover': { bgcolor: '#1d4ed8' },
                        width: { xs: '100%', sm: 'auto' }
                    }}
                    onClick={() => navigate("/")}
                >
                    Send Report
                </Button>
            </Box>
        </Box>
    );
}