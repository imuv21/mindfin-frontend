
import { useEffect, useState } from "react";
import { CircularProgress, Pagination } from "@mui/material";
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
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from "react-redux";
import { getMonthlyAttentenceData, setAttentenceFilterValues } from "../../redux/attedenceSlice";
import { useNavigate } from "react-router-dom";


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





export default function MonthlyAttendance() {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState(null);
    const [name, setName] = useState("");
    const [itemsPerPage] = useState(10);


    const {attentencefilterOptions,MonthlyAttendance,isLoading} = useSelector((state)=>state.attendence)

    console.log(attentencefilterOptions,"attentencefilterOptions");
    


    const employees = [
        {
            id: "EMP001",
            name: "John Doe",
            workingDays: 30,
            presentDays: 28,
            absentDays: 2,
            month: "March",
        },
        {
            id: "EMP002",
            name: "Jane Smith",
            workingDays: 30,
            presentDays: 27,
            absentDays: 3,
            month: "March",
        },
        {
            id: "EMP003",
            name: "Ravi Kumar",
            workingDays: 30,
            presentDays: 30,
            absentDays: 0,
            month: "March",
        },
        {
            id: "EMP004",
            name: "Sneha Reddy",
            workingDays: 30,
            presentDays: 25,
            absentDays: 5,
            month: "March",
        },
    ];


    console.log(selectedDate,"selectedDate");
    
    const handleDateChange = (date) => {
        setSelectedDate(date);
    
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 0-indexed
    
        dispatch(setAttentenceFilterValues({ year, month }));
      };

         const handleSearch = (e) => {
              setName(e.target.value);
              dispatch(setAttentenceFilterValues({ search: e.target.value, page: 1 }));
          };
      
          const handlePageChange = (event, page) => {
              dispatch(setAttentenceFilterValues({ page }));
          };

          const calculateShowingRange = () => {
            const start = (MonthlyAttendance?.pagination?.currentPage - 1) * itemsPerPage + 1;
            const end = Math.min(
                MonthlyAttendance?.pagination?.currentPage * itemsPerPage,
                MonthlyAttendance?.pagination?.totalRecords
            );
            return { start, end };
        };
    
        const { start, end } = calculateShowingRange();

        useEffect(() => {
                dispatch(getMonthlyAttentenceData(attentencefilterOptions));
            }, [attentencefilterOptions, dispatch]);


            

return (
    <MainLayout>
        <ProfileHeader
        name="Monthly Attendance"
        />

        <div className="container mx-auto p-4">
            <div className="flex flex-col border border-[#D9D9D9] rounded-[8px] p-4">
                <div className="overflow-x-auto">
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        sx={{ pb: 3, mt: 1 }}
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
                                value={name}
                                name="name"
                                onChange={handleSearch}
                            />

                            {/* Status Month */}
                            <Box sx={{ width: 200 }}>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    dateFormat="MM/yyyy"
                                    showMonthYearPicker
                                    placeholderText="Select Month"
                                    customInput={
                                        <TextField
                                            label="Select Month"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                        />
                                    }
                                />
                            </Box>

                            {/* Search Button */}
                             {/* <IconButton
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
                                </IconButton> */}
                        </Box>

                        {/* All Button */}
                        <Box mt={{ xs: 2, md: 0 }}>
                            <Button
                                variant="outlined"
                                sx={{ textTransform: "none", borderRadius: 2 }}
                                onClick={()=>navigate(`/allAttendance`)}
                            >
                                Back
                            </Button>
                        </Box>
                    </Box>

                    {isLoading ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="300px"
                        >
                            <CircularProgress color="primary" />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Employee ID</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Employee</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Working Days</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Present Day</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Absent Day</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Month</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Action</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {MonthlyAttendance?.employees?.length ? (
                                        MonthlyAttendance?.employees?.map((emp) => (
                                            <StyledTableRow key={emp._id} sx={{ height: 44 }}>
                                                {/* Employee ID */}
                                                <StyledTableCell sx={{ fontSize: 14, color: "#14151C" }}>
                                                    {emp?.employeeId}
                                                </StyledTableCell>

                                                {/* Employee Name + Avatar */}
                                                <StyledTableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar
                                                            src={emp.img && emp.img.length > 0 ? emp.img[0] : undefined}
                                                            sx={{ width: 32, height: 32, mr: 1.5 }}
                                                        >
                                                            {(!emp.img || emp.img.length === 0) &&
                                                                emp.firstName
                                                                    .split(" ")
                                                                    .map((n) => n[0])
                                                                    .join("")}
                                                        </Avatar>
                                                        <Typography fontSize={14} fontWeight={500} color="#14151C">
                                                            {emp.firstName} {emp.lastName}
                                                        </Typography>
                                                    </Box>
                                                </StyledTableCell>

                                                {/* Working Days */}
                                                <StyledTableCell sx={{ fontSize: 14, color: "#14151C" }}>
                                                    {MonthlyAttendance?.totalWorkingDays}
                                                </StyledTableCell>

                                                {/* Present Days */}
                                                <StyledTableCell sx={{ fontSize: 14, color: "#14151C" }}>
                                                    {emp?.totalWorkedDays}
                                                </StyledTableCell>

                                                {/* Absent Days */}
                                                <StyledTableCell sx={{ fontSize: 14, color: "#14151C" }}>
                                                    {emp?.totalAbsentDays}
                                                </StyledTableCell>

                                                {/* Month */}
                                                <StyledTableCell sx={{ fontSize: 14, color: "#14151C" }}>
                                                    {MonthlyAttendance?.selectedMonth}
                                                </StyledTableCell>

                                                {/* Action */}
                                                <StyledTableCell>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ textTransform: "none", fontSize: 13 }}
                                                        onClick={() => navigate(`/viewEmployee/${emp?._id}`)}
                                                    >
                                                        View
                                                    </Button>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    ) : (
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={7} sx={{ textAlign: "center", fontSize: 14, color: "#A2A1A8" }}>
                                                No Data found
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {!isLoading && MonthlyAttendance?.employees?.length ? (
                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-500">
                                Showing {start}-{end} out of {MonthlyAttendance?.pagination?.totalRecords} results
                            </div>
                            <Pagination
                                shape="rounded"
                                siblingCount={1}
                                boundaryCount={0}
                                count={MonthlyAttendance?.pagination?.totalPages}
                                page={attentencefilterOptions?.page}
                                onChange={handlePageChange}
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
                    ) : null}
                </div>
            </div>
        </div>
    </MainLayout>
);


}