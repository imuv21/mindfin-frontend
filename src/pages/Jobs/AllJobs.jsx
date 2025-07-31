import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Button, Grid, Divider, IconButton, TextField, MenuItem, Pagination,CircularProgress } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MainLayout from '@/components/layout/MainLayout';
import ProfileHeader from '@/components/layout/ProfileHeader';
import { SearchIcon } from 'lucide-react';
import AddJobModal from './AddJobModal';
import { capitalizeFirstLetter, formatDate } from '../../helpers/conversion';
import { useDispatch, useSelector } from 'react-redux';
import { getAllJobs ,setFilterValues, setRefresh} from '../../redux/jobSlice';
import api from '../../helpers/Api';
import Toastify from '../../helpers/Toastify';
import EditJobModal from './EditJobModal';

const JobCard = ({ status, title, branch, vacancies, salary, date, published ,jobType,id,updateStatus,openModal,closeModal}) => {
    const isActive = status === 'Active';

    const handlePublish = () => {
        updateStatus(id);
    };


    return (
        <Card sx={{
            borderRadius: 2,
            border:'1px solid #D9D9D9',
            boxShadow: 'none',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Box sx={{ px: 3, pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FiberManualRecordIcon
                        sx={{
                            fontSize: 12,
                            mr: 1,
                            color: status === `COMPLETED` ? '#ffc107' : '#4caf50',

                        }}
                    />
                    <Typography sx={{ fontWeight: 'medium', fontSize: "12px" }}>
                        {capitalizeFirstLetter( status)} Jobs
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ px: 3, pt: 0, flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: "14px", color: "#363636" }}>
                        {title}
                    </Typography>
                    <IconButton size="small" sx={{ p: 0 }} onClick={()=>openModal(id)}>
                        <EditNoteIcon  />
                    </IconButton>
                </Box>
                <Typography sx={{ fontSize: "12px", color: "#818181", pb: 1 }}>
                    {branch}
                </Typography>


                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1 }}>
                    <Typography sx={{ fontWeight: 'medium', fontSize: "12px", color: "#818181" }}>
                        Vacancies
                    </Typography>
                    <Typography sx={{ fontWeight: 'medium', fontSize: "12px", color: "#818181" }}>
                        {vacancies}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1 }}>
                    <Typography sx={{ fontWeight: 'medium', fontSize: "12px", color: "#818181" }} align="right">
                        Salary
                    </Typography>
                    <Typography sx={{ fontWeight: 'medium', fontSize: "12px", color: "#818181" }}>
                        {salary}
                    </Typography>
                </Box>


                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1 }}>
                    <Typography sx={{ fontWeight: 'medium', fontSize: "12px", color: "#818181" }}>
                        Job Type
                    </Typography>
                    <Typography sx={{ fontWeight: 'medium', fontSize: "12px", color: "#818181" }}>
                        {jobType}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1 }}>
                    <Typography sx={{ fontWeight: 'medium', fontSize: "12px", color: "#818181" }}>
                        Date of Publish
                    </Typography>
                    <Typography sx={{ fontWeight: 'medium', fontSize: "12px", color: "#818181" }}>
                        {formatDate( date)}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ p: 3, pt: 1 }}>
                <Button
                    // variant={published ? "contained" : "outlined"}
                    variant={published ? "outlined" : "contained" }
                    style={{cursor: published ? 'crosshair' : 'pointer'}}
                    disabled={published}
                    fullWidth
                    onClick={handlePublish}
                    sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        // bgcolor: published ? '#2563EB' : 'transparent',
                        bgcolor: published ? 'transparent' : '#2563EB',
                        // color: published ? 'white' : '#1976d2',
                        color: published ? '#1976d2' : 'white',
                        // border: published ? 'none' : '1px solid #2563EB',
                        border: published ? '1px solid #2563EB' : 'none',
                        '&:hover': {
                            // bgcolor: published ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
                            bgcolor: published ? 'rgba(25, 118, 210, 0.04)' : '#1565c0'
                        }
                    }}
                >
                    {/* {published ? 'Publish' : 'Published'} */}
                    {published ? 'Published' : 'Publish'}
                </Button>
            </Box>
        </Card>
    );
};

