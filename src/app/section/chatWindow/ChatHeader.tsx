import { RootState } from "@/app/store/store";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";

export const ChatHeader = () => {
    const { activeChatUser } = useSelector(
        (state: RootState) => state.chat
    );
    return (
        <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: { xs: 1.5, sm: 2 },
                    backgroundColor: "#111322",
                    borderBottom: "2px solid #1F212F",
                }}
            >
                <Avatar
                    sx={{
                        bgcolor: "#FFFFFF",
                        color: "#000000",
                        width: { xs: 36, sm: 45 },
                        height: { xs: 36, sm: 45 },
                    }}
                >
                    {activeChatUser?.username.charAt(0).toUpperCase()}
                </Avatar>
                <Stack>
                    <Typography
                        variant="h6"
                        sx={{ fontSize: { xs: "16px", sm: "18px" } }}
                    >
                        {activeChatUser?.username}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="gray"
                        sx={{ fontSize: { xs: "12px", sm: "14px" } }}
                    >
                        {activeChatUser?.online ? "online" : "offline"}
                    </Typography>
                </Stack>
            </Box>
    );
}