import React, { useState, useEffect } from 'react';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleLead, updateLead, createLeadHistory, getLeadHistories, updateLeadHistory, deleteLeadHistory } from '../redux/telecallerSlice';
import { formatCurrency, formatDate } from '../components/utils';
import Loader from "../components/ui/Loader";
import Toastify from '../helpers/Toastify';
import api from "../helpers/Api";
import {
    Close as CloseIcon, FileDownload as FileDownloadIcon, FileUpload as FileUploadIcon, Visibility as VisibilityIcon, Delete as DeleteIcon, PersonAdd as PersonAddIcon,
    Description as DocIcon, Save as SaveIcon
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import '../Telecaller/telecaller.css';


const EditLeadData = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentLead, singleLeadLoading, histories, historyLoading, historyError, historyAddLoading, historyAddError, historyDeleteLoading, historyDeleteError,
        historyUpdateLoading, historyUpdateError } = useSelector(state => state.telecaller);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [loanTypes, setLoanTypes] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [historyList, setHistoryList] = useState([
        {
            id: 1,
            dateLabel: '1 week ago',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            scheduleDate: '22/10/2024 at 10AM',
            reschedule: false,
            remarks: 'Call back the customer at 22/10/2024 at 10AM'
        },
        {
            id: 2,
            dateLabel: 'Today',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            scheduleDate: '22/10/2024 at 10AM',
            reschedule: true,
            remarks: 'Call back the customer at 22/10/2024 at 10AM'
        },
        {
            id: 3,
            dateLabel: '1 week ago',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            scheduleDate: '22/10/2024 at 10AM',
            reschedule: false,
            remarks: 'Call back the customer at 22/10/2024 at 10AM'
        },
        {
            id: 4,
            dateLabel: 'Today',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            scheduleDate: '22/10/2024 at 10AM',
            reschedule: true,
            remarks: 'Call back the customer at 22/10/2024 at 10AM'
        },
        {
            id: 5,
            dateLabel: '1 week ago',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            scheduleDate: '22/10/2024 at 10AM',
            reschedule: false,
            remarks: 'Call back the customer at 22/10/2024 at 10AM'
        },
        {
            id: 6,
            dateLabel: 'Today',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            scheduleDate: '22/10/2024 at 10AM',
            reschedule: true,
            remarks: 'Call back the customer at 22/10/2024 at 10AM'
        },
        {
            id: 7,
            dateLabel: '1 week ago',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            scheduleDate: '22/10/2024 at 10AM',
            reschedule: false,
            remarks: 'Call back the customer at 22/10/2024 at 10AM'
        },
        {
            id: 8,
            dateLabel: 'Today',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            scheduleDate: '22/10/2024 at 10AM',
            reschedule: true,
            remarks: 'Call back the customer at 22/10/2024 at 10AM'
        }
    ]);

    const [historyForm, setHistoryForm] = useState({
        description: '',
        scheduledDate: '',
        scheduledTime: '',
        status: 'INPROGRESS',
        remarks: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (isUpdating) return;
        setIsUpdating(true);
        try {
            const result = await dispatch(updateLead({
                id: currentLead._id,
                updatedData: {
                    ...formData,
                    loanAmount: Number(formData.loanAmount)
                }
            })).unwrap();

            if (result.success) {
                Toastify.success("Lead updated successfully.");
            }
        } catch (error) {
            Toastify.error(error?.message || "Failed to update lead.");
        } finally {
            setIsUpdating(false);
        }
    };

    const fetchLoanTypes = async () => {
        const result = await api.getAllLoanType();
        if (result.data?.success) {
            setLoanTypes(result.data?.data?.data);
        }
    };

    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0 || isUploading) return;

        // const maxSize = 50 * 1024; // 50 KB 
        // for (let i = 0; i < files.length; i++) {
        //     if (files[i].size > maxSize) {
        //         Toastify.error(`File "${files[i].name}" is larger than 50 KB and will not be uploaded!`);
        //         e.target.value = null;
        //         return;
        //     }
        // }
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('folderName', `lead_${currentLead._id}`);

            for (let i = 0; i < files.length; i++) {
                formData.append('image', files[i]);
            }

            const response = await api.uploadDocs(formData);
            if (response.data.success) {
                const newDocuments = response.data.data;
                const updatedDocuments = [...currentLead.document, ...newDocuments];

                const result = await dispatch(updateLead({
                    id: currentLead._id,
                    updatedData: { document: updatedDocuments }
                })).unwrap();

                if (result.success) {
                    Toastify.success('Documents uploaded successfully!');
                }
            }
        } catch (error) {
            Toastify.error(error?.message || 'Failed to upload documents!');
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
            e.target.value = null;
        }
    };

    const handleDeleteDocument = async (docId) => {
        if (deletingId) return;
        setDeletingId(docId);

        try {
            const updatedDocuments = currentLead.document.filter(doc => doc._id !== docId);

            const result = await dispatch(updateLead({ id: currentLead._id, updatedData: { document: updatedDocuments } })).unwrap();
            if (result.success) {
                Toastify.success('Document removed!');
            }
        } catch (error) {
            Toastify.error(error?.message || 'Failed to remove document!');
            console.error(error);
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


    // History

    const handleHistoryInput = (e) => {
        const { name, value } = e.target;
        setHistoryForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddHistory = async () => {
        if (!historyForm.description || historyAddLoading) return;

        try {
            await dispatch(createLeadHistory({
                leadId: id,
                ...historyForm
            })).unwrap();

            Toastify.success("History added successfully!");
            setShowForm(false);
            setHistoryForm({
                description: '',
                scheduledDate: '',
                scheduledTime: '',
                status: 'In progress',
                remarks: ''
            });
        } catch (error) {
            Toastify.error(error?.message || "Failed to add history");
        }
    };

    const handleDeleteHistory = async (historyId) => {
        if (historyDeleteLoading) return;

        try {
            await dispatch(deleteLeadHistory(historyId)).unwrap();
            Toastify.success("History deleted successfully!");
        } catch (error) {
            Toastify.error(error?.message || "Failed to delete history");
        }
    };

    const handleNewClick = () => {
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    const goBack = () => {
        navigate('/credit-manager-lead-data');
    }

    useEffect(() => {
        if (id) {
            dispatch(getSingleLead(id));
            dispatch(getLeadHistories(id));
            fetchLoanTypes();
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (currentLead && loanTypes?.length > 0) {
            const matchedLoanType = loanTypes.find(
                loan => loan.loanName === currentLead.loanType
            );
            setFormData({
                leadName: currentLead.leadName || "",
                email: currentLead.email || "",
                phone: currentLead.phone || "",
                alternativePhone: currentLead.alternativePhone || "",
                location: currentLead.location || "",
                loanType: matchedLoanType?._id || "",
                loanAmount: currentLead.loanAmount ? String(currentLead.loanAmount) : ""
            });
            setDocuments(currentLead.document || []);
        }
    }, [currentLead, loanTypes]);

    return (
        <MainLayout>
            <ProfileHeader name="User Name" breadcrumbs={[""]} />

            <div className='teleCont'>
                <div className="viewLeadsCont">

                    <div className="pageHeader">
                        <div className="headerLeft">
                            <h2 className="teleSupHeading">Edit Lead Personal Information</h2>
                            <nav className="breadcrumbs">
                                <span className="bcItem">Leads Data</span>
                                <span className="bcSeparator">›</span>
                                <span className="bcItem active">View Lead Personal Information</span>
                            </nav>
                        </div>
                        <button className="backBtn" onClick={goBack}>Back</button>
                    </div>

                    {singleLeadLoading ? <Loader /> :
                        <div className="topRow">
                            <div className="card leadCard">
                                <div className="leadForm">

                                    <div className="formRow">
                                        <div className="formGroup">
                                            <div className="teleSubHeading">Lead Name</div>
                                            <input type="text" name="leadName" value={formData.leadName} onChange={handleInputChange} className="teleInput" />
                                        </div>
                                        <div className="formGroup">
                                            <div className="teleSubHeading">Email Address</div>
                                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="teleInput" />
                                        </div>
                                    </div>

                                    <div className="formRow">
                                        <div className="formGroup">
                                            <div className="teleSubHeading">Phone Number</div>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="teleInput" />
                                        </div>
                                        <div className="formGroup">
                                            <div className="teleSubHeading">Alternate Number</div>
                                            <input type="tel" name="alternativePhone" value={formData.alternativePhone} onChange={handleInputChange} className="teleInput" />
                                        </div>
                                    </div>

                                    <div className="formRow">
                                        <div className="formGroup">
                                            <div className="teleSubHeading">Location</div>
                                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="teleInput" />
                                        </div>
                                        <div className="formGroup">
                                            <div className="teleSubHeading">Loan Type</div>
                                            <select name="loanType" value={formData.loanType} onChange={handleInputChange} className="teleSelect">
                                                <option value="">Select Loan Type</option>
                                                {loanTypes && loanTypes.length > 0 && loanTypes.map((loanType, index) => (
                                                    <option key={index} value={loanType?._id}>
                                                        {loanType?.loanName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="formRow">
                                        <div className="formGroup">
                                            <div className="teleSubHeading">Loan Amount</div>
                                            <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleInputChange} className="teleInput" />
                                        </div>
                                        <div className="formGroup">
                                            <div className="teleSubHeading">Lead Created Date</div>
                                            <div className="teleText">
                                                {currentLead?.LeadCreatedDate ? formatDate(currentLead.LeadCreatedDate) : "N/A"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="formRow">
                                        <div className="formGroup">
                                            <div className="teleSubHeading">Representatives</div>
                                            <div className="teleText">{currentLead?.representatives || "Data Entry"}</div>
                                        </div>
                                        <div className="formGroup">
                                            <div className="teleSubHeading">Assigned To</div>
                                            <div className="teleText">{currentLead?.assignedTo || "N/A"}</div>
                                        </div>
                                    </div>

                                    <div className="formActions">
                                        <button className="teleBtn" onClick={handleSave} disabled={isUpdating}>
                                            <SaveIcon /> {isUpdating ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="card docsCard">
                                <h3 className="teleHeading">Uploaded Documents</h3>
                                <ul className="docList">
                                    {currentLead?.document?.map((doc) => (
                                        <li key={doc._id} className="docItem">
                                            <div className="docName">
                                                <DocIcon />
                                                <div>
                                                    <div className="teleSubHeading">{doc.name || "Document"}</div>
                                                </div>
                                            </div>
                                            <div className="docActions">
                                                <FileDownloadIcon onClick={() => handleDownload(doc.url, doc.name)} style={{ cursor: 'pointer' }} />
                                                <a href={doc.url} target="_blank" rel="noreferrer">
                                                    <VisibilityIcon />
                                                </a>
                                                {deletingId === doc._id ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    <DeleteIcon onClick={() => handleDeleteDocument(doc._id)} />
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                    {(!currentLead?.document || currentLead.document.length === 0) &&
                                        <li className="teleText">No documents uploaded</li>
                                    }
                                </ul>

                                <div className="uploadDocBtn">
                                    <button onClick={() => document.getElementById('doc-upload').click()} className="teleBtn" disabled={isUploading}>
                                        <FileUploadIcon />
                                        {isUploading ? "Uploading..." : "Upload Documents"}
                                    </button>
                                    <input type="file" id="doc-upload" multiple style={{ display: 'none' }} onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                                </div>
                            </div>
                        </div>
                    }

                    {/* <div className="historyCard card">
                        <div className="historyHeader">
                            <h3 className="teleHeading">Lead History</h3>
                            <button className="teleBtn" onClick={handleNewClick}>
                                <PersonAddIcon /> NEW
                            </button>
                        </div>
                        {showForm ? (
                            <div className="leadForm">
                                <div className="formRow">
                                    <div className="formGroup">
                                        <label className='teleText'>Write a description</label>
                                        <input
                                            type="text"
                                            name="description"
                                            value={historyForm.description}
                                            onChange={handleHistoryInput}
                                            placeholder="Enter description"
                                        />
                                    </div>
                                    <div className="formGroup">
                                        <label className='teleText'>Schedule date</label>
                                        <input
                                            type="date"
                                            name="scheduledDate"
                                            value={historyForm.scheduledDate}
                                            onChange={handleHistoryInput}
                                        />
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <label className='teleText'>Schedule time</label>
                                        <input
                                            type="time"
                                            name="scheduledTime"
                                            value={historyForm.scheduledTime}
                                            onChange={handleHistoryInput}
                                        />
                                    </div>
                                    <div className="formGroup">
                                        <label className='teleText'>Status</label>
                                        <select name="status" value={historyForm.status} onChange={handleHistoryInput}>
                                            <option value="INPROGRESS">In Progress</option>
                                            <option value="PENDING">Pending</option>
                                            <option value="CLOSED">Closed</option>
                                            <option value="DROPPED">Dropped</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup fullWidth">
                                        <label className='teleText'>Remarks</label>
                                        <input
                                            type="text"
                                            name="remarks"
                                            value={historyForm.remarks}
                                            onChange={handleHistoryInput}
                                            placeholder="Enter remarks"
                                        />
                                    </div>
                                </div>

                                <div className="formActions">
                                    <button className="teleBtn outline" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                    <button className="teleBtn" onClick={handleAddHistory} disabled={historyAddLoading}>
                                        {historyAddLoading ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </div>
                        ) : histories && histories.length > 0 ? (
                            <div className="leadHistoryScrollable">
                                {histories.map((history) => (
                                    <div key={history._id} className="historyItem">
                                        <div className="historyHeader">
                                            <div className="teleText">
                                                {formatDate(history.createdAt)}
                                            </div>
                                            <div className="historyActions">
                                                <button className="iconBtn" onClick={() => handleDeleteHistory(history._id)} disabled={historyDeleteLoading}>
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </div>
                                        <p><strong>Description:</strong> {history.description}</p>
                                        {history.scheduledDate && (
                                            <p>
                                                <strong>Schedule:</strong>{' '}
                                                <span style={{ color: 'red' }}>
                                                    {formatDate(history.scheduledDate)} at {history.scheduledTime}
                                                </span>
                                            </p>
                                        )}
                                        <p><strong>Status:</strong> {history.status}</p>
                                        {history.remarks && (
                                            <p><strong>Remarks:</strong> {history.remarks}</p>
                                        )}
                                        <p><strong>Created by:</strong> {`${history?.createdBy?.firstName}  ${history?.createdBy?.lastName}`}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="teleText">No History yet</div>
                        )}
                    </div> */}

                </div>
            </div>

        </MainLayout>
    );
};

export default EditLeadData;
