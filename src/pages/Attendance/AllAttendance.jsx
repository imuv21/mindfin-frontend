
import { useEffect, useState } from "react";
import { Button, Pagination } from "@mui/material";
import api from "../../helpers/Api";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
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
} from "@mui/material";
import { getAttentenceData, setFilterValues } from "../../redux/attedenceSlice";
import { getISTTimeOnly } from "../../helpers/conversion";
import { useNavigate } from "react-router-dom";

const StyledTableRow = styled(TableRow)(() => ({
    height: 44,
}));

const StyledTableCell = styled(TableCell)(() => ({
    paddingTop: 2,
    paddingBottom: 2,
    height: 44,
    lineHeight: '44px',
}));

export default function AllAttendance() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { filterOptions, isRefresh, isLoading, attendenceData } = useSelector(
        (state) => state.attendence
    );

    const [name, setName] = useState("");
    const [itemsPerPage] = useState(10);

    const handleSearch = (e) => {
        setName(e.target.value);
        dispatch(setFilterValues({ name: e.target.value, page: 1 }));
    };

    const handlePageChange = (event, page) => {
        dispatch(setFilterValues({ page }));
    };

    const calculateShowingRange = () => {
        const start = (attendenceData?.currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(
            attendenceData?.currentPage * itemsPerPage,
            attendenceData?.totalRecords
        );
        return { start, end };
    };

    const { start, end } = calculateShowingRange();

    useEffect(() => {
        dispatch(getAttentenceData(filterOptions));
    }, [filterOptions, dispatch, isRefresh]);

    return (
        <MainLayout>
            <ProfileHeader
            //Attendance
            name="Attendance"
            breadcrumbs={["All Employee Attendance"]}
            
            />
            <div className="container mx-auto p-4">
                <div className="flex flex-col border border-[#D9D9D9] rounded-[8px] p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-2 ">
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
                                    className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white"
                                    placeholder="Search employee"
                                    value={name}
                                    onChange={(e) => handleSearch(e)}
                                />
                            </div>

                        </div>
                            <Button  variant="contained" onClick={()=>navigate(`/monthlyAttendance`)}>
                                Show Monthly attendence
                            </Button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <CircularProgress />
                        </div>
                    ) : attendenceData?.data?.length === 0 ? (
                        <div className="flex justify-center items-center text-gray-500 w-full h-64">
                            No Attendence Data Found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Employee Name</StyledTableCell>
                                            <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Designation</StyledTableCell>
                                            <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Type</StyledTableCell>
                                            <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Check In Time</StyledTableCell>
                                            <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Status</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {attendenceData?.data?.map((emp) => (
                                            <TableRow key={emp.id} sx={{ height: 44, py: 0, lineHeight: '44px' }}>
                                                <StyledTableCell sx={{ height: '44px !important' }}>
                                                    <Box display="flex" alignItems="center">
                                                        <Box display="flex" alignItems="center">
                                                            <Avatar
                                                                src={emp?.employee?.profileImg[0]} // 👈 This should be the image URL
                                                                sx={{ width: 32, height: 32 }}
                                                            />
                                                            <Typography variant="body2" sx={{ ml: 2, fontSize: 14, color: "#16151C", fontWeight: 500 }}>
                                                                {emp?.employee?.firstName} {emp?.employee?.lastName}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: 14, color: "#16151C" }}>{emp?.employee?.designation?.designation}</StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: 14, color: "#16151C" }}>{emp?.employee?.employeeType}</StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: 14, color: "#16151C" }}>{getISTTimeOnly(emp.checkIn)}</StyledTableCell>
                                                <StyledTableCell>
                                                    {/* <Chip
                                                        label={emp.status}
                                                        sx={{
                                                            backgroundColor:
                                                                emp.status === "ONTIME"
                                                                    ? "#3FC28A1A"
                                                                    : emp.status === "LATE"
                                                                        ? "#F45B691A"
                                                                        : "#F5F5F5",
                                                            color:
                                                                emp.status === "ONTIME"
                                                                    ? "#3FC28A"
                                                                    : emp.status === "LATE"
                                                                        ? "#F45B69"
                                                                        : "#757575",
                                                            fontWeight: 600,
                                                            fontSize: 12,
                                                            height: 24,
                                                            borderRadius: '4px !important',
                                                        }}
                                                    /> */}
                                                    <Chip
    label={emp.status}
    sx={{
        backgroundColor:
            emp.status === "ONTIME"
                ? "#3FC28A1A"
                : emp.status === "LATE"
                ? "#F45B691A"
                : emp.status === "ABSENT"
                ? "#FF00001A"
                : emp.status === "HALFDAY"
                ? "#FFA5001A"
                : "#F5F5F5",
        color:
            emp.status === "ONTIME"
                ? "#3FC28A"
                : emp.status === "LATE"
                ? "#F45B69"
                : emp.status === "ABSENT"
                ? "#FF0000"
                : emp.status === "HALFDAY"
                ? "#FFA500"
                : "#757575",
        fontWeight: 600,
        fontSize: 12,
        height: 24,
        borderRadius: '4px !important',
    }}
/>

                                                </StyledTableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    )}

                    {attendenceData?.data?.length > 0 && (
                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-500">
                                Showing {start}-{end} out of {attendenceData?.totalRecords} results
                            </div>
                            <Pagination
                                count={attendenceData?.totalPages}
                                page={filterOptions?.page}
                                onChange={handlePageChange}
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
                    )}
                </div>
            </div>
        </MainLayout>
    );
}