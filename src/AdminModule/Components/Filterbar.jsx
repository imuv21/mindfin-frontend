import React, { useEffect, useState } from "react";
import {
    styled,
    Box,
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllLeadData, setFilterValues } from "../../redux/leadSlice";
import api from "../../helpers/Api";
import * as XLSX from 'xlsx';
import { formatDate } from "../../helpers/conversion";
import Toastify from "../../helpers/Toastify";

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
    const { filterOptions } = useSelector((state) => state.leads);

    const [date, setDate] = useState("");
    const [representative, setRepresentative] = useState("");
    const [telecaller, setTelecaller] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const [telecallerList, setTelecallerList] = useState([]);
    const [isTelecallerOpen, setIsTelecallerOpen] = useState(false);

    // Debounce search to avoid too many API calls
    const [searchDebounceTimer, setSearchDebounceTimer] = useState(null);

    // Fetch telecallers
    const fetchTelecallers = async () => {
        try {
            const { data, status } = await api.getAllTelecallers();
            if (status === 200) setTelecallerList(data?.data || []);
        } catch (error) {
            console.error("Failed to fetch telecallers", error);
            Toastify.error(error?.response?.data?.message || error.message || "Something went wrong");
        }
    };

    // Handle search change with debouncing
    const handleSearch = (e) => {
        const searchValue = e.target.value;
        setSearch(searchValue);

        // Clear previous timer
        if (searchDebounceTimer) {
            clearTimeout(searchDebounceTimer);
        }

        // Set new timer for debounced search
        const timer = setTimeout(() => {
            // Call the parent component's filter handler
            if (onFiltersChange) {
                onFiltersChange({
                    search: searchValue,
                    date: date,
                    representative: representative,
                    telecaller: telecaller
                });
            }

            // Also update Redux if needed
            dispatch(setFilterValues({
                search: searchValue,
                date: date,
                representative: representative,
                telecaller: telecaller,
                page: 1
            }));
        }, 300); // 300ms debounce

        setSearchDebounceTimer(timer);
    };

    // Handle date change
    const handleDateChange = (e) => {
        const dateValue = e.target.value;
        setDate(dateValue);

        if (onFiltersChange) {
            onFiltersChange({
                search: search,
                date: dateValue,
                representative: representative,
                telecaller: telecaller
            });
        }

        dispatch(setFilterValues({
            search: search,
            date: dateValue,
            representative: representative,
            telecaller: telecaller,
            page: 1
        }));
    };

    // Handle representative change
    const handleRepresentativeChange = (e) => {
        const repValue = e.target.value;
        setRepresentative(repValue);

        if (onFiltersChange) {
            onFiltersChange({
                search: search,
                date: date,
                representative: repValue,
                telecaller: telecaller
            });
        }

        dispatch(setFilterValues({
            search: search,
            date: date,
            representative: repValue,
            telecaller: telecaller,
            page: 1
        }));
    };

    // Handle telecaller change
    const handleTelecallerChange = (e) => {
        const telecallerValue = e.target.value;
        setTelecaller(telecallerValue);

        if (onFiltersChange) {
            onFiltersChange({
                search: search,
                date: date,
                representative: representative,
                telecaller: telecallerValue
            });
        }

        dispatch(setFilterValues({
            search: search,
            date: date,
            representative: representative,
            telecaller: telecallerValue,
            page: 1
        }));
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSearch("");
        setDate("");
        setRepresentative("");
        setTelecaller("");

        if (onFiltersChange) {
            onFiltersChange({
                search: "",
                date: "",
                representative: "",
                telecaller: ""
            });
        }

        dispatch(setFilterValues({
            search: "",
            date: "",
            representative: "",
            telecaller: "",
            page: 1
        }));
    };

    // Export leads with current filters
    const fetchData = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                search: search || '',
                date: date || '',
                representative: representative || '',
                telecaller: telecaller || ''
            }).toString();

            const { data, status } = await api.exportLead(query);
            if (status === 200) {
                const lead = data?.data || [];
                const excelData = lead.map((item) => ({
                    'Lead Name': item?.leadName || '_',
                    'Phone': item?.phone || '_',
                    'Alternative Phone': item?.alternativePhone || '_',
                    'Email': item?.email || '_',
                    'Location': item?.location || '_',
                    'Loan Type': item?.loanType?.loanName || '_',
                    'Loan Amount': item?.loanAmount || '_',
                    'Lead Created Date': formatDate(item?.LeadCreatedDate) || '_',
                    'Assigned To': item?.assignedTo || '_',
                    'Status': item?.status || '_'
                }));

                const worksheet = XLSX.utils.json_to_sheet(excelData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

                // Auto-size columns
                const maxWidth = excelData.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
                worksheet['!cols'] = Array(maxWidth).fill({ width: 15 });

                XLSX.writeFile(workbook, `Leads_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
                Toastify.success("Data exported successfully!");
            }
        } catch (error) {
            console.error("Export error:", error);
            Toastify.error(error?.response?.data?.message || "Export failed");
        } finally {
            setLoading(false);
        }
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (searchDebounceTimer) {
                clearTimeout(searchDebounceTimer);
            }
        };
    }, [searchDebounceTimer]);

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#fff"
            sx={{
                borderRadius: '12px',
                p: 2,
                gap: { xs: 1.5, sm: 2 },
            }}
        >
            {/* LEFT SIDE */}
            <Box
                display="flex"
                flexWrap="wrap"
                alignItems="center"
                gap={{ xs: 1.5, sm: 2 }}
                flex={1}
                minWidth={250}
            >
                <IconButton onClick={handleClearFilters} title="Clear all filters" sx={{ p: 1 }}>
                    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                        <path
                            d="M10.75 6.55C16.13 6.55 20.5 5.25 20.5 3.66C20.5 2.06 16.13 0.77 10.75 0.77C5.36 0.77 1 2.06 1 3.66C1 5.25 5.36 6.55 10.75 6.55Z"
                            stroke="black"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M1 3.66C1 5.61 2.4 7.4 4.67 8.56C6.73 9.61 8.5 11.47 8.5 13.79C8.5 14.59 9.51 15.23 10.75 15.23C11.99 15.23 13 14.59 13 13.79C13 11.47 14.77 9.61 16.83 8.56C19.09 7.4 20.5 5.61 20.5 3.66"
                            stroke="black"
                            strokeWidth="1.5"
                        />
                    </svg>
                </IconButton>

                <StyledTextField
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    size="small"
                    placeholder="Select Date"
                    sx={{ minWidth: { xs: '100%', sm: 150 } }}
                />

                {/* <FormControl variant="standard" sx={{ minWidth: { xs: '100%', sm: 140 } }}>
                    <StyledSelect
                        displayEmpty
                        value={representative}
                        onChange={handleRepresentativeChange}
                        renderValue={(selected) => selected || 'Representative'}
                    >
                        <MenuItem value="" disabled>
                            Representatives
                        </MenuItem>
                        <MenuItem value="">All Representatives</MenuItem>
                        <MenuItem value="Rep1">Rep 1</MenuItem>
                        <MenuItem value="Rep2">Rep 2</MenuItem>
                    </StyledSelect>
                </FormControl> */}

                <FormControl variant="standard" sx={{ minWidth: { xs: '100%', sm: 140 } }}>
                    <StyledSelect
                        displayEmpty
                        value={telecaller}
                        onChange={handleTelecallerChange}
                        onOpen={() => {
                            if (!isTelecallerOpen) {
                                setIsTelecallerOpen(true);
                                fetchTelecallers();
                            }
                        }}
                        renderValue={(selected) => {
                            if (!selected) return 'Telecallers';
                            const caller = telecallerList.find((c) => c._id === selected);
                            return caller ? `${caller.firstName} ${caller.lastName}` : 'Telecallers';
                        }}
                    >
                        <MenuItem value="" disabled>
                            Telecallers
                        </MenuItem>
                        <MenuItem value="">All Telecallers</MenuItem>
                        {telecallerList.map((caller) => (
                            <MenuItem key={caller._id} value={caller._id}>
                                {caller.firstName} {caller.lastName}
                            </MenuItem>
                        ))}
                    </StyledSelect>
                </FormControl>
            </Box>

            {/* RIGHT SIDE */}
            <Box
                display="flex"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="flex-end"
                gap={{ xs: 1, sm: 1.5 }}
                flexShrink={0}
            >
                {/* Search Box */}
                <Box position="relative" sx={{ width: { xs: '100%', sm: 180 } }}>
                    <input
                        type="search"
                        className="block w-full p-2 pl-9 text-sm border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search"
                        value={search}
                        onChange={handleSearch}
                    />
                    <svg
                        className="absolute left-3 top-2.5 w-4 h-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </Box>

                {/* Export Button */}
                <Button
                    variant="contained"
                    sx={{
                        textTransform: 'none',
                        height: 40,
                        bgcolor: '#2563EB',
                        '&:hover': { bgcolor: '#1d4ed8' },
                        '&:disabled': { bgcolor: '#9ca3af' },
                        minWidth: { xs: '100%', sm: 'auto' },
                    }}
                    onClick={fetchData}
                    disabled={loading}
                >
                    {loading ? 'Exporting...' : 'Export'}
                </Button>

                {/* Upload Button */}
                <Button
                    variant="contained"
                    sx={{
                        textTransform: 'none',
                        height: 40,
                        bgcolor: '#2563EB',
                        '&:hover': { bgcolor: '#1d4ed8' },
                        minWidth: { xs: '100%', sm: 'auto' },
                    }}
                    onClick={() => navigate('/adminUploadDataList')}
                >
                    Upload
                </Button>
            </Box>
        </Box>
    );

}



