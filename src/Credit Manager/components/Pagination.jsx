import React from 'react';
import {
  Box,
  MenuItem,
  Select,
  Typography,
  Pagination,
  PaginationItem
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

export default function CustomPagination({ page, count, rowsPerPage, onChange, onRowsPerPageChange }) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={2}
      py={2}
      sx={{ borderTop: '1px solid #eee' }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="body2" fontWeight="bold">Show rows:</Typography>
        <Select
          size="small"
          value={Number(rowsPerPage)}
          onChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
          sx={{ borderRadius: 2, fontSize: 14, minWidth: 100 }}
        >
          <MenuItem value={1}>1 Items</MenuItem> 
          <MenuItem value={2}>2 Items</MenuItem>
          <MenuItem value={10}>10 Items</MenuItem>
        </Select>
      </Box>

      <Pagination
        page={Number(page)}
        count={count}
        onChange={onChange}
        variant="outlined"
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
            border: "1px solid #2563EB",
          },
          "& .MuiPaginationItem-root:hover": {
            color: "#fff",
            backgroundColor: "#2563EB",
          },
        }}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            components={{ previous: ArrowBackIos, next: ArrowForwardIos }}
            sx={{
              borderRadius: 2,
              minWidth: 36,
              height: 36,
              fontSize: 14,
              borderColor: '#e0e0e0'
            }}
          />
        )}
      />
    </Box>
  );
}
