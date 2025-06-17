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
    Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { User } from "@/app/type/type";
import NewChatModal from "./NewChatModel";
import { getUserChats } from "@/app/store/slices/userSlice";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { formatMessageTimestamp } from "@/app/utils/formatMessageTimestamp";
import { getInitials } from "@/app/utils/getInitials";

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
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
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
                                    <SearchIcon
                                        sx={{
                                            color: "#FFFFFF",
                                            fontSize: { xs: 20, sm: 24 },
                                        }}
                                    />
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

                            const unseenMessageCount =
                                userChat?.messages.filter(
                                    (msg) =>
                                        msg.seen === false &&
                                        msg.sender.id !== user?.id
                                ).length || 0;

                            const latestMessage =
                                userChat?.messages?.[
                                userChat.messages.length - 1
                                ];
                            const timestampLabel = formatMessageTimestamp(
                                latestMessage?.createdAt
                            );

                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        mt: 1,
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor:
                                            activeChat &&
                                                ((activeChat.user1.id ===
                                                    user?.id &&
                                                    activeChat.user2.id ===
                                                    otherUser.id) ||
                                                    (activeChat.user1.id ===
                                                        otherUser.id &&
                                                        activeChat.user2.id ===
                                                        user?.id))
                                                ? "#373546"
                                                : "#1F212F",
                                        color: "#FFFFFF",
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        "&:hover": {
                                            bgcolor: "#2A2C3A",
                                            transition: "all 0.2s ease-in-out",
                                        },
                                    }}
                                    onClick={() => handleSelectUser(otherUser)}
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        sx={{
                                            flex: 1,
                                            overflow: "hidden",
                                            gap: 2,
                                        }}
                                    >
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
                                                        backgroundColor:
                                                            "#00FF00",
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
                                                {getInitials(otherUser.username)}
                                            </Avatar>
                                        </Box>
                                        <Box
                                            sx={{
                                                flex: 1,
                                                display: "flex",
                                                flexDirection: "column",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: {
                                                            xs: "14px",
                                                            sm: "16px",
                                                        },
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {otherUser.username}
                                                </Typography>
                                                {timestampLabel && (
                                                    <Typography
                                                        sx={{
                                                            color: "#B0B3B8",
                                                            fontSize: {
                                                                xs: "10px",
                                                                sm: "12px",
                                                            },
                                                            textAlign: "right",
                                                        }}
                                                    >
                                                        {timestampLabel}
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    mt: 0.5,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "5px",
                                                        overflow: "hidden",
                                                        width: "90%",
                                                    }}
                                                >
                                                    {latestMessage?.sender
                                                        ?.id === user?.id && (
                                                            <Box>
                                                                {latestMessage?.seen ? (
                                                                    <DoneAllIcon
                                                                        sx={{
                                                                            fontSize:
                                                                            {
                                                                                xs: "12px",
                                                                                sm: "14px",
                                                                            },
                                                                            color: "#4CB4DC",
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <DoneAllIcon
                                                                        sx={{
                                                                            fontSize:
                                                                            {
                                                                                xs: "12px",
                                                                                sm: "14px",
                                                                            },
                                                                            color: "#FFFFFF",
                                                                        }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        )}
                                                    <Typography
                                                        sx={{
                                                            color: "#B0B3B8",
                                                            fontSize: {
                                                                xs: "12px",
                                                                sm: "14px",
                                                            },
                                                            whiteSpace:
                                                                "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                        }}
                                                        title={
                                                            latestMessage?.content ||
                                                            "No messages yet"
                                                        }
                                                    >
                                                        {latestMessage?.content ||
                                                            "No messages yet"}
                                                    </Typography>
                                                </Box>
                                                {unseenMessageCount > 0 && (
                                                    <Box
                                                        sx={{
                                                            pr: "10px",
                                                        }}
                                                    >
                                                        <Badge
                                                            badgeContent={
                                                                unseenMessageCount
                                                            }
                                                            sx={{
                                                                "& .MuiBadge-badge":
                                                                {
                                                                    backgroundColor:
                                                                        "#1DAA61",
                                                                    color: "#000000",
                                                                    fontSize:
                                                                        "10px",
                                                                    minWidth:
                                                                        "18px",
                                                                    height: "18px",
                                                                    borderRadius:
                                                                        "50%",
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                            </Box>
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
                toggleDrawer={toggleDrawer}
            />
        </Box>
    );
};

export default Sidebar;
