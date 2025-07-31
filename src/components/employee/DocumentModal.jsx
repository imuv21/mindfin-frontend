import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
} from '@mui/material';
import { Close } from '@/Svg';
import api from '../../helpers/Api';

export default function DocumentModal({ open, handleClose, documentName, imageUrl }) {
    // Check if it's a PDF
    
    const safeUrl = typeof imageUrl === 'string' ? imageUrl : String(imageUrl);

// const isPDF = decodeURIComponent(safeUrl).toLowerCase().split('?')[0].endsWith('.pdf');
const isPDF = /\.pdf$/i.test(safeUrl.split('?')[0].split('#')[0].trim());
console.log("Processed URL:", decodeURIComponent(safeUrl));
console.log("isPDF:", isPDF);
    


  
    const downloadFile = async (imageUrl) => {
        
            const fileName = imageUrl?.split('/')?.pop()?.split('?')[0];
                
        try {
        
        const response = await api.downloadPhoto(imageUrl);

        
        if (response.data instanceof Blob) {
            const fileUrl = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = fileUrl;
            
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(fileUrl);
        } else {
            console.error("Error while generating Barcode");
        }
        } catch (error) {
        console.log('Download failed:', error);
        }
    };
  
    
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3 },
            }}
        >
            {/* Header */}
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                py: 1,
                borderBottom: "1px solid #F1F5F9"
            }}>
                <Typography fontSize={18} fontWeight={600} sx={{ color: '#0F172A' }}>
                    Documents
                </Typography>
                <IconButton
                    onClick={handleClose}
                    sx={{
                        color: "#000",
                        padding: '0px',
                        "&:hover": { backgroundColor: "transparent" },
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            {/* Sub-header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" py={2} px={3}  >
                <Box py={2} px={3} >
                    {/* <Typography sx={{ color: "#0F172A", fontSize: '12px' }}> */}
                    <Typography sx={{ color: "#64748B", fontSize: '12px' }}>
                        {documentName}
                    </Typography>
                    {/* <Typography sx={{ color: "#64748B", fontSize: '12px' }}>50 Kb</Typography> */}
                </Box>
                {
                    !isPDF && (
                        <IconButton   onClick={() => downloadFile(imageUrl)}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5"
                                stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M5.8335 8.33301L10.0002 12.4997L14.1668 8.33301"
                                stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 12.5V2.5"
                                stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </IconButton>

                    )
                }
               
            </Box>

            {/* Preview Content */}
            <DialogContent
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    pt: 0,
                    minHeight: '400px',
                }}
            >
                {isPDF ? (
                    <iframe
                        src={imageUrl}
                        title="PDF Preview"
                        style={{
                            width: '100%',
                            height: '500px',
                            border: 'none',
                            borderRadius: '8px',
                        }}
                    />
                ) : (
                    <Box
                        component="img"
                        src={imageUrl}
                        alt="Document Preview"
                        sx={{
                            maxWidth: '100%',
                            maxHeight: '500px',
                            objectFit: 'contain',
                            borderRadius: 2,
                            border: '1px solid #eee',
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
