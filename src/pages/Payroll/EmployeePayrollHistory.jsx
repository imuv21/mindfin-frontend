import React, { useEffect, useState } from 'react';
import { Pagination, FormControl, MenuItem, Select, Chip, CircularProgress } from "@mui/material";
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
import { Link } from 'react-router-dom';
import GeneratePayrollPopup from './GeneratePayrollPopup';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPayrolls, setPayroleFilterValues, setPayrollRefresh } from '../../redux/payrollSlice';
import { formatFullDate } from '../../helpers/conversion';
import api from '../../helpers/Api';
import Toastify from '../../helpers/Toastify';
import EditPayRollPopup from './EditPayRollPopup';
import DeleteModal from '@/components/employee/DeleteModal';

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
        dateGenerated: '2025-04-01',
        paymentMonth: 'March',
        paymentYear: '2025',
        status: 'Paid',
    },
    {
        id: 2,
        name: 'Fatima Mohammed',
        designation: 'Finance Officer',
        dateGenerated: '2025-04-05',
        paymentMonth: 'March',
        paymentYear: '2025',
        status: 'Pending',
    },
    {
        id: 3,
        name: 'Ibrahim Bankole',
        designation: 'HR Manager',
        dateGenerated: '2025-04-03',
        paymentMonth: 'March',
        paymentYear: '2025',
        status: 'Paid',
    },
    {
        id: 4,
        name: 'Sadiq Sadiq',
        designation: 'IT Specialist',
        dateGenerated: '2025-04-02',
        paymentMonth: 'March',
        paymentYear: '2025',
        status: 'Pending',
    },
];

