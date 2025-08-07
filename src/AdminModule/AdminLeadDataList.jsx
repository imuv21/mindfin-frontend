import React, { useState } from 'react';
import {
  styled,
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Checkbox, IconButton, Typography
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import Filterbar from '../AdminModule/Components/Filterbar';
import CustomPagination from '../AdminModule/Components/Pagination';
import AssignTelecallerModal from '../AdminModule/AssignTeleModal';
import { useNavigate } from 'react-router-dom';



const StyledTableRow = styled(TableRow)(() => ({
  height: 44,
  lineHeight: '44px',
  fontSize: '14px',
  color: '#363636',
  borderBottom: 'none'
}));

const StyledTableCell = styled(TableCell)(() => ({
  padding: 0,
  height: 44,
  lineHeight: '44px',
  fontSize: '14px',
  color: "#818181",
}));

const leads = new Array(23).fill(null).map((_, index) => ({
  id: index + 1,
  name: 'Uday',
  phone: '985475213',
  altPhone: '985475213',
  email: 'lead@gmail.com',
  location: 'Bangalore',
  amount: '1,200,000',
  type: 'Personal',
  date: '2025-03-10',
  representative: "telecaller",
}));

export default function AdminLeadDataList() {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const navigate = useNavigate();

  const totalPages = Math.ceil(leads.length / rowsPerPage);
  const paginatedRows = leads.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSelectAll = (event) => {
    const paginated = paginatedRows.map((row) => row.id);
    setSelected(event.target.checked ? paginated : []);
  };

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    setSelected([]);
  };

  const handleRowsPerPageChange = (newRows) => {
    setRowsPerPage(newRows);
    setPage(1);
  };

  const handleOpenModal = (id) => {
    setSelectedLeadId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLeadId(null);
  };

  const handleAssignTelecaller = (leadId, telecallerName) => {
    console.log(`Assigned ${telecallerName} to Lead ID ${leadId}`);
    // Future: API call or UI update can be added here
  };

  return (
    <MainLayout>
      <ProfileHeader  name='Leads Data'/>
      <Box p={2}>
        <Filterbar />

        <TableContainer elevation={1} sx={{ borderRadius: 2, marginTop: "20px", background: "white", padding: '10px' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1400 }}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell padding="checkbox" sx={{ border: 'none', background: "#F8FAFC" }}>
                    <Checkbox
                      checked={selected.length === paginatedRows.length && paginatedRows.length > 0}
                      onChange={handleSelectAll}
                    />
                  </StyledTableCell>
                  {['Lead Name', 'Phone Number', 'Alternate Number', 'Gmail', 'Location', 'Loan Amount', 'Loan Type', 'Lead Created Date', 'Representatives', 'Assign Telecaller', 'Option'].map((label) => (
                    <StyledTableCell key={label} sx={{ fontWeight: 600, color: "#363636", border: 'none', background: "#F8FAFC" }}>
                      {label}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(row.id)}
                        onChange={() => handleSelectRow(row.id)}
                      />
                    </StyledTableCell>
                    <StyledTableCell>{row.name}</StyledTableCell>
                    <StyledTableCell>{row.phone}</StyledTableCell>
                    <StyledTableCell>{row.altPhone}</StyledTableCell>
                    <StyledTableCell>{row.email}</StyledTableCell>
                    <StyledTableCell>{row.location}</StyledTableCell>
                    <StyledTableCell>{row.amount}</StyledTableCell>
                    <StyledTableCell>{row.type}</StyledTableCell>
                    <StyledTableCell>{row.date}</StyledTableCell>
                    <StyledTableCell>{row.representative}</StyledTableCell>
                    <StyledTableCell>
                      <button
                        className="text-blue-600 font-semibold underline"
                        onClick={() => handleOpenModal(row.id)}
                      >
                        Assign
                      </button>
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton onClick={() => navigate('/adminViewDataList')}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => navigate('/adminEditDataList')}>
                        <Edit fontSize="small" />
                      </IconButton>


                      <IconButton><Delete fontSize="small" /></IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <CustomPagination
            page={page}
            count={totalPages}
            rowsPerPage={rowsPerPage}
            onChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </TableContainer>
      </Box>

      {/* Assign Modal */}
      <AssignTelecallerModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onAssign={handleAssignTelecaller}
        leadId={selectedLeadId}
      />
    </MainLayout>
  );
}









// //with api testing

// import React, { useEffect, useState } from 'react';
// import {
//   styled,
//   Box, Paper, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Checkbox, IconButton, Typography
// } from '@mui/material';
// import { Edit, Delete, Visibility } from '@mui/icons-material';
// import MainLayout from '../AdminModule/layout/MainLayout';
// import ProfileHeader from '../AdminModule/layout/ProfileHeader';
// import Filterbar from '../AdminModule/Components/Filterbar';
// import CustomPagination from '../AdminModule/Components/Pagination';
// import AssignTelecallerModal from '../AdminModule/AssignTeleModal';
// import { useNavigate } from 'react-router-dom';
// import api from '../helpers/Api';

// const StyledTableRow = styled(TableRow)(() => ({
//   height: 44,
//   lineHeight: '44px',
//   fontSize: '14px',
//   color: '#363636',
//   borderBottom: 'none'
// }));

// const StyledTableCell = styled(TableCell)(() => ({
//   padding: 0,
//   height: 44,
//   lineHeight: '44px',
//   fontSize: '14px',
//   color: "#818181",
// }));

// export default function AdminLeadDataList() {
//   const [selected, setSelected] = useState([]);
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedLeadId, setSelectedLeadId] = useState(null);
//   const [telecallers, setTelecallers] = useState([]);
//   const [leads, setLeads] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         const res = await api.getAllLeads();
//         setLeads(res.data.data || []);
//       } catch (error) {
//         console.error("Error fetching leads:", error);
//       }
//     };
//     fetchLeads();
//   }, []);

