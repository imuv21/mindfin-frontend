import React, { useState, useEffect } from 'react';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllDataEntryLeads, deleteDataEntryLead } from '../redux/dataEntrySlice';
import { formatCurrency, formatDate } from '../components/utils';
import Loader from "../components/ui/Loader";
import Toastify from '../helpers/Toastify';
import {
  IosShare as IosShareIcon, Search as SearchIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, BorderColor as BorderColorIcon, FileUpload as FileUploadIcon,
  Close as CloseIcon, FileDownload as FileDownloadIcon, PersonAdd as PersonAddIcon, Description as DocIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import CircularProgress from '@mui/material/CircularProgress';
import '../Telecaller/telecaller.css';



const LeadDataList = () => {

  const columns = ["Lead Name", "Phone Number", "Alternate Number", "Gmail", "Location", "Loan Amount", "Loan Type", "Lead Created Date", "Option"];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dataEntryLeads, dataEntryLeadPagination, dataEntryLeadLoading } = useSelector(state => state.dataEntry);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const params = { page, limit, search: searchTerm, date: dateFilter, status: statusFilter };

  const clearAllFilters = () => {
    setDateFilter("");
    setStatusFilter("");
  };

  const goToViewLeadPage = (id) => {
    navigate(`/data-entry-view-lead-data/${id}`);
  }

  const goToEditLeadPage = (id) => {
    navigate(`/data-entry-edit-lead-form/${id}`);
  }

  const goToAddLeadPage = (id) => {
    navigate(`/data-entry-add-leads`);
  }

  const handleDeleteLead = async (id) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      const result = await dispatch(deleteDataEntryLead(id)).unwrap();
      if (result.success) {
        Toastify.success("Lead deleted successfully.");
        dispatch(getAllDataEntryLeads(params));
      }
    } catch (err) {
      Toastify.error(err?.message || "Something went wrong!");
    } finally {
      setDeletingId(null);
    }
  };

  const exportLeads = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {

      const dataForExcel = dataEntryLeads && dataEntryLeads.length > 0 && dataEntryLeads.map(lead => ({
        "Lead ID": lead._id,
        "Lead Name": lead.leadName,
        "Email": lead.email,
        "Phone": lead.phone,
        "Alternative Phone": lead.alternativePhone,
        "Location": lead.location,
        "Loan Type": lead.loanType?.loanName,
        "Loan Amount": lead.loanAmount,
        "Lead Created Date": formatDate(lead.LeadCreatedDate)
      }));

      const ws = XLSX.utils.json_to_sheet(dataForExcel);
      const colWidths = [
        { wch: 25 },  // Lead ID
        { wch: 20 },  // Lead Name
        { wch: 25 },  // Email
        { wch: 15 },  // Phone
        { wch: 20 },  // Alt Phone
        { wch: 15 },  // Location
        { wch: 15 },  // Loan Type ID
        { wch: 15 },  // Loan Amount
        { wch: 25 }, // Lead Created Date
      ];
      ws['!cols'] = colWidths;
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data Entry Leads");
      XLSX.writeFile(wb, "data_entry_leads.xlsx");

    } catch (error) {
      console.error("Export failed:", error);
      Toastify.error(error?.message || "Something went wrong!");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    dispatch(getAllDataEntryLeads(params));
  }, [dispatch, page, limit, searchTerm, dateFilter, statusFilter]);


  return (
    <MainLayout>
      <ProfileHeader name="Leads Data" breadcrumbs={[""]} />

      <div className='teleCont'>
        <div className="leadsTableCont border">

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
              <button className="teleBtn" onClick={goToAddLeadPage}>Add Leads</button>
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
                  {columns && columns.length > 0 && columns.map((h) => (
                    <th key={h} className="teleSubHeading">{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {dataEntryLeadLoading ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="loadingCell">
                      <Loader />
                    </td>
                  </tr>
                ) : dataEntryLeads?.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="noDataCell">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  dataEntryLeads?.map((lead) => (
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
                      <td className="teleText">{formatDate(lead.LeadCreatedDate) || "N/A"}</td>
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

            <div className="telePagination">
              <button className="telePageBtn" disabled={dataEntryLeadPagination?.isFirst || dataEntryLeadLoading} onClick={() => setPage(prev => Math.max(prev - 1, 1))}>
                ‹
              </button>

              {dataEntryLeadPagination && dataEntryLeadPagination.totalPages > 0 && (
                <>
                  {Array.from({ length: Math.min(5, dataEntryLeadPagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (dataEntryLeadPagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= dataEntryLeadPagination.totalPages - 2) {
                      pageNum = dataEntryLeadPagination.totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        className={`telePageBtn ${page === pageNum ? 'telePageActive' : ''}`}
                        onClick={() => setPage(pageNum)}
                        disabled={dataEntryLeadLoading}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {dataEntryLeadPagination.totalPages > 5 && page < dataEntryLeadPagination.totalPages - 2 && (
                    <span className="telePageDots">...</span>
                  )}

                  {dataEntryLeadPagination.totalPages > 5 && page < dataEntryLeadPagination.totalPages - 2 && (
                    <button
                      className={`telePageBtn ${page === dataEntryLeadPagination.totalPages ? 'telePageActive' : ''}`}
                      onClick={() => setPage(dataEntryLeadPagination.totalPages)}
                      disabled={dataEntryLeadLoading}
                    >
                      {dataEntryLeadPagination.totalPages}
                    </button>
                  )}
                </>
              )}

              <button className="telePageBtn" disabled={dataEntryLeadPagination?.isLast || dataEntryLeadLoading} onClick={() => setPage(prev => Math.min(prev + 1, dataEntryLeadPagination?.totalPages || 1))}>
                ›
              </button>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default LeadDataList;