import React, { useState, useEffect } from 'react';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleLead, getLeadHistories } from '../redux/telecallerSlice';
import { formatCurrency, formatDate, statusDisplay, statusColors } from '../components/utils';
import Loader from "../components/ui/Loader";
import {
    Close as CloseIcon, FileDownload as FileDownloadIcon, FileUpload as FileUploadIcon, Visibility as VisibilityIcon, Delete as DeleteIcon, PersonAdd as PersonAddIcon,
    Description as DocIcon
} from '@mui/icons-material';
import './telecaller.css';


const ViewLeadDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentLead, singleLeadLoading, singleLeadError, histories } = useSelector(state => state.telecaller);
    const [showForm, setShowForm] = useState(false);
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

    const handleNewClick = () => {
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
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

    const goBack = () => {
        navigate('/telecaller-leads-data');
    }

    useEffect(() => {
        if (id) {
            dispatch(getSingleLead(id));
            dispatch(getLeadHistories(id));
        }
    }, [dispatch, id]);


    return (
        <MainLayout>
            <ProfileHeader name="User Name" breadcrumbs={[""]} />

            <div className='teleCont'>
                <div className="viewLeadsCont">

                    <div className="pageHeader">
                        <div className="headerLeft">
                            <h2 className="teleSupHeading">View Lead Personal Information</h2>
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
                                <h3 className="teleHeading">Personal Information</h3>
                                <div className="infoGrid">
                                    <div className="field">
                                        <div className="teleSubHeading">Lead Name</div>
                                        <div className="teleText">{currentLead?.leadName || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Email Address</div>
                                        <div className="teleText">{currentLead?.email || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Phone Number</div>
                                        <div className="teleText">{currentLead?.phone || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Alternate Number</div>
                                        <div className="teleText">{currentLead?.alternativePhone || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Location</div>
                                        <div className="teleText">{currentLead?.location || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Loan Type</div>
                                        <div className="teleText">{currentLead?.loanType || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Loan Amount</div>
                                        <div className="teleText">{currentLead?.loanAmount ? formatCurrency(currentLead.loanAmount) : "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Lead Created Date</div>
                                        <div className="teleText">{currentLead?.LeadCreatedDate ? formatDate(currentLead.LeadCreatedDate) : "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Representatives</div>
                                        <div className="teleText">{currentLead?.representatives || "Data Entry"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Assigned To</div>
                                        <div className="teleText">{currentLead?.assignedTo || "N/A"}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="card docsCard">
                                <h3 className="teleHeading">Uploaded Documents</h3>
                                <ul className="docList">
                                    {currentLead?.document?.map((doc, index) => (
                                        <li key={index} className="docItem">
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
                                            </div>
                                        </li>
                                    ))}
                                    {(!currentLead?.document || currentLead.document.length === 0) &&
                                        <li className="teleText">No documents uploaded</li>
                                    }
                                </ul>
                            </div>
                        </div>
                    }

                    <div className="historyCard card">
                        <div className="historyHeader">
                            <h3 className="teleHeading">Lead History</h3>
                            {currentLead?.status && (
                                <div className={`statusTag ${statusColors[currentLead.status]}`}>
                                    {statusDisplay[currentLead.status] || currentLead.status}
                                </div>
                            )}
                        </div>

                        {histories && histories.length > 0 ? (
                            <div className="leadHistoryScrollable">
                                {histories.map((history) => (
                                    <div key={history._id} className="historyItem">
                                        <div className="historyHeader">
                                            <div className="teleText">
                                                {formatDate(history.createdAt)}
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
                    </div>

                </div>
            </div>

        </MainLayout>
    );
};

export default ViewLeadDetails;
