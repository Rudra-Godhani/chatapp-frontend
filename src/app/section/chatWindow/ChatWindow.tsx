"use client";

import {
    Box,
    Typography,
    Stack,
    Avatar,
    TextField,
    IconButton,
    CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import store, { AppDispatch, RootState } from "@/app/store/store";
import { useEffect, useState, useRef } from "react";
import { addMessage } from "@/app/store/slices/chatSlice";
import { socket } from "../../../socket";
import EmojiPicker, { Theme } from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { getUserChats } from "@/app/store/slices/userSlice";

const ChatWindow = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { activeChat, messages, activeChatUser } = useSelector(
        (state: RootState) => state.chat
    );
    const { loading, user } = useSelector((state: RootState) => state.user);
    const [message, setMessage] = useState("");
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const textFieldRef = useRef<HTMLInputElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = (smooth = false) => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: smooth ? "smooth" : "auto",
            });
        }
    };

    useEffect(() => {
        scrollToBottom(true);
    }, [messages]);

    useEffect(() => {
        if (activeChat?.id) {
            socket.emit("joinChat", activeChat.id);
            scrollToBottom(false);
        }

        socket.on("receiveMessage", (newMessage) => {

            dispatch(addMessage(newMessage));
            const updatedState = store.getState() as RootState;
            const updatedMessages = updatedState.chat.messages;
            if (user?.id && updatedMessages.length === 1) {
                dispatch(getUserChats(user.id));
            }
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [activeChat?.id, dispatch,user?.id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSendMessage = async () => {
        if (!message.trim() || !activeChat || !user) return;

        const messageData = {
            chatId: activeChat.id,
            senderId: user.id,
            content: message,
        };

        socket.emit("sendMessage", messageData);
        setMessage("");
        setShowEmojiPicker(false);

        if (user?.id && messages.length === 0) {
            dispatch(getUserChats(user.id));
        }
    };

    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const onEmojiClick = (emojiObject: { emoji: string }) => {
        const input = textFieldRef.current?.querySelector("textarea");
        if (!input) return;

        const cursorPos = input.selectionStart || 0;
        const currentValue = input.value; // Get the current value from input
        const newMessage = currentValue.slice(0, cursorPos) + emojiObject.emoji + currentValue.slice(cursorPos);

        // Update message state with the new value
        setMessage(newMessage);

        // Force immediate cursor position update
        const newCursorPos = cursorPos + emojiObject.emoji.length;
        input.focus();
        input.setSelectionRange(newCursorPos, newCursorPos);

        // Ensure cursor position is maintained after React's state update
        setTimeout(() => {
            input.focus();
            input.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };


    if (!activeChatUser) {
        return null;
    }

    return (
        <Box
            sx={{
                height: {
                    xs: "calc(100vh - 56px)",
                    sm: "calc(100vh - 64px)",
                    md: "calc(100vh - 72px)",
                },
                color: "#fff",
                display: "flex",
                position: "relative",
                flexDirection: "column",
                backgroundColor: "#0F101A",
            }}
        >
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

            <Box
                ref={messagesContainerRef}
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: { xs: 1.5, sm: 2 },
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    scrollbarWidth: "thin",
                    scrollbarColor: "#A07ACD #0F101A",
                }}
            >
                {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CircularProgress
                            size={24}
                            sx={{
                                color: "#FFFFFF",
                            }}
                        />
                    </Box>
                ) : messages.length === 0 ? (
                    <Typography
                        sx={{
                            textAlign: "center",
                            color: "#ffffff",
                            fontSize: { xs: "14px", sm: "16px" },
                        }}
                    >
                        No messages yet, start messaging
                    </Typography>
                ) : (
                    messages.map((msg, index) => {
                        const timestamp = msg.createdAt;
                        const date = new Date(timestamp);
                        const localDate = new Date(
                            date.getTime() - date.getTimezoneOffset() * 60000
                        );
                        const hours = localDate
                            .getHours()
                            .toString()
                            .padStart(2, "0");
                        const minutes = localDate
                            .getMinutes()
                            .toString()
                            .padStart(2, "0");
                        const time = `${hours}:${minutes}`;
                        return (
                            <Box
                                key={index}
                                sx={{
                                    bgcolor:
                                        msg.sender.id === user?.id
                                            ? "#A07ACD"
                                            : "#373546",
                                    px: { xs: 1.5, sm: 2 },
                                    py: 1,
                                    position: "relative",
                                    borderRadius:
                                        msg.sender.id === user?.id
                                            ? "16px 0px 16px 16px"
                                            : "0px 16px 16px 16px",
                                    maxWidth: { xs: "70%", sm: "45%" },
                                    alignSelf:
                                        msg.sender.id === user?.id
                                            ? "flex-end"
                                            : "flex-start",
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            color: "#fff",
                                            fontSize: {
                                                xs: "14px",
                                                sm: "16px",
                                            },
                                        }}
                                    >
                                        {msg.content}
                                    </Typography>
                                </Box>
                                <Box
                                    display="flex"
                                    justifyContent={
                                        msg.sender.id === user?.id
                                            ? "flex-end"
                                            : "flex-start"
                                    }
                                >
                                    <Typography
                                        fontSize={{ xs: "10px", sm: "12px" }}
                                        sx={{
                                            color:
                                                msg.sender.id === user?.id
                                                    ? "#FFFFFF"
                                                    : "gray",
                                        }}
                                    >
                                        {time}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })
                )}
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    p: { xs: 1.5, sm: 2 },
                    gap: 2,
                    borderTop: "2px solid #1F212F",
                    backgroundColor: "#111322",
                }}
            >
                <IconButton sx={{ color: "#FFFFFF" }}>
                    <SentimentSatisfiedAltIcon
                        htmlColor="#FFFFFF"
                        fontSize="medium"
                        onClick={handleEmojiPickerHideShow}
                    />
                </IconButton>
                <TextField
                    variant="outlined"
                    placeholder="Type a message..."
                    fullWidth
                    multiline
                    minRows={1}
                    maxRows={5}
                    value={message}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setMessage(newValue);
                        // Ensure cursor position is maintained after clearing
                        const input = textFieldRef.current?.querySelector("textarea");
                        if (input) {
                            const cursorPos = input.selectionStart || 0;
                            setTimeout(() => {
                                input.setSelectionRange(cursorPos, cursorPos);
                            }, 0);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    onFocus={() => {
                        if (document.activeElement === textFieldRef.current) {
                            setShowEmojiPicker(false);
                        }
                    }}
                    ref={textFieldRef}
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
                />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#A07ACD",
                        width: { xs: "48px", sm: "58px" },
                        height: { xs: "48px", sm: "58px" },
                        borderRadius: "5px",
                        cursor: "pointer",
                        "&:hover": {
                            backgroundColor: "#8B5FBF",
                            transform: "scale(1.05)",
                            transition: "all 0.2s ease-in-out",
                        },
                    }}
                    onClick={handleSendMessage}
                >
                    <SendIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </Box>
            </Box>
            {showEmojiPicker && (
                <Box
                    ref={emojiPickerRef}
                    sx={{
                        position: "absolute",
                        bottom: {
                            xs: "calc(48px + 1.5rem)",
                            sm: "calc(58px + 2rem)",
                            md: "calc(58px + 2.5rem)",
                        },
                        left: { xs: "0.5rem", sm: "1rem" },
                        zIndex: 1000,
                        width: {
                            xs: "min(90vw, 350px)",
                            sm: "min(80vw, 350px)",
                            md: "min(50vw, 400px)",
                        },
                        height: {
                            xs: "min(50vh, 350px)",
                            sm: "min(50vh, 350px)",
                            md: "min(50vh, 400px)",
                        },
                    }}
                >
                    <EmojiPicker
                        width="100%"
                        height="100%"
                        theme={Theme.DARK}
                        onEmojiClick={onEmojiClick}
                    />
                </Box>
            )}
        </Box>
    );
};

export default ChatWindow;
