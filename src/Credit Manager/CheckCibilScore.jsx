import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProfileHeader from './Layout/ProfileHeader';
import { Box, Typography, Button, Checkbox } from '@mui/material';

const CheckCibilScore = () => {
    return (
        <MainLayout>
            <Box
                sx={{
                    display: { xs: 'none', sm: 'none', md: 'block' },
                    padding: 3,
                }}
            >
                <ProfileHeader
                    name="CIBIL / CREDIT SCORE"
                    sx={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        mb: 3,
                    }}
                />

                <Box
                    sx={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: 2,
                        padding: 3,
                        display: 'flex',
                        gap: 3,
                        minHeight: 250,
                    }}
                >

                    {/* Left Section */}
                    <Box
                        sx={{
                            flex: 1,
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
                                fontSize: '18px',
                                width: '100%',
                                borderBottom: '2px solid #E2E8F0',
                                paddingBottom: '6px',
                                marginTop: 0,
                                textAlign: 'center',
                            }}
                        >
                            UDAY REDDY A
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 4,
                                fontWeight: 600,
                                fontSize: '12px',
                                color: '#898989',
                            }}
                        >
                            Your Check Cibil Score  as of 1st March '25
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1,
                                fontWeight: 600,
                                fontSize: '32px',
                                color: '#0F172A', // Optional: makes it visually stand out
                            }}
                        >
                            681
                        </Typography>


                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            {/* Submit Button */}
                            <Button
                                variant="contained"
                                sx={{
                                    textTransform: 'none',
                                    bgcolor: '#2563EB',
                                    color: '#fff',
                                    '&:hover': { bgcolor: '#1d4ed8' },
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    borderRadius: '8px',
                                }}
                            >
                                Submit
                            </Button>

                            {/* Status Button */}
                            <Button
                                variant="outlined"
                                sx={{
                                    textTransform: 'none',
                                    backgroundColor: '#ffffff',
                                    borderColor: '#E2E8F0',
                                    color: '#8C94A3',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                                endIcon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="none"
                                        stroke="#8C94A3"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-chevron-down"
                                        viewBox="0 0 24 24"
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                }
                            >
                                Status
                            </Button>
                        </Box>

                    </Box>


                    {/* Right Section */}
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
                            sx={{ fontWeight: 700, fontSize: '16px', fontStyle: 'bold', mb: 2 }}>
                            Cibil Score History
                        </Typography>


                        <Box
                            component="table"
                            sx={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                fontSize: 14,
                                color: '#475569',
                                tableLayout: 'fixed',
                            }}
                        >
                            <thead>
                                <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left' }}>
                                    <th style={{ padding: '8px 2px', width: 30, fontSize: '12px', fontWeight: 500, color: '#64748B' }}>
                                        {/* <Checkbox /> */}
                                    </th>
                                    <th style={{ padding: '8px 4px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>Date</th>
                                    <th style={{ padding: '8px 4px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>Score</th>
                                    <th style={{ padding: '8px 4px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>Report</th>
                                    <th style={{ padding: '8px 4px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500 }}>
                                        {/* <Checkbox /> */}
                                    </td>
                                    <td style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>2025-03-10</td>
                                    <td style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>978</td>
                                    <td style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            fill="none"
                                            stroke="#2563EB"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </td>
                                    <td style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#2563EB' }}>Eligible</td>
                                </tr>

                                <tr>
                                    <td style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500 }}>
                                        {/* <Checkbox /> */}
                                    </td>
                                    <td style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>2025-03-05</td>
                                    <td style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>678</td>
                                    <td style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            fill="none"
                                            stroke="#2563EB"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </td>
                                    <td style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#24D164' }}>RNR</td>
                                </tr>

                                <tr>
                                    <td style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500 }}>
                                        {/* <Checkbox /> */}
                                    </td>
                                    <td style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>2025-02-08</td>
                                    <td style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>278</td>
                                    <td style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#64748B' }}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            fill="none"
                                            stroke="#2563EB"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </td>
                                    <td style={{ padding: '8px 6px', fontSize: '12px', fontWeight: 500, color: '#ED4F9D' }}>Rejected</td>
                                </tr>
                            </tbody>

                        </Box>
                    </Box>
                </Box>
            </Box>
        </MainLayout>
    );
};

export default CheckCibilScore;