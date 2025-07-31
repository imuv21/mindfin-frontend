import MainLayout from '@/components/layout/MainLayout';
import ProfileHeader from '@/components/layout/ProfileHeader';
import {
    styled,
    Typography,
    Box,
    Card,
    Grid, Avatar,

    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Link
} from "@mui/material";
import React, { useEffect, useState } from 'react';
import EmployeePayslip from './EmployeePayslip';
import SalaryBreakdown from './SalaryBreakdown';
import EmployeePayrollHistory from './EmployeePayrollHistory';
import api from '../../helpers/Api';
import Toastify from "../../helpers/Toastify";
import { getAllPayslips, getAllTaxes, setFilterValues,} from "../../redux/payrollSlice";
import { useDispatch, useSelector } from 'react-redux';





const SalaryDefnition = () => {

    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState('Salary Breakdown');
    const [cardData, setCardData] = useState([]);

    const { paySlipData, isLoading, filterOptions } = useSelector(
        (state) => state.payroll
      );
    


    const tabs = [
        { id: 'Salary Breakdown' },
        { id: 'Tax Definition' },
        { id: 'Payslips' },
        { id: 'Payroll' },
    ];


     const fetchCardData = async () => {
        try {
          const { data, status } = await api.payRollCardData();
          if (status === 200) {
            setCardData([data.data]);
          }
        } catch (error) {
          console.log(error);
        }
      };


       useEffect(() => {
          fetchCardData();
          
        }, []);




        const summaryData = [
            {
                icon: <svg width="46" height="47" viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="23" cy="23.5" r="23" fill="#FFF8DF"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M30.0188 28.0878L30.0194 15.3606L21.4449 15.3986V16.5454H28.8343V28.0879L30.0188 28.0878ZM27.9735 30.1332L27.9741 17.4059L19.3996 17.444V18.5907H26.789V30.1332L27.9735 30.1332ZM25.1512 25.3734C25.1512 23.2986 23.4693 21.6167 21.3946 21.6167C19.3198 21.6167 17.6379 23.2987 17.6379 25.3734C17.6379 27.4478 19.3197 29.13 21.3946 29.13C23.4692 29.13 25.1512 27.448 25.1512 25.3734ZM30.88 14.5V28.9863H28.8347V31.0316H26.7894V31.6006L25.3696 33.0202L24.3711 32.0219L23.3585 33.0178L22.3711 32.0304L21.3669 33.0178L20.3796 32.0304L19.3753 33.0178L18.382 32.0244L17.3862 33.0203L16 31.6344V18.5908H18.5011V16.5454H20.5465V14.5001L30.88 14.5ZM22.6796 25.6133C22.9611 26.1593 22.8458 26.9708 22.3296 27.3592C22.1682 27.4807 21.9739 27.557 21.7714 27.5974L21.839 28.1203H20.9258L20.9954 27.5816C20.8021 27.5335 20.6203 27.4501 20.4691 27.3263C20.1792 27.0898 20.0291 26.7364 19.9605 26.3761L20.6557 26.2192C20.7157 26.5921 20.9927 26.8868 21.4034 26.8868C21.6349 26.8868 21.8093 26.828 21.9267 26.7103C22.0767 26.56 22.1554 26.3328 22.0744 26.1335C21.9682 25.8724 21.6441 25.7966 21.3919 25.7219C21.1071 25.6376 20.8111 25.5625 20.5665 25.3936C19.837 24.8903 19.8881 23.6732 20.7329 23.3049C20.8192 23.2671 20.9102 23.2419 21.0028 23.2224L20.9258 22.6264H21.839L21.7608 23.2325C21.9127 23.2677 22.0592 23.3215 22.1891 23.4036C22.4637 23.5773 22.6125 23.8548 22.6778 24.1518L21.9486 24.2962C21.9134 24.1927 21.8577 24.0962 21.771 24.0265C21.6697 23.9454 21.535 23.908 21.4024 23.9039C21.1651 23.8961 20.855 23.9577 20.7645 24.1968C20.7144 24.329 20.7483 24.4828 20.8493 24.5849C20.9402 24.6764 21.1604 24.7716 21.5102 24.8708C21.8599 24.97 22.1187 25.0727 22.2863 25.1787C22.4538 25.2848 22.5849 25.4296 22.6796 25.6133L22.6796 25.6133Z" fill="#FDCC1C"/>
                </svg>
                ,
                value: cardData[0]?.totalGrossSalary ?? "-",
                label: "Gross salary this month",
                bg: "#EEF0FE",
            },
            {
                icon: <svg width="46" height="47" viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="23" cy="23.5" r="23" fill="#E8F5FF"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M30.0188 28.0878L30.0194 15.3606L21.4449 15.3986V16.5454H28.8343V28.0879L30.0188 28.0878ZM27.9735 30.1332L27.9741 17.4059L19.3996 17.444V18.5907H26.789V30.1332L27.9735 30.1332ZM25.1512 25.3734C25.1512 23.2986 23.4693 21.6167 21.3946 21.6167C19.3198 21.6167 17.6379 23.2987 17.6379 25.3734C17.6379 27.4478 19.3197 29.13 21.3946 29.13C23.4692 29.13 25.1512 27.448 25.1512 25.3734ZM30.88 14.5V28.9863H28.8347V31.0316H26.7894V31.6006L25.3696 33.0202L24.3711 32.0219L23.3585 33.0178L22.3711 32.0304L21.3669 33.0178L20.3796 32.0304L19.3753 33.0178L18.382 32.0244L17.3862 33.0203L16 31.6344V18.5908H18.5011V16.5454H20.5465V14.5001L30.88 14.5ZM22.6796 25.6133C22.9611 26.1593 22.8458 26.9708 22.3296 27.3592C22.1682 27.4807 21.9739 27.557 21.7714 27.5974L21.839 28.1203H20.9258L20.9954 27.5816C20.8021 27.5335 20.6203 27.4501 20.4691 27.3263C20.1792 27.0898 20.0291 26.7364 19.9605 26.3761L20.6557 26.2192C20.7157 26.5921 20.9927 26.8868 21.4034 26.8868C21.6349 26.8868 21.8093 26.828 21.9267 26.7103C22.0767 26.56 22.1554 26.3328 22.0744 26.1335C21.9682 25.8724 21.6441 25.7966 21.3919 25.7219C21.1071 25.6376 20.8111 25.5625 20.5665 25.3936C19.837 24.8903 19.8881 23.6732 20.7329 23.3049C20.8192 23.2671 20.9102 23.2419 21.0028 23.2224L20.9258 22.6264H21.839L21.7608 23.2325C21.9127 23.2677 22.0592 23.3215 22.1891 23.4036C22.4637 23.5773 22.6125 23.8548 22.6778 24.1518L21.9486 24.2962C21.9134 24.1927 21.8577 24.0962 21.771 24.0265C21.6697 23.9454 21.535 23.908 21.4024 23.9039C21.1651 23.8961 20.855 23.9577 20.7645 24.1968C20.7144 24.329 20.7483 24.4828 20.8493 24.5849C20.9402 24.6764 21.1604 24.7716 21.5102 24.8708C21.8599 24.97 22.1187 25.0727 22.2863 25.1787C22.4538 25.2848 22.5849 25.4296 22.6796 25.6133L22.6796 25.6133Z" fill="#248CD8"/>
                </svg>
                
                ,
                value: cardData[0]?.totalNetSalary ?? "-",
                label: "Net salary this month",
                bg: "#FFF7E5",
            },
            {
                icon: <svg width="46" height="47" viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="23" cy="23.1973" r="23" fill="#FFF4E8"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M30.0188 27.7851L30.0194 15.0579L21.4449 15.0959V16.2427H28.8343V27.7852L30.0188 27.7851ZM27.9735 29.8304L27.9741 17.1032L19.3996 17.1412V18.288H26.789V29.8305L27.9735 29.8304ZM25.1512 25.0706C25.1512 22.9959 23.4693 21.314 21.3946 21.314C19.3198 21.314 17.6379 22.996 17.6379 25.0706C17.6379 27.1451 19.3197 28.8272 21.3946 28.8272C23.4692 28.8272 25.1512 27.1452 25.1512 25.0706ZM30.88 14.1973V28.6836H28.8347V30.7289H26.7894V31.2979L25.3696 32.7175L24.3711 31.7192L23.3585 32.7151L22.3711 31.7277L21.3669 32.7151L20.3796 31.7277L19.3753 32.7151L18.382 31.7216L17.3862 32.7175L16 31.3316V18.288H18.5011V16.2427H20.5465V14.1974L30.88 14.1973ZM22.6796 25.3106C22.9611 25.8566 22.8458 26.668 22.3296 27.0565C22.1682 27.1779 21.9739 27.2543 21.7714 27.2946L21.839 27.8175H20.9258L20.9954 27.2788C20.8021 27.2307 20.6203 27.1473 20.4691 27.0236C20.1792 26.7871 20.0291 26.4336 19.9605 26.0734L20.6557 25.9165C20.7157 26.2894 20.9927 26.5841 21.4034 26.5841C21.6349 26.5841 21.8093 26.5252 21.9267 26.4075C22.0767 26.2573 22.1554 26.03 22.0744 25.8308C21.9682 25.5697 21.6441 25.4939 21.3919 25.4191C21.1071 25.3349 20.8111 25.2598 20.5665 25.0908C19.837 24.5876 19.8881 23.3705 20.7329 23.0022C20.8192 22.9644 20.9102 22.9391 21.0028 22.9196L20.9258 22.3236H21.839L21.7608 22.9298C21.9127 22.965 22.0592 23.0188 22.1891 23.1009C22.4637 23.2746 22.6125 23.552 22.6778 23.849L21.9486 23.9934C21.9134 23.8899 21.8577 23.7935 21.771 23.7237C21.6697 23.6426 21.535 23.6053 21.4024 23.6011C21.1651 23.5934 20.855 23.655 20.7645 23.8941C20.7144 24.0263 20.7483 24.18 20.8493 24.2821C20.9402 24.3737 21.1604 24.4689 21.5102 24.5681C21.8599 24.6672 22.1187 24.77 22.2863 24.8759C22.4538 24.982 22.5849 25.1269 22.6796 25.3106L22.6796 25.3106Z" fill="#F29425"/>
                </svg>
                ,
                value: cardData[0]?.totalTax ?? "-",
                label: "Total tax this month",
                bg: "#ECFDF5",
            },
        ];


        const handlePageChange = (event, page) => {
            dispatch(setFilterValues({ page }));
          };

          const calculateShowingRange = () => {
            const start = (paySlipData?.currentPage - 1) * itemsPerPage + 1;
            const end = Math.min(
              paySlipData?.currentPage * itemsPerPage,
              paySlipData?.total
            );
            return { start, end };
          };

          useEffect(() => {
            dispatch(getAllPayslips(filterOptions));
          }, [filterOptions]);
        

    return (
        <MainLayout>
            <ProfileHeader 
            name='Payroll'
            
            />
            <div className="container mx-auto p-4">
                <Box mb={4}>
                    {/* Summary Cards */}
                    <Grid container spacing={2}>
                        {summaryData.map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index} sx={{width:'23%'}}>
                                <Card
                                    sx={{
                                        backgroundColor: item.bg,
                                        borderRadius: 2,
                                        p: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        boxShadow: "none",
                                    }}
                                >
                                    <Box>{item.icon}</Box>
                                    <Box>
                                        <Typography fontWeight={600} color="text.primary">
                                            {item.value}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.label}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <div className=" mx-auto">
                    {/* Tabs Navigation */}
                    <div className="border border-gray-200 rounded-lg">
                        <nav className="flex space-x-4 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`py-4 px-3 mx-2 text-sm font-medium flex items-center whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                                        ? 'border-b-2 border-blue-500 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.id}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6">
                        {activeTab === 'Salary Breakdown' && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <SalaryBreakdown />
                            </div>
                        )}

                        {/* {activeTab === 'Tax Definition' && (
                            <div className="bg-white border border-gray-200 rounded-lg">
                                <EmployeePayslip />
                            </div>
                        )} */}

                        {activeTab === 'Payslips' && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <EmployeePayslip />
                            </div>
                        )}

                        {activeTab === 'Payroll' && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <EmployeePayrollHistory />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default SalaryDefnition;