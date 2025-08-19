import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import "../Telecaller/telecaller.css";

import { Close as CloseIcon } from '@mui/icons-material';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";

const DocumentVerification = () => {

    const [showPopup, setShowPopup] = useState(false);

    const documents = [
        { id: 1, name: "Balance Sheet (2-3 years)", verified: true },
        { id: 2, name: "GST Returns (GSTR 3B, 1)", verified: true },
        { id: 3, name: "ITR (2-3 years)", verified: true },
        { id: 4, name: "Bank Statements (6-12 months)", verified: true },
        { id: 5, name: "Balance Sheet (2-3 years)", verified: true },
        { id: 6, name: "Collateral Documents", verified: true },
    ];

    const history = [
        {
            date: "2025-03-10",
            balanceSheet: "verified",
            gstReturns: "verified",
            itr: "verified",
            status: "Eligible",
        },
        {
            date: "2025-03-05",
            balanceSheet: "not_verified",
            gstReturns: "verified",
            itr: "verified",
            status: "RNR",
        },
        {
            date: "2025-02-08",
            balanceSheet: "not_verified",
            gstReturns: "verified",
            itr: "rejected",
            status: "Rejected",
        },
    ];

    const renderDocStatus = (doc) => {
        if (doc.verified) {
            return (
                <span className="status-cell">
                    <CheckCircleIcon className="status-icon status-verified" />
                    <span className="teleText">Verified</span>
                </span>
            );
        }
        if (doc.pending) {
            return (
                <span className="status-cell">
                    <HourglassEmptyIcon className="status-icon status-pending" />
                    <span className="teleText">Not Verified</span>
                </span>
            );
        }
        return (
            <span className="status-cell">
                <CancelIcon className="status-icon status-rejected" />
                <span className="teleText">Rejected</span>
            </span>
        );
    };

    const renderHistoryStatus = (s) => {
        if (s === "verified") {
            return (
                <span className="status-cell">
                    <CheckCircleIcon className="status-icon status-verified" />
                    <span className="teleText">Verified</span>
                </span>
            );
        }
        if (s === "not_verified") {
            return (
                <span className="status-cell">
                    <HourglassEmptyIcon className="status-icon status-pending" />
                    <span className="teleText">Not Verified</span>
                </span>
            );
        }
        if (s === "rejected") {
            return (
                <span className="status-cell">
                    <CancelIcon className="status-icon status-rejected" />
                    <span className="teleText">Rejected</span>
                </span>
            );
        }
        return null;
    };

    const statusLabelClass = (label) =>
        label === "Eligible" ? "status-label eligible" : label === "RNR" ? "status-label rnr" : "status-label rejected";

    const handleCheck = () => {
        const allVerified = documents.every(doc => doc.verified);
        if (allVerified) {
            setShowPopup(true);
        } else {
            alert("Not all documents are verified!");
        }
    };

    const closePpup = () => {
        setShowPopup(false);
    }

    return (
        <MainLayout>
            <ProfileHeader name="Document Verification" breadcrumbs={[""]} />

            <div className='docVerificationCont'>
                <div className="border doc-verify-card">
                    <div className="doc-header">
                        <div className="teleSupHeading">UDAY REDDY A</div>
                        <select className="styledSelect">
                            <option>Status</option>
                            <option>Eligible</option>
                            <option>RNR</option>
                            <option>Rejected</option>
                        </select>
                    </div>

                    <table className="doc-table">
                        <thead>
                            <tr>
                                <th>Document Name</th>
                                <th>Upload Document</th>
                                <th>Verification Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.id}>
                                    <td>
                                        <div className="doc-row-name">
                                            <input className="doc-checkbox" type="checkbox" defaultChecked={!!doc.verified} />
                                            <span className="teleText">{doc.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <a className="upload-link" href="#upload">
                                            Upload
                                        </a>
                                    </td>
                                    <td>{renderDocStatus(doc)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button className="teleBtn" onClick={handleCheck}>Check</button>
                </div>

                <div className="border history-card">
                    <div className="teleHeading">Document Verification History</div>

                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Balance Sheet</th>
                                <th>GST Returns</th>
                                <th>ITR</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((row, i) => (
                                <tr key={i}>
                                    <td className="teleText">{row.date}</td>
                                    <td>{renderHistoryStatus(row.balanceSheet)}</td>
                                    <td>{renderHistoryStatus(row.gstReturns)}</td>
                                    <td>{renderHistoryStatus(row.itr)}</td>
                                    <td>
                                        <span className={statusLabelClass(row.status)}>{row.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-card border">
                        <CloseIcon onClick={closePpup} />
                        <div className="emoji">🎉</div>
                        <h2 className="teleSupHeading">Eligible for loan</h2>
                        <p className="teleText">Company profile eligible for loan</p>
                        <button className="teleBtn" style={{ width: '100%' }}>Create loan</button>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default DocumentVerification;
