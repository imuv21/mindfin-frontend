import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";
import ProfileHeader from "@/components/layout/ProfileHeader";
import {
    styled,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    TableContainer,
    Paper,
    Box,
    Card,
    Grid,
    Chip,
    TextField,
    MenuItem,
    IconButton,
    Button,
    CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AlarmIcon from "@mui/icons-material/Alarm";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import AddCandidateModal from "./AddCandidateModal";
import { useDispatch, useSelector } from "react-redux";
import { getAllCandidates, setCandidateFilterValues } from "../../redux/jobSlice";
import { formatDate } from "../../helpers/conversion";
import ViewCandidateModal from "./ViewCandidateModal"; // Import the ViewCandidateModal component
import EditCandidateModal from "./EditCandidateModal";
import DeleteModal from "@/components/employee/DeleteModal";
import api from '../../helpers/Api';
import Toastify from '../../helpers/Toastify';



const StyledTableRow = styled(TableRow)(() => ({
    height: 44,
}));

const StyledTableCell = styled(TableCell)(() => ({
    paddingTop: 2,
    paddingBottom: 2,
    height: 44,
    lineHeight: '44px',
}));

export default function AllCandidates() {
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [name, setName] = useState('');
    const [itemsPerPage] = useState(10);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
    const [opendeleteModal,setOpenDeleteModal] = useState (false)
    const [deleteLoading,setDeleteLoading] = useState(false)

    

    const { candidateFilterOptions, candidates, isLoading } = useSelector((state) => state.jobs);

    const handleSearch = (e) => {
        setName(e.target.value);
        dispatch(setCandidateFilterValues({ name: e.target.value, page: 1 }));
    };

    const handlePageChange = (event, page) => {
        dispatch(setCandidateFilterValues({ page }));
    };

    const calculateShowingRange = () => {
        const start = (candidates?.currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(
            candidates?.currentPage * itemsPerPage,
            candidates?.totalCandidate
        );
        return { start, end };
    };

    const { start, end } = calculateShowingRange();

    useEffect(() => {
        dispatch(getAllCandidates(candidateFilterOptions));
    }, [candidateFilterOptions,openModal,openEditModal,deleteLoading]);


    const handleViewCandidate = (id) => {
        setSelectedCandidateId(id);
        setOpenViewModal(true);
    };

    //setOpenEditModal

    const handleEditCandidate = (id) => {
        setSelectedCandidateId(id);
        setOpenEditModal(true);
    };
    const handelDeleteModalOpen = (id) => {
        setSelectedCandidateId(id);
        setOpenDeleteModal(true);
    };

    const handleDeleteSubmit =async()=>{
        try {
            setDeleteLoading(true)

            const {data,status} = await api.deleteACandidate(selectedCandidateId)

            if(status === 200){
                Toastify.success("Candidate deleted successfully")
                setOpenDeleteModal(false)
            }
            
        } catch (error) {
                    Toastify.error(error.response.data.message || `something went wrong`);
            
        }finally{
            setDeleteLoading(false)

        }
    }

    const downloadFile = async (imageUrl) => {
            
                const fileName = imageUrl?.split('/')?.pop()?.split('?')[0];
                    
            try {
            
            const response = await api.downloadPhoto(imageUrl);
    
            
            if (response.data instanceof Blob) {
                const fileUrl = window.URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = fileUrl;
                
                link.download = fileName;
                link.click();
                window.URL.revokeObjectURL(fileUrl);
            } else {
                console.error("Error while generating Barcode");
            }
            } catch (error) {
            console.log('Download failed:', error);
            }
        };

    return (
        <MainLayout>
            <ProfileHeader 
            name="Candidates"
            breadcrumbs={["Show All Candidates"]}
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
                                        <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
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
                                        placeholder="Search Candidate"
                                        value={name}
                                        onChange={(e) => handleSearch(e)}
                                    />
                                </div>
                            </div>

                            {/* All Button */}
                            <Box mt={{ xs: 2, md: 0 }}>
                                <Button onClick={() => setOpenModal(true)}
                                    variant="outlined"
                                    sx={{ textTransform: "none", borderRadius: 2, background: '#2563EB', display: 'flex', gap: '10px', color: '#fff' }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 6.33333V11.6667M11.6667 9H6.33333M17 9C17 10.0506 16.7931 11.0909 16.391 12.0615C15.989 13.0321 15.3997 13.914 14.6569 14.6569C13.914 15.3997 13.0321 15.989 12.0615 16.391C11.0909 16.7931 10.0506 17 9 17C7.94943 17 6.90914 16.7931 5.93853 16.391C4.96793 15.989 4.08601 15.3997 3.34315 14.6569C2.60028 13.914 2.011 13.0321 1.60896 12.0615C1.20693 11.0909 1 10.0506 1 9C1 6.87827 1.84285 4.84344 3.34315 3.34315C4.84344 1.84285 6.87827 1 9 1C11.1217 1 13.1566 1.84285 14.6569 3.34315C16.1571 4.84344 17 6.87827 17 9Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    Add Candidates
                                </Button>
                                <AddCandidateModal isOpen={openModal} onClose={() => setOpenModal(false)} />
                            </Box>
                        </Box>

                        <ViewCandidateModal isOpen={openViewModal} onClose={() => setOpenViewModal(false)} id={selectedCandidateId} />

                        <EditCandidateModal isOpen={openEditModal}  onClose={() => setOpenEditModal(false)} id={selectedCandidateId}  />

                         <DeleteModal
                                isOpen={opendeleteModal}
                                close={()=>setOpenDeleteModal(false)}
                                handleSubmit={handleDeleteSubmit}
                                heading="Confirm Deletion"
                                description="Are you sure you want to delete this Candidate?"
                                loading={deleteLoading}
                        />

                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Candidate Name</StyledTableCell>
                                            <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Applied For</StyledTableCell>
                                            <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Applied Date</StyledTableCell>
                                            <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Email Address</StyledTableCell>
                                            <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Mobile Number</StyledTableCell>
                                            <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Status</StyledTableCell>
                                            <StyledTableCell sx={{ fontSize: 14, color: "#A2A1A8" }}>Action</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {candidates?.candidates?.length ? (
                                            candidates.candidates.map((emp) => (
                                                <StyledTableRow key={emp.id} sx={{ height: 48 }}>
                                                    <StyledTableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <Typography fontSize={14} fontWeight={500} color="#14151C">
                                                                {emp.name}
                                                            </Typography>
                                                        </Box>
                                                    </StyledTableCell>
                                                    <StyledTableCell sx={{ fontSize: 14, color: "#14151C" }}>
                                                        {emp.appliedFor?.jobTitle}
                                                    </StyledTableCell>
                                                    <StyledTableCell sx={{ fontSize: 14, color: "#14151C" }}>
                                                        {formatDate(emp.AppliedDate)}
                                                    </StyledTableCell>
                                                    <StyledTableCell sx={{ fontSize: 14, color: "#14151C" }}>
                                                        {emp.email}
                                                    </StyledTableCell>
                                                    <StyledTableCell sx={{ fontSize: 14, color: "#14151C" }}>
                                                        {emp.phone}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Chip
                                                            label={emp.applicationStatus === "SELECTED"
                                                                ? "Selected"
                                                                : emp.applicationStatus === "INPROGRESS"
                                                                    ? "In Process"
                                                                    : emp.applicationStatus === "REJECTED"
                                                                        ? "Rejected"
                                                                        : "-"}
                                                            sx={{
                                                                backgroundColor:
                                                                    emp.applicationStatus === "SELECTED"
                                                                        ? "#3FC28A1A"
                                                                        : emp.applicationStatus === "INPROGRESS"
                                                                            ? "#EFBE121A"
                                                                            : emp.applicationStatus === "REJECTED"
                                                                                ? "#FBBF241A"
                                                                                : "#E0E0E0",
                                                                color:
                                                                    emp.applicationStatus === "SELECTED"
                                                                        ? "#3FC28A"
                                                                        : emp.applicationStatus === "INPROGRESS"
                                                                            ? "#FBBF24"
                                                                            : emp.applicationStatus === "REJECTED"
                                                                                ? "#F45B69"
                                                                                : "#757575",
                                                                fontWeight: 600,
                                                                fontSize: 12,
                                                                height: 24,
                                                                borderRadius: '4px',
                                                            }}
                                                        />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <div className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                                                        <button className="text-gray-600 hover:text-gray-900 cursor-pointer"  onClick={()=>downloadFile(emp?.resume[0])} >
                                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M1 13V14C1 14.7956 1.31607 15.5587 1.87868 16.1213C2.44129 16.6839 3.20435 17 4 17H14C14.7956 17 15.5587 16.6839 16.1213 16.1213C16.6839 15.5587 17 14.7956 17 14V13M13 9L9 13M9 13L5 9M9 13V1" stroke="#818181" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                </svg>
                                                            </button>

                                                            <button className="text-gray-600 hover:text-gray-900 cursor-pointer" onClick={() => handleViewCandidate(emp?._id)}>
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                                </svg>
                                                            </button>
                                                            <button className="text-gray-600 hover:text-gray-900 cursor-pointer" onClick={() => handleEditCandidate(emp?._id)}>
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                                </svg>
                                                            </button>
                                                            <button className="text-gray-600 hover:text-gray-900 cursor-pointer" onClick={()=> handelDeleteModalOpen(emp?._id)}>
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                        ) : (
                                            <StyledTableRow>
                                                <StyledTableCell colSpan={7} sx={{ textAlign: 'center', fontSize: 14, color: "#A2A1A8" ,mt:5}}>
                                                    No Candidate data found
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}


                        {
                            candidates?.candidates?.length > 1 && (
                                <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-500">
                                Showing {start}-{end} out of {candidates?.totalCandidate} results
                            </div>
                            <Pagination
                                shape="rounded"
                                siblingCount={1}
                                boundaryCount={0}
                                count={candidates?.totalPages}
                                page={candidateFilterOptions?.page}
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
                                        border: '1px solid #2563EB'
                                    },
                                    "& .MuiPaginationItem-root:hover": {
                                        color: "#fff",
                                        backgroundColor: "#2563EB",
                                    },
                                }}
                            />
                        </div>
                            )
                        }
                        
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}