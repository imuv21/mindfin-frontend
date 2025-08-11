import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Divider, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import RoleBreadcrumbs from './layout/RoleBreadcrumbs';
import api from "../helpers/Api";

const ViewLeadData = () => {
    const { id } = useParams();
    console.log("Lead ID from URL:", id);
    const [loading, setLoading] = useState(true);
    const [lead, setLead] = useState(null);

    const fetchLeadData = async () => {
        try {
            setLoading(true);
            const { data, status } = await api.getALead(id);
            if (status === 200) {
                setLead(data.data); 
            }
        } catch (error) {
            console.error("Failed to fetch lead data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeadData();
    }, [id]);

    if (loading) {
        return (
            <MainLayout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "80vh" }}>
                    <CircularProgress />
                </Box>
            </MainLayout>
        );
    }

    if (!lead) {
        return (
            <MainLayout>
                <Typography variant="h6" textAlign="center" mt={5}>Lead not found</Typography>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <ProfileHeader name={lead.leadName || "Lead Details"} />
            <RoleBreadcrumbs
                name='Lead Personal Information'
                breadcrumbs={['Leads Data', 'Lead Personal Information']}
            />

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    width: '100%',
                    maxWidth: 740,
                    marginLeft: '20px',
                    marginTop: '20px'
                }}
            >
                <Typography variant="subtitle1" fontWeight="bold" mb={2} sx={{ fontSize: "14px", color: "#0F172A" }}>
                    Personal Information
                </Typography>

                <Grid container spacing={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                        <Grid item>
                            <Typography variant="caption" sx={{ fontSize: "14px", color: "#A2A1A8" }}>
                                Lead Name
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }}>{lead.leadName || '-'}</Typography>
                            <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                        </Grid>

                        <Grid item>
                            <Typography variant="caption" sx={{ fontSize: "14px", color: "#A2A1A8" }}>
                                Email Address
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }}>{lead.email || '-'}</Typography>
                            <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                        </Grid>

                        <Grid item>
                            <Typography variant="caption" sx={{ fontSize: "14px", color: "#A2A1A8" }}>
                                Phone Number
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }}>{lead.phone || '-'}</Typography>
                            <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                        </Grid>

                        <Grid item>
                            <Typography variant="caption" sx={{ fontSize: "14px", color: "#A2A1A8" }}>
                                Alternate Number
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }}>{lead.alternativePhone || '-'}</Typography>
                            <Divider sx={{ mt: 1, borderColor: '#A2A1A81A' }} />
                        </Grid>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                        <Grid item>
                            <Typography variant="caption" sx={{ fontSize: "14px", color: "#A2A1A8" }}>
                                Location
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }}>{lead.location || '-'}</Typography>
                            <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                        </Grid>

                        <Grid item>
                            <Typography variant="caption" sx={{ fontSize: "14px", color: "#A2A1A8" }}>
                                Loan Type
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }}>{lead.loanType?.loanName || '-'}</Typography>
                            <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                        </Grid>

                        <Grid item>
                            <Typography variant="caption" sx={{ fontSize: "16px", color: "#A2A1A8" }}>
                                Loan Amount
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }}>{lead.loanAmount || '-'}</Typography>
                            <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                        </Grid>

                        <Grid item>
                            <Typography variant="caption" sx={{ fontSize: "14px", color: "#A2A1A8" }}>
                                Lead Created Date
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }}>
                                {lead.LeadCreatedDate ? new Date(lead.LeadCreatedDate).toLocaleDateString() : '-'}
                            </Typography>
                            <Divider sx={{ mt: 1, borderColor: '#A2A1A81A' }} />
                        </Grid>
                    </Box>
                </Grid>
            </Paper>
        </MainLayout>
    );
};

export default ViewLeadData;
