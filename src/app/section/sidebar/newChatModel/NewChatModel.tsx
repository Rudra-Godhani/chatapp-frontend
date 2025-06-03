"use client";

import React, { useState } from "react";
import {
    Box,
    Modal,
    Typography,
    IconButton,
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";
import ChatTabs from "../tabs/Tabs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { setActiveChat, setSelectedUsers } from "@/app/store/slices/chatSlice";
import { startChat } from "@/app/store/slices/userSlice";
import { User } from "@/app/type/type";

interface NewChatModalProps {
    open: boolean;
    onClose: () => void;
    onLoadingChange: (loading: boolean) => void;
}

const NewChatModal = ({ open, onClose, onLoadingChange }: NewChatModalProps) => {
    const [search, setSearch] = useState("");
    const [isSelecting, setIsSelecting] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { users, user, chats } = useSelector((state: RootState) => state.user);

    const handleUserSelect = async (selectedUser: User) => {
        if (!user?.id) return;
        setIsSelecting(true);
        onLoadingChange(true);
        try {
            await dispatch(startChat(user.id, selectedUser.id));
            const newChat = chats.find(
                (chat) =>
                    (chat.user1.id === selectedUser.id || chat.user2.id === selectedUser.id) &&
                    (!chat.messages || chat.messages.length === 0)
            );

            if (newChat) {
                dispatch(setSelectedUsers(selectedUser));
                dispatch(setActiveChat({ chat: newChat, currentUserId: user.id }));
            }
        } finally {
            setIsSelecting(false);
            onLoadingChange(false);
            onClose();
        }
    };

    const filteredUsers = users?.filter((u) => {
        if (u.id === user?.id) return false;
        const existingChat = chats?.find(
            (chat) =>
                (chat.user1.id === u.id || chat.user2.id === u.id) &&
                chat.messages && chat.messages.length > 0
        );
        return !existingChat;
    }).filter(
        (u) =>
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="new-conversation-modal"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    width: { xs: "80vw", sm: 400 },
                    maxWidth: "100%",
                    backgroundColor: "#111322",
                    borderRadius: "8px",
                    p: { xs: 2, sm: 3 },
                    boxShadow: 24,
                    outline: "none",
                    maxHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography
                        id="new-conversation-modal"
                        variant="h6"
                        sx={{ color: "#FFFFFF", fontSize: { xs: "18px", sm: "20px" } }}
                    >
                        New Conversation
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon sx={{ color: "#FFFFFF", fontSize: { xs: 20, sm: 24 } }} />
                    </IconButton>
                </Box>

                <TextField
                    variant="outlined"
                    placeholder="Search users..."
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                        my: 2,
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

                <Box sx={{ maxHeight: "300px", overflowY: "auto", scrollbarWidth: "thin",
                    scrollbarColor: "#A07ACD #0F101A", }}>
                    {filteredUsers.length === 0 && (
                        <Typography
                            sx={{ color: "#FFFFFF", textAlign: "center", fontSize: { xs: "14px", sm: "16px" } }}
                        >
                            No users found
                        </Typography>
                    )}
                    <List>
                        {filteredUsers?.map((user, index) => (
                            <React.Fragment key={index}>
                                <ListItem
                                    sx={{
                                        py: 1,
                                        cursor: isSelecting ? "not-allowed" : "pointer",
                                        opacity: isSelecting ? 0.7 : 1,
                                        "&:hover": {
                                            bgcolor: isSelecting ? "inherit" : "#2A2C3A",
                                            transition: "all 0.2s ease-in-out",
                                        },
                                    }}
                                    onClick={() => !isSelecting && handleUserSelect(user)}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            sx={{
                                                bgcolor: "#FFFFFF",
                                                color: "#000000",
                                                width: { xs: 36, sm: 40 },
                                                height: { xs: 36, sm: 40 },
                                            }}
                                        >
                                            {user.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={user.username}
                                        secondary={user.email}
                                        primaryTypographyProps={{
                                            color: "#FFFFFF",
                                            fontSize: { xs: "14px", sm: "16px" },
                                        }}
                                        secondaryTypographyProps={{
                                            color: "#B0B3B8",
                                            fontSize: { xs: "12px", sm: "14px" },
                                        }}
                                    />
                                    {user.online && (
                                        <CircleIcon
                                            sx={{
                                                color: "#00FF00",
                                                fontSize: "12px",
                                                ml: 1,
                                            }}
                                        />
                                    )}
                                </ListItem>
                                {index < filteredUsers.length - 1 && (
                                    <Divider sx={{ bgcolor: "#313036" }} />
                                )}
                            </React.Fragment>
                        ))}
                    </List>
                </Box>
            </Box>
        </Modal>
    );
};

export default NewChatModal;