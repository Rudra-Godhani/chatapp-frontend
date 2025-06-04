"use client";

import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import GroupIcon from "@mui/icons-material/Group";

const ChatTabs = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box
            sx={{
                width: "100%",
                backgroundColor: "#313036",
                p: "5px",
                borderRadius: "5px",
            }}
        >
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="chat tabs"
                sx={{
                    "& .MuiTabs-indicator": { display: "none" },
                    minHeight: "auto",
                }}
            >
                <Tab
                    label="Personal"
                    icon={<ChatBubbleOutlineIcon />}
                    iconPosition="start"
                    sx={{
                        width: "50%",
                        color: "#FFFFFF",
                        backgroundColor: value === 0 ? "#111322" : "#313036",
                        borderRadius: "5px",
                        mr: "8px",
                        p: { xs: "6px 12px", sm: "8px 16px" },
                        "&.Mui-selected": { color: "#FFFFFF" },
                        textTransform: "none",
                        fontSize: { xs: "14px", sm: "16px" },
                        minHeight: "auto",
                    }}
                />
                <Tab
                    label="Groups"
                    icon={<GroupIcon />}
                    iconPosition="start"
                    sx={{
                        width: "50%",
                        color: "#FFFFFF",
                        backgroundColor: value === 1 ? "#111322" : "#313036",
                        borderRadius: "5px",
                        p: { xs: "6px 12px", sm: "8px 16px" },
                        "&.Mui-selected": { color: "#FFFFFF" },
                        textTransform: "none",
                        fontSize: { xs: "14px", sm: "16px" },
                        minHeight: "auto",
                    }}
                />
            </Tabs>
        </Box>
    );
};

export default ChatTabs;