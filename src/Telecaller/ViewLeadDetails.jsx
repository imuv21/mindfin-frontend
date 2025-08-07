import React, { useState } from 'react';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import {
    Close as CloseIcon, FileDownload as FileDownloadIcon, FileUpload as FileUploadIcon, Visibility as VisibilityIcon, Delete as DeleteIcon, PersonAdd as PersonAddIcon,
    Description as DocIcon
} from '@mui/icons-material';
import './telecaller.css';

const dummyLead = {
    name: 'Uday Kumar',
    email: 'Bodgdan@gmail.com',
    phone: '(307) 555-0133',
    alternate: '(307) 555-0133',
    location: 'Bangalore',
    loanType: 'Personal',
    loanAmount: '1,200,000',
    createdDate: '2025-03-10',
    representatives: 'Data Entry',
    assignedTo: 'Telecaller 3'
};

const dummyDocs = [
    { id: 1, name: 'Overview.pdf', size: '50 Kb' },
    { id: 2, name: 'Contract.pdf', size: '50 Kb' },
    { id: 3, name: 'Contract.pdf', size: '50 Kb' },
    { id: 4, name: 'Overview.pdf', size: '50 Kb' },
];

const ViewLeadDetails = () => {

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
                        <button className="backBtn">Back</button>
                    </div>

                    <div className="topRow">
                        <div className="card leadCard">
                            <h3 className="teleHeading">Personal Information</h3>
                            <div className="infoGrid">
                                <div className="field">
                                    <div className="teleSubHeading">Lead Name</div>
                                    <div className="teleText">{dummyLead.name}</div>
                                </div>
                                <div className="field">
                                    <div className="teleSubHeading">Email Address</div>
                                    <div className="teleText">{dummyLead.email}</div>
                                </div>
                                <div className="field">
                                    <div className="teleSubHeading">Phone Number</div>
                                    <div className="teleText">{dummyLead.phone}</div>
                                </div>
                                <div className="field">
                                    <div className="teleSubHeading">Alternate Number</div>
                                    <div className="teleText">{dummyLead.alternate}</div>
                                </div>
                                <div className="field">
                                    <div className="teleSubHeading">Location</div>
                                    <div className="teleText">{dummyLead.location}</div>
                                </div>
                                <div className="field">
                                    <div className="teleSubHeading">Loan Type</div>
                                    <div className="teleText">{dummyLead.loanType}</div>
                                </div>
                                <div className="field">
                                    <div className="teleSubHeading">Loan Amount</div>
                                    <div className="teleText">{dummyLead.loanAmount}</div>
                                </div>
                                <div className="field">
                                    <div className="teleSubHeading">Lead Created Date</div>
                                    <div className="teleText">{dummyLead.createdDate}</div>
                                </div>
                                <div className="field">
                                    <div className="teleSubHeading">Representatives</div>
                                    <div className="teleText">{dummyLead.representatives}</div>
                                </div>
                                <div className="field">
                                    <div className="teleSubHeading">Assigned To</div>
                                    <div className="teleText">{dummyLead.assignedTo}</div>
                                </div>
                            </div>
                        </div>

                        <div className="card docsCard">
                            <h3 className="teleHeading">Uploaded Documents</h3>
                            <ul className="docList">
                                {dummyDocs.map(doc => (
                                    <li key={doc.id} className="docItem">
                                        <div className="docName">
                                            <DocIcon />
                                            <div>
                                                <div className="teleSubHeading">{doc.name}</div>
                                                <div className="teleText">{doc.size}</div>
                                            </div>
                                        </div>
                                        <div className="docActions">
                                            <FileDownloadIcon />
                                            <VisibilityIcon />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="historyCard card">
                        <div className="historyHeader">
                            <h3 className="teleHeading">Lead History</h3>
                            {historyList.length > 0 ? (
                                <div className="statusBadge status-process">In Conversation</div>
                            ) : (
                                <button className="teleBtn" onClick={handleNewClick}>
                                    <PersonAddIcon /> NEW
                                </button>
                            )}
                        </div>

                        {showForm ? (
                            <div className="leadForm">
                                <div className="formRow">
                                    <div className="formGroup">
                                        <label className='teleText'>Write a description</label>
                                        <input type="text" placeholder="Enter" />
                                    </div>
                                    <div className="formGroup">
                                        <label className='teleText'>Schedule date</label>
                                        <select><option>Select</option></select>
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <label className='teleText'>Schedule time</label>
                                        <select><option>Select</option></select>
                                    </div>
                                    <div className="formGroup">
                                        <label className='teleText'>Status</label>
                                        <select>
                                            <option>In progress</option>
                                            <option>Completed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <label className='teleText'>Remarks</label>
                                        <input type="text" placeholder="Enter" />
                                    </div>
                                    <div className="formGroup">
                                    </div>
                                </div>

                                <div className="formActions">
                                    <button className="teleBtn outline" onClick={handleCancel}>Cancel</button>
                                    <button className="teleBtn">Save</button>
                                </div>
                            </div>
                        ) : historyList.length > 0 ? (
                            <div className="leadHistoryScrollable">
                                {historyList.map((item) => (
                                    <div key={item.id} className="historyItem">
                                        <div className="teleText">{item.dateLabel}</div>
                                        <p><strong>Description:</strong> {item.description}</p>
                                        <p>
                                            <strong>{item.reschedule ? 'Reschedule date:' : 'Schedule date:'}</strong>{' '}
                                            <span style={{ color: 'red' }}>{item.scheduleDate}</span>
                                        </p>
                                        <p><strong>Remarks:</strong> {item.remarks}</p>
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
