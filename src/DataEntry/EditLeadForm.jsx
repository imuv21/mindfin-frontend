import React, { useState, useEffect } from 'react';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getADataEntryLead, updateDataEntryLead } from '../redux/dataEntrySlice';
import { formatCurrency, formatDate } from '../components/utils';
import Loader from "../components/ui/Loader";
import Toastify from '../helpers/Toastify';
import api from "../helpers/Api";
import { Save as SaveIcon } from '@mui/icons-material';
import '../Telecaller/telecaller.css';


const EditLeadForm = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { dataEntrySingleLead, dataEntrySingleLeadLoading } = useSelector(state => state.dataEntry);

    const [formData, setFormData] = useState({});
    const [loanTypes, setLoanTypes] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (isUpdating) return;
        setIsUpdating(true);
        try {
            const result = await dispatch(updateDataEntryLead({
                id: dataEntrySingleLead._id,
                data: {
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

    const goBack = () => {
        navigate('/data-entry-leads-data');
    }

    useEffect(() => {
        if (id) {
            dispatch(getADataEntryLead(id));
            fetchLoanTypes();
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (dataEntrySingleLead && loanTypes?.length > 0) {
            const matchedLoanType = loanTypes.find(
                loan => loan.loanName === dataEntrySingleLead.loanType
            );
            setFormData({
                leadName: dataEntrySingleLead.leadName || "",
                email: dataEntrySingleLead.email || "",
                phone: dataEntrySingleLead.phone || "",
                alternativePhone: dataEntrySingleLead.alternativePhone || "",
                location: dataEntrySingleLead.location || "",
                loanType: matchedLoanType?._id || "",
                loanAmount: dataEntrySingleLead.loanAmount ? String(dataEntrySingleLead.loanAmount) : ""
            });
        }
    }, [dataEntrySingleLead, loanTypes]);

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
                                <span className="bcItem active">Edit Lead Personal Information</span>
                            </nav>
                        </div>
                        <button className="backBtn" onClick={goBack}>Back</button>
                    </div>

                    {dataEntrySingleLeadLoading ? <Loader /> :
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
                                                {dataEntrySingleLead?.LeadCreatedDate ? formatDate(dataEntrySingleLead.LeadCreatedDate) : "N/A"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="formActions">
                                        <button className="teleBtn" onClick={handleSave} disabled={isUpdating}>
                                            <SaveIcon /> {isUpdating ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

        </MainLayout>
    );
};

export default EditLeadForm;
