import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Avatar,
    IconButton,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    Button,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MainLayout from '@/components/layout/MainLayout';
import ProfileHeader from '@/components/layout/ProfileHeader';
import api from "../../helpers/Api"
import Toastify from '../../helpers/Toastify';
import { useNavigate } from 'react-router-dom';
const departments = [
    {
        name: "Data entry",
        members: [
            { name: "Dianne Russell", role: "Branch" },
            { name: "Arlene McCoy", role: "Branch" },
            { name: "Cody Fisher", role: "Branch" },
            { name: "Theresa Webb", role: "Branch" },
            { name: "Ronald Richards", role: "Branch" }
        ]
    },
    {
        name: "Marketing",
        members: [
            { name: "Darrell Steward", role: "Branch" },
            { name: "Kristin Watson", role: "Branch" },
            { name: "Courtney Henry", role: "Branch" },
            { name: "Kathryn Murphy", role: "Branch" },
            { name: "Albert Flores", role: "Branch" }
        ]
    },
    {
        name: "Telecallers",
        members: [
            { name: "Leslie Alexander", role: "Project Manager" },
            { name: "Ronald Richards", role: "Branch" },
            { name: "Savannah Nguyen", role: "Project Manager" },
            { name: "Eleanor Pena", role: "Branch" },
            { name: "Esther Howard", role: "Project Manager" }
        ]
    },
    {
        name: "HR",
        members: [
            { name: "Wade Warren", role: "Sr. Marketing Manager" },
            { name: "Brooklyn Simmons", role: "Marketing Coordinator" },
            { name: "Kristin Watson", role: "Marketing Coordinator" },
            { name: "Jacob Jones", role: "Branch" },
            { name: "Cody Fisher", role: "Marketing" }
        ]
    }
];

export default function AllDesignations() {

    const navigate = useNavigate()
    const [filter, setFilter] = React.useState('');
    
    const [name,setName] = useState('')
    const [employeees,setAllEmployees] = useState([])
    const [loading,setLoading] = useState(false)


    const fetchEmployess = async ()=>{
          setLoading(true)
        try {

            const {data,status} = await api.getAlldepartmentEmployees(name)

            console.log(data,"response");

            if(status === 200){
                setAllEmployees(data.data)              
            }
            
            
            
        } catch (error) {
                Toastify.error(error.response.data.message || `something went wrong`);
            
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchEmployess()
    },[name])

    console.log(employeees,"frpm the mapp");


    // Group by designation
// const grouped = employeees.reduce((acc, curr) => {
//     const designation = curr.designation.designation;
//     if (!acc[designation]) {
//       acc[designation] = [];
//     }
//     acc[designation].push(curr);
//     return acc;
//   }, {});
  
const grouped = employeees.reduce((acc, emp) => {
    const key = emp.designation?.designation;
    if (!acc[key]) {
      acc[key] = { id: emp.designation?._id, members: [] };
    }
    acc[key].members.push(emp);
    return acc;
  }, {});

  // Convert to array format
//   const departments = Object.entries(grouped).map(([name, members]) => ({
//     name,
//     members: members.slice(0, 10) // only show first 10
//   }));

    console.log(departments,"department");
    
    const handleViewAll = (designationId) => {
        
          navigate(`/allDepartments/${designationId}`);
      };


    return (
        <MainLayout>
            <ProfileHeader
            name="All Destination"
            breadcrumbs={["All Destination Information"]}
            />
            <div className="container mx-auto p-4">
                <div className="flex flex-col border border-[#D9D9D9] rounded-[8px] p-4">
                    <Box >
                        {/* Top Controls */}
                        <Box display="flex" justifyContent="space-between" mb={4}>
                            {/* Search Field */}
                            <TextField
                                placeholder="Search"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ width: 280 }}
                                value={name}
                                name='name'
                                onChange={(e)=>setName(e.target.value)}
                            />
                        </Box>

                      
                        <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
  {loading ? (
    <Box display="flex" justifyContent="center" py={5}>
      <CircularProgress />
    </Box>
  ) : Object.keys(grouped).length === 0 ? (
    <Typography textAlign="center" color="text.secondary">No data found</Typography>
  ) : (
    <Grid container spacing={3}>
      {Object.entries(grouped).slice(0, 10).map(([designation, value]) => (
        <Grid item width='48%' key={designation}>
          <Box sx={{ p: 2, borderRadius: 3, border: "1px solid #A2A1A833" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ borderBottom: "1px solid #A2A1A833" }}>
              <Box mb={1}>
                <Typography fontWeight={600}>{designation}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {/* {value?.members?.length} Members */}
                  {value?.members?.length} {value?.members?.length === 1 ? "Member" : "Members"}

                </Typography>
              </Box>
              <Button
                size="small"
                sx={{ textTransform: 'none', fontSize: 14 }}
                onClick={() => handleViewAll(value.id)}
              >
                View All
              </Button>
            </Box>

            {/* Members List (limited to 10) */}
            {value.members.slice(0, 10).map((member) => (
              <Box key={member._id} display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar sx={{ width: 32, height: 32 }} src={member.profileImg?.[0]} />
                  <Box>
                    <Typography fontSize={14}>{member.firstName} {member.lastName}</Typography>
                    <Typography fontSize={12} color="text.secondary">{member.designation?.designation}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      ))}
    </Grid>
  )}
</Box>

                    </Box>
                </div>
            </div>
        </MainLayout>
    );
}
