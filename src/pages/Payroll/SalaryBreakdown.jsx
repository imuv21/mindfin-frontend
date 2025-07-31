import React, { useState } from 'react';
import { Pagination, FormControl, MenuItem, Select } from "@mui/material";
import {
    styled,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Avatar,
    TablePagination
} from '@mui/material';
import CreateSalaryPopup from './CreateSalaryPopup';
import { Link } from 'react-router-dom';

const StyledTableRow = styled(TableRow)(() => ({
    height: 44,
}));

const StyledTableCell = styled(TableCell)(() => ({
    paddingTop: 2,
    paddingBottom: 2,
    height: 44,
    lineHeight: '44px',
}));

const employeeData = [
    {
        id: 1,
        name: 'Abubakar Alghazali',
        designation: 'Managing Director',
        branch: '-',
        basicSalary: 'Rs.446,331',
        allowances: 'Rs.446,331',
        grossSalary: 'Rs.446,331',
        deduction: 'Rs.446,331',
        netSalary: 'Rs.446,331'
    },
    {
        id: 2,
        name: 'Fatima Mohammed',
        designation: 'Managing Director',
        branch: '-',
        basicSalary: 'Rs.446,331',
        allowances: 'Rs.446,331',
        grossSalary: 'Rs.446,331',
        deduction: 'Rs.446,331',
        netSalary: 'Rs.446,331'
    },
    {
        id: 3,
        name: 'Ibrahim Bankole',
        designation: 'Managing Director',
        branch: '-',
        basicSalary: 'Rs.446,331',
        allowances: 'Rs.446,331',
        grossSalary: 'Rs.446,331',
        deduction: 'Rs.446,331',
        netSalary: 'Rs.446,331'
    },
    {
        id: 4,
        name: 'Sadiq Sadiq',
        designation: 'Managing Director',
        branch: '-',
        basicSalary: 'Rs.446,331',
        allowances: 'Rs.446,331',
        grossSalary: 'Rs.446,331',
        deduction: 'Rs.446,331',
        netSalary: 'Rs.446,331'
    },
];

const SalaryBreakdown = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(2);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [open, setOpen] = useState(false);
    const paginatedData = employeeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Salary Defination</Typography>
                <CreateSalaryPopup open={open} handleClose={() => setOpen(false)} />
                <Button onClick={() => setOpen(true)}
                    sx={{ padding: "0px 18px !important", background: '#2563EB', color: '#fff', textTransform: 'capitalize', borderRadius: '10px' }}>
                    Create Salary Definition
                </Button>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            {[
                                "S/N", "Designation", "Basic Salary",
                                "Allowances", "Gross Salary", "Deduction", "Net Salary", "Action"
                            ].map((heading) => (
                                <StyledTableCell key={heading} sx={{ fontSize: 12, color: "#A2A1A8" }}>
                                    {heading}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((emp, index) => (
                            <StyledTableRow key={emp.id}>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>
                                    {String(page * rowsPerPage + index + 1).padStart(2, '0')}
                                </StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{emp.designation}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{emp.basicSalary}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{emp.allowances}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{emp.grossSalary}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{emp.deduction}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{emp.netSalary}</StyledTableCell>
                                <StyledTableCell>
                                    <Button size="small" variant="outlined"
                                        sx={{ textTransform: "none", border: 'none', padding: '0px !important', justifyContent: 'flex-start' }}>
                                        View
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination Component */}
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
        </Box>
    );
};

export default SalaryBreakdown;
