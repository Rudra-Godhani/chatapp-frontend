"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { setActiveChat, setGeneratingResponse } from "@/app/store/slices/chatSlice";
import {
    Box,
    Button,
    Stack,
    Typography,
    IconButton,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { User } from "@/app/type/type";
import NewChatModal from "./NewChatModel";
import { getUserChats } from "@/app/store/slices/userSlice";
import SearchBar from "./SearchBar";
import ChatListItem from "./ChatListItem";

interface SidebarProps {
    toggleDrawer?: () => void;
    isMobile?: boolean;
}

const Sidebar = ({ toggleDrawer, isMobile = false }: SidebarProps) => {
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const { users, chats, user } = useSelector(
        (state: RootState) => state.user
    );
    const { activeChat } = useSelector((state: RootState) => state.chat);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleSelectUser = async (selectedUser: User) => {
        if (!user?.id) return;
        const chat = chats.find(
            (c) =>
                (c.user1.id === user.id && c.user2.id === selectedUser.id) ||
                (c.user1.id === selectedUser.id && c.user2.id === user.id)
        );
        if (chat) {
            dispatch(setActiveChat({ chat, currentUserId: user.id }));
            await dispatch(getUserChats(user.id));
            dispatch(setGeneratingResponse(false));
        }
        if (isMobile && toggleDrawer) {
            toggleDrawer();
        }
    };

    const usersWithMessages = users.filter((u) => {
        if (u.id === user?.id) return false;
        return chats?.some(
            (chat) =>
                ((chat.user1.id === u.id && chat.user2.id === user?.id) ||
                    (chat.user1.id === user?.id && chat.user2.id === u.id)) &&
                chat.messages &&
                chat.messages.length > 0
        );
    });

    const filteredUsers = usersWithMessages.filter(
        (u) =>
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
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
                <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}
                >
                    <IconButton onClick={toggleDrawer}>
                        <CloseIcon
                            sx={{
                                color: "#FFFFFF",
                                fontSize: { xs: 24, sm: 24 },
                            }}
                        />
                    </IconButton>
                </Box>
            )}

            <Stack gap={{ xs: 2, sm: 3 }}>
                <SearchBar search={search} onSearchChange={setSearch} />
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
                }}
            >
                {filteredUsers.length === 0 ? (
                    <Typography
                        sx={{
                            color: "#FFFFFF",
                            mt: 2,
                            textAlign: "center",
                            fontSize: { xs: "14px", sm: "16px" },
                        }}
                    >
                        No users with chats found
                    </Typography>
                ) : (
                    <Box sx={{ mt: 2 }}>
                        {filteredUsers.map((otherUser, index) => {
                            const userChat = chats.find(
                                (c) =>
                                    (c.user1.id === user?.id &&
                                        c.user2.id === otherUser.id) ||
                                    (c.user1.id === otherUser.id &&
                                        c.user2.id === user?.id)
                            );

                            return (
                                <ChatListItem
                                    key={index}
                                    otherUser={otherUser}
                                    user={user}
                                    activeChat={activeChat}
                                    userChat={userChat}
                                    onSelectUser={handleSelectUser}
                                />
                            );
                        })}
                    </Box>
                )}
            </Box>
            <NewChatModal
                open={openModal}
                onClose={handleCloseModal}
                toggleDrawer={toggleDrawer}
            />
        </Box>
    );
};

export default Sidebar;
