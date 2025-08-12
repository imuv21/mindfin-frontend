import React, { useState, useEffect } from 'react';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTelecallerLeads, deleteLeadThunk, updateLead, getAllCreditManagers, assignCreditManagerToLead } from '../redux/telecallerSlice';
import { formatCurrency, formatDate, statusDisplay, statusColors } from '../components/utils';
import Loader from "../components/ui/Loader";
import Toastify from '../helpers/Toastify';
import api from "../helpers/Api";
import * as XLSX from 'xlsx';
import {
    IosShare as IosShareIcon, Search as SearchIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, BorderColor as BorderColorIcon, FileUpload as FileUploadIcon,
    Close as CloseIcon, FileDownload as FileDownloadIcon, PersonAdd as PersonAddIcon, Description as DocIcon
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import '../Telecaller/telecaller.css';



const LeadData = () => {

    const columns = {
        "Tele caller 1": ["Lead Name", "Phone Number", "Alternate Number", "Gmail", "Loan Amount", "Loan Type", "Status", "Upload", "Option"],
        "Tele caller 2": ["Lead Name", "Phone Number", "Alternate Number", "Gmail", "Location", "Loan Amount", "Loan Type", "Lead Created Date", "Status", "Assign Credit Manager", "Option"],
        "Tele caller 3": ["Lead Name", "Phone Number", "Alternate Number", "Gmail", "Location", "Loan Amount", "Loan Type", "Drop Reason", "Option"]
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { leads, pagination, teleLoading, creditManagers, creditManagersLoading, assignmentLoading } = useSelector(state => state.telecaller);

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [currentLeadId, setCurrentLeadId] = useState(null);
    const [selectedManager, setSelectedManager] = useState("");
    const [activeTab, setActiveTab] = useState("Tele caller 1");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentPreviewLead, setCurrentPreviewLead] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingDocId, setDeletingDocId] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    const params = { page, limit, name: searchTerm, date: dateFilter, status: statusFilter };


    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1);
    };

    const clearAllFilters = () => {
        setDateFilter("");
        setStatusFilter("");
    };

    const handleOpenPreview = (lead) => {
        setCurrentPreviewLead(lead);
        setIsPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
        setCurrentPreviewLead(null);
    };

    const goToViewLeadPage = (id) => {
        navigate(`/telecaller-view-lead-details/${id}`);
    }

    const goToEditLeadPage = (id) => {
        navigate(`/telecaller-edit-lead-data/${id}`);
    }

    const handleFileUpload = async (e, leadId) => {
        const files = e.target.files;
        if (!files || files.length === 0 || isUploading) return;

        const maxSize = 50 * 1024; // 50 KB
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > maxSize) {
                Toastify.error(`File "${files[i].name}" exceeds 50KB limit!`);
                e.target.value = null;
                return;
            }
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('folderName', `lead_${leadId}`);

            for (let i = 0; i < files.length; i++) {
                formData.append('image', files[i]);
            }

            const response = await api.uploadDocs(formData);
            if (response.data.success) {
                const newDocuments = response.data.data;

                const lead = leads.find(l => l._id === leadId);
                if (!lead) {
                    Toastify.error("Lead not found!");
                    return;
                }

                const updatedDocuments = [...lead.document, ...newDocuments];
                const result = await dispatch(updateLead({
                    id: leadId,
                    updatedData: { document: updatedDocuments }
                })).unwrap();

                if (result.success) {
                    dispatch(getAllTelecallerLeads(params));
                    if (currentPreviewLead && currentPreviewLead._id === leadId) {
                        setCurrentPreviewLead({
                            ...currentPreviewLead,
                            document: updatedDocuments
                        });
                    }
                    Toastify.success('Documents uploaded successfully!');
                }
            }
        } catch (error) {
            Toastify.error(error?.message || 'Failed to upload documents!');
        } finally {
            setIsUploading(false);
            e.target.value = null;
        }
    };

    const handleDeleteDocument = async (docId, leadId) => {
        if (deletingDocId) return;
        setDeletingDocId(docId);

        try {
            const lead = leads.find(l => l._id === leadId);
            if (!lead) {
                Toastify.error("Lead not found!");
                return;
            }

            const updatedDocuments = lead.document.filter(doc => doc._id !== docId);
            const result = await dispatch(updateLead({
                id: leadId,
                updatedData: { document: updatedDocuments }
            })).unwrap();

            if (result.success) {
                dispatch(getAllTelecallerLeads(params));
                if (currentPreviewLead && currentPreviewLead._id === leadId) {
                    setCurrentPreviewLead({
                        ...currentPreviewLead,
                        document: updatedDocuments
                    });
                }
                Toastify.success('Document removed!');
            }
        } catch (error) {
            Toastify.error(error?.message || 'Failed to remove document!');
        } finally {
            setDeletingDocId(null);
        }
    };

    const handleDeleteLead = async (id) => {
        if (deletingId) return;
        setDeletingId(id);
        try {
            const result = await dispatch(deleteLeadThunk(id)).unwrap();
            if (result.success) {
                Toastify.success("Lead deleted successfully.");
                dispatch(getAllTelecallerLeads(params));
            }
        } catch (err) {
            Toastify.error(err?.message || "Something went wrong!");
        } finally {
            setDeletingId(null);
        }
    };

    const handleDownload = async (url, filename) => {
        const res = await fetch(url);
        const blob = await res.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename || 'file';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const exportLeads = async () => {
        if (isExporting) return;
        setIsExporting(true);
        try {
            const response = await api.exportTelecallerLeads();

            const leads = response.data.data;
            const dataForExcel = leads.map(lead => ({
                "Lead ID": lead._id,
                "Lead Name": lead.leadName,
                "Email": lead.email,
                "Phone": lead.phone,
                "Alternative Phone": lead.alternativePhone,
                "Location": lead.location,
                "Loan Type ID": lead.loanType,
                "Loan Amount": lead.loanAmount,
                "Branch ID": lead.branch,
                "Created By ID": lead.createdBy,
                "Status": lead.status,
                "PAN Card": lead.panCard,
                "Date of Birth": lead.dateOfBirth ? new Date(lead.dateOfBirth).toLocaleDateString() : '',
                "Lead Created Date": lead.LeadCreatedDate ? new Date(lead.LeadCreatedDate).toLocaleString() : '',
                "Documents": lead.document.map(doc => doc.url).join(', '),
                "Assigned Date": lead.assignedDate ? new Date(lead.assignedDate).toLocaleString() : '',
                "Assigned To ID": lead.assignedTo
            }));

            const ws = XLSX.utils.json_to_sheet(dataForExcel);
            const colWidths = [
                { wch: 25 },  // Lead ID
                { wch: 20 },  // Lead Name
                { wch: 25 },  // Email
                { wch: 15 },  // Phone
                { wch: 20 },  // Alt Phone
                { wch: 15 },  // Location
                { wch: 15 },  // Loan Type ID
                { wch: 15 },  // Loan Amount
                { wch: 15 },  // Branch ID
                { wch: 15 },  // Created By ID
                { wch: 12 },  // Status
                { wch: 15 },  // PAN Card
                { wch: 15 },  // DOB
                { wch: 20 },  // Lead Created Date
                { wch: 40 },  // Documents
                { wch: 20 },  // Assigned Date
                { wch: 15 }   // Assigned To ID
            ];
            ws['!cols'] = colWidths;
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Telecaller Leads");
            XLSX.writeFile(wb, "telecaller_leads.xlsx");

        } catch (error) {
            console.error("Export failed:", error);
            Toastify.error(error?.message || "Something went wrong!");
        } finally {
            setIsExporting(false);
        }
    };

    //  Credit Manager Assignment

    const openAssignModal = (leadId) => {
        const lead = leads.find(l => l._id === leadId);
        setCurrentLeadId(leadId);
        setSelectedManager(lead?.creditManger || "");
        setIsAssignModalOpen(true);
    };

    const closeAssignModal = () => {
        setIsAssignModalOpen(false);
        setCurrentLeadId(null);
        setSelectedManager("");
    };

    const assignCreditManager = async () => {
        if (!currentLeadId || !selectedManager) return;

        try {
            await dispatch(assignCreditManagerToLead({
                leadId: currentLeadId,
                creditManagerId: selectedManager
            })).unwrap();

            Toastify.success('Credit manager assigned successfully!');
            closeAssignModal();
        } catch (error) {
            Toastify.error(error?.message || 'Failed to assign credit manager');
        }
    };

    useEffect(() => {
        dispatch(getAllCreditManagers());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllTelecallerLeads(params));
    }, [dispatch, activeTab, page, limit, searchTerm, dateFilter, statusFilter]);


    return (
        <MainLayout>
            <ProfileHeader name="Leads Data" breadcrumbs={["This is leads data"]} />

            {/* Document Preview Modal */}
            {isPreviewOpen && currentPreviewLead && (
                <div className="filePreviewModal">
                    <div className="modalContent">
                        <div className="modalHeader">
                            <h3>Uploaded Documents</h3>
                            <button className="closeButton" onClick={handleClosePreview}>
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="uploadedList">
                            {currentPreviewLead.document?.length > 0 ? (
                                currentPreviewLead.document.map((doc) => (
                                    <div className="fileCard" key={doc._id}>
                                        <div className="fileIcon">
                                            <DocIcon />
                                        </div>
                                        <div className="fileDetails">
                                            <div className="fileName">{doc.name || "Document"}</div>
                                        </div>
                                        <div className="fileActions">
                                            <FileDownloadIcon onClick={() => handleDownload(doc.url, doc.name)} style={{ cursor: 'pointer' }} />
                                            <a href={doc.url} target="_blank" rel="noreferrer">
                                                <VisibilityIcon />
                                            </a>
                                            {deletingDocId === doc._id ? (
                                                <CircularProgress size={20} />
                                            ) : (
                                                <DeleteIcon onClick={() => handleDeleteDocument(doc._id, currentPreviewLead._id)} />
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No documents uploaded</p>
                            )}
                        </div>

                        <div className="uploadDocBtn">
                            <input
                                type="file"
                                id={`modal-upload-${currentPreviewLead._id}`}
                                multiple
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileUpload(e, currentPreviewLead._id)}
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            />
                            <label htmlFor={`modal-upload-${currentPreviewLead._id}`} className="teleBtn">
                                <FileUploadIcon />  {isUploading ? 'Uploading...' : 'Upload Documents'}
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Credit Manager Assignment Modal */}
            {isAssignModalOpen && (
                <div className="assignModal">
                    <div className="modalContent">
                        <div className="modalHeader">
                            <h3>Assign Credit Manager</h3>
                            <button className="closeButton" onClick={closeAssignModal}>
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="modalBody">
                            <p className="teleText">Select a credit manager for this lead:</p>

                            {creditManagersLoading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px' }}>
                                    <CircularProgress size={24} />
                                    <p className="teleText">Loading credit managers...</p>
                                </div>
                            ) : creditManagers.length === 0 ? (
                                <p className="teleText">No credit managers available</p>
                            ) : (
                                <div style={{ marginTop: '15px' }}>
                                    <select value={selectedManager} onChange={(e) => setSelectedManager(e.target.value)} className="styledSelect bigSelect" style={{ width: '100%' }}>
                                        <option value="">Select Credit Manager</option>
                                        {creditManagers.map((manager) => (
                                            <option key={manager._id} value={manager._id} selected={leads.find(l => l._id === currentLeadId)?.creditManger === manager._id}>
                                                {manager.name} ({manager.totalTodayAssignedLeads} leads today)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="modalActions">
                            <button className="teleBtn" onClick={closeAssignModal}>Cancel</button>
                            <button
                                className="teleBtn"
                                onClick={assignCreditManager}
                                disabled={!selectedManager || assignmentLoading}
                                style={{ minWidth: '120px' }}
                            >
                                {assignmentLoading ? <CircularProgress size={20} /> : 'Assign Manager'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className='teleCont'>
                <div className="leadsTableCont border">

                    <div className="teleTabs">
                        {["Tele caller 1", "Tele caller 2", "Tele caller 3"].map((tab) => (
                            <button key={tab} onClick={() => handleTabChange(tab)} className={activeTab === tab ? "teleActiveTab" : ""}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="filterAndActions">
                        <div className="teleFilterWrapper">
                            <button className={`teleFilterBtn ${!dateFilter && !statusFilter ? 'active' : ''}`} onClick={clearAllFilters}>
                                All
                            </button>
                            <input
                                type="date"
                                className="styledSelect"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                            <select
                                className="styledSelect"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="INPROGRESS">In Progress</option>
                                <option value="CLOSED">Closed</option>
                                <option value="DROPPED">Dropped</option>
                            </select>
                        </div>

                        <div className="searchAndActions">
                            <div className="teleSearchWrapper">
                                <SearchIcon />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="teleSearchInput"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="teleBtn" onClick={exportLeads}><IosShareIcon /> Export</button>
                            <button className="teleBtn">Send Report</button>
                        </div>
                    </div>

                    <div className="leadsTableWrapper">
                        <table className="leadsTable">
                            <thead>
                                <tr>
                                    <th>
                                        <label className="teleCustomCheckbox">
                                            <input type="checkbox" />
                                            <span className="teleCheckmark"></span>
                                        </label>
                                    </th>
                                    {columns[activeTab].map((h) => (
                                        <th key={h} className="teleSubHeading">{h}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {teleLoading ? (
                                    <tr>
                                        <td colSpan={columns[activeTab].length + 1} className="loadingCell">
                                            <Loader />
                                        </td>
                                    </tr>
                                ) : leads?.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns[activeTab].length + 1} className="noDataCell">
                                            No leads found
                                        </td>
                                    </tr>
                                ) : (
                                    leads?.map((lead) => (
                                        <tr key={lead._id}>
                                            <td>
                                                <label className="teleCustomCheckbox">
                                                    <input type="checkbox" />
                                                    <span className="teleCheckmark"></span>
                                                </label>
                                            </td>

                                            {/* Common columns */}
                                            <td className="teleText">{lead.leadName || "N/A"}</td>
                                            <td className="teleText">{lead.phone || "N/A"}</td>
                                            <td className="teleText">{lead.alternativePhone || "N/A"}</td>
                                            <td className="teleText">{lead.email || "N/A"}</td>

                                            {/* Tab-specific columns */}
                                            {activeTab === "Tele caller 1" && (
                                                <>
                                                    <td className="teleText">{formatCurrency(lead.loanAmount) || "N/A"}</td>
                                                    <td className="teleText">{lead.loanType?.loanName || "N/A"}</td>
                                                    <td>
                                                        <span className={`statusTag ${statusColors[lead.status] || ''}`}>
                                                            {statusDisplay[lead.status] || lead.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className='actionIcons'>
                                                            <FileUploadIcon onClick={() => handleOpenPreview(lead)} style={{ cursor: 'pointer' }} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='actionIcons'>
                                                            <VisibilityIcon onClick={() => goToViewLeadPage(lead._id)} />
                                                            <BorderColorIcon onClick={() => goToEditLeadPage(lead._id)} />
                                                            {deletingId === lead._id ? (
                                                                <CircularProgress size={20} />
                                                            ) : (
                                                                <DeleteIcon onClick={() => handleDeleteLead(lead._id)} />
                                                            )}
                                                        </div>
                                                    </td>
                                                </>
                                            )}

                                            {activeTab === "Tele caller 2" && (
                                                <>
                                                    <td className="teleText">{lead.location || "N/A"}</td>
                                                    <td className="teleText">{formatCurrency(lead.loanAmount) || "N/A"}</td>
                                                    <td className="teleText">{lead.loanType?.loanName || "N/A"}</td>
                                                    <td className="teleText">{formatDate(lead.LeadCreatedDate) || "N/A"}</td>
                                                    <td>
                                                        <span className={`statusTag ${statusColors[lead.status] || ''}`}>
                                                            {statusDisplay[lead.status] || lead.status}
                                                        </span>
                                                    </td>
                                                    <td className="teleText">
                                                        {lead.creditManger ? (
                                                            <button className="assignedButton" onClick={() => openAssignModal(lead._id)}>
                                                                Assigned
                                                            </button>
                                                        ) : (
                                                            <button className="assignButton" onClick={() => openAssignModal(lead._id)}>
                                                                Assign
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className='actionIcons'>
                                                            <VisibilityIcon onClick={() => goToViewLeadPage(lead._id)} />
                                                            <BorderColorIcon onClick={() => goToEditLeadPage(lead._id)} />
                                                            {deletingId === lead._id ? (
                                                                <CircularProgress size={20} />
                                                            ) : (
                                                                <DeleteIcon onClick={() => handleDeleteLead(lead._id)} />
                                                            )}
                                                        </div>
                                                    </td>
                                                </>
                                            )}

                                            {activeTab === "Tele caller 3" && (
                                                <>
                                                    <td className="teleText">{lead.location || "N/A"}</td>
                                                    <td className="teleText">{formatCurrency(lead.loanAmount) || "N/A"}</td>
                                                    <td className="teleText">{lead.loanType?.loanName || "N/A"}</td>
                                                    <td className="teleText">
                                                        {lead.status === "DROPPED" ? "No response" : "N/A"}
                                                    </td>
                                                    <td>
                                                        <div className='actionIcons'>
                                                            <VisibilityIcon onClick={() => goToViewLeadPage(lead._id)} />
                                                            <BorderColorIcon onClick={() => goToEditLeadPage(lead._id)} />
                                                            {deletingId === lead._id ? (
                                                                <CircularProgress size={20} />
                                                            ) : (
                                                                <DeleteIcon onClick={() => handleDeleteLead(lead._id)} />
                                                            )}
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="telePaginationRow">
                        <div className="teleShowMore">
                            <span className='teleSubHeading'>Show rows:</span>
                            <select className="styledSelect" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                                <option value={5}>5 items</option>
                                <option value={10}>10 items</option>
                                <option value={20}>20 items</option>
                            </select>
                        </div>

                        <div className="telePagination">
                            <button className="telePageBtn" disabled={pagination?.isFirst || teleLoading} onClick={() => setPage(prev => Math.max(prev - 1, 1))}>
                                ‹
                            </button>

                            {pagination && pagination.totalPages > 0 && (
                                <>
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (pagination.totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (page <= 3) {
                                            pageNum = i + 1;
                                        } else if (page >= pagination.totalPages - 2) {
                                            pageNum = pagination.totalPages - 4 + i;
                                        } else {
                                            pageNum = page - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                className={`telePageBtn ${page === pageNum ? 'telePageActive' : ''}`}
                                                onClick={() => setPage(pageNum)}
                                                disabled={teleLoading}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    {pagination.totalPages > 5 && page < pagination.totalPages - 2 && (
                                        <span className="telePageDots">...</span>
                                    )}

                                    {pagination.totalPages > 5 && page < pagination.totalPages - 2 && (
                                        <button
                                            className={`telePageBtn ${page === pagination.totalPages ? 'telePageActive' : ''}`}
                                            onClick={() => setPage(pagination.totalPages)}
                                            disabled={teleLoading}
                                        >
                                            {pagination.totalPages}
                                        </button>
                                    )}
                                </>
                            )}

                            <button className="telePageBtn" disabled={pagination?.isLast || teleLoading} onClick={() => setPage(prev => Math.min(prev + 1, pagination?.totalPages || 1))}>
                                ›
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
};

export default LeadData;