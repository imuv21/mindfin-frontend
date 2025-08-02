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
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../redux/userSlice";
import Toastify from "../../helpers/Toastify";


const ProfileHeader = ({ name = "Brooklyn Simmons", breadcrumbs = [] }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(logout());
      sessionStorage.clear();
      Toastify.success("Logout Successfully.");
      navigate('/login');
    } catch (error) {
      Toastify.error('Something went wrong!');
    }
  }

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={3}
      py={2}
      sx={{ backgroundColor: '#fff' }}
    >
      {/* Left Side: Breadcrumb + Name */}
      <Box>
        <Typography fontWeight={600} fontSize="20px" mt={0.5}>
          {name}
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '14px' }}>
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
        <IconButton
          sx={{
            width: 36,
            height: 36,
            borderRadius: '8px',
            background: '#A2A1A81A',
          }}
        >
          <NotificationsNoneIcon fontSize="small" />
        </IconButton>

        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            py: 0.75,
            borderRadius: '12px',
            cursor: 'pointer',
            border: '1px solid #E5E7EB',
          }}
          onClick={handleMenuOpen}
        >
          <Avatar
            src={user?.user?.profileImg?.[0] || ""}
            sx={{ width: 30, height: 30, mr: 1 }}
          />
          <Box>
            <Typography fontSize="14px" fontWeight={500} mr={0.5}>
              {user?.user?.firstName} {user?.user?.lastName}
            </Typography>
            <Typography fontSize="12px">{user?.user?.designation?.designation}</Typography>
          </Box>
          <ExpandMoreIcon fontSize="12px" sx={{ color: '#6B7280' }} />
        </Paper>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => navigate(`/myProfile`)}>Profile</MenuItem>
          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default ProfileHeader;
