import { Box, Stack, Typography } from "@mui/material";
import React from "react";

const ChatWelcome = () => {

    return (
        <Box
            sx={{
                width: "100%",
                backgroundColor: "#131426",
                height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)", md: "calc(100vh - 72px)" },
                overflowY: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Stack alignItems="center" gap={2} sx={{ textAlign: "center", px: 2 }}>
                <Typography
                    variant="h4"
                    color="#A3A1A2"
                    sx={{ fontSize: { xs: "24px", sm: "30px", md: "36px" } }}
                >
                    Welcome to ChatApp
                </Typography>
                <Typography
                    variant="body1"
                    color="#A3A1A2"
                    sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                >
                    Select a chat to start messaging
                </Typography>
            </Stack>
        </Box>
    );
};

export default ChatWelcome;