const AllJobs = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [itemsPerPage] = useState(10);
    const [designation, setDesignation] = useState("");
    const [jobStatus, setJobStatus] = useState("")
    const [id, setId] = useState(null)
    const [updateStatusLoading,setUpdateStatusLoading] = useState(false)
    const dispatch = useDispatch()
    const {filterOptions,isRefresh,isLoading,
        jobsData
    } = useSelector(
        (state) => state.jobs
      );

      const {designations}= useSelector((state)=>state.employee)
      



      const handleDesignationChange = (e) => {
          console.log(e.target.value, "dessi");
      
          setDesignation(e.target.value);
          dispatch(setFilterValues({ designation: e.target.value, page: 1 }));
        };

      const handleStatusChange = (e) => {
          console.log(e.target.value, "dessi");
      
          setJobStatus(e.target.value);
          dispatch(setFilterValues({ jobStatus: e.target.value, page: 1 }));
        };

        const handlePageChange = (event, page) => {
            console.log("page", page);
            dispatch(setFilterValues({ page }));
          };


          const calculateShowingRange = () => {
            const start = (jobsData?.currentPage - 1) * itemsPerPage + 1;
            const end = Math.min(
              jobsData?.currentPage * itemsPerPage,
              jobsData?.totalJobs

            );
            return { start, end };
          };

        const { start, end } = calculateShowingRange();


      useEffect(()=>{

        dispatch(getAllJobs(filterOptions))

      },[filterOptions,isRefresh])


  console.log(jobsData,"jobsdats");
