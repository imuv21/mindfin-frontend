import React, { useEffect, useState } from 'react';
import {
  styled,
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Checkbox, IconButton, Typography,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import CustomPagination from './Components/Pagination';
import Filterbar from './Components/Filterbar';
import MainLayout from './layout/MainLayout';
import ProfileHeader from '@/components/layout/ProfileHeader';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllLeadData, setFilterValues, setRefresh } from '../redux/leadSlice';
import { formatDate } from '../helpers/conversion';
import api from '../helpers/Api';
import Toastify from '../helpers/Toastify';
import DeleteModal from '@/components/employee/DeleteModal';

const StyledTableRow = styled(TableRow)(() => ({
  height: 44,
  lineHeight: '44px',
  fontSize: '14px',
  color:'#363636'
}));

const StyledTableCell = styled(TableCell)(() => ({
  padding: 0,
  height: 44,
  lineHeight: '44px',
  fontSize: '14px',
  color: "#818181",
}));


export default function LeadDataList() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {isRefresh,isLoading,filterOptions,leadsData} = useSelector((state)=>state.leads)
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1); // page is 1-based for MUI Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search,setSearch] = useState('')
  const [leadId, setLeadId] = useState(null);
  const [deleteLoading,setDeleteLoading] = useState(false)
  const [opendeleteModal,setOpenDeleteModal] = useState (false)
  
 
console.log(leadsData,"led");


 const handlePageChange = (event, page) => {
     console.log("page", page); 
     setPage(page);

     dispatch(setFilterValues({ page }));
   };


   
  const handleLimitChange = (newRows) => {
    setRowsPerPage(newRows);
    setPage(1); 
    dispatch(setFilterValues({ limit:newRows,page :1}));

  };


  const handleDeleteLead =(id) =>{
    setLeadId(id);
    setOpenDeleteModal(true);
 }

 const handleDeleteSubmit =async()=>{
  try {
       
      setDeleteLoading(true)

      const {data,status} = await api.deleteALead(leadId)

      if(status === 200){
          Toastify.success("Holiday deleted successfully")
          dispatch(setRefresh())
          setOpenDeleteModal(false)

      }
      
  } catch (error) {
              Toastify.error(error.response.data.message || `something went wrong`);
      
  }finally{
      setDeleteLoading(false)

  }
}


  useEffect(()=>{
          dispatch(getAllLeadData(filterOptions))
        },[filterOptions,isRefresh])


  return (

    <MainLayout>
      <ProfileHeader 
      
      name='Leads Data'

      />
      <Box p={2}>
        
        <Filterbar />

        {isLoading ? (
        // Loading state
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100dvh',
            background: '#f5f5f5',
            borderRadius: '4px',
            p: 2
          }}
        >
          {/* <Typography variant="body1">Loading data...</Typography> */}
          <CircularProgress/>
        </Box>
      ) : (
        <>
          {leadsData?.leads?.length === 0 ? (
            // No Data Found state
            <Box 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '300px',
                background: '#f5f5f5',
                borderRadius: '4px',
                p: 3
              }}
            >
              <Typography variant="h6" gutterBottom>
                No Leads Found
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Try adjusting your filters or check back later
              </Typography>
            </Box>
          ) :(
            <>
        <TableContainer elevation={1} sx={{ borderRadius: 2, marginTop:"20px", background:"white", padding:'10px' }}>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell padding="checkbox">
                  {/* <Checkbox
                    checked={selected.length === paginatedRows.length && paginatedRows.length > 0}
                    onChange={handleSelectAll}
                  /> */}
                </StyledTableCell>
                {['Lead Name', 'Phone Number', 'Alternate Number', 'Gmail', 'Location', 'Loan Amount', 'Loan Type', 'Lead Created Date', 'Option'].map((label) => (
                  <StyledTableCell key={label} sx={{ fontWeight: 600, color: "#363636" }}>
                    {label}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {leadsData?.leads?.map((row,index) => (
                <StyledTableRow key={row._id}>
                  <StyledTableCell padding="checkbox">
                    {/* <Checkbox
                      checked={selected.includes(row._id)}
                      onChange={() => handleSelectRow(row._id)}
                    /> */}

{(leadsData?.pagination?.currentPage - 1) * leadsData?.pagination?.leadsPerPage + index + 1}

                  </StyledTableCell>
                  <StyledTableCell>{row?.leadName}</StyledTableCell>
                  <StyledTableCell>{row?.phone}</StyledTableCell>
                  <StyledTableCell>{row?.alternativePhone}</StyledTableCell>
                  <StyledTableCell>{row?.email}</StyledTableCell>
                  <StyledTableCell>{row?.location}</StyledTableCell>
                  <StyledTableCell>{row?.loanAmount}</StyledTableCell>
                  <StyledTableCell>{row?.loanType}</StyledTableCell>
                  <StyledTableCell>{ formatDate(  row?.LeadCreatedDate)}</StyledTableCell>
                  <StyledTableCell>
                    <IconButton  onClick={()=>navigate(`/viewLeadData/${row._id}`)}><Visibility fontSize="small" /></IconButton>
                    <IconButton onClick={()=>navigate(`/editLeadForm/${row._id}`)}><Edit fontSize="small" /></IconButton>
                    <IconButton  onClick={()=>handleDeleteLead(row._id)}><Delete fontSize="small" /></IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}

        </TableContainer>

          <DeleteModal
                                        isOpen={opendeleteModal}
                                        close={()=>setOpenDeleteModal(false)}
                                        handleSubmit={handleDeleteSubmit}
                                        heading="Confirm Deletion"
                                        description="Are you sure you want to delete this Lead?"
                                        loading={deleteLoading}
                                />
          <CustomPagination
            page={leadsData?.pagination?.currentPage}
            count={leadsData?.pagination?.totalPages}
            rowsPerPage={leadsData?.pagination?.leadsPerPage}
            onChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
          />
          </>
          )}
 </>
      )}
      </Box>
    </MainLayout>
  );
}
