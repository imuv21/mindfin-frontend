import React, { useState, useEffect } from 'react';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllCreditManagers } from '../redux/telecallerSlice';
import { getAllCreditManagerLeads, getAllTelecallers } from "../redux/creditManagerSlice";
import Loader from "../components/ui/Loader";
import Toastify from '../helpers/Toastify';
import api from "../helpers/Api";
import * as XLSX from 'xlsx';
import {
    IosShare as IosShareIcon, Search as SearchIcon, BorderColor as BorderColorIcon
} from '@mui/icons-material';
import '../Telecaller/telecaller.css';



const Topup = () => {

    const tableColumns = [
        "Lead Name", "Lead Number", "Lead Email Id", "Lead Location", "Top-up Eligibility", "Bank Name", "Bank Employee", "Bank Employee Email Id", "Pan Number", "Location", "Type of Loan", "Net Disbursement Amount", "Rate of Interest", "Pf", "Tenure", "Insurance Amount", "Remarks", "Options"
    ];

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { creditLeads, total, totalPages, hasNext, hasPrevious, creditLoading, creditError, telecallers, telecallersLoading } = useSelector(state => state.credit);

    const [activeTab, setActiveTab] = useState("Tele caller 1");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [activeTelecaller, setActiveTelecaller] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [isExporting, setIsExporting] = useState(false);

    const params = { page, limit, search: searchTerm, date: dateFilter, status: statusFilter, teleCaller: activeTelecaller?._id };


    useEffect(() => {
        dispatch(getAllCreditManagers());
        dispatch(getAllTelecallers());
    }, [dispatch]);

    useEffect(() => {
        if (telecallers.length > 0 && !activeTelecaller) {
            setActiveTelecaller(telecallers[0]);
        }
    }, [telecallers, activeTelecaller]);

    useEffect(() => {
        dispatch(getAllCreditManagerLeads(params));
    }, [dispatch, activeTab, page, limit, searchTerm, dateFilter, statusFilter, activeTelecaller]);

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

    const goToViewLeadPage = (id, bankId) => {
        navigate(`/top-up-detail/${id}`);
    }

    const exportLeads = async () => {
        if (isExporting) return;
        setIsExporting(true);
        try {
            const dataForExcel = creditLeads.map(lead => {
                const bankDetail = lead?.bankDetails?.[0];  // Get first bank detail object

                return {
                    "Lead Name": lead.leadName || "N/A",
                    "Phone": lead.phone || "N/A",
                    "Email": lead.email || "N/A",
                    "Location": lead.location || "N/A",
                    "Bank Name": bankDetail?.bankName || "N/A",
                    "Banker Name": bankDetail?.bankerName || "N/A",
                    "Banker Email": bankDetail?.emailId || "N/A",
                    "PAN Card": lead.panCard || "N/A",
                    "Loan Type": lead?.loanType?.loanName || "N/A",  // Use loanName instead of ID
                    "Loan Amount Requested": bankDetail?.loanAmountRequested || "N/A",
                    "Rate of Interest": bankDetail?.rateOfInterest || "N/A",
                    "PF": bankDetail?.pf || "N/A",
                    "Tenure": bankDetail?.tenure || "N/A",
                    "Insurance Amount": bankDetail?.insuranceAmount || "N/A",
                    "Remarks": bankDetail?.remarks || "N/A",
                    // Add other fields from the table as needed
                    "Eligibility Status": "Eligible"  // Hardcoded as in table
                };
            });

            const ws = XLSX.utils.json_to_sheet(dataForExcel);

            // Set column widths (add/modify as needed)
            const colWidths = [
                { wch: 25 },  // Lead Name
                { wch: 15 },  // Phone
                { wch: 25 },  // Email
                { wch: 15 },  // Location
                { wch: 20 },  // Bank Name
                { wch: 20 },  // Banker Name
                { wch: 25 },  // Banker Email
                { wch: 15 },  // PAN Card
                { wch: 20 },  // Loan Type
                { wch: 20 },  // Loan Amount Requested
                { wch: 18 },  // Rate of Interest
                { wch: 10 },  // PF
                { wch: 10 },  // Tenure
                { wch: 18 },  // Insurance Amount
                { wch: 40 },  // Remarks
                { wch: 18 }   // Eligibility Status
            ];

            ws['!cols'] = colWidths;
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Credit Leads");
            XLSX.writeFile(wb, "credit_leads.xlsx");

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
    const pageNumbers = getPageNumbers(page, totalPages);


    return (
        <MainLayout>
            <ProfileHeader name="Topup" breadcrumbs={[""]} />

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
                                    creditLeads?.map((lead) => {
                                        const bankDetail = lead?.bankDetails?.[0];
                                        return (
                                            <tr key={lead._id}>
                                                <td>
                                                    <label className="teleCustomCheckbox">
                                                        <input type="checkbox" />
                                                        <span className="teleCheckmark"></span>
                                                    </label>
                                                </td>

                                                <td className="teleText">{lead.leadName || "N/A"}</td>
                                                <td className="teleText">{lead.phone || "N/A"}</td>
                                                <td className="teleText">{lead.email || "N/A"}</td>
                                                <td className="teleText">{lead.location || "N/A"}</td>

                                                <td className="teleText">Eligible</td>

                                                <td className="teleText">{bankDetail?.bankName || "N/A"}</td>
                                                <td className="teleText">{bankDetail?.bankerName || "N/A"}</td>
                                                <td className="teleText">{bankDetail?.emailId || "N/A"}</td>
                                                <td className="teleText">{lead.panCard || "N/A"}</td>
                                                <td className="teleText">{lead.location || "N/A"}</td>

                                                <td className="teleText">{lead?.loanType?.loanName || "N/A"}</td>
                                                <td className="teleText">{bankDetail?.loanAmountRequested ? `₹${bankDetail.loanAmountRequested}` : "N/A"}</td>
                                                <td className="teleText">{bankDetail?.rateOfInterest ? `${bankDetail.rateOfInterest}%` : "N/A"}</td>
                                                <td className="teleText">{bankDetail?.pf ? `${bankDetail.pf}%` : "N/A"}</td>
                                                <td className="teleText">{bankDetail?.tenure || "N/A"}</td>
                                                <td className="teleText">{bankDetail?.insuranceAmount ? `₹${bankDetail.insuranceAmount}` : "N/A"}</td>
                                                <td className="teleText">{bankDetail?.remarks || "N/A"}</td>

                                                <td>
                                                    <div className='actionIcons'>
                                                        <BorderColorIcon onClick={() => goToViewLeadPage(lead._id, bankDetail?._id)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
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

                        {!creditLoading && !creditError && total > limit && (
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

export default Topup;