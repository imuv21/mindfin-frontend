import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import ProfileHeader from './layout/ProfileHeader'
import MainLayout from './layout/MainLayout'
import api from '../helpers/Api';
import Toastify from '../helpers/Toastify';
import DuplicateModal from '../AdminModule/DuplicateModal';


const UploadDocumnet = () => {

    const [open, setOpen] = useState(() => {
        return localStorage.getItem('hasDuplicates') === 'true';
    });
    
    
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
    
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
    
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
                console.log(jsonData, "jaisaa");
    
                const res = await api.addLead(jsonData);
               
    
                if (res.status === 200) {

                    if (res?.data?.data?.hasDuplicates) {
                        localStorage.setItem('hasDuplicates', 'true');
                        return setOpen(true);
                    }


                    Toastify.success("Leads added successfully");

                    
                }
            } catch (err) {
                console.error('Upload error:', err);
                alert('Upload failed. Check the file format and try again.');
            } finally {
                // Reset file input so same file can be uploaded again
                event.target.value = null;
            }
        };
    
        reader.readAsArrayBuffer(file);
    };
    

    const handleClose = () =>{
        localStorage.removeItem('hasDuplicates');
        setOpen(false);
        Toastify.success("Leads added successfully");

    }


    return (
        <MainLayout>
            <ProfileHeader name='Admin' />
            <div className="container m-auto p-4">
                {
                    open && 
                <DuplicateModal  onClose={handleClose} />
                }
                <div className="flex items-center justify-center flex-col bg-[#fff] rounded-[8px] p-4 h-100">
                    <label htmlFor="upload-file" className="flex items-center gap-2 text-white bg-[#2563EB] rounded-lg px-4 py-2 text-sm font-medium cursor-pointer">
                        <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.25 11.25V14.25C16.25 14.6478 16.092 15.0294 15.8107 15.3107C15.5294 15.592 15.1478 15.75 14.75 15.75H4.25C3.85218 15.75 3.47064 15.592 3.18934 15.3107C2.90804 15.0294 2.75 14.6478 2.75 14.25V11.25" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.25 6L9.5 2.25L5.75 6" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.5 2.25V11.25" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Upload Document
                    </label>
                    <input
                        id="upload-file"
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <div className="text-gray-500 text-[16px] pt-2">
                        UPLOAD DATA, XLS or CSV
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default UploadDocumnet;
