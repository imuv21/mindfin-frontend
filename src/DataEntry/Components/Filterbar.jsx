import React, { useEffect, useState } from "react";
import {
    styled,
    Box,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    IconButton,
    InputAdornment,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllLeadData, setFilterValues } from "../../redux/leadSlice";
import api from "../../helpers/Api";
import * as XLSX from 'xlsx';
import { formatDate } from "../../helpers/conversion";
import Toastify from "../../helpers/Toastify";


const StyledTextField = styled(TextField)({
    fontSize: '14px',
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            border: 'none',
        },
        '&:hover fieldset': {
            border: 'none',
        },
        '&.Mui-focused fieldset': {
            border: 'none',
        },
        backgroundColor: '#fff',
        paddingRight: 0,
    },
});

const StyledSelect = styled(Select)(() => ({
    height: 44,
    lineHeight: '44px',
    fontSize: '14px',
    '&::before, &::after': {
        display: 'none',
    },
    '&:hover::before': {
        borderBottom: 'none !important',
    },
    '&.Mui-focused::after': {
        borderBottom: 'none !important',
    },
    '& .MuiSelect-select': {
        padding: '6px 24px 6px 0',
        border: 'none',
        backgroundColor: 'transparent',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    boxShadow: 'none',
    background: 'transparent',
}));

export default function Filterbar() {
   const  navigate = useNavigate()
    const dispatch = useDispatch()
     const {isRefresh,isLoading,filterOptions} = useSelector((state)=>state.leads)
   
    const [date, setDate] = useState(null);
    const [representative, setRepresentative] = useState("");
    const [telecaller, setTelecaller] = useState("");
    const [search,setSearch] = useState('')
    const [loading,setLoading] = useState(false)

    

    const handleSearch = (e) => {
        setSearch(e.target.value);
        dispatch(setFilterValues({ search: e.target.value, page: 1 }));
      };

      const handleDateChange = (e) =>{
        setDate(e.target.value)
        dispatch(setFilterValues({ date: e.target.value, page: 1 }));

      }


      useEffect(()=>{
        dispatch(getAllLeadData(filterOptions))
      },[filterOptions])


      console.log(filterOptions,"oombi");




    const fetchData = async () =>{
        setLoading(true); // Start loading

        try {

            let query = `search=${search}&date=${date}`

            const {data,status} = await api.exportLead(query)
            console.log(data,"exp1");

            if (status === 200) {
                let lead = data?.data

                const excelData = lead?.map((item) => ({
                    leadName: item?.leadName|| '_',
                    phone: item?.phone || '_',
                    alternativePhone: item?.alternativePhone || '_',
                    email: item?.email || '_',
                    location: item?.location || '_',
                    loanType: item?.loanType || '_',
                    loanAmount: item?.loanAmount || '_',
                    LeadCreatedDate:  formatDate( item?.LeadCreatedDate) || '_',
                  }));
                  const worksheet = XLSX.utils.json_to_sheet(excelData);
                  const workbook = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(workbook, worksheet, 'Refunds');
                  XLSX.writeFile(workbook, `Lead.xlsx`);



            }



        
            
        } catch (error) {
            console.log(error);
            Toastify.error("Internal server issue")

            
        }
        finally{
            setLoading(false); // Start loading

        }
    }
      

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#fff"
            sx={{ borderRadius: '12px', padding: '10px' }}
        >
            {/* Left Filters */}
            <Box display="flex" alignItems="center" gap={2}>
                <IconButton>
                    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.75 6.55427C16.1348 6.55427 20.5 5.25909 20.5 3.66141C20.5 2.06373 16.1348 0.768555 10.75 0.768555C5.36522 0.768555 1 2.06373 1 3.66141C1 5.25909 5.36522 6.55427 10.75 6.55427Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M1 3.66113C1.0017 5.61509 2.40851 7.39635 4.66812 8.55616C6.73072 9.61485 8.5 11.4677 8.5 13.7861V13.7861C8.5 14.585 9.50736 15.2326 10.75 15.2326C11.9926 15.2326 13 14.585 13 13.7861V13.7861C13 11.4677 14.7693 9.61485 16.8319 8.55616C19.0915 7.39635 20.4983 5.61509 20.5 3.66113" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                </IconButton>
                <div className="w-px h-8 bg-[#979797]"></div>
                <StyledTextField sx={{ fontSize: '14px' }}
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    size="small"

                />
                {/* <div className="w-px h-8 bg-[#979797]"></div> */}
                {/* <FormControl variant="standard" sx={{ minWidth: 150 }}>
                    <StyledSelect
                        displayEmpty
                        value={representative}
                        onChange={(e) => setRepresentative(e.target.value)}
                        renderValue={(selected) => selected || " Representative"}
                    >
                        <MenuItem value="" disabled> Representative</MenuItem>
                        <MenuItem value="Rep1">Rep 1</MenuItem>
                        <MenuItem value="Rep2">Rep 2</MenuItem>
                    </StyledSelect>
                </FormControl> */}
                <div className="w-px h-8 bg-[#979797]"></div>
                {/* <FormControl variant="standard" sx={{ minWidth: 150 }}>
                    <StyledSelect
                        displayEmpty
                        value={telecaller}
                        onChange={(e) => setTelecaller(e.target.value)}
                        label="Telecallers"
                    >
                        <MenuItem value="" disabled> Tele Caller</MenuItem>
                        <MenuItem value="Caller1">Caller 1</MenuItem>
                        <MenuItem value="Caller2">Caller 2</MenuItem>
                    </StyledSelect>
                </FormControl> */}
            </Box>

            {/* Right Buttons */}
            <Box mt={{ xs: 2, md: 0 }} sx={{ display: "flex", gap: 1 }}>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                    </div>
                    <input
                        type="search"
                        className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white"
                        placeholder="Search lead name"
                        name="search"
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                {/* <button
                    className="flex items-center gap-2 text-white bg-[#2563EB] rounded-lg px-4 py-2 text-sm font-medium cursor-pointer"
                    onClick={()=>fetchData()}
                >
                    Export
                </button> */}

<button
    className="flex items-center gap-2 text-white bg-[#2563EB] rounded-lg px-4 py-2 text-sm font-medium cursor-pointer"
    onClick={fetchData}
    disabled={loading}
>
    {loading ? "Exporting..." : "Export"}
</button>

                <button
                    type="button"
                    className="flex items-center gap-2 text-white bg-[#2563EB] rounded-lg px-4 py-2 text-sm font-medium cursor-pointer"
                    onClick={() => navigate("/uploadDocument")}                >
                    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.25 11.25V14.25C16.25 14.6478 16.092 15.0294 15.8107 15.3107C15.5294 15.592 15.1478 15.75 14.75 15.75H4.25C3.85218 15.75 3.47064 15.592 3.18934 15.3107C2.90804 15.0294 2.75 14.6478 2.75 14.25V11.25" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M13.25 6L9.5 2.25L5.75 6" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M9.5 2.25V11.25" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    Upload Document
                </button>
            </Box>
        </Box>
    );
}
