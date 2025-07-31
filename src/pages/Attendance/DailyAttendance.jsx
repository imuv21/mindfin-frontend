
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
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
    Chip,
    TableContainer,
    Paper,
    Box,
    Card,
    Grid,
    TextField,
    MenuItem,
    IconButton,
    Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AlarmIcon from "@mui/icons-material/Alarm";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

const summaryData = [
    {
        icon: <AccessTimeIcon sx={{ color: "#4F46E5" }} />,
        value: "05:30 Hours",
        label: "Average Working Hours",
        bg: "#EEF0FE",
    },
    {
        icon: <AlarmIcon sx={{ color: "#D97706" }} />,
        value: "09:00 (GMT+6)",
        label: "Check In Time",
        bg: "#FFF7E5",
    },
    {
        icon: <AlarmIcon sx={{ color: "#059669" }} />,
        value: "15:25 (GMT+6)",
        label: "Check Out Time",
        bg: "#ECFDF5",
    },
    {
        icon: <HourglassBottomIcon sx={{ color: "#DB2777" }} />,
        value: "50 Minute",
        label: "Average Break Time",
        bg: "#FFF1F2",
    },
];

const StyledTableRow = styled(TableRow)(() => ({
    height: 44,
}));

const StyledTableCell = styled(TableCell)(() => ({
    paddingTop: 2,
    paddingBottom: 2,
    height: 44,
    lineHeight: '44px',
}));


