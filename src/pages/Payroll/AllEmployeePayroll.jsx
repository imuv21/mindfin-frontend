
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import api from "../../helpers/Api";
import { useDispatch, useSelector } from "react-redux";
import { getEmployees, setFilterValues } from "../../redux/employeeSlice";
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


export default function AllEmployeePayroll() {
    const navigate = useNavigate()

    const employees = [
        {
            id: "EMP001",
            name: "John Doe",
            ctc: 600000, // yearly CTC
            monthlySalary: 50000,
            deduction: 2000,
            status: "Completed"
        },
        {
            id: "EMP002",
            name: "Jane Smith",
            ctc: 480000,
            monthlySalary: 40000,
            deduction: 1500,
            status: "Pending"
        },
        {
            id: "EMP003",
            name: "Ravi Kumar",
            ctc: 720000,
            monthlySalary: 60000,
            deduction: 0,
            status: "Completed"
        },
        {
            id: "EMP004",
            name: "Sneha Reddy",
            ctc: 540000,
            monthlySalary: 45000,
            deduction: 3000,
            status: "Completed"
        }
    ];

    return (
        <MainLayout>
            <ProfileHeader />
            <div className="container mx-auto p-4">
                <div className="flex flex-col border border-[#D9D9D9] rounded-[8px] p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-2">
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
                                />
                            </div>
                        </div>
                        <div style={{display:"flex",gap:30}}>
                            <button
                         className="flex items-center gap-2 text-white bg-[#2563EB] rounded-lg px-4 py-2 text-sm font-medium cursor-pointer"
                            onClick={()=>navigate("/salaryDefnition")}
                            >
                                Detailed View
                            </button>

                            <button
                                type="button"
                                className="flex items-center gap-2 text-white bg-[#2563EB] rounded-lg px-4 py-2 text-sm font-mediumm cursor-pointer"
                                onClick={() => navigate("/newEmployee")}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 6L12 2M12 2L16 6M12 2L12 16" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M18.2454 9C19.3433 10.3696 20 12.1081 20 14C20 18.4183 16.4183 22 12 22C7.58172 22 4 18.4183 4 14C4 12.1081 4.65672 10.3696 5.75462 9" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                                </svg>

                                Export
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Employee Name</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>CTC</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Salary Per Month</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Deduction</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Status</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>

                                    
                                    {employees.map((emp) => (
                                        <TableRow key={emp.id} sx={{ height: 44, py: 0, lineHeight: '44px' }}>
                                            {/* Employee Name */}
                                            <StyledTableCell>
                                                <Box display="flex" alignItems="center">
                                                    <Avatar
                                                        src={emp.image} // Optional, defaults to initials or empty avatar
                                                        sx={{ width: 32, height: 32, mr: 1.5 }}
                                                    />
                                                    <Typography fontSize={14} fontWeight={500} color="#16151C">
                                                        {emp.name}
                                                    </Typography>
                                                </Box>
                                            </StyledTableCell>

                                            {/* CTC */}
                                            <StyledTableCell sx={{ fontSize: 14, color: "#16151C" }}>
                                                ₹{emp.ctc.toLocaleString()}
                                            </StyledTableCell>

                                            {/* Salary Per Month */}
                                            <StyledTableCell sx={{ fontSize: 14, color: "#16151C" }}>
                                                ₹{emp.monthlySalary.toLocaleString()}
                                            </StyledTableCell>

                                            {/* Deduction */}
                                            <StyledTableCell sx={{ fontSize: 14, color: "#16151C" }}>
                                                ₹{emp.deduction.toLocaleString()}
                                            </StyledTableCell>

                                            {/* Status */}
                                            <StyledTableCell>
                                                <Chip
                                                    label={emp.status}
                                                    sx={{
                                                        backgroundColor:
                                                            emp.status === "Completed"
                                                                ? "#3FC28A1A"
                                                                : emp.status === "Pending"
                                                                    ? "#FBBF241A"
                                                                    : "#E0E0E0",
                                                        color:
                                                            emp.status === "Completed"
                                                                ? "#3FC28A"
                                                                : emp.status === "Pending"
                                                                    ? "#FBBF24"
                                                                    : "#757575",
                                                        fontWeight: 600,
                                                        fontSize: 12,
                                                        height: 24,
                                                        borderRadius: '4px',
                                                    }}
                                                />
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