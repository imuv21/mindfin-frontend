import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Avatar,
  Chip,
  Button
} from '@mui/material';
import { format } from 'date-fns';
import { Skeleton } from '@mui/material';
import { useState } from 'react';
import api from '../../helpers/Api'
import { useEffect } from 'react';
import { getISTTimeOnly } from '../../helpers/conversion';
import { useNavigate } from 'react-router-dom';

const attendanceData = [
  {
    name: 'Leasie Watson',
    role: 'Team Lead - Design',
    type: 'Office',
    time: '09:27 AM',
    status: 'On Time',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    name: 'Darlene Robertson',
    role: 'Web Designer',
    type: 'Office',
    time: '10:15 AM',
    status: 'Late',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    name: 'Jacob Jones',
    role: 'Medical Assistant',
    type: 'Remote',
    time: '10:24 AM',
    status: 'Late',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    name: 'Kathryn Murphy',
    role: 'Marketing Coordinator',
    type: 'Office',
    time: '09:10 AM',
    status: 'On Time',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    name: 'Leslie Alexander',
    role: 'Data Analyst',
    type: 'Office',
    time: '09:15 AM',
    status: 'On Time',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  {
    name: 'Ronald Richards',
    role: 'Phyton Developer',
    type: 'Remote',
    time: '09:29 AM',
    status: 'On Time',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
  },
  {
    name: 'Jenny Wilson',
    role: 'React JS Developer',
    type: 'Remote',
    time: '11:30 AM',
    status: 'Late',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg'
  }
];

// const getStatusColor = (status) => {
//   switch (status) {
//     case 'ONTIME':
//       return 'success';
//     case 'LATE':
//       return 'error';
//     default:
//       return 'default';
//   }
// };

const getStatusColor = (status) => {
  switch (status) {
    case 'ONTIME':
      return 'success';    
    case 'LATE':
      return 'warning';    
    case 'HALFDAY':
      return 'info';      
    case 'ABSENT':
      return 'error';       
    default:
      return 'default';     
  }
};




export default function AttendanceOverviewTable() {
     const navigate = useNavigate()
     const [loading , setLoading ] = useState(false)
     const [data,setData] = useState([])



     const stats = [
      {
        label: 'On time',
        value: data?.totalOnTime ?? "-",
        updated : ` ${format(new Date(), 'MMMM dd, yyyy')}`,
        icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="5" fill="#7152F3" fill-opacity="0.05" />
          <ellipse cx="20" cy="23.7501" rx="5" ry="2.08333" stroke="#2563EB" stroke-width="1.5" stroke-linejoin="round" />
          <ellipse cx="20" cy="16.6667" rx="2.5" ry="2.5" stroke="#2563EB" stroke-width="1.5" stroke-linejoin="round" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6282 20.9185C14.4842 20.9391 13.4223 21.1326 12.6079 21.4584C12.1786 21.6301 11.7808 21.8534 11.4781 22.1396C11.1738 22.4274 10.916 22.8305 10.916 23.3333C10.916 23.8361 11.1738 24.2392 11.4781 24.5269C11.7808 24.8132 12.1786 25.0364 12.6079 25.2081C13.0775 25.396 13.6294 25.5399 14.2318 25.632C13.6963 25.1138 13.3751 24.5169 13.3366 23.8797C13.2773 23.8589 13.22 23.8375 13.1649 23.8154C12.8402 23.6855 12.6278 23.5496 12.5088 23.4371C12.4558 23.387 12.4318 23.3524 12.4213 23.3333C12.4318 23.3142 12.4558 23.2795 12.5088 23.2295C12.6278 23.1169 12.8402 22.981 13.1649 22.8511C13.2965 22.7985 13.4404 22.7493 13.5953 22.7043C13.9569 22.0024 14.6733 21.3853 15.6282 20.9185ZM12.4139 23.3508C12.4138 23.3508 12.414 23.3494 12.415 23.3467C12.4145 23.3494 12.414 23.3508 12.4139 23.3508ZM12.415 23.3199C12.414 23.3172 12.4138 23.3158 12.4139 23.3158C12.414 23.3158 12.4145 23.3172 12.415 23.3199Z" fill="#2563EB" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M26.6627 23.8797C26.6242 24.5169 26.303 25.1138 25.7675 25.632C26.3699 25.5399 26.9218 25.396 27.3914 25.2081C27.8207 25.0364 28.2185 24.8132 28.5212 24.5269C28.8254 24.2392 29.0833 23.8361 29.0833 23.3333C29.0833 22.8305 28.8254 22.4274 28.5212 22.1396C28.2185 21.8534 27.8207 21.6301 27.3914 21.4584C26.577 21.1326 25.5151 20.9391 24.3711 20.9185C25.3259 21.3853 26.0424 22.0024 26.404 22.7043C26.5589 22.7493 26.7028 22.7985 26.8343 22.8511C27.159 22.981 27.3715 23.1169 27.4905 23.2295C27.5434 23.2795 27.5675 23.3142 27.578 23.3333C27.5675 23.3524 27.5434 23.387 27.4905 23.4371C27.3715 23.5496 27.159 23.6855 26.8343 23.8154C26.7793 23.8375 26.722 23.8589 26.6627 23.8797ZM27.5854 23.3508C27.5853 23.3508 27.5848 23.3494 27.5843 23.3467C27.5853 23.3494 27.5855 23.3508 27.5854 23.3508ZM27.5843 23.3199C27.5848 23.3172 27.5853 23.3158 27.5854 23.3158C27.5855 23.3158 27.5853 23.3172 27.5843 23.3199Z" fill="#2563EB" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M23.814 18.3464C23.6076 18.8144 23.3176 19.2372 22.9629 19.596C23.3173 19.7999 23.7283 19.9166 24.1665 19.9166C25.5012 19.9166 26.5832 18.8346 26.5832 17.4999C26.5832 16.1652 25.5012 15.0833 24.1665 15.0833C24.0637 15.0833 23.9623 15.0897 23.8629 15.1021C24.0488 15.5609 24.1554 16.0603 24.1657 16.5833C24.166 16.5833 24.1662 16.5833 24.1665 16.5833C24.6728 16.5833 25.0832 16.9937 25.0832 17.4999C25.0832 18.0062 24.6728 18.4166 24.1665 18.4166C24.0416 18.4166 23.9226 18.3916 23.814 18.3464Z" fill="#2563EB" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1363 15.1021C16.0369 15.0897 15.9355 15.0833 15.8327 15.0833C14.498 15.0833 13.416 16.1652 13.416 17.4999C13.416 18.8346 14.498 19.9166 15.8327 19.9166C16.2709 19.9166 16.6819 19.7999 17.0363 19.596C16.6816 19.2372 16.3916 18.8144 16.1851 18.3464C16.0766 18.3916 15.9576 18.4166 15.8327 18.4166C15.3264 18.4166 14.916 18.0062 14.916 17.4999C14.916 16.9937 15.3264 16.5833 15.8327 16.5833C15.833 16.5833 15.8332 16.5833 15.8335 16.5833C15.8438 16.0603 15.9504 15.5609 16.1363 15.1021Z" fill="#2563EB" />
        </svg>
        ,
      },
      {
        label: 'Late',
        value: data?.totalLate ?? "-",
        updated : ` ${format(new Date(), 'MMMM dd, yyyy')}`,
        icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="5" fill="#7152F3" fill-opacity="0.05" />
        <ellipse cx="20" cy="23.7501" rx="5" ry="2.08333" stroke="#2563EB" stroke-width="1.5" stroke-linejoin="round" />
        <ellipse cx="20" cy="16.6667" rx="2.5" ry="2.5" stroke="#2563EB" stroke-width="1.5" stroke-linejoin="round" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6282 20.9185C14.4842 20.9391 13.4223 21.1326 12.6079 21.4584C12.1786 21.6301 11.7808 21.8534 11.4781 22.1396C11.1738 22.4274 10.916 22.8305 10.916 23.3333C10.916 23.8361 11.1738 24.2392 11.4781 24.5269C11.7808 24.8132 12.1786 25.0364 12.6079 25.2081C13.0775 25.396 13.6294 25.5399 14.2318 25.632C13.6963 25.1138 13.3751 24.5169 13.3366 23.8797C13.2773 23.8589 13.22 23.8375 13.1649 23.8154C12.8402 23.6855 12.6278 23.5496 12.5088 23.4371C12.4558 23.387 12.4318 23.3524 12.4213 23.3333C12.4318 23.3142 12.4558 23.2795 12.5088 23.2295C12.6278 23.1169 12.8402 22.981 13.1649 22.8511C13.2965 22.7985 13.4404 22.7493 13.5953 22.7043C13.9569 22.0024 14.6733 21.3853 15.6282 20.9185ZM12.4139 23.3508C12.4138 23.3508 12.414 23.3494 12.415 23.3467C12.4145 23.3494 12.414 23.3508 12.4139 23.3508ZM12.415 23.3199C12.414 23.3172 12.4138 23.3158 12.4139 23.3158C12.414 23.3158 12.4145 23.3172 12.415 23.3199Z" fill="#2563EB" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M26.6627 23.8797C26.6242 24.5169 26.303 25.1138 25.7675 25.632C26.3699 25.5399 26.9218 25.396 27.3914 25.2081C27.8207 25.0364 28.2185 24.8132 28.5212 24.5269C28.8254 24.2392 29.0833 23.8361 29.0833 23.3333C29.0833 22.8305 28.8254 22.4274 28.5212 22.1396C28.2185 21.8534 27.8207 21.6301 27.3914 21.4584C26.577 21.1326 25.5151 20.9391 24.3711 20.9185C25.3259 21.3853 26.0424 22.0024 26.404 22.7043C26.5589 22.7493 26.7028 22.7985 26.8343 22.8511C27.159 22.981 27.3715 23.1169 27.4905 23.2295C27.5434 23.2795 27.5675 23.3142 27.578 23.3333C27.5675 23.3524 27.5434 23.387 27.4905 23.4371C27.3715 23.5496 27.159 23.6855 26.8343 23.8154C26.7793 23.8375 26.722 23.8589 26.6627 23.8797ZM27.5854 23.3508C27.5853 23.3508 27.5848 23.3494 27.5843 23.3467C27.5853 23.3494 27.5855 23.3508 27.5854 23.3508ZM27.5843 23.3199C27.5848 23.3172 27.5853 23.3158 27.5854 23.3158C27.5855 23.3158 27.5853 23.3172 27.5843 23.3199Z" fill="#2563EB" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M23.814 18.3464C23.6076 18.8144 23.3176 19.2372 22.9629 19.596C23.3173 19.7999 23.7283 19.9166 24.1665 19.9166C25.5012 19.9166 26.5832 18.8346 26.5832 17.4999C26.5832 16.1652 25.5012 15.0833 24.1665 15.0833C24.0637 15.0833 23.9623 15.0897 23.8629 15.1021C24.0488 15.5609 24.1554 16.0603 24.1657 16.5833C24.166 16.5833 24.1662 16.5833 24.1665 16.5833C24.6728 16.5833 25.0832 16.9937 25.0832 17.4999C25.0832 18.0062 24.6728 18.4166 24.1665 18.4166C24.0416 18.4166 23.9226 18.3916 23.814 18.3464Z" fill="#2563EB" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1363 15.1021C16.0369 15.0897 15.9355 15.0833 15.8327 15.0833C14.498 15.0833 13.416 16.1652 13.416 17.4999C13.416 18.8346 14.498 19.9166 15.8327 19.9166C16.2709 19.9166 16.6819 19.7999 17.0363 19.596C16.6816 19.2372 16.3916 18.8144 16.1851 18.3464C16.0766 18.3916 15.9576 18.4166 15.8327 18.4166C15.3264 18.4166 14.916 18.0062 14.916 17.4999C14.916 16.9937 15.3264 16.5833 15.8327 16.5833C15.833 16.5833 15.8332 16.5833 15.8335 16.5833C15.8438 16.0603 15.9504 15.5609 16.1363 15.1021Z" fill="#2563EB" />
      </svg>
        ,
      },
      
    ];

 const fetchData = async() =>{
    setLoading(true)
    try {

      const {data,status} = await api.dashboardAttendence()
      console.log(data,"dashboard data");
      if (status === 200){
        setData(data)
      }
      
    } catch (error) {
      console.log(error);
      
    }
    finally{
      setLoading(false)

    }
  }

  useEffect(()=>{
    fetchData()
  },[])


   
console.log(data,"atten dash");



  return (

    <div>
      
      <div className="flex flex-wrap gap-4 mb-7">
  {stats.map((stat, index) => (
    <div
      key={index}
      className="bg-white border border-[#D9D9D9] rounded-[8px] py-4 flex flex-col justify-between h-full ml-4.5"
      style={{ flex: '1 1 45%', maxWidth: '31%' }} // Ensures only two per row
    >
      <div className="flex items-center gap-3 px-4">
        <div>
          {loading ? <Skeleton variant="circular" width={40} height={40} /> : stat.icon}
        </div>
        <span className="text-gray-700 font-medium">
          {loading ? <Skeleton width="100px" /> : stat.label}
        </span>
      </div>
      <div className="text-3xl font-bold mt-3 mb-2 pb-2 px-4 text-black border-b border-[#D9D9D9]">
        {loading ? <Skeleton width="100px" /> : stat.value}
      </div>
      <p className="text-xs text-gray-400 mt-auto px-4">
        {loading ? <Skeleton width="80px" /> : `Update: ${stat.updated}`}
      </p>
    </div>
  ))}
</div>

      <div className="flex flex-col border border-[#D9D9D9] rounded-[8px] p-4">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontWeight={600}>Attendance Overview</Typography>
          <Button variant="outlined" size="small" onClick={()=>navigate("/allAttendance")}>View All</Button>
        </Box>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Check In Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
  {data?.attendanceDetails?.length > 0 ? (
    data.attendanceDetails.map((item, index) => (
      <TableRow key={item._id}>
        <TableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar src={item?.employee?.profileImg[0]} alt={item?.employee?.firstName} sx={{ width: 32, height: 32 }} />
            <Typography variant="body2">{item?.employee?.firstName} {item?.employee?.lastName}</Typography>
          </Box>
        </TableCell>
        <TableCell>{item?.employee?.designation?.designation}</TableCell>
        <TableCell>{item?.employee?.jobType}</TableCell>
        <TableCell>{getISTTimeOnly(item?.checkIn)}</TableCell>
        <TableCell>
          <Chip label={item?.status} color={getStatusColor(item?.status)} size="small" />
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={5} align="center">
        No attendance data found
      </TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </div>
      </div>
  );
}
