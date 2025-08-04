import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';


const RoleBreadcrumbs = ({ name = "Brooklyn Simmons", breadcrumbs = [] }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate()

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={3}
      py={2}
      sx={{}}
    >
      {/* Left Side: Breadcrumb + Name */}
      <Box>
        <Typography fontWeight={600} fontSize="26px" mt={0.5} color='info'>
          {name}
        </Typography>
        <Breadcrumbs 
        
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"        
         sx={{ fontSize: '14px' }}>
          {breadcrumbs.map((crumb, index) => (
            <Typography
              key={index}
              color={index === breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary'}
              fontWeight={index === breadcrumbs.length - 1 ? 500 : 400}
            >
              {crumb}
            </Typography>
          ))}
        </Breadcrumbs>
      </Box>

      {/* Right Side: Notification + Profile Box */}
      <Box display="flex" alignItems="center" gap={2}>
        <button className="px-6 py-2 text-gray-600 border bg-[#FFFFFF] border-[#97979733] rounded hover:bg-gray-50 cursor-pointer" 
         onClick={()=>  navigate("/leadDataList")
         }
        >
          Back
        </button>
      </Box>
    </Box>
  );
};

export default RoleBreadcrumbs;
