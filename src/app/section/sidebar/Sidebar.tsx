"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { setActiveChat } from "@/app/store/slices/chatSlice";
import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
    InputAdornment,
    Avatar,
    IconButton,
    CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import ChatTabs from "./tabs/Tabs";
import { Chat } from "@/app/type/type";
import NewChatModal from "./newChatModel/NewChatModel";
import { getUserChats } from "@/app/store/slices/userSlice";

interface SidebarProps {
    toggleDrawer?: () => void;
    isMobile?: boolean;
}

const Sidebar = ({ toggleDrawer, isMobile = false }: SidebarProps) => {
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const { chats, user } = useSelector((state: RootState) => state.user);
    const { activeChat } = useSelector((state: RootState) => state.chat);
    const [isNewChatLoading, setIsNewChatLoading] = useState(false);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleSelectChat = (chat: Chat) => {
        dispatch(setActiveChat({ chat, currentUserId: user?.id || "" }));
        if (user?.id) {
            dispatch(getUserChats(user.id));
        }
        if (isMobile && toggleDrawer) {
            toggleDrawer();
        }
    };

    const filteredChats = chats?.filter(
        (chat) =>
            chat.messages && chat.messages.length > 0 &&
            (chat.user1.username.toLowerCase().includes(search.toLowerCase()) ||
                chat.user2.username.toLowerCase().includes(search.toLowerCase()) ||
                chat.user1.email.toLowerCase().includes(search.toLowerCase()) ||
                chat.user2.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <Box
            sx={{
                height: {
                    xs: "100vh",
                    md: "calc(100vh - 72px)",
                },
                backgroundColor: "#111322",
                p: { xs: 2, sm: 3 },
                borderRight: { md: "2px solid #1F212F" },
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                mt: { xs: "0", md: "72px" },
            }}
        >
            {isMobile && toggleDrawer && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                    <IconButton onClick={toggleDrawer}>
                        <CloseIcon sx={{ color: "#FFFFFF", fontSize: { xs: 24, sm: 24 } }} />
                    </IconButton>
                </Box>
            )}

            <Stack gap={{ xs: 2, sm: 3 }}>
                <Box width="100%" mx="auto">
                    <TextField
                        variant="outlined"
                        placeholder="Search users..."
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                border: "2px solid #1F212F",
                                color: "#FFFFFF",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#A07ACD",
                                    borderWidth: "2px",
                                },
                                fontSize: { xs: "14px", sm: "16px" },
                            },
                            input: { color: "#FFFFFF" },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "#FFFFFF", fontSize: { xs: 20, sm: 24 } }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <Button
                    startIcon={<ControlPointIcon />}
                    sx={{
                        backgroundColor: "#A07ACD",
                        color: "#FFFFFF",
                        py: { xs: 1, sm: 1.5 },
                        fontSize: { xs: "14px", sm: "16px" },
                        textTransform: "none",
                        borderRadius: "8px",
                        "&:hover": {
                            backgroundColor: "#8B5FBF",
                            transform: "scale(1.02)",
                            transition: "all 0.2s ease-in-out",
                        },
                    }}
                    onClick={handleOpenModal}
                >
                    New Chat
                </Button>
                <ChatTabs />
            </Stack>
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    mt: 2,
                    pt: 1,
                    pb: 1,
                    scrollbarWidth: "thin",
                    scrollbarColor: "#A07ACD #111322",
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "#111322",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#A07ACD",
                        borderRadius: "4px",
                    },
                }}
            >
                {isNewChatLoading ? (
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 5,
                    }}>
                        <CircularProgress
                            size={24}
                            sx={{
                                color: "#FFFFFF",
                            }}
                        />
                    </Box>
                ) : filteredChats?.length === 0 ? (
                    <Typography sx={{ color: "#FFFFFF", mt: 2, textAlign: "center", fontSize: { xs: "14px", sm: "16px" } }}>No chats found</Typography>
                ) : (
                    <Box sx={{ mt: 2 }}>
                        <Typography sx={{ color: "#FFFFFF", mb: 1, fontSize: { xs: "16px", sm: "18px" } }}>
                            Chats:
                        </Typography>
                        {filteredChats?.map((chat, index) => {
                            const otherUser = chat.user1.id === user?.id ? chat.user2 : chat.user1;
                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        mt: 1,
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: activeChat?.id === chat.id ? "#373546" : "#1F212F",
                                        color: "#FFFFFF",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        "&:hover": {
                                            bgcolor: "#2A2C3A",
                                            transition: "all 0.2s ease-in-out",
                                        },
                                    }}
                                    onClick={() => handleSelectChat(chat)}
                                >
                                    <Box display="flex" gap={2} alignItems="center">
                                        <Box position="relative">
                                            {otherUser.online && (
                                                <Box
                                                    sx={{
                                                        position: "absolute",
                                                        right: 0,
                                                        bottom: 2,
                                                        width: "12px",
                                                        height: "12px",
                                                        zIndex: 10,
                                                        backgroundColor: "#00FF00",
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                            )}
                                            <Avatar
                                                sx={{
                                                    bgcolor: "#FFFFFF",
                                                    color: "#000000",
                                                    width: { xs: 40, sm: 45 },
                                                    height: { xs: 40, sm: 45 },
                                                }}
                                            >
                                                {otherUser.username.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
                                                {otherUser.username}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: "#B0B3B8",
                                                    fontSize: { xs: "12px", sm: "14px" },
                                                }}
                                            >
                                                {otherUser.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </Box>
            <NewChatModal
                open={openModal}
                onClose={handleCloseModal}
                onLoadingChange={setIsNewChatLoading}
            />
        </Box>
    );
};

export default Sidebar;