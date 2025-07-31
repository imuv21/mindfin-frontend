import React, { useState } from 'react';
import {
  styled,
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Checkbox, IconButton, Typography
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import MainLayout from '../DataEntry/layout/MainLayout';
import ProfileHeader from '../DataEntry/layout/ProfileHeader';
import Filterbar from '../DataEntry/Components/Filterbar';
import CustomPagination from '../DataEntry/Components/Pagination';

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
 /*  assign: 'assign' */
}));

export default function AdminLeadDataList() {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1); // page is 1-based for MUI Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(leads.length / rowsPerPage);

  const handleSelectAll = (event) => {
    const paginatedRows = leads.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    if (event.target.checked) {
      const allIds = paginatedRows.map((row) => row.id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    setSelected([]); // optional: clear selected on page change
  };

  const handleRowsPerPageChange = (newRows) => {
    setRowsPerPage(newRows);
    setPage(1); // reset to first page when rowsPerPage changes
  };

  const paginatedRows = leads.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (

    <MainLayout>
      <ProfileHeader />
      <Box p={2}>
        <Filterbar />

        <TableContainer elevation={1} sx={{ borderRadius: 2, marginTop: "20px", background: "white", padding: '10px' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1400 }}>
              <TableHead >
                <StyledTableRow >
                  <StyledTableCell padding="checkbox" sx={{ border: 'none', background:"#F8FAFC", }}>
                    <Checkbox
                      checked={selected.length === paginatedRows.length && paginatedRows.length > 0}
                      onChange={handleSelectAll}
                    />
                  </StyledTableCell>
                  {['Lead Name', 'Phone Number', 'Alternate Number', 'Gmail', 'Location', 'Loan Amount', 'Loan Type', 'Lead Created Date', 'Representatives', 'Assign Telecaller', 'Option'].map((label) => (
                    <StyledTableCell key={label} sx={{ fontWeight: 600, color: "#363636",border: 'none' , background:"#F8FAFC" }}>
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
                      <div  className="text-[#2563EB] font-semibold underline">
                      <a href='#' >Assign </a></div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton><Visibility fontSize="small" /></IconButton>
                      <IconButton><Edit fontSize="small" /></IconButton>
                      <IconButton><Delete fontSize="small" /></IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {/* Pagination */}
          <CustomPagination
            page={page}
            count={totalPages}
            rowsPerPage={rowsPerPage}
            onChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </TableContainer>
      </Box>
    </MainLayout>
  );
}
