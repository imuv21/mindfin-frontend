import React, { useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Divider,
    CircularProgress,
} from '@mui/material';
import MainLayout from './../../components/layout/MainLayout';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeadById, clearSelectedLead } from '../../redux/creditSlice';
import { formatDate } from './../../helpers/conversion';
import Toastify from './../../helpers/Toastify';
import { useNavigate } from 'react-router-dom';


const CibilLeadsView = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const { selectedLead, loadingLead, error } = useSelector((state) => state.creditManager);

    useEffect(() => {
        if (id) {
            dispatch(fetchLeadById(id));
        }
        return () => dispatch(clearSelectedLead());
    }, [dispatch, id]);

    useEffect(() => {
        if (error) Toastify.error(error);
    }, [error]);

    const renderText = (value) => (value !== undefined && value !== null ? value : 'N/A');
    const renderDate = (date) => (date ? formatDate(date) : 'N/A');
    
    // Updated renderLoanType function to handle both string and object cases
    const renderLoanType = (loanType) => {
        if (Array.isArray(loanType)) return loanType.map((t) => t?.loanName || t || 'N/A').join(', ');
        if (typeof loanType === 'object' && loanType !== null) return loanType?.loanName || 'N/A';
        if (typeof loanType === 'string') return loanType; // Handle string case
        return 'N/A';
    };

    return (
        <MainLayout>
            {/* Page Header and Breadcrumb */}
            <Box className="p-4 sm:p-6">
                <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-blue-600 mb-1">Lead detailed history</h1>
                        <div className="flex flex-wrap items-center text-sm text-gray-500">
                            <span className="text-sm font-medium text-[#667085]">CIBIL / CREDIT SCORE</span>
                            <span className="mx-2">→</span>
                            <span className="text-sm font-medium text-black">Lead detailed history</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            className="px-4 py-2 border border-gray-200 text-gray-600 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => navigate('/cibil-credit-score')}>
                            Back
                        </button>
                    </div>
                </Box>

                {/* Content */}
                {loadingLead ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '60vh',
                            width: '100%',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: '#fff',
                            width: '100%',
                            maxWidth: 740,
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            mb={2}
                            sx={{ fontSize: '14px', color: '#0F172A' }}
                        >
                            Personal Information
                        </Typography>

                        <Grid container spacing={2}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" sx={{ fontSize: '14px', color: '#A2A1A8' }}>
                                        Lead Name
                                    </Typography>
                                    <Typography sx={{ fontSize: '16px', color: '#16151C' }}>
                                        {selectedLead?.leadName || 'N/A'}
                                    </Typography>
                                    <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" sx={{ fontSize: '14px', color: '#A2A1A8' }}>
                                        Email Address
                                    </Typography>
                                    <Typography sx={{ fontSize: '16px', color: '#16151C' }}>
                                        {selectedLead?.email || 'N/A'}
                                    </Typography>
                                    <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" sx={{ fontSize: '14px', color: '#A2A1A8' }}>
                                        Phone Number
                                    </Typography>
                                    <Typography sx={{ fontSize: '16px', color: '#16151C' }}>
                                        {selectedLead?.phone || 'N/A'}
                                    </Typography>
                                    <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" sx={{ fontSize: '14px', color: '#A2A1A8' }}>
                                        Alternate Number
                                    </Typography>
                                    <Typography sx={{ fontSize: '16px', color: '#16151C' }}>
                                        {selectedLead?.alternativePhone || 'N/A'}
                                    </Typography>
                                    <Divider sx={{ mt: 1, borderColor: '#A2A1A81A' }} />
                                </Grid>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" sx={{ fontSize: '14px', color: '#A2A1A8' }}>
                                        Location
                                    </Typography>
                                    <Typography sx={{ fontSize: '16px', color: '#16151C' }}>
                                        {selectedLead?.location || 'N/A'}
                                    </Typography>
                                    <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" sx={{ fontSize: '14px', color: '#A2A1A8' }}>
                                        Loan Type
                                    </Typography>
                                    <Typography sx={{ fontSize: '16px', color: '#16151C' }}>
                                        {renderLoanType(selectedLead?.loanType)}
                                    </Typography>
                                    <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" sx={{ fontSize: '14px', color: '#A2A1A8' }}>
                                        Loan Amount
                                    </Typography>
                                    <Typography sx={{ fontSize: '16px', color: '#16151C' }}>
                                        {selectedLead?.loanAmount || 'N/A'}
                                    </Typography>
                                    <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" sx={{ fontSize: '14px', color: '#A2A1A8' }}>
                                        Lead Created Date
                                    </Typography>
                                    <Typography sx={{ fontSize: '16px', color: '#16151C' }}>
                                        {formatDate(selectedLead?.LeadCreatedDate) || 'N/A'}
                                    </Typography>
                                    <Divider sx={{ mt: 1, borderColor: '#A2A1A81A' }} />
                                </Grid>
                            </Box>
                        </Grid>
                    </Paper>
                )}
            </Box>
        </MainLayout>
    );
};

export default CibilLeadsView;