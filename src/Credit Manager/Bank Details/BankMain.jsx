import React, { useState } from 'react';
import { Box } from '@mui/material';
import MainLayout from '../../components/layout/MainLayout';
import ProfileHeader from '../../components/layout/ProfileHeader';
// import LoanStatus from '../Components/LoanStatus';
import Filterbar from '../components/Filterbar';
// import BankApproved from '../Bank Details/BankApproved';
// import BankFollowUp from '../Bank Details/BankFollowUp';
// import BankRejected from '../Bank Details/BankRejected';
import CustomPagination from '../components/Pagination';

const BankMain = () => {
  const [activeTab, setActiveTab] = useState(0); 

  return (
    <MainLayout>
      <Box
        sx={{
          display: {
            xs: "none",
            sm: "none",
            md: "block",
          },
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

      {/* <LoanStatus activeTab={activeTab} setActiveTab={setActiveTab} /> */}
      <Filterbar />

      {/* <div>
        {activeTab === 0 && <BankApproved />}
        {activeTab === 1 && <BankFollowUp />}
        {activeTab === 2 && <BankRejected />}
      </div> */}

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
