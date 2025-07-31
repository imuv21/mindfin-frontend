// src/components/auth/MultiBranchModal.jsx
import React from 'react';
import { Modal, Box, Typography, Button, List, CircularProgress } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
//   boxShadow: 24,
  borderRadius: '16px', // Apply border radius
  p: 4,
};

const MultiBranchModal = ({ branches, onSelect, onClose, loading }) => {
  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h1"
          textAlign="center"
          fontWeight="bold"
        >
          Select Branch
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100px">
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {branches.map((branch) => (
              <Button
                key={branch._id}
                onClick={() => onSelect(branch._id)}
                fullWidth
                sx={{ my: 1, fontWeight: 'bold' }} // Apply font weight to buttons
              >
                {branch.name}
              </Button>
            ))}
          </List>
        )}
      </Box>
    </Modal>
  );
};

export default MultiBranchModal;