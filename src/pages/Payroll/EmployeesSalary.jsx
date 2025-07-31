import { useEffect, useRef, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import api from "../../helpers/Api";
import { useDispatch, useSelector } from "react-redux";
import { getAllPayslips, getAllTaxes, setFilterValues, setRefresh } from "../../redux/payrollSlice";
import { getAllEmployeesWithOutpagination } from "../../redux/employeeSlice";
import Toastify from "../../helpers/Toastify";
import DeleteModal from "@/components/employee/DeleteModal";
import PayslipPDFRenderer from "@/components/payroll/PayslipPDFRenderer";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image-more";

const StyledTableRow = styled(TableRow)(() => ({
  height: 44,
}));

const StyledTableCell = styled(TableCell)(() => ({
  paddingTop: 2,
  paddingBottom: 2,
  height: 44,
  lineHeight: "44px",
  paddingLeft: 2,
}));

export default function EmployeesSalary() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pdfRef = useRef();

  const [cardData, setCardData] = useState([]);
  const [name, setName] = useState("");
  const [itemsPerPage] = useState(10);
  const [designation, setDesignation] = useState("");
  const [selectedHolidayId, setSelectedHolidayId] = useState(null);
  const [opendeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isPdfReady, setIsPdfReady] = useState(false);

  //slices

  const { designations } = useSelector((state) => state.employee);
  const { paySlipData, isRefresh, isLoading, filterOptions } = useSelector(
    (state) => state.payroll
  );

 
    // console.log(designations, "pay roo");

  const handleSearch = (e) => {
    setName(e.target.value);
    dispatch(setFilterValues({ search: e.target.value, page: 1 }));
  };

  const handleDesignationChange = (e) => {
    // console.log(e.target.value, "dessi");

    setDesignation(e.target.value);
    dispatch(setFilterValues({ designation: e.target.value, page: 1 }));
  };

  useEffect(() => {
    dispatch(getAllPayslips(filterOptions));
  }, [filterOptions,isRefresh]);

  const handlePageChange = (event, page) => {
    dispatch(setFilterValues({ page }));
  };

  const calculateShowingRange = () => {
    const start = (paySlipData?.currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(
      paySlipData?.currentPage * itemsPerPage,
      paySlipData?.total
    );
    return { start, end };
  };

  const { start, end } = calculateShowingRange();

  // console.log(paySlipData, "paymode on");
  // console.log(filterOptions, "filterOptions");

  const fetchCardData = async () => {
    try {
      const { data, status } = await api.getEmployeeCounts();
      if (status === 200) {
        setCardData([data.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCardData();
    dispatch(getAllTaxes())
    dispatch(getAllEmployeesWithOutpagination())
  }, []);

  const summaryData = [
    {
      icon: (
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="38" height="38" rx="4" fill="white" />
          <path
            d="M27.774 25C28.5233 25 29.1193 24.5285 29.6545 23.8691C30.7499 22.5194 28.9513 21.4408 28.2654 20.9126C27.568 20.3756 26.7894 20.0714 26 20M25 18C26.3807 18 27.5 16.8807 27.5 15.5C27.5 14.1193 26.3807 13 25 13"
            stroke="#001B12"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M10.226 25C9.47666 25 8.88067 24.5285 8.34555 23.8691C7.25009 22.5194 9.04867 21.4408 9.73465 20.9126C10.432 20.3756 11.2106 20.0714 12 20M12.5 18C11.1193 18 10 16.8807 10 15.5C10 14.1193 11.1193 13 12.5 13"
            stroke="#001B12"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M15.0838 22.1112C14.062 22.743 11.383 24.0331 13.0147 25.6474C13.8118 26.436 14.6995 27 15.8156 27H22.1844C23.3005 27 24.1882 26.436 24.9853 25.6474C26.617 24.0331 23.938 22.743 22.9162 22.1112C20.5201 20.6296 17.4799 20.6296 15.0838 22.1112Z"
            stroke="#001B12"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22.5 14.5C22.5 16.433 20.933 18 19 18C17.067 18 15.5 16.433 15.5 14.5C15.5 12.567 17.067 11 19 11C20.933 11 22.5 12.567 22.5 14.5Z"
            stroke="#001B12"
            stroke-width="1.5"
          />
        </svg>
      ),
      value: "Total Employee",
      label: cardData[0]?.totalEmployees ?? "-",
      bg: "#EEF0FE",
    },
    {
      icon: (
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="38" height="38" rx="4" fill="white" />
          <path
            d="M19.5 29H13.5909C12.0455 29 10.8163 28.248 9.71266 27.1966C7.45337 25.0441 11.1628 23.324 12.5776 22.4816C14.6784 21.2307 17.1368 20.7719 19.5 21.1052C20.3575 21.2261 21.1926 21.4514 22 21.7809"
            stroke="#001B12"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M23.5 13.5C23.5 15.9853 21.4853 18 19 18C16.5147 18 14.5 15.9853 14.5 13.5C14.5 11.0147 16.5147 9 19 9C21.4853 9 23.5 11.0147 23.5 13.5Z"
            stroke="#001B12"
            stroke-width="1.5"
          />
          <path
            d="M25.5 29V22M22 25.5H29"
            stroke="#001B12"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      ),
      value: "New Employee",
      label: cardData[0]?.newEmployees ?? "-",
      bg: "#FFF7E5",
    },
    {
      icon: (
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="38" height="38" rx="4" fill="white" />
          <path
            d="M27.774 25C28.5233 25 29.1193 24.5285 29.6545 23.8691C30.7499 22.5194 28.9513 21.4408 28.2654 20.9126C27.568 20.3756 26.7894 20.0714 26 20M25 18C26.3807 18 27.5 16.8807 27.5 15.5C27.5 14.1193 26.3807 13 25 13"
            stroke="#001B12"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M10.226 25C9.47666 25 8.88067 24.5285 8.34555 23.8691C7.25009 22.5194 9.04867 21.4408 9.73465 20.9126C10.432 20.3756 11.2106 20.0714 12 20M12.5 18C11.1193 18 10 16.8807 10 15.5C10 14.1193 11.1193 13 12.5 13"
            stroke="#001B12"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M15.0838 22.1112C14.062 22.743 11.383 24.0331 13.0147 25.6474C13.8118 26.436 14.6995 27 15.8156 27H22.1844C23.3005 27 24.1882 26.436 24.9853 25.6474C26.617 24.0331 23.938 22.743 22.9162 22.1112C20.5201 20.6296 17.4799 20.6296 15.0838 22.1112Z"
            stroke="#001B12"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22.5 14.5C22.5 16.433 20.933 18 19 18C17.067 18 15.5 16.433 15.5 14.5C15.5 12.567 17.067 11 19 11C20.933 11 22.5 12.567 22.5 14.5Z"
            stroke="#001B12"
            stroke-width="1.5"
          />
        </svg>
      ),

      value: "Male",
      label: cardData[0]?.maleEmployees ?? "-",
      bg: "#ECFDF5",
    },
    {
      icon: (
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="38" height="38" rx="4" fill="white" />
          <path
            d="M27.774 25C28.5233 25 29.1193 24.5285 29.6545 23.8691C30.7499 22.5194 28.9513 21.4408 28.2654 20.9126C27.568 20.3756 26.7894 20.0714 26 20M25 18C26.3807 18 27.5 16.8807 27.5 15.5C27.5 14.1193 26.3807 13 25 13"
            stroke="#001B12"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M10.226 25C9.47666 25 8.88067 24.5285 8.34555 23.8691C7.25009 22.5194 9.04867 21.4408 9.73465 20.9126C10.432 20.3756 11.2106 20.0714 12 20M12.5 18C11.1193 18 10 16.8807 10 15.5C10 14.1193 11.1193 13 12.5 13"
            stroke="#001B12"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M15.0838 22.1112C14.062 22.743 11.383 24.0331 13.0147 25.6474C13.8118 26.436 14.6995 27 15.8156 27H22.1844C23.3005 27 24.1882 26.436 24.9853 25.6474C26.617 24.0331 23.938 22.743 22.9162 22.1112C20.5201 20.6296 17.4799 20.6296 15.0838 22.1112Z"
            stroke="#001B12"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22.5 14.5C22.5 16.433 20.933 18 19 18C17.067 18 15.5 16.433 15.5 14.5C15.5 12.567 17.067 11 19 11C20.933 11 22.5 12.567 22.5 14.5Z"
            stroke="#001B12"
            stroke-width="1.5"
          />
        </svg>
      ),
      value: "Female",
      label: cardData[0]?.femaleEmployees ?? "-",
      bg: "#FFF1F2",
    },
  ];


  const handleDeleteHoliday = (id) => {
      setSelectedHolidayId(id);
      setOpenDeleteModal(true);
    };
  
    const handleDeleteSubmit = async () => {
      try {
        setDeleteLoading(true);
  
        const { data, status } = await api.deletePaySlip(selectedHolidayId);
  
        if (status === 200) {
          Toastify.success("Pay Slip deleted successfully");
          dispatch(setRefresh());
          setOpenDeleteModal(false);
        }
      } catch (error) {
        Toastify.error(error.response.data.message || `something went wrong`);
      } finally {
        setDeleteLoading(false);
      }
    };


   
    const handleDownload = (empData) => {
      console.log(empData,"oomf");
      
      setData(empData);
      setIsPdfReady(false);
  
      // Allow time for the PayslipPDFRenderer to mount
      setTimeout(() => {
        const node = pdfRef.current;
        if (node) {
          domtoimage
            .toPng(node)
            .then((dataUrl) => {
              const pdf = new jsPDF("p", "mm", "a4");
              const imgProps = pdf.getImageProperties(dataUrl);
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
              pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
              // Extract employee name, month, and year from empData
          const employeeName = empData?.employee?.firstName || 'Employee';
          const month = empData?.month || 'Month';
          const year = empData?.year || 'Year';
          console.log(employeeName,month,year,"oomff");
          
          // Create filename
          const filename = `payslip_${employeeName}_${month}_${year}.pdf`;
           console.log(filename,"flma");
           
          pdf.save(filename);
          setIsPdfReady(false);
            })
            .catch((error) => {
              console.error("Error generating PDF:", error);
              setIsPdfReady(false);
            });
        } else {
          console.error("DOM node not found for PDF generation");
          setIsPdfReady(false);
        }
      }, 100); // Small delay to ensure the component is mounted
    };
  


  // console.log(data,"dwnload data");
  


  return (
    <MainLayout>
      <ProfileHeader  
      name="Employees salary"
      />

      <div className="container mx-auto p-4">
        <Box mb={4}>
          {/* Summary Cards */}
          <Grid container spacing={2}>
            {summaryData.map((item, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
                sx={{ width: "20%" }}
              >
                <Card
                  sx={{
                    backgroundColor: item.bg,
                    borderRadius: 2,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    boxShadow: "none",
                  }}
                >
                  <Box>{item.icon}</Box>
                  <Box>
                    <Typography fontWeight={600} color="text.primary">
                      {item.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        <div className="flex flex-col border border-[#D9D9D9] rounded-[8px] p-4">
          <div className="overflow-x-auto">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              sx={{ py: 3 }}
            >
              {/* 🔍 Filter Inputs + Search Button */}
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                {/* Employee Name */}
                <TextField
                  label="Employee Name"
                  variant="outlined"
                  size="small"
                  sx={{ width: 250 }}
                  value={name}
                  onChange={(e) => handleSearch(e)}
                  name="name"
                />

                {/* Status Dropdown */}
                <TextField
                  label="Select Designation"
                  variant="outlined"
                  size="small"
                  select
                  sx={{ width: 200 }}
                  value={designation}
                  onChange={handleDesignationChange}
                  name="designation"
                >
                  <MenuItem value="">All</MenuItem>
                  {designations &&
                    designations
                      .filter(
                        (designation) =>
                          designation.designation !== "SUPERADMIN"
                      )
                      .map((designation, index) => (
                        <MenuItem key={index} value={designation._id}>
                          {designation.designation}
                        </MenuItem>
                      ))}
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
              <Box mt={{ xs: 2, md: 0 }} sx={{ display: "flex", gap: 5 }}>
                <button
                  className="flex items-center gap-2 text-white bg-[#2563EB] rounded-lg px-4 py-2 text-sm font-medium cursor-pointer"
                  onClick={() => navigate("/salaryDefnition")}
                >
                  Detailed View
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 text-white bg-[#2563EB] rounded-lg px-4 py-2 text-sm font-medium cursor-pointer"
                  onClick={() => navigate("/createPayslip")}
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
                  Add Salary
                </button>
              </Box>
            </Box>

              <DeleteModal
                          isOpen={opendeleteModal}
                          close={() => setOpenDeleteModal(false)}
                          handleSubmit={handleDeleteSubmit}
                          heading="Confirm Deletion"
                          description="Are you sure you want to delete this Pay Slip?"
                          loading={deleteLoading}
                        />


          {/* {renderPDF && data && (
                <PayslipPDFRenderer
                    data={data}
                    onComplete={() => setRenderPDF(false)}
                />
            )} */}

            <TableContainer>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Employee ID
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Employee
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Email
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Role
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Month&Year
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Salary
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Job Type
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Payslip
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>
                      Action
                    </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>

                     {isLoading ? (
                                        <TableRow>
                                          <TableCell colSpan={8} align="center">
                                            <CircularProgress />
                                          </TableCell>
                                        </TableRow>
                                      ) : paySlipData?.paySlips?.length === 0 ? (
                                        <TableRow>
                                          <TableCell colSpan={8} align="center">
                                            No Payment Slip data found
                                          </TableCell>
                                        </TableRow>
                                      ) :
                  (paySlipData?.paySlips?.map((emp) => (
                    <StyledTableRow key={emp._id} sx={{ height: 44 }}>
                      {/* Employee ID */}
                      <StyledTableCell sx={{ fontSize: 14, color: "#14151C" }}>
                        {emp?.employee?.employeeId}
                      </StyledTableCell>

                      {/* Employee Name + Avatar */}
                      <StyledTableCell sx={{ height: "44px !important" }}>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={emp?.employee?.profileImg[0]}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              ml: 1,
                              fontSize: 14,
                              color: "#14151C",
                              fontWeight: 500,
                            }}
                          >
                            {emp?.employee?.firstName} {emp?.employee?.lastName}
                          </Typography>
                        </Box>
                      </StyledTableCell>

                      {/*email */}
                      <StyledTableCell sx={{ fontSize: 14, color: "#14151C" }}>
                        {emp?.employee?.professionalEmail}
                      </StyledTableCell>

                      {/* role */}
                      <StyledTableCell sx={{ fontSize: 14, color: "#14151C" }}>
                        {emp?.employee?.designation?.designation}
                      </StyledTableCell>

                      <StyledTableCell>{`${emp?.month},${emp?.year}`}</StyledTableCell>
                      <StyledTableCell>{emp?.grossSalary}</StyledTableCell>
                      <StyledTableCell>
                        {emp?.employee?.employeeType}
                      </StyledTableCell>
                      <StyledTableCell>
                        <svg onClick={()=>handleDownload(emp)} style={{cursor:"pointer"}}
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 16.5674V17.5674C4 18.363 4.31607 19.1261 4.87868 19.6887C5.44129 20.2513 6.20435 20.5674 7 20.5674H17C17.7956 20.5674 18.5587 20.2513 19.1213 19.6887C19.6839 19.1261 20 18.363 20 17.5674V16.5674M16 12.5674L12 16.5674M12 16.5674L8 12.5674M12 16.5674V4.56738"
                            stroke="#818181"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </StyledTableCell>

                      {/* Action */}
                      <StyledTableCell
                        sx={{
                          fontSize: 16,
                          color: "#16151C",
                          verticalAlign: "middle",
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <svg onClick={()=>navigate(`/payslipView/${emp?._id}`)}
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{cursor:"pointer"}}
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
                          <svg onClick={()=>navigate(`/editPayslip/${emp?._id}`)}
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
                          <svg       onClick={() => handleDeleteHoliday(emp?._id)}

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
                        </Box>
                      </StyledTableCell>
                    </StyledTableRow>
                  )))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>


          {Array.isArray(paySlipData?.paySlips) && paySlipData?.paySlips.length > 1 && (

<div className="flex justify-between items-center mt-4">
<div className="text-sm text-gray-500">
  {/* Showing  out of results */}
  Showing {start}-{end} out of {paySlipData?.total} results
</div>
<Pagination
  shape="rounded"
  siblingCount={1}
  boundaryCount={0}
  count={paySlipData?.totalPages}
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
         {/* Hidden UI for PDF rendering */}
          {/* Hidden UI for PDF rendering */}
          {data && (
            <div
              ref={pdfRef}
              style={{ position: "absolute", left: "-9999px", top: 0 }}
            >
              <PayslipPDFRenderer payslipData={data} />
            </div>
          )}
      </div>
    </MainLayout>
  );
}