const EmployeePayrollHistory = () => {

    const dispatch = useDispatch()
    const { payRollData, isPayrollLoading, payRollFillterOptions,isPayrollRefresh } = useSelector(
        (state) => state.payroll
      );

    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(2);
    const [itemsPerPage] = useState(10);
    const [selectedHolidayId, setSelectedHolidayId] = useState(null);
    const [opendeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);






    


    const handlePageChange = (event, page) => {
                    dispatch(setPayroleFilterValues({ page }));
                  };

                  const calculateShowingRange = () => {
                    const start = (payRollData?.currentPage - 1) * itemsPerPage + 1;
                    const end = Math.min(
                        payRollData?.currentPage * itemsPerPage,
                        payRollData?.total
                    );
                    return { start, end };
                  };
                  const { start, end } = calculateShowingRange();    
                  
                   useEffect(() => {
                                  dispatch(getAllPayrolls(payRollFillterOptions));
                                }, [payRollFillterOptions,isPayrollRefresh]);

              
    const handleEditHoliday = (id) => {
    setSelectedHolidayId(id);
    setOpenEditModal(true);
};

 const handleDeleteHoliday =(id) =>{
    setSelectedHolidayId(id);
    setOpenDeleteModal(true);
 }

 const handleDeleteSubmit =async()=>{
    try {
        setDeleteLoading(true)

        const {data,status} = await api.deleteAPayRoll(selectedHolidayId)

        if(status === 200){
            Toastify.success("payroll deleted successfully")
            dispatch(setPayrollRefresh())
            setOpenDeleteModal(false)

        }
        
    } catch (error) {
                Toastify.error(error.response.data.message || `something went wrong`);
        
    }finally{
        setDeleteLoading(false)

    }
}                             


    return (


        <Box >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Employee Payroll History</Typography>
                <GeneratePayrollPopup open={open} handleClose={() => setOpen(false)} />
                <Button  onClick={() => setOpen(true)}
                 sx={{ padding: "0px 18px !important", background: '#2563EB', color: '#fff', textTransform: 'capitalize', borderRadius: '10px' }}>
                    Generate Payroll</Button>
            </Box>

            <EditPayRollPopup
            open={openEditModal}
            handleClose={() => setOpenEditModal(false)}
            id={selectedHolidayId}
            />

<DeleteModal
                                isOpen={opendeleteModal}
                                close={()=>setOpenDeleteModal(false)}
                                handleSubmit={handleDeleteSubmit}
                                heading="Confirm Deletion"
                                description="Are you sure you want to delete this Pay roll details?"
                                loading={deleteLoading}
                        />



   {isPayrollLoading ? (
                                        //   <StyledTableRow>
                                        //   <StyledTableCell colSpan={8}>
                                        //     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px", width: "100%" }}>
                                        //       <CircularProgress />
                                        //     </div>
                                        //   </StyledTableCell>
                                        // </StyledTableRow>
                                        <StyledTableRow>
                                        <StyledTableCell
                                          colSpan={8}
                                          style={{
                                            padding: 0,
                                            height: 100,
                                            textAlign: "center",
                                            verticalAlign: "middle", // ensures vertical alignment in table cell
                                          }}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              height: "100px",
                                              width: "100%",
                                            }}
                                          >
                                            <CircularProgress  style={{marginLeft:510}}/>
                                          </div>
                                        </StyledTableCell>
                                      </StyledTableRow>
                                      

                                        ) : payRollData?.payRolls?.length === 0 ? (
                                          <TableRow>
                                            <TableCell colSpan={8} align="center">
                                            <p style={{margin:500}}>  Payroll data found </p>
                                            
                                                                                    
                                            </TableCell>
                                          </TableRow>
                                        ) :  (

            <TableContainer>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            {[
                                "S/N", "Payment name", "Designation", "Date generated",
                                "Payment month", "Payment year", "Status", "Action"
                            ].map((heading) => (
                                <StyledTableCell key={heading} sx={{ fontSize: 12, color: "#A2A1A8" }}>
                                    {heading}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {payRollData?.payRolls?.map((emp, index) => (
                            <StyledTableRow key={emp?._id}>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>
                                {(payRollData?.currentPage - 1) * itemsPerPage + index + 1}
                                </StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{emp?.paymentName}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{emp?.designation?.designation}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{formatFullDate( emp?.generatedDate)}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{emp?.paymentMonth}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>{emp?.paymentYear}</StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 12, color: "#14151C" }}>
                                    <Chip
                                        label={emp?.status || '-'}
                                        sx={{
                                            backgroundColor:
                                                emp?.status === "PAID"
                                                    ? "#3FC28A1A"
                                                    : emp.status === "PENDING"
                                                        ? "#FBBF241A"
                                                        : "#E0E0E0",
                                            color:
                                                emp?.status === "PAID"
                                                    ? "#3FC28A"
                                                    : emp?.status === "PENDING"
                                                        ? "#FBBF24"
                                                        : "#757575",
                                            fontWeight: 600,
                                            fontSize: 12,
                                            height: 24,
                                            borderRadius: '4px',
                                        }}
                                    />
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Button size="small" variant="outlined"
                                        sx={{ textTransform: "none", border: 'none', padding: '0px !important', justifyContent: 'flex-start' }}>
                                         <div className=" whitespace-nowrap text-sm font-medium flex space-x-3">
                                                        
                                                        <button className="text-gray-600 hover:text-gray-900 cursor-pointer" onClick={()=>handleEditHoliday(emp?._id)}>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                            </svg>
                                                        </button>
                                                        <button className="text-gray-600 hover:text-gray-900 cursor-pointer" onClick={()=>handleDeleteHoliday(emp?._id)}>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
                                        )}



            {/* Pagination Component */}

            {Array.isArray(payRollData?.payRolls) && payRollData?.payRolls.length > 1 && (
  
            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                Showing {start}-{end} out of {payRollData?.total} results
                </div>
                <Pagination
                    shape="rounded"
                    siblingCount={1}
                    boundaryCount={0}
                    count={payRollData?.totalPages}
                    page={payRollFillterOptions?.page}
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
            )}
        </Box>
    );
};

export default EmployeePayrollHistory;
