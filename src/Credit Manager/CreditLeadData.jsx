import React, { useState, useEffect } from 'react';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteLeadThunk } from '../redux/telecallerSlice';
import { getAllCreditManagerLeads, creditUpdateLead, getAllTelecallers } from "../redux/creditManagerSlice";
import { formatCurrency } from '../components/utils';
import Loader from "../components/ui/Loader";
import Toastify from '../helpers/Toastify';
import api from "../helpers/Api";
import * as XLSX from 'xlsx';
import {
    IosShare as IosShareIcon, Search as SearchIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, BorderColor as BorderColorIcon, FileUpload as FileUploadIcon,
    Close as CloseIcon, FileDownload as FileDownloadIcon, Description as DocIcon
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import '../Telecaller/telecaller.css';



const CreditLeadData = () => {

    const tableColumns = [
        "Lead Name", "Phone Number", "Alternate Number", "Gmail", "Location", "Loan Amount", "Loan Type", "Upload", "Option"
    ];

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { creditLeads, total, totalPages, hasNext, hasPrevious, creditLoading, creditError, telecallers, telecallersLoading } = useSelector(state => state.credit);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [activeTelecaller, setActiveTelecaller] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentPreviewLead, setCurrentPreviewLead] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingDocId, setDeletingDocId] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    const params = { page, limit, search: searchTerm, date: dateFilter, status: statusFilter, teleCaller: activeTelecaller?._id };


    useEffect(() => {
        dispatch(getAllTelecallers());
    }, [dispatch]);

    useEffect(() => {
        if (telecallers.length > 0 && !activeTelecaller) {
            setActiveTelecaller(telecallers[0]);
        }
    }, [telecallers, activeTelecaller]);

    useEffect(() => {
        dispatch(getAllCreditManagerLeads(params));
    }, [dispatch, page, limit, searchTerm, dateFilter, statusFilter, activeTelecaller]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm, dateFilter, statusFilter, activeTelecaller]);


    const handleTabChange = (telecaller) => {
        setActiveTelecaller(telecaller);
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
        navigate(`/credit-manager-view-lead-data/${id}`);
    }

    const goToEditLeadPage = (id) => {
        navigate(`/credit-manager-edit-lead-data/${id}`);
    }

    const handleFileUpload = async (e, leadId) => {
        const files = e.target.files;
        if (!files || files.length === 0 || isUploading) return;

        // const maxSize = 50 * 1024; // 50 KB
        // for (let i = 0; i < files.length; i++) {
        //     if (files[i].size > maxSize) {
        //         Toastify.error(`File "${files[i].name}" exceeds 50KB limit!`);
        //         e.target.value = null;
        //         return;
        //     }
        // }

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

                const lead = creditLeads.find(l => l._id === leadId);
                if (!lead) {
                    Toastify.error("Lead not found!");
                    return;
                }

                const updatedDocuments = [...lead.document, ...newDocuments];
                const result = await dispatch(creditUpdateLead({
                    id: leadId,
                    updatedData: { document: updatedDocuments }
                })).unwrap();

                if (result.success) {
                    dispatch(getAllCreditManagerLeads(params));
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
            const lead = creditLeads.find(l => l._id === leadId);
            if (!lead) {
                Toastify.error("Lead not found!");
                return;
            }

            const updatedDocuments = lead.document.filter(doc => doc._id !== docId);
            const result = await dispatch(creditUpdateLead({
                id: leadId,
                updatedData: { document: updatedDocuments }
            })).unwrap();

            if (result.success) {
                dispatch(getAllCreditManagerLeads(params));
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
                dispatch(getAllCreditManagerLeads(params));
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
            const dataForExcel = creditLeads.map(lead => ({
                "Lead Name": lead.leadName || "N/A",
                "Phone": lead.phone || "N/A",
                "Alternative Phone": lead.alternativePhone || "N/A",
                "Email": lead.email || "N/A",
                "Location": lead.location || "N/A",
                "Loan Amount": lead.loanAmount || "N/A",  // Keep as number for Excel formatting
                "Loan Type": lead.loanType?.loanName || "N/A"  // Use loanName instead of ID
            }));

            const ws = XLSX.utils.json_to_sheet(dataForExcel);

            // Set column widths to match visible columns
            const colWidths = [
                { wch: 25 },  // Lead Name
                { wch: 15 },  // Phone
                { wch: 20 },  // Alternative Phone
                { wch: 25 },  // Email
                { wch: 15 },  // Location
                { wch: 15 },  // Loan Amount
                { wch: 20 }   // Loan Type
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


    //pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };
    const getPageNumbers = (currentPage, totalPages) => {
        if (!totalPages || totalPages <= 0) return [];
        const pageNumbers = [];
        const maxPageButtons = 5;

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (endPage - startPage < maxPageButtons - 1) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, endPage - maxPageButtons + 1);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };
    const pageNumbers = totalPages && totalPages > 0 ? getPageNumbers(page, totalPages) : [];


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

            <div className='teleCont'>
                <div className="leadsTableCont border">

                    <div className="teleTabs">
                        {telecallersLoading ? (
                            <div>Loading telecallers...</div>
                        ) : (telecallers && telecallers.length > 0 && telecallers.map(tele => (
                            <button
                                key={tele._id}
                                onClick={() => handleTabChange(tele)}
                                className={activeTelecaller?._id === tele._id ? "teleActiveTab" : ""}
                            >
                                {tele.firstName} {tele.lastName}
                            </button>
                        ))
                        )}
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
                                    {tableColumns.map((h) => (
                                        <th key={h} className="teleSubHeading">{h}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {creditLoading ? (
                                    <tr>
                                        <td colSpan={tableColumns.length + 1} className="loadingCell">
                                            <Loader />
                                        </td>
                                    </tr>
                                ) : creditLeads?.length === 0 ? (
                                    <tr>
                                        <td className="noDataCell">
                                            No leads found
                                        </td>
                                    </tr>
                                ) : (
                                    creditLeads?.map((lead) => (
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
                                            <td className="teleText">{lead.location || "N/A"}</td>

                                            <td className="teleText">{formatCurrency(lead.loanAmount) || "N/A"}</td>
                                            <td className="teleText">{lead.loanType?.loanName || "N/A"}</td>
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

                        {!creditLoading && !creditError && total && total > limit && totalPages > 0 && (
                            <div className="telePagination">
                                <button className="telePageBtn" onClick={() => handlePageChange(page - 1)} disabled={!hasPrevious}>
                                    ‹
                                </button>
                                {pageNumbers.map(index => (
                                    <button key={index} className={`telePageBtn ${index === page ? 'telePageActive' : ''}`} onClick={() => handlePageChange(index)}>
                                        {index}
                                    </button>
                                ))}
                                <button className="telePageBtn" onClick={() => handlePageChange(page + 1)} disabled={!hasNext}>
                                    ›
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </MainLayout>
    );
};

export default CreditLeadData;