export default function DailyAttendance() {

    const employees = [
        {
            id: "EMP001",
            name: "Alex Johnson",
            image: "https://randomuser.me/api/portraits/men/1.jpg",
            checkInTime: "09:27 AM",
            checkOutTime: "06:15 PM",
            workingHours: "8h 48m",
            shift: "Morning",
            status: "On Time",
        },
        {
            id: "EMP002",
            name: "Emily Davis",
            image: "https://randomuser.me/api/portraits/women/2.jpg",
            checkInTime: "08:55 AM",
            checkOutTime: "05:30 PM",
            workingHours: "8h 35m",
            shift: "Morning",
            status: "On Time",
        },
        {
            id: "EMP003",
            name: "Michael Lee",
            image: "https://randomuser.me/api/portraits/men/3.jpg",
            checkInTime: "10:12 AM",
            checkOutTime: "07:45 PM",
            workingHours: "8h 5m",
            shift: "Evening",
            status: "Late",
        },
        {
            id: "EMP004",
            name: "Sophie Miller",
            image: "https://randomuser.me/api/portraits/women/4.jpg",
            checkInTime: "09:10 AM",
            checkOutTime: "06:00 PM",
            workingHours: "8h 50m",
            shift: "Morning",
            status: "On Time",
        },
        {
            id: "EMP005",
            name: "David Kim",
            image: "https://randomuser.me/api/portraits/men/5.jpg",
            checkInTime: "09:45 AM",
            checkOutTime: "06:50 PM",
            workingHours: "9h 5m",
            shift: "Flexible",
            status: "On Time",
        },
        {
            id: "EMP006",
            name: "Rachel Green",
            image: "https://randomuser.me/api/portraits/women/6.jpg",
            checkInTime: "10:00 AM",
            checkOutTime: "07:10 PM",
            workingHours: "8h 10m",
            shift: "Evening",
            status: "Late",
        },
        {
            id: "EMP007",
            name: "Kevin Brown",
            image: "https://randomuser.me/api/portraits/men/7.jpg",
            checkInTime: "10:00 PM",
            checkOutTime: "06:00 AM",
            workingHours: "8h 0m",
            shift: "Night",
            status: "On Time",
        },
        {
            id: "EMP008",
            name: "Laura Wilson",
            image: "https://randomuser.me/api/portraits/women/8.jpg",
            checkInTime: "08:50 AM",
            checkOutTime: "05:45 PM",
            workingHours: "8h 55m",
            shift: "Morning",
            status: "On Time",
        },
        {
            id: "EMP009",
            name: "Brian Adams",
            image: "https://randomuser.me/api/portraits/men/9.jpg",
            checkInTime: "11:15 AM",
            checkOutTime: "08:10 PM",
            workingHours: "8h 55m",
            shift: "Flexible",
            status: "Late",
        },
        {
            id: "EMP010",
            name: "Olivia White",
            image: "https://randomuser.me/api/portraits/women/10.jpg",
            checkInTime: "09:05 AM",
            checkOutTime: "06:10 PM",
            workingHours: "9h 5m",
            shift: "Morning",
            status: "On Time",
        },
    ];



    return (
        <MainLayout>
            <ProfileHeader />

            <div className="container mx-auto p-4">
                <Box mb={4}>
                    {/* Summary Cards */}
                    <Grid container spacing={2}>
                        {summaryData.map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        backgroundColor: item.bg,
                                        borderRadius: 2,
                                        p: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        boxShadow: "none",
                                    }}
                                >
                                    <Box>{item.icon}</Box>
                                    <Box>
                                        <Typography fontWeight={600} color="text.primary">
                                            {item.value}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.label}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <div className="flex flex-col border border-[#D9D9D9] rounded-[8px] p-4">
                    <div className="overflow-x-auto">
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            flexWrap="wrap"
                            sx={{ py: 3 }}
                        >
                            {/* 🔍 Filter Inputs + Search Button */}
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                                flexWrap="wrap"
                            >
                                {/* Employee Name */}
                                <TextField
                                    label="Employee Name"
                                    variant="outlined"
                                    size="small"
                                    sx={{ width: 250 }}
                                />

                                {/* Status Dropdown */}
                                <TextField
                                    label="Select Status"
                                    variant="outlined"
                                    size="small"
                                    select
                                    sx={{ width: 200 }}
                                >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Late">Late</MenuItem>
                                    <MenuItem value="Absent">Absent</MenuItem>
                                </TextField>

                                {/* Search Button */}
                                <IconButton
                                    sx={{
                                        backgroundColor: "#2563EB",
                                        color: "#fff",
                                        borderRadius: 2,
                                        width: 40,
                                        height: 40,
                                        "&:hover": {
                                            backgroundColor: "#1E40AF",
                                        },
                                    }}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </Box>

                            {/* All Button */}
                            <Box mt={{ xs: 2, md: 0 }}>
                                <Button
                                    variant="outlined"
                                    sx={{ textTransform: "none", borderRadius: 2 }}
                                >
                                    All
                                </Button>
                            </Box>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Employee ID</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Employee</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Clock In</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Clock Out</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Working Hours</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Shift</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Status</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Action</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {employees.map((emp) => (
                                        <StyledTableRow key={emp.id} sx={{ height: 44 }}>
                                            {/* Employee ID */}
                                            <StyledTableCell sx={{ fontSize: 14, color: "#14151C" }}>
                                                #{emp.id.toString().padStart(3, '0')}
                                            </StyledTableCell>

                                            {/* Employee Name + Avatar */}
                                            <StyledTableCell sx={{ height: '44px !important' }}>
                                                <Box display="flex" alignItems="center">
                                                    <Avatar src={emp.image} sx={{ width: 32, height: 32 }} />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ ml: 2, fontSize: 14, color: "#14151C", fontWeight: 500 }}
                                                    >
                                                        {emp.name}
                                                    </Typography>
                                                </Box>
                                            </StyledTableCell>
                                            
                                            {/* Clock In */}
                                            <StyledTableCell sx={{ fontSize: 14, color: "#14151C" }}>
                                                {emp.checkInTime}
                                            </StyledTableCell>

                                            {/* Clock Out */}
                                            <StyledTableCell sx={{ fontSize: 14, color: "#14151C" }}>
                                                {emp.checkOutTime}
                                            </StyledTableCell>

                                            <StyledTableCell>{emp.workingHours}</StyledTableCell>
                                            <StyledTableCell>{emp.shift}</StyledTableCell>

                                            {/* Status */}
                                            <StyledTableCell>
                                                <Chip
                                                    label={emp.status}
                                                    sx={{
                                                        backgroundColor:
                                                            emp.status === "On Time"
                                                                ? "#3FC28A1A"
                                                                : emp.status === "Late"
                                                                    ? "#F45B691A"
                                                                    : "#F5F5F5",
                                                        color:
                                                            emp.status === "On Time"
                                                                ? "#3FC28A"
                                                                : emp.status === "Late"
                                                                    ? "#F45B69"
                                                                    : "#757575",
                                                        fontWeight: 600,
                                                        fontSize: 12,
                                                        height: 24,
                                                        borderRadius: '4px !important',
                                                    }}
                                                />
                                            </StyledTableCell>

                                            {/* Action */}
                                            <StyledTableCell>
                                                <Button size="small" variant="outlined" sx={{ textTransform: "none" }}>
                                                    View
                                                </Button>
                                            </StyledTableCell>
                                        </StyledTableRow>
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