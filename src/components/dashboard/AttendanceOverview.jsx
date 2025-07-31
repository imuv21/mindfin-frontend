import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../helpers/Api";
import { format, parseISO } from 'date-fns';
import { Skeleton, Box } from '@mui/material';




const AttendanceOverview = () => {

  const [data,setData] = useState([])
  const [loading , setLoading ] = useState(false)


  const fetchData = async() =>{
    setLoading(true)
    try {

      const {data,status} = await api.getWeeklyAttendanceGraph()
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


  console.log(data,"graph");




  return (
    <div className="bg-white p-4 border border-[#D9D9D9] rounded-[8px]  w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Attendance Overview</h2>
        <button className="text-sm px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">
          This Week
        </button>
      </div>

      


{loading ? (
  <Box>
    <Skeleton variant="text" width={"100%"} height={30} />
    <Box display="flex" alignItems="flex-end" gap={2} height={300} mt={2}>
      {[...Array(7)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          width={"30%"}
          height={Math.floor(Math.random() * 120) + 80} // random bar height
          sx={{ borderRadius: '4px' }}
        />
      ))}
    </Box>
  </Box>
)  : data.length === 0 ? (
  <Box height={300} display="flex" alignItems="center" justifyContent="center">
    <p className="text-gray-500 text-center text-sm">No attendance data found</p>
  </Box>
) :
 (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} barGap={8}>
      <XAxis
        dataKey="date"
        axisLine={false}
        tickLine={false}
        tickFormatter={(str) => {
          const date = parseISO(str);
          return format(date, 'MMM dd');
        }}
      />
      <YAxis domain={[20, 100]} axisLine={false} tickLine={false} />
      <Tooltip />
      <Legend />
      <Bar dataKey="attendance" fill="#2563eb" name="Attendance" radius={[4, 4, 0, 0]} />
      <Bar dataKey="halfDay" fill="#3b82f6" name="Half Day" radius={[4, 4, 0, 0]} />
      <Bar dataKey="leave" fill="#93c5fd" name="On Leave" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
)}



    </div>
  );
};

export default AttendanceOverview;
