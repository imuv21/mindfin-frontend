import React, { useState, useEffect } from 'react';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleLead, getLeadHistories } from '../redux/telecallerSlice';
import { addTopup, updateTopup, getAllTopups, deleteTopup, resetTopupsState } from "../redux/creditManagerSlice";
import { formatCurrency, formatDate } from '../components/utils';
import Loader from "../components/ui/Loader";
import Toastify from '../helpers/Toastify';
import {
    Close as CloseIcon, FileDownload as FileDownloadIcon, FileUpload as FileUploadIcon, Visibility as VisibilityIcon, Delete as DeleteIcon, PersonAdd as PersonAddIcon,
    Description as DocIcon, BorderColor as BorderColorIcon
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import '../Telecaller/telecaller.css';


const TopupDetail = () => {

    const { id, bankId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentLead, singleLeadLoading } = useSelector(state => state.telecaller);

    const initialData = {
        disbursalAmount: "",
        paymentMode: "",
        disbursalDate: "",
        emiStartDate: "",
        processingFee: "",
        insuranceCharges: "",
        netDisbursedAmount: "",
        tenure: "",
        scheduledDate: "",
        followUpDate: "",
        status: "",
        remarks: "",
    };

    const initialTrackingData = {
        emiAmount: "",
        numOfEmis: "",
        numOfEmisPaid: "",
        pendingLoanAmount: "",
        processingFeeDeduction: "",
        insuranceCharges: "",
        tenure: "",
        status: "",
        scheduledDate: "",
        followUpDate: "",
        remarks: "",
    };

    const [formData, setFormData] = useState(initialData);
    const [trackingFormData, setTrackingFormData] = useState(initialTrackingData);
    const [isEditing, setIsEditing] = useState(false);
    const [isTrackingEditing, setIsTrackingEditing] = useState(false);


    // follow up
    const { topups, topupsLoading, addTopupLoading, updateTopupLoading } = useSelector(state => state.credit);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentTopup, setCurrentTopup] = useState(null);
    const [isAdded, setIsAdded] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const initialFormState = {
        applicant: id,
        type: "Personal",
        amount: "",
        status: "Pending",
        cibilScore: "",
        remarks: "",
    };
    const [topupFormData, setTopupFormData] = useState(initialFormState);

    useEffect(() => {
        if (id) {
            dispatch(getAllTopups(id));
        }
        return () => {
            dispatch(resetTopupsState());
        };
    }, [id, dispatch]);

    const handleAddNewTopup = () => {
        setTopupFormData(initialFormState);
        setEditMode(false);
        setCurrentTopup(null);
        setShowForm(true);
    };

    const handleTopupChange = (e) => {
        const { name, value } = e.target;
        setTopupFormData(prev => ({ ...prev, [name]: name === 'amount' || name === 'cibilScore' ? Number(value) : value }));
    };

    const handleTopupSubmit = async (e) => {
        e.preventDefault();
        if (isAdded) return;
        setIsAdded(true);
        try {
            const result = await dispatch(addTopup(topupFormData)).unwrap();

            if (result.success) {
                Toastify.success("Topup added successfully!");
                setShowForm(false);
                setTopupFormData(initialFormState);
            } else {
                Toastify.error(result.message || "Failed to add topup");
            }
        } catch (err) {
            Toastify.error(err?.message || "Failed to add topup");
        } finally {
            setIsAdded(false);
        }
    };

    const handleTopupEdit = (topup) => {
        setCurrentTopup(topup);
        setEditMode(true);
        setTopupFormData({
            applicant: topup.applicant,
            type: topup.type,
            amount: topup.amount,
            status: topup.status,
            cibilScore: topup.cibilScore,
            remarks: topup.remarks,
        });
        setShowForm(true);
    };

    const handleTopupUpdateSubmit = async (e) => {
        e.preventDefault();
        if (isUpdated) return;
        setIsUpdated(true);
        try {
            const result = await dispatch(updateTopup({
                id: currentTopup._id,
                data: topupFormData
            })).unwrap();

            if (result.success) {
                Toastify.success("Topup updated successfully!");
                setShowForm(false);
                setEditMode(false);
                setCurrentTopup(null);
            } else {
                Toastify.error(result.message || "Failed to update topup");
            }
        } catch (err) {
            Toastify.error(err?.message || "Failed to update topup");
        } finally {
            setIsUpdated(false);
        }
    };

    const handleTopupDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this topup?")) {
            if (deletingId) return;
            setDeletingId(id);
            try {
                const result = await dispatch(deleteTopup(id)).unwrap();

                if (result.success) {
                    Toastify.success(result.data?.message || "Topup deleted successfully!");
                } else {
                    Toastify.error(result.message || "Failed to delete topup");
                }
            } catch (err) {
                Toastify.error(err?.message || "Failed to delete topup");
            } finally {
                setDeletingId(null);
            }
        }
    };



    // two forms
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleTrackingChange = (e) => {
        const { name, value } = e.target;
        setTrackingFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setIsEditing(false);
    };
    const handleTrackingSave = () => {
        setIsTrackingEditing(false);
    };

    const handleCancel = () => {
        setFormData(initialData);
        setIsEditing(false);
    }
    const handleTrackingCancel = () => {
        setTrackingFormData(initialTrackingData);
        setIsTrackingEditing(false);
    }

    const handleEdit = () => {
        setIsEditing(true);
    };
    const handleTrackingEdit = () => {
        setIsTrackingEditing(true);
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
        navigate('/top-up');
    }

    useEffect(() => {
        if (id) {
            dispatch(getSingleLead(id));
            dispatch(getLeadHistories(id));
        }
    }, [dispatch, id]);


    return (
        <MainLayout>
            <ProfileHeader name="View Detailed History" breadcrumbs={[""]} />

            <div className='teleCont'>
                <div className="viewLeadsCont">

                    <div className="pageHeader">
                        <div className="headerLeft">
                            <h2 className="teleSupHeading">View Detailed History</h2>
                            <nav className="breadcrumbs">
                                <span className="bcItem">Leads Data</span>
                                <span className="bcSeparator">›</span>
                                <span className="bcItem active">View Detailed History</span>
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

                    <div className="loanCard card">
                        <div className="historyHeader">
                            <h3 className="teleHeading">Loan Details</h3>
                        </div>

                        {isEditing ? (
                            <div className="loanFormCont">

                                <div className="formRow">
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Disbursal Amount</div>
                                        <input
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="disbursalAmount"
                                            value={formData.disbursalAmount}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Payment Mode</div>
                                        <input
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="paymentMode"
                                            value={formData.paymentMode}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Disbursal Date</div>
                                        <input
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="disbursalDate"
                                            value={formData.disbursalDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="formGroup">
                                        <div className="teleSubHeading">EMI Start Date</div>
                                        <input
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="emiStartDate"
                                            value={formData.emiStartDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Processing Fee</div>
                                        <input
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="processingFee"
                                            value={formData.processingFee}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Insurance Charges</div>
                                        <input
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="insuranceCharges"
                                            value={formData.insuranceCharges}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Net Disbursed Amount</div>
                                        <input
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="netDisbursedAmount"
                                            value={formData.netDisbursedAmount}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Tenure</div>
                                        <input
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="tenure"
                                            value={formData.tenure}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Scheduled Date</div>
                                        <input
                                            type="date"
                                            className="border teleText"
                                            name="scheduledDate"
                                            value={formData.scheduledDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Follow-up Date</div>
                                        <input
                                            type="date"
                                            className="border teleText"
                                            name="followUpDate"
                                            value={formData.followUpDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Status</div>
                                        <select
                                            className="styledSelect"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="">Not Eligible / Eligible</option>
                                            <option value="Eligible">Eligible</option>
                                            <option value="Not Eligible">Not Eligible</option>
                                        </select>
                                    </div>
                                    <div className="formGroup">
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Remarks</div>
                                        <textarea
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="remarks"
                                            value={formData.remarks}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="formRow">
                                    <button className="teleBtn" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                    <button className="teleBtn" onClick={handleSave}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="leadCard">
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
                                    <div className="formRow">
                                        <button className="teleBtn" style={{ marginTop: '10px', width: '100px' }} onClick={handleEdit}>
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                    <div className="loanCard card">
                        <div className="historyHeader">
                            <h3 className="teleHeading">Repayment Tracking</h3>
                        </div>

                        {isTrackingEditing ? (
                            <div className="loanFormCont">

                                <div className="formRow">
                                    <div className="formGroup">
                                        <div className="teleSubHeading">EMI Amount</div>
                                        <input
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="emiAmount"
                                            value={trackingFormData.emiAmount}
                                            onChange={handleTrackingChange}
                                        />
                                    </div>
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Number of EMIs</div>
                                        <input
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="numOfEmis"
                                            value={trackingFormData.numOfEmis}
                                            onChange={handleTrackingChange}
                                        />
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Number of EMIs Paid</div>
                                        <input
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="numOfEmisPaid"
                                            value={trackingFormData.numOfEmisPaid}
                                            onChange={handleTrackingChange}
                                        />
                                    </div>
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Pending Loan Amount</div>
                                        <input
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="pendingLoanAmount"
                                            value={trackingFormData.pendingLoanAmount}
                                            onChange={handleTrackingChange}
                                        />
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Processing Fee Deduction</div>
                                        <input
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="processingFeeDeduction"
                                            value={trackingFormData.processingFeeDeduction}
                                            onChange={handleTrackingChange}
                                        />
                                    </div>
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Insurance Charges</div>
                                        <input
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="insuranceCharges"
                                            value={trackingFormData.insuranceCharges}
                                            onChange={handleTrackingChange}
                                        />
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Tenure</div>
                                        <input
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="tenure"
                                            value={trackingFormData.tenure}
                                            onChange={handleTrackingChange}
                                        />
                                    </div>
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Status</div>
                                        <select
                                            className="styledSelect"
                                            name="status"
                                            value={trackingFormData.status}
                                            onChange={handleTrackingChange}
                                        >
                                            <option value="">Not Eligible / Eligible</option>
                                            <option value="Eligible">Eligible</option>
                                            <option value="Not Eligible">Not Eligible</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Scheduled Date</div>
                                        <input
                                            type="date"
                                            className="border teleText"
                                            name="scheduledDate"
                                            value={trackingFormData.scheduledDate}
                                            onChange={handleTrackingChange}
                                        />
                                    </div>
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Follow-up Date</div>
                                        <input
                                            type="date"
                                            className="border teleText"
                                            name="followUpDate"
                                            value={trackingFormData.followUpDate}
                                            onChange={handleTrackingChange}
                                        />
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Remarks</div>
                                        <textarea
                                            className="border teleText"
                                            placeholder="Enter"
                                            name="remarks"
                                            value={trackingFormData.remarks}
                                            onChange={handleTrackingChange}
                                        />
                                    </div>
                                </div>

                                <div className="formRow">
                                    <button className="teleBtn" onClick={handleTrackingCancel}>
                                        Cancel
                                    </button>
                                    <button className="teleBtn" onClick={handleTrackingSave}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="leadCard">
                                <div className="infoGrid">
                                    <div className="field">
                                        <div className="teleSubHeading">EMI Amount</div>
                                        <div className="teleText">{currentLead?.leadName || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Number of EMIs</div>
                                        <div className="teleText">{currentLead?.email || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Number of EMIs Paid</div>
                                        <div className="teleText">{currentLead?.phone || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Pending Loan Amount</div>
                                        <div className="teleText">{currentLead?.alternativePhone || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Processing Fee Deduction</div>
                                        <div className="teleText">{currentLead?.location || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Insurance Charges</div>
                                        <div className="teleText">{currentLead?.loanType || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Tenure</div>
                                        <div className="teleText">{currentLead?.loanAmount ? formatCurrency(currentLead.loanAmount) : "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Status</div>
                                        <div className="teleText">{currentLead?.LeadCreatedDate ? formatDate(currentLead.LeadCreatedDate) : "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Scheduled Date</div>
                                        <div className="teleText">{currentLead?.representatives || "Data Entry"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Follow-up Date</div>
                                        <div className="teleText">{currentLead?.assignedTo || "N/A"}</div>
                                    </div>
                                    <div className="formRow">
                                        <button className="teleBtn" style={{ marginTop: '10px', width: '100px' }} onClick={handleTrackingEdit}>
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="followUpCard card">
                        <div className="followUpHeader">
                            <h3 className="teleHeading">Topup History</h3>
                            <button className="teleBtn" onClick={handleAddNewTopup}>
                                Add New Topup
                            </button>
                        </div>

                        {!showForm && (
                            <div className="leadsTableWrapper">
                                <table className="leadsTable">
                                    <thead>
                                        <tr>
                                            <th className="teleSubHeading">Type</th>
                                            <th className="teleSubHeading">Amount</th>
                                            <th className="teleSubHeading">Status</th>
                                            <th className="teleSubHeading">CIBIL Score</th>
                                            <th className="teleSubHeading">Remarks</th>
                                            <th className="teleSubHeading">Created Date</th>
                                            <th className="teleSubHeading">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topupsLoading ? (
                                            <tr>
                                                <td colSpan="7" className="text-center">Loading topups...</td>
                                            </tr>
                                        ) : topups?.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center">No topups found</td>
                                            </tr>
                                        ) : (
                                            topups?.map((item) => (
                                                <tr key={item._id}>
                                                    <td>{item.type}</td>
                                                    <td>₹{item.amount.toLocaleString()}</td>
                                                    <td>{item.status}</td>
                                                    <td>{item.cibilScore || "-"}</td>
                                                    <td>{item.remarks || "-"}</td>
                                                    <td>{formatDate(item.createdAt)}</td>
                                                    <td>
                                                        <div className='actionIcons'>
                                                            <BorderColorIcon onClick={() => handleTopupEdit(item)} />
                                                            {deletingId === item._id ? (
                                                                <CircularProgress size={20} />
                                                            ) : (
                                                                <DeleteIcon onClick={() => handleTopupDelete(item._id)} />
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {showForm && (
                            <form className="loanFormCont" onSubmit={editMode ? handleTopupUpdateSubmit : handleTopupSubmit}>
                                <div className="formRow">
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Type</div>
                                        <select
                                            name="type"
                                            value={topupFormData.type}
                                            onChange={handleTopupChange}
                                            className="styledSelect"
                                            required
                                        >
                                            <option value="Personal">Personal</option>
                                            <option value="Business">Business</option>
                                        </select>
                                    </div>
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Amount</div>
                                        <input
                                            type="number"
                                            name="amount"
                                            placeholder="Amount"
                                            value={topupFormData.amount}
                                            onChange={handleTopupChange}
                                            className="border teleText"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <div className="teleSubHeading">Status</div>
                                        <select
                                            name="status"
                                            value={topupFormData.status}
                                            onChange={handleTopupChange}
                                            className="styledSelect"
                                            required
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div className="formGroup">
                                        <div className="teleSubHeading">CIBIL Score</div>
                                        <input
                                            type="number"
                                            name="cibilScore"
                                            placeholder="CIBIL Score"
                                            value={topupFormData.cibilScore}
                                            onChange={handleTopupChange}
                                            className="border teleText"
                                        />
                                    </div>
                                </div>

                                <div className="formRow">
                                    <div className="formGroup fullWidth">
                                        <div className="teleSubHeading">Remarks</div>
                                        <textarea
                                            name="remarks"
                                            placeholder="Remarks"
                                            value={topupFormData.remarks}
                                            onChange={handleTopupChange}
                                            className="border teleText"
                                            rows="3"
                                        />
                                    </div>
                                </div>

                                <div className="formRow actions">
                                    <button type="button" className="teleBtn"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditMode(false);
                                            setCurrentTopup(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="teleBtn" disabled={addTopupLoading || updateTopupLoading}>
                                        {editMode ? (updateTopupLoading ? "Updating..." : "Update Topup") : (addTopupLoading ? "Saving..." : "Save Topup")}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                </div>
            </div>

        </MainLayout>
    );
};

export default TopupDetail;
