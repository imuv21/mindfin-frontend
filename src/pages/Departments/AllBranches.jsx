import { useEffect, useState } from "react";
import { Pagination, FormControl, MenuItem, Select } from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";
import ProfileHeader from "@/components/layout/ProfileHeader";
import {
    styled,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Avatar,
    Typography,
    Box,
    Chip,
    TableContainer,
    Paper,
    IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import TuneIcon from "@mui/icons-material/Tune"; // Make sure this is imported

// Optional: Styled IconButton (removes hover effect, or style it your way)
const CustomIconButton = styled(IconButton)(() => ({
    color: "#4B5563", // gray-600
    padding: 6,
    "&:hover": {
        color: "#1F2937", // gray-900
        backgroundColor: "transparent", // removes ripple background
    },
}));

const StyledTableRow = styled(TableRow)(() => ({
    height: 44,
}));

const StyledTableCell = styled(TableCell)(() => ({
    paddingTop: 2,
    paddingBottom: 2,
    height: 44,
    lineHeight: '44px',
}));


export default function AllBranches() {
    const [filter, setFilter] = useState("");

    const navigate = useNavigate();

    const employees = [
        {
            id: 345321231,
            name: "Alex Johnson",
            image: "https://randomuser.me/api/portraits/men/1.jpg",
            designation: "Bangalore",
            type: "Office",
            status: "Permanent",
        },
        {
            id: 987890345,
            name: "Emily Davis",
            image: "https://randomuser.me/api/portraits/women/2.jpg",
            designation: "Bangalore",
            type: "Remote",
            status: "Permanent",
        },
        {
            id: 453367122,
            name: "Michael Lee",
            image: "https://randomuser.me/api/portraits/men/3.jpg",
            designation: "Bangalore",
            type: "Remote",
            status: "Permanent",
        },
        {
            id: 345321231,
            name: "Sophie Miller",
            image: "https://randomuser.me/api/portraits/women/4.jpg",
            designation: "Chennai",
            type: "Remote",
            status: "Permanent",
        },
        {
            id: 453677881,
            name: "David Kim",
            image: "https://randomuser.me/api/portraits/men/5.jpg",
            designation: "Bangalore",
            type: "Remote",
            status: "Permanent",
        },
        {
            id: 109918765,
            name: "Rachel Green",
            image: "https://randomuser.me/api/portraits/women/6.jpg",
            designation: "Bangalore",
            type: "Remote",
            status: "Permanent",
        },
    ];

    const filteredEmployees = filter
        ? employees.filter(emp => emp.designation.toLowerCase() === filter.toLowerCase())
        : employees;

    return (
        <MainLayout>
            <ProfileHeader />
            <div className="container mx-auto p-4">
                <div className="flex flex-col border border-[#D9D9D9] rounded-[8px] p-4">
                        <Box display="flex" alignItems="center" justifyContent='space-between' mb={3}>
                            <Box>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="search"
                                        className="block w-full p-2 pl-10 text-sm text-gray-900 border border-[#A2A1A81A] rounded-lg bg-white"
                                        placeholder="Search employee"
                                    />
                                </div>
                            </Box>
                            {/* Filter Dropdown */}
                            <Box>
                                <FormControl size="small" sx={{ minWidth: 150 }}>
                                    <Select
                                        value={filter}
                                        displayEmpty
                                        onChange={(e) => setFilter(e.target.value)}
                                        startAdornment={<TuneIcon sx={{ mr: 1 }} />}
                                    >
                                        <MenuItem value="">All Locations</MenuItem>
                                        <MenuItem value="Bangalore">Bangalore</MenuItem>
                                        <MenuItem value="Chennai">Chennai</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>


                    <div className="overflow-x-auto">
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell sx={{ fontSize: 16, color: "#A2A1A8" }}>Employee Id</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 16, color: "#A2A1A8" }}>Employee Name</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 16, color: "#A2A1A8" }}>Designation</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 16, color: "#A2A1A8" }}>Type</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 16, color: "#A2A1A8" }}>Status</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 16, color: "#A2A1A8" }}>Action</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {employees.map((emp) => (
                                        <TableRow key={emp.id} sx={{ height: 56 }}>
                                            <StyledTableCell sx={{ fontSize: 16, color: "#16151C", verticalAlign: 'middle' }}>
                                                {emp.id}
                                            </StyledTableCell>

                                            <StyledTableCell sx={{ verticalAlign: 'middle' }}>
                                                <Box display="flex" alignItems="center">
                                                    <Avatar src={emp.image} sx={{ width: 32, height: 32 }} />
                                                    <Typography variant="body2" sx={{ ml: 2, fontSize: 16, color: "#16151C", fontWeight: 500 }}>
                                                        {emp.name}
                                                    </Typography>
                                                </Box>
                                            </StyledTableCell>

                                            <StyledTableCell sx={{ fontSize: 16, color: "#16151C", verticalAlign: 'middle' }}>
                                                {emp.designation}
                                            </StyledTableCell>

                                            <StyledTableCell sx={{ fontSize: 16, color: "#16151C", verticalAlign: 'middle' }}>
                                                {emp.type}
                                            </StyledTableCell>

                                            <StyledTableCell sx={{ verticalAlign: 'middle' }}>
                                                <Chip
                                                    label={emp.status}
                                                    sx={{
                                                        backgroundColor:
                                                            emp.status === "Permanent"
                                                                ? "#7152F31A"
                                                                : emp.status === "Late"
                                                                    ? "#7152F31A"
                                                                    : "#F5F5F5",
                                                        color:
                                                            emp.status === "Permanent"
                                                                ? "#2563EB"
                                                                : emp.status === "Late"
                                                                    ? "#2563EB"
                                                                    : "#757575",
                                                        fontWeight: 600,
                                                        fontSize: 12,
                                                        height: 24,
                                                        borderRadius: '4px',
                                                    }}
                                                />
                                            </StyledTableCell>

                                            <StyledTableCell sx={{ fontSize: 16, color: "#16151C", verticalAlign: 'middle' }}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <CustomIconButton onClick={() => navigate(`/viewEmployee/${emp._id}`)}>
                                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </CustomIconButton>

                                                    <CustomIconButton>
                                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </CustomIconButton>

                                                    <CustomIconButton>
                                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </CustomIconButton>
                                                </Box>
                                            </StyledTableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </TableContainer>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-500">
                            Showing  out of results
                        </div>
                        <Pagination
                            shape="rounded"
                            siblingCount={1}
                            boundaryCount={0}
                            sx={{
                                "& .MuiPaginationItem-root": {
                                    margin: "0 4px",
                                    border: "1px solid #E0E2E7",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    fontFamily: `'Public Sans', sans-serif`,
                                },
                                "& .Mui-selected": {
                                    color: "#2563EB",
                                    backgroundColor: "transparent !important",
                                    border: '1px solid #2563EB'
                                },
                                "& .MuiPaginationItem-root:hover": {
                                    color: "#fff",
                                    backgroundColor: "#2563EB",
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

        </MainLayout>
    );
}