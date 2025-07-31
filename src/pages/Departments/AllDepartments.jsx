import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import api from "../../helpers/Api";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployees,
  getSpecificDepartmentEmployees,
  setDeparmentFilterValues,
  setFilterValues,
  setRefresh,
} from "../../redux/employeeSlice";
import { CircularProgress } from "@mui/material";
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
  Box,
  Chip,
  TableContainer,
  Paper,
  IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DeleteModal from "@/components/employee/DeleteModal";
import Toastify from "../../helpers/Toastify";

// Optional: Styled IconButton (removes hover effect, or style it your way)
const CustomIconButton = styled(IconButton)(() => ({
  color: "#4B5563", // gray-600
  padding: 6,
  "&:hover": {
    color: "#1F2937", // gray-900
    backgroundColor: "transparent", // removes ripple background
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  height: 44,
}));

const StyledTableCell = styled(TableCell)(() => ({
  paddingTop: 2,
  paddingBottom: 2,
  height: 44,
  lineHeight: "44px",
}));

export default function AllDepartments() {
  const employees = [
    {
      id: 345321231,
      name: "Alex Johnson",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      branch: "Bangalore",
      type: "Office",
      status: "Active",
    },
    {
      id: 987890345,
      name: "Emily Davis",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      branch: "Bangalore",
      type: "Remote",
      status: "Inactive",
    },
    {
      id: 453367122,
      name: "Michael Lee",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      branch: "Bangalore",
      type: "Remote",
      status: "Suspended",
    },
    {
      id: 345321232, // Updated to a unique value
      name: "Sophie Miller",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      branch: "Chennai",
      type: "Remote",
      status: "Suspended",
    },
    {
      id: 453677881,
      name: "David Kim",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      branch: "Bangalore",
      type: "Remote",
      status: "Suspended",
    },
    {
      id: 109918765,
      name: "Rachel Green",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
      branch: "Bangalore",
      type: "Remote",
      status: "Suspended",
    },
  ];

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  const { departmentFilterOptions, isLoading, deparmentEmployees, isRefresh } =
    useSelector((state) => state.employee);

  const handlePageChange = (event, page) => {
    dispatch(setDeparmentFilterValues({ page }));
  };

  const handleSearch = (e) => {
    setName(e.target.value);
    dispatch(setDeparmentFilterValues({ name: e.target.value, page: 1 }));
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleDeleteClick = (id) => {
    setEmployeeId(id);
    setModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    try {
      const { data, status } = await api.deleteEmployee(employeeId);

      if (status === 200) {
        dispatch(setRefresh());
        Toastify.success("Employee Deleted successfully");
        setModalOpen(false);
      }
    } catch (error) {
      Toastify.error(error.response.data.message || `something went wrong`);
    } finally {
      setDeleteLoading(false);
    }
    // handleDelete(employeeId);
  };
  const calculateShowingRange = () => {
    const start = (deparmentEmployees?.page - 1) * itemsPerPage + 1;
    const end = Math.min(
      deparmentEmployees?.page * itemsPerPage,
      deparmentEmployees?.totalDocuments
    );
    return { start, end };
  };

  const { start, end } = calculateShowingRange();

  useEffect(() => {
    dispatch(setDeparmentFilterValues({ designation: id }));
  }, [id]);

  useEffect(() => {
    dispatch(
      getSpecificDepartmentEmployees({
        ...departmentFilterOptions,
        designation: id,
      })
    );
  }, [name, departmentFilterOptions.designation, isRefresh]);


  return (
    <MainLayout>
      <ProfileHeader
      name={deparmentEmployees?.designation?.designation || 'designations'}
      breadcrumbs={["All Departments",deparmentEmployees?.designation?.designation || 'designations']}
      />
      <div className="container mx-auto p-4">
        <div className="flex flex-col border border-[#D9D9D9] rounded-[8px] p-4">
          <div className="flex justify-between items-center mb-4">
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
                  placeholder="Search employee"
                  name="name"
                  value={name}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="300px"
            >
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <div className="overflow-x-auto">
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                        Employee Id
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                        Employee Name
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                        Branch
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                        Type
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
                    {deparmentEmployees?.employees?.length ? (
                      deparmentEmployees?.employees?.map((emp) => (
                        <TableRow key={emp._id} sx={{ height: 56 }}>
                          <StyledTableCell
                            sx={{
                              fontSize: 14,
                              color: "#16151C",
                              verticalAlign: "middle",
                            }}
                          >
                            {emp?.employeeId}
                          </StyledTableCell>

                          <StyledTableCell sx={{ verticalAlign: "middle" }}>
                            <Box display="flex" alignItems="center">
                              <Avatar
                                src={emp.profileImg?.[0]}
                                sx={{ width: 32, height: 32 }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  ml: 2,
                                  fontSize: 16,
                                  color: "#16151C",
                                  fontWeight: 500,
                                }}
                              >
                                {emp.firstName} {emp.lastName}
                              </Typography>
                            </Box>
                          </StyledTableCell>

                          <StyledTableCell
                            sx={{
                              fontSize: 16,
                              color: "#16151C",
                              verticalAlign: "middle",
                            }}
                          >
                            {emp.branch?.map((b, i) => (
                              <div key={i}>{b.name}</div>
                            ))}
                          </StyledTableCell>

                          <StyledTableCell
                            sx={{
                              fontSize: 16,
                              color: "#16151C",
                              verticalAlign: "middle",
                            }}
                          >
                            {emp?.jobType}
                          </StyledTableCell>

                          <StyledTableCell sx={{ verticalAlign: "middle" }}>
                            <Chip
                              label={emp?.employeeType}
                              sx={{
                                backgroundColor:
                                  emp.employeeType === "PERMENENT"
                                    ? "#E6F4EA"
                                    : emp.employeeType === "TEMPORARARY"
                                    ? "#FDECEA"
                                    : emp.employeeType === "INTERN"
                                    ? "#EBF5FF"
                                    : emp.employeeType === "NOTICEPERIOD"
                                    ? "#FFF8E1"
                                    : "#F5F5F5",
                                color:
                                  emp.employeeType === "PERMENENT"
                                    ? "#219653"
                                    : emp.employeeType === "TEMPORARARY"
                                    ? "#EB5757"
                                    : emp.employeeType === "INTERN"
                                    ? "#2F80ED"
                                    : emp.employeeType === "NOTICEPERIOD"
                                    ? "#F2C94C"
                                    : "#757575",
                                fontWeight: 600,
                                fontSize: 12,
                                height: 24,
                                borderRadius: "4px",
                              }}
                            />
                          </StyledTableCell>

                          <StyledTableCell
                            sx={{
                              fontSize: 16,
                              color: "#16151C",
                              verticalAlign: "middle",
                            }}
                          >
                            <Box display="flex" alignItems="center" gap={1}>
                              <CustomIconButton
                                onClick={() =>
                                  navigate(`/viewEmployee/${emp._id}`)
                                }
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </CustomIconButton>

                              <CustomIconButton
                                onClick={() =>
                                  navigate(`/editEmployee/${emp._id}`)
                                }
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </CustomIconButton>

                              <CustomIconButton
                                onClick={() => handleDeleteClick(emp._id)}
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </CustomIconButton>
                            </Box>
                          </StyledTableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <StyledTableCell
                          colSpan={6}
                          sx={{
                            textAlign: "center",
                            fontSize: 16,
                            color: "#A2A1A8",
                          }}
                        >
                          No Employee Data found
                        </StyledTableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}

          {!isLoading && deparmentEmployees?.employees?.length ? (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing {start}-{end} out of{" "}
                {deparmentEmployees?.totalDocuments} results
              </div>
              <Pagination
                shape="rounded"
                siblingCount={1}
                boundaryCount={0}
                count={deparmentEmployees?.totalPages}
                page={departmentFilterOptions?.page}
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
          ) : null}

          <DeleteModal
            isOpen={isModalOpen}
            close={handleModalClose}
            handleSubmit={handleDeleteSubmit}
            heading="Confirm Deletion"
            description="Are you sure you want to delete this employee?"
            loading={deleteLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
}
