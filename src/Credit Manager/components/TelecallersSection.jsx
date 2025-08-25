import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import api from '../../helpers/Api';

export default function TelecallerTabs() {
    const [activeTab, setActiveTab] = useState(0);
    const [telecallers, setTelecallers] = useState([]);

    useEffect(() => {
        const fetchTelecallers = async () => {
            try {
                const response = await api.getAllTelecallers();
                console.log("API response:", response);

                // This line is the key fix
                setTelecallers(response.data.data);
            } catch (error) {
                console.error("Failed to fetch telecallers:", error);
            }
        };

        fetchTelecallers();
    }, []);

    return (
        <Box p={2} sx={{ maxWidth: "100%" }}>
            <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    minHeight: "44px",
                }}
            >
                {Array.isArray(telecallers) &&
                    telecallers.map((telecaller, index) => (
                        <Tab
                            key={telecaller._id || index}
                            label={`${telecaller.firstName} ${telecaller.lastName}`}
                            sx={{
                                minHeight: "44px",
                                textTransform: "none",
                                fontSize: { xs: "12px", sm: "14px", md: "16px" },
                                color: activeTab === index ? "#2563EB" : "inherit",
                                fontWeight: activeTab === index ? 500 : "normal",
                            }}
                        />
                    ))}
            </Tabs>
        </Box>
    );
}