import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Divider,
    CircularProgress,
} from '@mui/material';
import MainLayout from './layout/MainLayout';
import ProfileHeader from '@/components/layout/ProfileHeader';
import { useParams } from 'react-router-dom';
import api from "../helpers/Api"
import Toastify from '../helpers/Toastify';
import { formatDate } from '../helpers/conversion';
import RoleBreadcrumbs from './layout/RoleBreadcrumbs';

const ViewLeadData = () => {
    
    
    const {id} = useParams()
    const [loading,setLoading] = useState(false)
    const [Data,setData] = useState([])
   



    const fetchData =async ()=>{
        try {
            setLoading(true)

            const {data,status} = await api.getALead(id)
            // console.log(data,"da");
            
            if(status === 200){
                setData(data?.data)
            }
            
        } catch (error) {
                Toastify.error(error.response.data.message || `something went wrong`);
            
        }finally{
            setLoading(false)

        }
    }

    useEffect(()=>{
        fetchData()
    },[id])

    console.log(Data,"viewdata");
    

    return (
        <MainLayout>
            <ProfileHeader
             name={loading ? 'Loading...' : Data?.leadName}
            />

            <RoleBreadcrumbs
            name='Lead Personal Information'
            breadcrumbs={['Leads Data' , 'Lead Personal Information']}
            
            />


            {loading ? (
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
                    marginLeft: '20px',
                    marginTop: '20px'
                }}
            >
                <Typography variant="subtitle1" fontWeight="bold" mb={2} sx={{fontSize:"14px", color:"#0F172A"}}>
                    Personal Information
                </Typography>

                <Grid container spacing={2}  >
                    <Box sx={{ display: 'flex' , flexDirection:'column', width:'48%'}}>
                      
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" sx={{fontSize:"14px", color:"#A2A1A8"}}>
                                    Lead Name
                                </Typography>
                                <Typography sx={{fontSize:"16px", color:"#16151C"}}>{Data?.leadName}</Typography>
                                <Divider sx={{ mt: 1, mb: 2,borderColor:'#A2A1A81A' }} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" sx={{fontSize:"14px", color:"#A2A1A8"}}>
                                    Email Address
                                </Typography>
                                <Typography sx={{fontSize:"16px", color:"#16151C"}}>{Data?.email}</Typography>
                                <Divider sx={{ mt: 1, mb: 2,borderColor:'#A2A1A81A' }} />
                            </Grid>
                      
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" sx={{fontSize:"14px", color:"#A2A1A8"}}>
                                    Phone Number
                                </Typography>
                                <Typography sx={{fontSize:"16px", color:"#16151C"}}>{Data?.phone}</Typography>
                                <Divider sx={{ mt: 1, mb: 2,borderColor:'#A2A1A81A' }} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" sx={{fontSize:"14px", color:"#A2A1A8"}}>
                                    Alternate Number
                                </Typography>
                                <Typography sx={{fontSize:"16px", color:"#16151C"}}>{Data?.alternativePhone}</Typography>
                                <Divider sx={{ mt: 1, borderColor:'#A2A1A81A' }} />
                            </Grid>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection:'column', width:'48%'}}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" sx={{fontSize:"14px", color:"#A2A1A8"}}>
                                    Location
                                </Typography>
                                <Typography sx={{fontSize:"16px", color:"#16151C"}}>{Data?.location}</Typography>
                                <Divider sx={{ mt: 1, mb: 2,borderColor:'#A2A1A81A' }} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" sx={{fontSize:"14px", color:"#A2A1A8"}}>
                                    Loan Type
                                </Typography>
                                <Typography sx={{fontSize:"16px", color:"#16151C"}}>{Data?.loanType}</Typography>
                                <Divider sx={{ mt: 1, mb: 2,borderColor:'#A2A1A81A' }} />
                            </Grid>
                        
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" sx={{fontSize:"16px", color:"#A2A1A8"}}>
                                    Loan Amount
                                </Typography>
                                <Typography sx={{fontSize:"16px", color:"#16151C"}} >{Data?.loanAmount}</Typography>
                                <Divider sx={{ mt: 1, mb: 2,borderColor:'#A2A1A81A' }} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption"  sx={{fontSize:"14px", color:"#A2A1A8"}}>
                                    Lead Created Date
                                </Typography>
                                <Typography sx={{fontSize:"16px", color:"#16151C"}}>{formatDate( Data?.LeadCreatedDate)}</Typography>
                                <Divider sx={{ mt: 1, borderColor:'#A2A1A81A' }} />
                            </Grid>
                       
                    </Box>
                </Grid>
            </Paper>
        )}
        </MainLayout>
    );
};

export default ViewLeadData;
