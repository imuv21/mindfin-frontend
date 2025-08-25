import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import MainLayout from "../../components/layout/MainLayout";
import ProfileHeader from "../../components/layout/ProfileHeader";
import Filterbar from "../components/Filterbar";
import BankApproved from "../Bank Details/BankApproved";
import BankFollowUp from "../Bank Details/BankFollowUp";
import BankRejected from "../Bank Details/BankRejected";
import CustomPagination from "../components/Pagination";

const BankMain = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <MainLayout>
      {/* Header (hidden on small screens) */}
      <Box
        sx={{
          display: { xs: "none", sm: "none", md: "block" },
        }}
      >
        <ProfileHeader
          name="Loan Response Management"
          sx={{
            fontSize: "24px",
            fontWeight: "bold",
          }}
        />
      </Box>

      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Approved" />
          <Tab label="Follow-ups" />
          <Tab label="Rejected" />
          <Tab label="Cancelled" />
        </Tabs>
      </Box>

      {/* Filter bar (below tabs like in Figma) */}
      <Filterbar />

      {/* Tab Content */}
      <div>
        {activeTab === 0 && <BankApproved />}
        {activeTab === 1 && <BankFollowUp />}
        {activeTab === 2 && <BankRejected />}
        {activeTab === 3 && <div>Cancelled Data Coming Soon...</div>}
      </div>

      {/* Pagination */}
      <CustomPagination
        // page={leadsData?.pagination?.currentPage}
        // count={leadsData?.pagination?.totalPages}
        // rowsPerPage={leadsData?.pagination?.leadsPerPage}
        // onChange={handlePageChange}
        // onRowsPerPageChange={handleLimitChange}
      />
    </MainLayout>
  );
};

export default BankMain;
