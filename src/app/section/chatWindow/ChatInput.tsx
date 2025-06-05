import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { socket } from "@/app/utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { getUserChats } from "@/app/store/slices/userSlice";

interface ChatInputProps {
    message: string;
    setMessage: (value: string) => void;
}

export const ChatInput = ({ message, setMessage }: ChatInputProps) => {
    const textFieldRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { activeChat } = useSelector(
        (state: RootState) => state.chat
    );
    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();

    const onEmojiClick = (emojiObject: { emoji: string }) => {
        const input = textFieldRef.current?.querySelector("textarea");
        if (!input) return;

        const cursorPos = input.selectionStart || 0;
        const currentValue = input.value; // Get the current value from input
        const newMessage =
            currentValue.slice(0, cursorPos) +
            emojiObject.emoji +
            currentValue.slice(cursorPos);

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

    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !activeChat || !user) return;

        const messageData = {
            chatId: activeChat.id,
            senderId: user.id,
            content: message,
        };

        socket.emit("sendMessage", messageData);
        socket.emit("stopTyping", { chatId: activeChat.id, userId: user.id });
        setMessage("");
        setShowEmojiPicker(false);
        setIsUserTyping(false);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        if (user?.id && activeChat?.messages.length === 0) {
            dispatch(getUserChats(user.id));
        }
    };

    const handleTyping = () => {
        if (!activeChat || !user) return;

        if (!isUserTyping) {
            setIsUserTyping(true);
            socket.emit("typing", { chatId: activeChat.id, userId: user.id });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsUserTyping(false);
            socket.emit("stopTyping", {
                chatId: activeChat.id,
                userId: user.id,
            });
        }, 2000);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node)
            ) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
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
                        handleTyping();
                        // Ensure cursor position is maintained after clearing
                        const input =
                            textFieldRef.current?.querySelector("textarea");
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
        </>
    );
};