//   console.log(jobsData,"jobs");
  console.log(filterOptions,"filter");
  

  const updateStatus = async(id) =>{
    setUpdateStatusLoading(true)
    try {

        const {data,status} = await api.updatePublishStatus(id)
        if(status === 200){
            Toastify.success("Job published Successfully")
            dispatch(setRefresh())
        }

        
    } catch (error) {
            Toastify.error(error.response.data.message || `something went wrong`);
        
    }finally{
        setUpdateStatusLoading(false)

    }
  }
  

 const  handleOpenEditModal =(id)=>{
    setId(id)
    setOpenEditModal(true)
  }
 const  handlecloseeditModal =()=>{
    setOpenEditModal(true)
  }



    const jobData = [
        { id: 1, status: 'Active', title: 'Marketing', branch: 'Branch', vacancies: 2, salary: 'Rs.50,000/month', date: '4 March 2025' },
        { id: 2, status: 'Completed', title: 'Marketing', branch: 'Branch', vacancies: 2, salary: 'Rs.50,000/month', date: '4 March 2025' },
        { id: 3, status: 'Active', title: 'Marketing', branch: 'Branch', vacancies: 2, salary: 'Rs.50,000/month', date: '4 March 2025' },
        { id: 4, status: 'Completed', title: 'Marketing', branch: 'Branch', vacancies: 2, salary: 'Rs.50,000/month', date: '4 March 2025' },
        { id: 5, status: 'Active', title: 'Manager', branch: 'Branch', vacancies: 2, salary: 'Rs.60,000/month', date: '4 March 2025' },
        { id: 6, status: 'Completed', title: 'Manager', branch: 'Branch', vacancies: 2, salary: 'Rs.60,000/month', date: '4 March 2025' },
        { id: 7, status: 'Active', title: 'Manager', branch: 'Branch', vacancies: 2, salary: 'Rs.60,000/month', date: '4 March 2025' },
        { id: 8, status: 'Completed', title: 'Manager', branch: 'Branch', vacancies: 2, salary: 'Rs.60,000/month', date: '4 March 2025' },
        { id: 9, status: 'Completed', title: 'Manager', branch: 'Branch', vacancies: 2, salary: 'Rs.60,000/month', date: '4 March 2025' },
        { id: 10, status: 'Completed', title: 'Manager', branch: 'Branch', vacancies: 2, salary: 'Rs.60,000/month', date: '4 March 2025' },
        { id: 11, status: 'Completed', title: 'Manager', branch: 'Branch', vacancies: 2, salary: 'Rs.60,000/month', date: '4 March 2025' },
        { id: 12, status: 'Completed', title: 'Manager', branch: 'Branch', vacancies: 2, salary: 'Rs.60,000/month', date: '4 March 2025' },
    ];

    return (
        <MainLayout>
            <ProfileHeader
            name="Jobs"
            breadcrumbs={["Show All Jobs"]}
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
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                                flexWrap="wrap"
                            >
                                {/* Employee Name */}
                                 {/* Status Dropdown */}
                                 <TextField
                                    label="Select Designation"
                                    variant="outlined"
                                    size="small"
                                    select
                                    sx={{ width: 200 }}
                                    value={designation}
                                    onChange={handleDesignationChange}

                                >
                                    <MenuItem value="">All</MenuItem>
                                    {/* {designations &&
                        designations.map((designation, index) => (
                          <MenuItem key={designation._id} value={designation._id}>
                            {designation.designation}
                          </MenuItem>
                        ))} */}
                         {designations &&
                  designations
                    .filter((d) => d.designation !== "SUPERADMIN")
                    .map((designation, index) => (
                      <MenuItem key={index} value={designation._id}>
                        {designation.designation}
                      </MenuItem>
                    ))}
                                </TextField>

                                {/* Status Dropdown */}
                                <TextField
                                    label="Job type"
                                    variant="outlined"
                                    size="small"
                                    select
                                    sx={{ width: 200 }}
                                    value={jobStatus}
                                    onChange={handleStatusChange}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="WFH">WFH</MenuItem>
                                    <MenuItem value="WFO">WFO</MenuItem>
                                    <MenuItem value="HYBRID">HYBRID</MenuItem>
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
                                <Button   onClick={() => setOpenModal(true)}
                                    variant="outlined"
                                    sx={{ textTransform: "none", borderRadius: 2, background: '#2563EB', display: 'flex', gap: '10px', color: '#fff' }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 6.33333V11.6667M11.6667 9H6.33333M17 9C17 10.0506 16.7931 11.0909 16.391 12.0615C15.989 13.0321 15.3997 13.914 14.6569 14.6569C13.914 15.3997 13.0321 15.989 12.0615 16.391C11.0909 16.7931 10.0506 17 9 17C7.94943 17 6.90914 16.7931 5.93853 16.391C4.96793 15.989 4.08601 15.3997 3.34315 14.6569C2.60028 13.914 2.011 13.0321 1.60896 12.0615C1.20693 11.0909 1 10.0506 1 9C1 6.87827 1.84285 4.84344 3.34315 3.34315C4.84344 1.84285 6.87827 1 9 1C11.1217 1 13.1566 1.84285 14.6569 3.34315C16.1571 4.84344 17 6.87827 17 9Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    Add Form
                                </Button>
                            </Box>
                        </Box>

                        <AddJobModal isOpen={openModal} onClose={() => setOpenModal(false)} />
                        <EditJobModal isOpen={openEditModal} onClose={() => setOpenEditModal(false)} id={id} />
                    </div>

                    {updateStatusLoading && (
                        <div style={{ position: "fixed", zIndex: 100, top: 0, left: 0, width: "100%", height: "100vh", background: "rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CircularProgress color='#fff' style={{ color: "#fff" }} size={30} />
                        </div>
                    )}
                    {/* <Box sx={{  minHeight: '100vh' }}>
                        <Grid container spacing={2} >
                            {jobsData?.jobs?.map((job) => (
                                <Grid item xs={12} sm={6} md={3} key={job?._id} width={"23%"}>
                                    <JobCard
                                        status={job?.jobStatus}
                                        title={job?.jobTitle}
                                        branch={job?.branch?.name}
                                        vacancies={job?.noOfVacancies}
                                        salary={job?.salaryAmount}
                                        date={job?.publishedDate || '-'}
                                        published={job?.isPublished}
                                        jobType={job?.jobType}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                         
                    </Box> */}
                     {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box sx={{ minHeight: '100vh' }}>
                            <Grid container spacing={2}>
                                {jobsData?.jobs?.length ? (
                                    jobsData.jobs.map((job) => (
                                        <Grid item xs={12} sm={6} md={3} key={job?._id} width={"23%"}>
                                            <JobCard
                                                status={job?.jobStatus}
                                                title={job?.jobTitle}
                                                branch={job?.branch?.name}
                                                vacancies={job?.noOfVacancies}
                                                salary={job?.salaryAmount}
                                                date={job?.publishedDate || '-'}
                                                published={job?.isPublished}
                                                jobType={job?.jobType}
                                                id={job?._id}
                                                updateStatus={updateStatus}
                                                openModal={handleOpenEditModal}

                                            />
                                        </Grid>
                                    ))
                                ) : (
                                    // <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                                    //     No data found
                                    // </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh',width:"100%" }}>
                                    {/* <CircularProgress /> */}
                                     <Typography variant="h6" color='textDisabled' sx={{ textAlign: 'center', py: 4 }}> 
                                         No Job data found
                                     </Typography>
                                     </Box>
                                )}
                            </Grid>
                        </Box>
                    )}


                    {
                        jobsData?.jobs?.length>1 && (
                            <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-500">
                              {console.log(jobData?.totalJobs,"paginat")
                              }
                              Showing {start}-{end}  out of {jobsData?.totalJobs} results
                            </div>
                            <Pagination
                              count={jobsData?.totalPages}
                              page={filterOptions?.page}
                              onChange={handlePageChange}
                              shape="rounded"
                              siblingCount={1}
                              boundaryCount={0}
                              sx={{
                                "& .MuiPaginationItem-root": {
                                  margin: "0 4px",
                                  border: "1px solid #E0E2E7",
                                  borderRadius: "6px",
                                  fontSize: "14px",
                                  fontFamily: `'Public Sans', sans-serif`,
                                },
                                "& .Mui-selected": {
                                  color: "#fff",
                                  backgroundColor: "#1D83F8 !important",
                                },
                                "& .MuiPaginationItem-root:hover": {
                                  color: "#fff",
                                  backgroundColor: "#1D83F8",
                                },
                              }}
                            />
                          </div>
                        )
                    }
                   
                </div>
            </div>
        </MainLayout>
    );
};

export default AllJobs;