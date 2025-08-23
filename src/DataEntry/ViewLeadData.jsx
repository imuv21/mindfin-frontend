import React, { useState, useEffect } from 'react';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getADataEntryLead } from '../redux/dataEntrySlice';
import { formatCurrency, formatDate } from '../components/utils';
import Loader from "../components/ui/Loader";
import '../Telecaller/telecaller.css';


const ViewLeadData = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { dataEntrySingleLead, dataEntrySingleLeadLoading } = useSelector(state => state.dataEntry);

    const goBack = () => {
        navigate('/data-entry-leads-data');
    }

    useEffect(() => {
        if (id) {
            dispatch(getADataEntryLead(id));
        }
    }, [dispatch, id]);


    return (
        <MainLayout>
            <ProfileHeader name="User Name" breadcrumbs={[""]} />

            <div className='teleCont'>
                <div className="viewLeadsCont">

                    <div className="pageHeader">
                        <div className="headerLeft">
                            <h2 className="teleSupHeading">Lead Personal Information</h2>
                            <nav className="breadcrumbs">
                                <span className="bcItem">Leads Data</span>
                                <span className="bcSeparator">›</span>
                                <span className="bcItem active">Lead Personal Information</span>
                            </nav>
                        </div>
                        <button className="backBtn" onClick={goBack}>Back</button>
                    </div>

                    {dataEntrySingleLeadLoading ? <Loader /> :
                        <div className="topRow">
                            <div className="card leadCard">
                                <h3 className="teleHeading">Personal Information</h3>
                                <div className="infoGrid" style={{ width: '60%' }}>
                                    <div className="field">
                                        <div className="teleSubHeading">Lead Name</div>
                                        <div className="teleText">{dataEntrySingleLead?.leadName || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Email Address</div>
                                        <div className="teleText">{dataEntrySingleLead?.email || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Phone Number</div>
                                        <div className="teleText">{dataEntrySingleLead?.phone || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Alternate Number</div>
                                        <div className="teleText">{dataEntrySingleLead?.alternativePhone || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Location</div>
                                        <div className="teleText">{dataEntrySingleLead?.location || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Loan Type</div>
                                        <div className="teleText">{dataEntrySingleLead?.loanType || "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Loan Amount</div>
                                        <div className="teleText">{dataEntrySingleLead?.loanAmount ? formatCurrency(dataEntrySingleLead.loanAmount) : "N/A"}</div>
                                    </div>
                                    <div className="field">
                                        <div className="teleSubHeading">Lead Created Date</div>
                                        <div className="teleText">{dataEntrySingleLead?.LeadCreatedDate ? formatDate(dataEntrySingleLead.LeadCreatedDate) : "N/A"}</div>
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

export default ViewLeadData;
