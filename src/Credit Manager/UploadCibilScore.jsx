import React, { useState, useEffect } from 'react';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import { Box, Typography, Button, Checkbox, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../helpers/Api';
import Toastify from '../helpers/Toastify';



const UploadCibilScore = () => {

    const { leadId } = useParams();
    const navigate = useNavigate();

    const [leadData, setLeadData] = useState(null);
    const [cibilData, setCibilData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [cibilHistory, setCibilHistory] = useState([]);
    const [checking, setChecking] = useState(false);
    const [cibilScore, setCibilScore] = useState(null);

    //  Load existing CIBIL data and history when component mounts
    useEffect(() => {
        const loadExistingData = () => {
            // Load existing score
            const existingScores = JSON.parse(localStorage.getItem('localCibilScores') || '{}');
            if (existingScores[leadId]) {
                setCibilData({ score: existingScores[leadId] });
                setCibilScore(existingScores[leadId]);
            }

            // Load existing history
            const existingHistory = JSON.parse(localStorage.getItem('cibilHistory') || '{}');
            if (existingHistory[leadId]) {
                setCibilHistory(existingHistory[leadId]);
            }
        };

        loadExistingData();
        console.log("UploadCibilScore mounted");
        console.log("leadId from params:", leadId);
    }, [leadId]);

    useEffect(() => {
        const fetchLeadData = async () => {
            try {
                setLoading(true);
                const res = await api.getALead(leadId);
                console.log("Lead data fetched:", res.data);
                setLeadData(res.data.data);
            } catch (error) {
                console.error("Failed to fetch lead data:", error);
                Toastify.error('Failed to load lead data');
            } finally {
                setLoading(false);
            }
        };

        fetchLeadData();
    }, [leadId]);

    //  Modified to work for both initial check and recheck
    const handleCheckCibilScore = async (id) => {
        try {
            setChecking(true);
            console.log("Checking CIBIL for lead:", id);

            const res = await api.fetchCibilScore(id);
            console.log("CIBIL API Response:", res.data);

            // Store score locally
            setCibilData({ score: res.data.cibilScore });
            setCibilScore(res.data.cibilScore);

            //  Update localStorage immediately
            const existingScores = JSON.parse(localStorage.getItem('localCibilScores') || '{}');
            existingScores[leadId] = res.data.cibilScore;
            localStorage.setItem('localCibilScores', JSON.stringify(existingScores));

            //  Add new record to history and persist it
            const newRecord = {
                id: Date.now(), // unique identifier
                date: new Date().toLocaleDateString('en-GB'),
                score: res.data.cibilScore,
                report: 'View Report',
                status: 'Active'
            };

            const updatedHistory = [newRecord, ...cibilHistory]; // latest first
            setCibilHistory(updatedHistory);

            //  Save history to localStorage
            const existingHistory = JSON.parse(localStorage.getItem('cibilHistory') || '{}');
            existingHistory[leadId] = updatedHistory;
            localStorage.setItem('cibilHistory', JSON.stringify(existingHistory));

        } catch (error) {
            console.error("Error fetching CIBIL score:", error);
            Toastify.error('Failed to fetch CIBIL score');
        } finally {
            setChecking(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setSubmitLoading(true);

            if (cibilData?.score) {
                // Score is already saved in localStorage from handleCheckCibilScore
                Toastify.success('CIBIL Score updated locally');
                navigate('/cibil-credit-score');
            } else {
                Toastify.error('No CIBIL score to submit');
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            Toastify.error('Failed to update CIBIL score');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleStatusUpdate = async (status) => {
        try {
            console.log('Status update:', status);
            Toastify.info(`Status updated to ${status}`);
        } catch (error) {
            Toastify.error('Failed to update status');
        }
    };

    if (loading) {
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
                        name="CIBIL / CREDIT SCORE"
                        sx={{
                            fontSize: "24px",
                            fontWeight: "bold",
                        }}
                    />
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </MainLayout>
        );
    }

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
                    name="CIBIL / CREDIT SCORE"
                    sx={{
                        fontSize: "24px",
                        fontWeight: "bold",
                    }}
                />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: 2,
                    padding: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                    minHeight: { xs: 'auto', md: 250 },
                }}
            >
                {/* Left Section */}
                <Box
                    sx={{
                        flex: { xs: 'none', md: 1 },
                        width: { xs: '100%', md: 'auto' },
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        padding: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 10px rgb(0 0 0 / 0.05)',
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 500,
                            fontSize: { xs: '16px', md: '18px' },
                            width: '100%',
                            borderBottom: '2px solid #E2E8F0',
                            paddingBottom: '6px',
                            marginTop: 0,
                            textAlign: 'center',
                        }}
                    >
                        {leadData?.leadName || 'UDAY REDDY A'}
                    </Typography>

                    {/* Display CIBIL Score if available */}
                    {cibilData?.score && (
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 500,
                                    color: '#64748B',
                                }}
                            >
                                Your Check Cibil Score
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '32px',
                                    color: '#4A4A4A',
                                }}
                            >
                                {cibilData.score}
                            </Typography>

                            {/*  Recheck button - always show when score exists */}
                            <Button
                                variant="outlined"
                                onClick={() => handleCheckCibilScore(leadId)}
                                disabled={checking}
                                sx={{
                                    mt: 2,
                                    textTransform: 'none',
                                    borderColor: '#2563EB',
                                    color: '#2563EB',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                }}
                            >
                                {checking ? 'Rechecking...' : 'Recheck CIBIL Score'}
                            </Button>
                        </Box>
                    )}

                    {!cibilData?.score && (
                        <>
                            <Typography
                                variant="contained"
                                onClick={() => handleCheckCibilScore(leadId)}
                                disabled={checking}
                                sx={{
                                    mt: 4,
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    color: '#898989',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                {checking ? 'Checking...' : 'Check CIBIL Score'}
                            </Typography>

                            <Button
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    textTransform: 'none',
                                    bgcolor: '#2563EB',
                                    '&:hover': { bgcolor: '#1d4ed8' },
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    fontStyle: 'normal',
                                    borderRadius: '8px',
                                }}
                                startIcon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-upload"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                }
                            >
                                Upload Document
                            </Button>
                        </>
                    )}

                    {/* Submit and Status buttons - shown only when CIBIL score is available */}
                    {cibilData?.score && (
                        <Box sx={{ mt: 3, display: 'flex', gap: 2, width: '100%' }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={submitLoading}
                                sx={{
                                    flex: 1,
                                    textTransform: 'none',
                                    bgcolor: '#2563EB',
                                    '&:hover': { bgcolor: '#2563EB' },
                                    fontSize: '14px',
                                    fontWeight: 600,
                                }}
                            >
                                {submitLoading ? 'Submitting...' : 'Submit'}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleStatusUpdate('Reviewed')}
                                sx={{
                                    flex: 1,
                                    textTransform: 'none',
                                    borderColor: '#2563EB',
                                    color: '#2563EB',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                }}
                            >
                                Status
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Right Section - CIBIL Score History */}
                <Box
                    sx={{
                        flex: 2,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        padding: 3,
                        boxShadow: '0 0 10px rgb(0 0 0 / 0.05)',
                        overflowX: 'auto',
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, fontSize: '16px', mb: 2 }}
                    >
                        CIBIL Score History
                    </Typography>

                    <Box
                        component="table"
                        sx={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: 14,
                            color: '#475569',
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left' }}>
                                <th style={{ padding: '8px 4px', width: 30, fontSize: '12px', fontWeight: 500, color: '#64748B' }}>
                                    <Checkbox />
                                </th>
                                <th style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>Date</th>
                                <th style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>Score</th>
                                <th style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>Report</th>
                                <th style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cibilHistory.length > 0 ? (
                                cibilHistory.map((record, index) => (
                                    <tr key={record.id || index}>
                                        <td style={{ padding: '8px 6px' }}>
                                            <Checkbox />
                                        </td>
                                        <td style={{ padding: '8px 6px' }}>{record.date || '-'}</td>
                                        <td style={{ padding: '8px 6px' }}>{record.score || '-'}</td>
                                        <td style={{ padding: '8px 6px' }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#2563EB',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                {record.report || 'View Report'}
                                            </Typography>
                                        </td>
                                        <td style={{ padding: '8px 6px' }}>
                                            <Box
                                                component="span"
                                                sx={{
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    backgroundColor: record.status === 'Active' ? '#DCFCE7' : '#FEF3C7',
                                                    color: record.status === 'Active' ? '#16A34A' : '#D97706',
                                                }}
                                            >
                                                {record.status || 'Pending'}
                                            </Box>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF' }}>
                                        No CIBIL score history available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Box>
                </Box>
            </Box>
        </MainLayout>
    );
};

export default UploadCibilScore;