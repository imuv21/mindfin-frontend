import React, { useEffect, useState } from 'react';
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
    TablePagination,
    CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPayslips, getAllTaxes, setFilterValues,} from "../../redux/payrollSlice";
import { useNavigate } from 'react-router-dom';


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

const EmployeePayslip = () => {

        const dispatch = useDispatch()
        const navigate = useNavigate()
        const { paySlipData, isLoading, filterOptions } = useSelector(
                (state) => state.payroll
              );

    const [page, setPage] = useState(0);
      const [itemsPerPage] = useState(10);
    
    const [rowsPerPage, setRowsPerPage] = useState(2);

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedData = employeeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    
            const handlePageChange = (event, page) => {
                dispatch(setFilterValues({ page }));
              };
    
              const calculateShowingRange = () => {
                const start = (paySlipData?.currentPage - 1) * itemsPerPage + 1;
                const end = Math.min(
                  paySlipData?.currentPage * itemsPerPage,
                  paySlipData?.total
                );
                return { start, end };
              };
              const { start, end } = calculateShowingRange();

    
              useEffect(() => {
                dispatch(getAllPayslips(filterOptions));
              }, [filterOptions]);
            

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Employee Payslip History</Typography>
                <Button sx={{ padding: "0px 18px !important", background: '#2563EB', color: '#fff', textTransform: 'capitalize', borderRadius: '10px' }}
                  onClick={() => navigate("/createPayslip")}

                >
                    Create payslip
                    </Button>
            </Box>

            {isLoading ? (
                                        <StyledTableRow>
                                        {/* <StyledTableCell colSpan={8}> */}
                                          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px", width: "100%" }}>
                                            <CircularProgress  style={{marginLeft:510}} />
                                          </div>
                                        {/* </StyledTableCell> */}
                                      </StyledTableRow>
                                      ) : paySlipData?.paySlips?.length === 0 ? (
                                        <TableRow>
                                          <TableCell colSpan={8} align="center">
                                          <p style={{margin:500}}>  No Payment Slip data found </p>

                                            
                                          </TableCell>
                                        </TableRow>
                                      ) :    

            <TableContainer>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            {[
                                "S/N", "Staff Name", "Designation", "Month", "Basic Salary",
                                "Allowances", "Gross Salary", "Deduction", "Net Salary", "Action"
                            ].map((heading) => (
                                <StyledTableCell key={heading} sx={{ fontSize: 12, color: "#A2A1A8" }}>
                                    {heading}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {paySlipData?.paySlips?.map((emp, index) => (
                            <StyledTableRow key={emp._id}>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>
                                    {/* {String(page * rowsPerPage + index + 1).padStart(2, '0')} */}
                                    {(paySlipData?.currentPage - 1) * itemsPerPage + index + 1}
                                </StyledTableCell>
                                <StyledTableCell sx={{ height: '44px !important' }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontSize: 12, color: "#14151C", fontWeight: 500 }}
                                    >
                            {emp?.employee?.firstName} {emp?.employee?.lastName}
                            </Typography>
                                </StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{emp?.employee?.designation?.designation}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{`${emp?.month},${emp?.year}`}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{emp.basicSalary}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{Number(emp?.housingAllowence)+Number(emp?.transportAllowence)+Number(emp?.utilityAllowence)+Number(emp?.productivityAllowence)+Number(emp?.communicationAllowence)+Number(emp?.inconvenienceAllowence)}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{emp?.grossSalary}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{emp?.totalDeduction || `-`}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{emp?.netSalary}</StyledTableCell>
                                <StyledTableCell>
                                    <Button size="small" variant="outlined"
                                     sx={{ textTransform: "none", border:'none', padding:'0px !important', justifyContent:'flex-start' }}
                                     onClick={()=>navigate(`/payslipView/${emp?._id}`)}
                                     >
                                        View
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

                    }

            {/* Pagination Component */}
            {Array.isArray(paySlipData?.paySlips) && paySlipData?.paySlips.length > 1 && (

<div className="flex justify-between items-center mt-4">
<div className="text-sm text-gray-500">
  {/* Showing  out of results */}
  Showing {start}-{end} out of {paySlipData?.total} results
</div>
<Pagination
  shape="rounded"
  siblingCount={1}
  boundaryCount={0}
  count={paySlipData?.totalPages}
  page={filterOptions?.page}
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
      border: "1px solid #2563EB",
    },
    "& .MuiPaginationItem-root:hover": {
      color: "#fff",
      backgroundColor: "#2563EB",
    },
  }}
/>
</div>


          )}



        </Box>
    );
};

export default EmployeePayslip;
