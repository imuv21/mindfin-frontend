import { useEffect, useState } from "react";
import { CircularProgress, Pagination } from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";
import ProfileHeader from "@/components/layout/ProfileHeader";
import {
  styled,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Typography,
  Chip,
  TableContainer,
  Paper,
  Box,
  Card,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AlarmIcon from "@mui/icons-material/Alarm";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import AddHolidayModal from "./AddHolidayModal";
import { useDispatch, useSelector } from "react-redux";
import { getAllHolidays, setFilterValues, setRefresh } from "../../redux/holidaySlice";
import { formatFullDate, getDayName } from "../../helpers/conversion";
import api from "../../helpers/Api";
import EditHolidayModal from "./EditHolidayModal";
import DeleteModal from "@/components/employee/DeleteModal";
import Toastify from "../../helpers/Toastify";

const StyledTableRow = styled(TableRow)(() => ({
  height: 44,
}));

const StyledTableCell = styled(TableCell)(() => ({
  paddingTop: 2,
  paddingBottom: 2,
  height: 44,
  lineHeight: "44px",
}));

export default function AllHolidayLists() {
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [itemsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedHolidayId, setSelectedHolidayId] = useState(null);
  const [opendeleteModal,setOpenDeleteModal] = useState (false)
  const [deleteLoading,setDeleteLoading] = useState(false)


  const { holidayData, isLoading, isRefresh, filterOptions } = useSelector(
    (state) => state.holidays
  );

  console.log(holidayData, "holidayData");

 

  const handlePageChange = (event, page) => {
    console.log("page", page);
    dispatch(setFilterValues({ page }));
  };

  const calculateShowingRange = () => {
    const start = (holidayData?.pagination?.currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(
      holidayData?.pagination?.currentPage * itemsPerPage,
      holidayData?.pagination?.total
    );
    return { start, end };
  };

  const { start, end } = calculateShowingRange();

  const handleSearch = (e) => {
    setName(e.target.value);
    dispatch(setFilterValues({ name: e.target.value, page: 1 }));
  };

  const handleChange = (e) => {
    setSelectedFilter(e.target.value);
    dispatch(setFilterValues({ filterType: e.target.value, page: 1 }));
  };


  const handleEditHoliday = (id) => {
    setSelectedHolidayId(id);
    setOpenEditModal(true);
};

 const handleDeleteHoliday =(id) =>{
    setSelectedHolidayId(id);
    setOpenDeleteModal(true);
 }

 const handleDeleteSubmit =async()=>{
    try {
        setDeleteLoading(true)

        const {data,status} = await api.deleteAHoliday(selectedHolidayId)

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


useEffect(() => {
    dispatch(getAllHolidays(filterOptions));
  }, [filterOptions, isRefresh]);

  return (
    <MainLayout>
      <ProfileHeader 
      name="All Holidays"
      breadcrumbs={["All Holiday Lists"]}
      />


      

      <div className="container mx-auto p-4">
        <div className="flex flex-col border border-[#D9D9D9] rounded-[8px] p-4">
          <div className="overflow-x-auto">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              sx={{ pb: 3 }}
            >
              <div className="flex space-x-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white"
                    placeholder="Search Holiday"
                    name="name"
                    onChange={handleSearch}
                    value={name}
                  />
                </div>
              </div>

              {/* All Button */}
              <Box mt={{ xs: 2, md: 0 }}>
                <Button
                  onClick={() => setOpenModal(true)}
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    background: "#2563EB",
                    display: "flex",
                    gap: "10px",
                    color: "#fff",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 6.33333V11.6667M11.6667 9H6.33333M17 9C17 10.0506 16.7931 11.0909 16.391 12.0615C15.989 13.0321 15.3997 13.914 14.6569 14.6569C13.914 15.3997 13.0321 15.989 12.0615 16.391C11.0909 16.7931 10.0506 17 9 17C7.94943 17 6.90914 16.7931 5.93853 16.391C4.96793 15.989 4.08601 15.3997 3.34315 14.6569C2.60028 13.914 2.011 13.0321 1.60896 12.0615C1.20693 11.0909 1 10.0506 1 9C1 6.87827 1.84285 4.84344 3.34315 3.34315C4.84344 1.84285 6.87827 1 9 1C11.1217 1 13.1566 1.84285 14.6569 3.34315C16.1571 4.84344 17 6.87827 17 9Z"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Add New Holiday
                </Button>
                <AddHolidayModal
                  isOpen={openModal}
                  onClose={() => setOpenModal(false)}
                />
              </Box>
            </Box>

               <EditHolidayModal isOpen={openEditModal}  onClose={() => setOpenEditModal(false)} id={selectedHolidayId}  />

                    <DeleteModal
                                isOpen={opendeleteModal}
                                close={()=>setOpenDeleteModal(false)}
                                handleSubmit={handleDeleteSubmit}
                                heading="Confirm Deletion"
                                description="Are you sure you want to delete this Holiday?"
                                loading={deleteLoading}
                        />

            <div className="flex items-center space-x-6 mb-4 text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="holidayFilter"
                  value=""
                  checked={selectedFilter === ""}
                  onChange={handleChange}
                  className="form-radio text-blue-600"
                />
                <span className="text-gray-800">All</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="holidayFilter"
                  value="upcoming"
                  checked={selectedFilter === "upcoming"}
                  onChange={handleChange}
                  className="form-radio text-blue-600"
                />
                <span className="text-gray-800">Upcoming</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="holidayFilter"
                  value="past"
                  checked={selectedFilter === "past"}
                  onChange={handleChange}
                  className="form-radio text-blue-600"
                />
                <span className="text-gray-800">Past Holidays</span>
              </label>
            </div>

            <TableContainer>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Date
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Day
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Holiday Name
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Action
                    </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>

                  

                  {
                    isLoading ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            <CircularProgress sx={{ color: '#2563EB', my: 2 }} />
                          </TableCell>
                        </TableRow>
                     
                      ) :
                  
                  
                  Array.isArray(holidayData?.holidays) &&
                  holidayData.holidays.length > 0 ? (
                    holidayData.holidays.map((emp) => (
                      <StyledTableRow key={emp?._id} sx={{ height: 44, my: 2 }}>
                        {/* Date */}
                        <StyledTableCell
                          sx={{
                            fontSize: 14,
                            color: "#14151C",
                            height: 40,
                            borderLeft: "4px solid #A2A1A833",
                          }}
                        >
                          {formatFullDate(emp?.holidayDate)}
                        </StyledTableCell>

                        {/* Day */}
                        <StyledTableCell
                          sx={{ fontSize: 14, color: "#14151C" }}
                        >
                          {getDayName(emp?.holidayDate)}
                        </StyledTableCell>

                        {/* Holiday Name */}
                        <StyledTableCell
                          sx={{ fontSize: 14, color: "#14151C" }}
                        >
                          {emp.holidayName}
                        </StyledTableCell>

                        {/* Action */}
                        <StyledTableCell>
                          <Button
                            size="small"
                            sx={{
                              textTransform: "none",
                              fontSize: 13,
                              px: 2,
                              borderRadius: "8px",
                              borderColor: "#C1C1C1",
                              color: "#3F3F3F",
                            }}
                          >
                            <div className=" whitespace-nowrap text-sm font-medium flex space-x-3">
                                                        
                                                            <button className="text-gray-600 hover:text-gray-900 cursor-pointer" onClick={()=>handleEditHoliday(emp?._id)}>
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                                </svg>
                                                            </button>
                                                            <button className="text-gray-600 hover:text-gray-900 cursor-pointer" onClick={()=>handleDeleteHoliday(emp?._id)}>
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={4} align="center">
                        No holidays found.
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {Array.isArray(holidayData?.holidays) && holidayData?.holidays.length > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing {start}-{end} out of {holidayData?.pagination?.total}{" "}
                results
              </div>
              <Pagination
                shape="rounded"
                siblingCount={1}
                boundaryCount={0}
                count={holidayData?.pagination?.totalPages}
                page={filterOptions?.page}
                onChange={handlePageChange}
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
              />
            </div>
          )}
        </div>
      </div>
      
    </MainLayout>
  );
}
