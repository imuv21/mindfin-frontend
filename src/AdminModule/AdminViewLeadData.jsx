import React, { useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Divider,
} from '@mui/material';
import MainLayout from './layout/MainLayout';
import ProfileHeader from '../AdminModule/layout/ProfileHeader';
import RoleBreadcrumbs from './layout/RoleBreadcrumbs';

const ViewLeadData = () => {
     const [loading,setLoading] = useState(false)
    const data = {
        name: 'Uday Kumar',
        email: 'bodgdan@gmail.com',
        phone: '(307) 555-0133',
        altPhone: '(307) 555-0133',
        location: 'Bangalore',
        type: 'Personal',
        amount: '1,200,000',
        date: '2025-03-10',
    };

    return (
        <MainLayout>
            <ProfileHeader name={data.name} />
            <RoleBreadcrumbs
                //Lead Personal Information

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

                <Grid container spacing={2}  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '48%' }}>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="caption" sx={{ fontSize: "14px", color: "#A2A1A8" }}>
                                Lead Name
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }}>{data.name}</Typography>
                            <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="caption" sx={{ fontSize: "14px", color: "#A2A1A8" }}>
                                Email Address
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }}>{data.email}</Typography>
                            <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="caption" sx={{ fontSize: "14px", color: "#A2A1A8" }}>
                                Phone Number
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }}>{data.phone}</Typography>
                            <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="caption" sx={{ fontSize: "14px", color: "#A2A1A8" }}>
                                Alternate Number
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }}>{data.altPhone}</Typography>
                            <Divider sx={{ mt: 1, borderColor: '#A2A1A81A' }} />
                        </Grid>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="caption" sx={{ fontSize: "14px", color: "#A2A1A8" }}>
                                Location
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }}>{data.location}</Typography>
                            <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="caption" sx={{ fontSize: "14px", color: "#A2A1A8" }}>
                                Loan Type
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }}>{data.type}</Typography>
                            <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="caption" sx={{ fontSize: "16px", color: "#A2A1A8" }}>
                                Loan Amount
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }} >{data.amount}</Typography>
                            <Divider sx={{ mt: 1, mb: 2, borderColor: '#A2A1A81A' }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="caption" sx={{ fontSize: "14px", color: "#A2A1A8" }}>
                                Lead Created Date
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#16151C" }}>{data.date}</Typography>
                            <Divider sx={{ mt: 1, borderColor: '#A2A1A81A' }} />
                        </Grid>

                    </Box>
                </Grid>
            </Paper>
        </MainLayout>
    );
};

export default ViewLeadData;

