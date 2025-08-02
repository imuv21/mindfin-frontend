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
import { useDispatch, useSelector } from "react-redux";
import {
  getAllLeaves,
  setFilterValues,
  setRefresh,
} from "../../redux/leaveSlice";
import { formatDateYYYYMMDD } from "../../helpers/conversion";
import LeaveModal from "./LeaveModal";
import { getAllEmployeesWithOutpagination } from "../../redux/employeeSlice";
import api from "../../helpers/Api";
import Toastify from "../../helpers/Toastify";
import EditLeaveModal from "./EditLeaveModal";
import DeleteModal from "@/components/employee/DeleteModal";

const StyledTableRow = styled(TableRow)(() => ({
  height: 44,
}));

const StyledTableCell = styled(TableCell)(() => ({
  paddingTop: 2,
  paddingBottom: 2,
  height: 44,
  lineHeight: "44px",
}));

export default function AllEmployeeLeaves() {
  const dispatch = useDispatch();
  const { leaveData, isLoading, isRefresh, filterOptions } = useSelector(
    (state) => state.leave
  );
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [itemsPerPage] = useState(10);
  const [isAddModalOpen, setIsModalOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedHolidayId, setSelectedHolidayId] = useState(null);
  const [opendeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handlePageChange = (event, page) => {
    console.log("page", page);
    dispatch(setFilterValues({ page }));
  };

  const calculateShowingRange = () => {
    const start = (leaveData?.pagination?.currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(
      leaveData?.pagination?.currentPage * itemsPerPage,
      leaveData?.pagination?.total
    );
    return { start, end };
  };

  const { start, end } = calculateShowingRange();

  const handleSearch = (e) => {
    setName(e.target.value);
    dispatch(setFilterValues({ name: e.target.value, page: 1 }));
  };

  const handleStatus = (e) => {
    setStatus(e.target.value);
    dispatch(setFilterValues({ status: e.target.value, page: 1 }));
  };

  const handleEditHoliday = (id) => {
    setSelectedHolidayId(id);
    setOpenEditModal(true);
  };

  const handleDeleteHoliday = (id) => {
    setSelectedHolidayId(id);
    setOpenDeleteModal(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      setDeleteLoading(true);

      const { data, status } = await api.deleteALeave(selectedHolidayId);

      if (status === 200) {
        Toastify.success("Holiday deleted successfully");
        dispatch(setRefresh());
        setOpenDeleteModal(false);
      }
    } catch (error) {
      Toastify.error(error.response.data.message || `something went wrong`);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getAllLeaves(filterOptions));
  }, [filterOptions, isRefresh]);

  useEffect(() => {
    dispatch(getAllEmployeesWithOutpagination());
  });

  console.log(leaveData, "leave form nigirea");

  return (
    <MainLayout>
      <ProfileHeader
      name="Leaves"
      breadcrumbs={["All Employee Leaves"]}
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
              {/* 🔍 Filter Inputs + Search Button */}
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                {/* Employee Name */}
                <TextField
                  label="Employee Name"
                  variant="outlined"
                  size="small"
                  sx={{ width: 250 }}
                  name="name"
                  value={name}
                  onChange={handleSearch}
                />

                {/* Status Dropdown */}
                <TextField
                  label="Select Status"
                  variant="outlined"
                  size="small"
                  select
                  sx={{ width: 200 }}
                  value={status}
                  onChange={handleStatus}
                  name="status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </TextField>

                {/* Search Button */}
                <IconButton
                  sx={{
                    backgroundColor: "#2563EB",
                    color: "#fff",
                    borderRadius: 2,
                    width: 40,
                    height: 40,
                    "&:hover": {
                      backgroundColor: "#1E40AF",
                    },
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Box>

              {/* All Button */}
              <Box mt={{ xs: 2, md: 0 }}>
                <Button
                  onClick={() => setIsModalOpen(true)}
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
                  Add leave
                </Button>
              </Box>
            </Box>

            <LeaveModal isOpen={isAddModalOpen} onClose={() => setIsModalOpen(false)} />

            <EditLeaveModal
              isOpen={openEditModal}
              onClose={() => setOpenEditModal(false)}
              id={selectedHolidayId}
            />

            <DeleteModal
              isOpen={opendeleteModal}
              close={() => setOpenDeleteModal(false)}
              handleSubmit={handleDeleteSubmit}
              heading="Confirm Deletion"
              description="Are you sure you want to delete this Leave?"
              loading={deleteLoading}
            />

            <TableContainer>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Employee
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Designation
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Leave from
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Leave to
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Days
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Leave type
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Status
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Action
                    </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {" "}
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : leaveData?.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No Leave data found
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaveData?.data?.map((emp) => (
                      <StyledTableRow key={emp._id} sx={{ height: 44 }}>
                        {/* Employee Name + Avatar */}
                        <StyledTableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar
                              sx={{ width: 32, height: 32, mr: 1.5 }}
                              src={emp?.employee?.profileImg[0]}
                            />

                            <Typography
                              fontSize={14}
                              fontWeight={500}
                              color="#14151C"
                            >
                              {emp?.employee?.firstName}{" "}
                              {emp?.employee?.lastName}
                            </Typography>
                          </Box>
                        </StyledTableCell>

                        {/* Designation */}
                        <StyledTableCell
                          sx={{ fontSize: 14, color: "#14151C" }}
                        >
                          {emp?.employee?.designation?.designation}
                        </StyledTableCell>

                        {/* Leave From */}
                        <StyledTableCell
                          sx={{ fontSize: 14, color: "#14151C" }}
                        >
                          {formatDateYYYYMMDD(emp.startDate)}
                        </StyledTableCell>

                        {/* Leave To */}
                        <StyledTableCell
                          sx={{ fontSize: 14, color: "#14151C" }}
                        >
                          {formatDateYYYYMMDD(emp.endDate)}
                        </StyledTableCell>

                        {/* Days */}
                        <StyledTableCell
                          sx={{ fontSize: 14, color: "#14151C" }}
                        >
                          {emp.duration}
                        </StyledTableCell>

                        {/* Leave Type */}
                        <StyledTableCell
                          sx={{ fontSize: 14, color: "#14151C" }}
                        >
                          {emp.leaveType === "ANNUALLEAVE"
                            ? `Annual Leave`
                            : emp.leaveType === "CASUALLEAVE"
                            ? `Casual Leave`
                            : emp.leaveType === "SICKLEAVE"
                            ? `Sick Leave`
                            : `Other`}
                        </StyledTableCell>

                        {/* Status */}
                        <StyledTableCell sx={{ fontSize: 14 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color={
                              emp.leaveStatus === "APPROVED"
                                ? "success"
                                : emp.leaveStatus === "PENDING"
                                ? "warning"
                                : "error"
                            }
                            sx={{
                              textTransform: "capitalize",
                              fontSize: 13,
                              px: 2,
                              borderRadius: "8px",
                            }}
                          >
                            {emp.leaveStatus}
                          </Button>
                        </StyledTableCell>

                        {/* Action */}
                        <StyledTableCell>
                          {/* <Button
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ textTransform: "none", fontSize: 13 }}
                                                > */}
                          <div className=" whitespace-nowrap text-sm font-medium flex space-x-3">
                            <button
                              className="text-gray-600 hover:text-gray-900 cursor-pointer"
                              onClick={() => handleEditHoliday(emp?._id)}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                ></path>
                              </svg>
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-900 cursor-pointer"
                              onClick={() => handleDeleteHoliday(emp?._id)}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                ></path>
                              </svg>
                            </button>
                          </div>
                          {/* </Button> */}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {Array.isArray(leaveData?.data) && leaveData?.data.length > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing {start}-{end} out of {leaveData?.pagination?.total}{" "}
                results
              </div>
              <Pagination
                shape="rounded"
                siblingCount={1}
                boundaryCount={0}
                count={leaveData?.pagination?.totalPages}
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
