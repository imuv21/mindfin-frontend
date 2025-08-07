import React, { useState } from 'react';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import {
    IosShare as IosShareIcon, Search as SearchIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, BorderColor as BorderColorIcon, FileUpload as FileUploadIcon,
    Close as CloseIcon, FileDownload as FileDownloadIcon, PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import './telecaller.css';


const LeadsData = () => {

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [previewFile, setPreviewFile] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [currentLeadId, setCurrentLeadId] = useState(null);
    const [selectedManager, setSelectedManager] = useState("");

    const creditManagers = [
        "Credit Manager A",
        "Credit Manager B",
        "Credit Manager C",
        "Credit Manager D",
        "Credit Manager E"
    ];

    const upFiles = [
        { name: "Overview.pdf", size: "50 Kb" },
        { name: "Contract.pdf", size: "50 Kb" },
        { name: "Contract.pdf", size: "50 Kb" },
        { name: "Overview.pdf", size: "50 Kb" },
        { name: "Overview.pdf", size: "50 Kb" }
    ];

    const initialInConversationLeads = Array(10).fill({
        name: "Uday",
        phone: "985475213",
        alternate: "985475213",
        email: "lead@gmail.com",
        amount: "1,200,000",
        type: "Personal",
        status: "In Process"
    });

    const [inConversationLeads, setInConversationLeads] = useState(
        initialInConversationLeads.map((lead, index) => ({
            ...lead,
            id: `in-conv-${index}`
        }))
    );

    const initialClosedLeads = Array(8).fill({
        name: "Uday",
        phone: "985475213",
        alternate: "985475213",
        email: "lead@gmail.com",
        location: "Bangalore",
        amount: "1,200,000",
        type: "Personal",
        createdDate: "2025-03-10",
        status: "Eligible",
        creditManager: null
    });

    const [closedLeads, setClosedLeads] = useState(
        initialClosedLeads.map((lead, index) => ({
            ...lead,
            id: `closed-${index}`
        }))
    );

    const droppedLeads = Array(5).fill({
        name: "Uday",
        phone: "985475213",
        alternate: "985475213",
        email: "lead@gmail.com",
        location: "Bangalore",
        amount: "1,200,000",
        type: "Personal",
        dropReason: "No Response"
    });

    const statusColors = {
        "In Process": "status-process",
        "Eligible": "status-eligible",
        "RNR": "status-rnr",
        "Rejected": "status-rejected"
    };

    const leadsByTab = {
        "In Conversation": inConversationLeads,
        "Closed": closedLeads,
        "Dropped": droppedLeads
    };

    const columns = {
        "In Conversation": ["Lead Name", "Phone Number", "Alternate Number", "Gmail", "Loan Amount", "Loan Type", "Status", "Upload", "Option"],
        "Closed": ["Lead Name", "Phone Number", "Alternate Number", "Gmail", "Location", "Loan Amount", "Loan Type", "Lead Created Date", "Status", "Assign Credit Manager", "Option"],
        "Dropped": ["Lead Name", "Phone Number", "Alternate Number", "Gmail", "Location", "Loan Amount", "Loan Type", "Drop Reason", "Option"]
    };

    const [activeTab, setActiveTab] = useState("In Conversation");
    const handleTabChange = (tab) => setActiveTab(tab);

    const handleFileUpload = (leadId) => {
        const newFile = {
            id: `file-${Date.now()}`,
            name: `document-${leadId.slice(-3)}.pdf`,
            type: 'application/pdf',
            size: '2.4 MB',
            uploadedAt: new Date().toISOString()
        };

        setUploadedFiles(prev => ({
            ...prev,
            [leadId]: newFile
        }));
    };

    const handleFilePreview = (leadId) => {
        if (uploadedFiles[leadId]) {
            setPreviewFile(uploadedFiles[leadId]);
            setIsPreviewOpen(true);
        }
    };

    const closePreview = () => {
        setIsPreviewOpen(false);
        setPreviewFile(null);
    };

    //  Credit Manager Assignment

    const openAssignModal = (leadId) => {
        setCurrentLeadId(leadId);
        setIsAssignModalOpen(true);
    };

    const closeAssignModal = () => {
        setIsAssignModalOpen(false);
        setCurrentLeadId(null);
        setSelectedManager("");
    };

    const assignCreditManager = () => {
        if (!currentLeadId || !selectedManager) return;

        setClosedLeads(prev =>
            prev.map(lead =>
                lead.id === currentLeadId
                    ? { ...lead, creditManager: selectedManager }
                    : lead
            )
        );

        closeAssignModal();
    };


    return (
        <MainLayout>
            <ProfileHeader name="Leads Data" breadcrumbs={["This is leads data"]} />

            {/* File Preview Modal */}
            {isPreviewOpen && previewFile && (
                <div className="filePreviewModal">
                    <div className="modalContent">

                        <div className="modalHeader">
                            <h3>Uploaded Documents</h3>
                            <button className="closeButton" onClick={closePreview}>
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="uploadedList">
                            {upFiles.map((file, idx) => (
                                <div className="fileCard" key={idx}>
                                    <div className="fileIcon">
                                        📄
                                    </div>
                                    <div className="fileDetails">
                                        <div className="fileName">{file.name}</div>
                                        <div className="fileSize">{file.size}</div>
                                    </div>
                                    <div className="fileActions">
                                        <FileDownloadIcon />
                                        <VisibilityIcon />
                                        <DeleteIcon />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="teleBtn fullBtn">
                            <FileUploadIcon /> Upload Document
                        </button>

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
                            <p>Select a credit manager for this lead:</p>

                            <div className="managerList">
                                {creditManagers.map((manager, index) => (
                                    <div key={index} className={`managerOption ${selectedManager === manager ? "selected" : ""}`} onClick={() => setSelectedManager(manager)}>
                                        <div className="managerIcon">
                                            <PersonAddIcon />
                                        </div>
                                        <div className="managerName">{manager}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="modalActions">
                            <button className="teleBtn" onClick={closeAssignModal}>Cancel</button>
                            <button className="teleBtn" onClick={assignCreditManager} disabled={!selectedManager}>
                                Assign Manager
                            </button>
                        </div>

                    </div>
                </div>
            )}

            <div className='teleCont'>
                <div className="leadsTableCont border">

                    <div className="teleTabs">
                        {["In Conversation", "Closed", "Dropped"].map((tab) => (
                            <button key={tab} onClick={() => handleTabChange(tab)} className={activeTab === tab ? "teleActiveTab" : ""}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="filterAndActions">
                        <div className="teleFilterWrapper">
                            <button className="teleFilterBtn">🧊 Todays</button>
                            <select className="styledSelect">
                                <option vlaue="">14 Feb 2019</option>
                                <option vlaue="">15 Feb 2019</option>
                            </select>
                            <select className="styledSelect">
                                <option vlaue="">Status</option>
                                <option value="eligible">Eligible</option>
                                <option value="rejected">Rejected</option>
                                <option value="inprocess">In Process</option>
                                <option value="rnr">RNR</option>
                            </select>
                        </div>

                        <div className="searchAndActions">
                            <div className="teleSearchWrapper">
                                <SearchIcon />
                                <input type="text" placeholder="Search" className="teleSearchInput" />
                            </div>
                            <button className="teleBtn"><IosShareIcon /> Export</button>
                            <button className="teleBtn">Send Report</button>
                        </div>
                    </div>

                    <table className="leadsTable">
                        <thead>
                            <tr>
                                <th>
                                    <label className="teleCustomCheckbox">
                                        <input type="checkbox" />
                                        <span className="teleCheckmark"></span>
                                    </label>
                                </th>
                                {columns[activeTab].map((h) => <th key={h} className="teleSubHeading">{h}</th>)}
                            </tr>
                        </thead>

                        <tbody>
                            {leadsByTab[activeTab].map((lead, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <label className="teleCustomCheckbox">
                                            <input type="checkbox" defaultChecked={activeTab === "In Conversation"} />
                                            <span className="teleCheckmark"></span>
                                        </label>
                                    </td>

                                    {/* Common columns */}
                                    <td className="teleText">{lead.name}</td>
                                    <td className="teleText">{lead.phone}</td>
                                    <td className="teleText">{lead.alternate}</td>
                                    <td className="teleText">{lead.email}</td>

                                    {/* Tab-specific columns */}
                                    {activeTab === "In Conversation" && (
                                        <>
                                            <td className="teleText">{lead.amount}</td>
                                            <td className="teleText">{lead.type}</td>
                                            <td>
                                                <span className={`statusTag ${statusColors[lead.status]}`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className='actionIcons'>
                                                    {uploadedFiles[lead.id] ? (
                                                        <VisibilityIcon onClick={() => handleFilePreview(lead.id)} />
                                                    ) : (
                                                        <FileUploadIcon onClick={() => handleFileUpload(lead.id)} />
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className='actionIcons'>
                                                    <VisibilityIcon />
                                                    <BorderColorIcon />
                                                    <DeleteIcon />
                                                </div>
                                            </td>
                                        </>
                                    )}

                                    {activeTab === "Closed" && (
                                        <>
                                            <td className="teleText">{lead.location}</td>
                                            <td className="teleText">{lead.amount}</td>
                                            <td className="teleText">{lead.type}</td>
                                            <td className="teleText">{lead.createdDate}</td>
                                            <td>
                                                <span className={`statusTag ${statusColors[lead.status]}`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="teleText">
                                                {lead.creditManager ? (lead.creditManager) : (
                                                    <button className="assignButton" onClick={() => openAssignModal(lead.id)}>
                                                        Assign
                                                    </button>
                                                )}
                                            </td>
                                            <td>
                                                <div className='actionIcons'>
                                                    <VisibilityIcon />
                                                    <BorderColorIcon />
                                                    <DeleteIcon />
                                                </div>
                                            </td>
                                        </>
                                    )}

                                    {activeTab === "Dropped" && (
                                        <>
                                            <td className="teleText">{lead.location}</td>
                                            <td className="teleText">{lead.amount}</td>
                                            <td className="teleText">{lead.type}</td>
                                            <td className="teleText">{lead.dropReason}</td>
                                            <td>
                                                <div className='actionIcons'>
                                                    <VisibilityIcon />
                                                    <BorderColorIcon />
                                                    <DeleteIcon />
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="telePaginationRow">
                        <div className="teleShowMore">
                            <span className='teleSubHeading'>Show rows:</span>
                            <select className="styledSelect">
                                <option>10 items</option>
                                <option>20 items</option>
                                <option>50 items</option>
                            </select>
                        </div>

                        <div className="telePagination">
                            <button className="telePageBtn">‹</button>
                            <button className="telePageBtn telePageActive">1</button>
                            <button className="telePageBtn">2</button>
                            <button className="telePageBtn">3</button>
                            <button className="telePageBtn">...</button>
                            <button className="telePageBtn">10</button>
                            <button className="telePageBtn">›</button>
                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
};

export default LeadsData;