//   const totalPages = Math.ceil(leads.length / rowsPerPage);
//   const paginatedRows = leads.slice((page - 1) * rowsPerPage, page * rowsPerPage);

//   const handleSelectAll = (event) => {
//     const paginated = paginatedRows.map((row) => row._id);
//     setSelected(event.target.checked ? paginated : []);
//   };

//   const handleSelectRow = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//     setSelected([]);
//   };

//   const handleRowsPerPageChange = (newRows) => {
//     setRowsPerPage(newRows);
//     setPage(1);
//   };

//   const handleOpenModal = async (id) => {
//     setSelectedLeadId(id);
//     try {
//       const res = await api.getAllTelecallers();
//       setTelecallers(res.data.data || []);
//     } catch (error) {
//       console.error("Error fetching telecallers:", error);
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedLeadId(null);
//   };

//   const handleAssignTelecaller = async (leadId, telecallerId) => {
//     try {
//       const res = await api.assignLeadToEmployee({
//         leadId: leadId,
//         employeeId: telecallerId,
//       });
//       console.log("Lead assigned successfully:", res.data.message);
//       handleCloseModal();
//     } catch (error) {
//       console.error("Failed to assign lead:", error);
//     }
//   };

//   return (
//     <MainLayout>
//       <ProfileHeader name='Leads Data' />
//       <Box p={2}>
//         <Filterbar />

//         <TableContainer elevation={1} sx={{ borderRadius: 2, marginTop: "20px", background: "white", padding: '10px' }}>
//           <Box sx={{ overflowX: 'auto' }}>
//             <Table sx={{ minWidth: 1400 }}>
//               <TableHead>
//                 <StyledTableRow>
//                   <StyledTableCell padding="checkbox" sx={{ border: 'none', background: "#F8FAFC" }}>
//                     <Checkbox
//                       checked={selected.length === paginatedRows.length && paginatedRows.length > 0}
//                       onChange={handleSelectAll}
//                     />
//                   </StyledTableCell>
//                   {["Lead Name", "Phone Number", "Alternate Number", "Gmail", "Location", "Loan Amount", "Loan Type", "Lead Created Date", "Representatives", "Assign Telecaller", "Option"].map((label) => (
//                     <StyledTableCell key={label} sx={{ fontWeight: 600, color: "#363636", border: 'none', background: "#F8FAFC" }}>
//                       {label}
//                     </StyledTableCell>
//                   ))}
//                 </StyledTableRow>
//               </TableHead>
//               <TableBody>
//                 {paginatedRows.map((row) => (
//                   <StyledTableRow key={row._id}>
//                     <StyledTableCell padding="checkbox">
//                       <Checkbox
//                         checked={selected.includes(row._id)}
//                         onChange={() => handleSelectRow(row._id)}
//                       />
//                     </StyledTableCell>
//                     <StyledTableCell>{row.name}</StyledTableCell>
//                     <StyledTableCell>{row.phone}</StyledTableCell>
//                     <StyledTableCell>{row.altPhone}</StyledTableCell>
//                     <StyledTableCell>{row.email}</StyledTableCell>
//                     <StyledTableCell>{row.location}</StyledTableCell>
//                     <StyledTableCell>{row.amount}</StyledTableCell>
//                     <StyledTableCell>{row.type}</StyledTableCell>
//                     <StyledTableCell>{row.date}</StyledTableCell>
//                     <StyledTableCell>{row.representative}</StyledTableCell>
//                     <StyledTableCell>
//                       <button
//                         className="text-blue-600 font-semibold underline"
//                         onClick={() => handleOpenModal(row._id)}
//                       >
//                         Assign
//                       </button>
//                     </StyledTableCell>
//                     <StyledTableCell>
//                       <IconButton onClick={() => navigate('/adminViewDataList')}>
//                         <Visibility fontSize="small" />
//                       </IconButton>
//                       <IconButton onClick={() => navigate('/adminEditDataList')}>
//                         <Edit fontSize="small" />
//                       </IconButton>
//                       <IconButton>
//                         <Delete fontSize="small" />
//                       </IconButton>
//                     </StyledTableCell>
//                   </StyledTableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </Box>

//           <CustomPagination
//             page={page}
//             count={totalPages}
//             rowsPerPage={rowsPerPage}
//             onChange={handlePageChange}
//             onRowsPerPageChange={handleRowsPerPageChange}
//           />
//         </TableContainer>
//       </Box>

//       <AssignTelecallerModal
//         isOpen={showModal}
//         onClose={handleCloseModal}
//         onAssign={handleAssignTelecaller}
//         leadId={selectedLeadId}
//         telecallers={telecallers}
//       />
//     </MainLayout>
//   );
// }


