import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { socket } from "@/app/utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { getUserChats } from "@/app/store/slices/userSlice";
import { addMessage } from "@/app/store/slices/chatSlice";
import ollama from "ollama/browser";
import { setGeneratingResponse } from "@/app/store/slices/chatSlice";

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
    const { activeChat, activeChatUser, isGeneratingResponse } = useSelector(
        (state: RootState) => state.chat
    );
    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();

    const isChatbot = activeChatUser?.id === "chatbot";

    const onEmojiClick = (emojiObject: { emoji: string }) => {
        const input = textFieldRef.current?.querySelector("textarea");
        if (!input) return;

        const cursorPos = input.selectionStart || 0;
        const currentValue = input.value;
        const newMessage =
            currentValue.slice(0, cursorPos) +
            emojiObject.emoji +
            currentValue.slice(cursorPos);

        setMessage(newMessage);

        const newCursorPos = cursorPos + emojiObject.emoji.length;
        input.focus();
        input.setSelectionRange(newCursorPos, newCursorPos);

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

        if (isChatbot) {
            const userMessage = {
                id: Date.now().toString(),
                chat: activeChat,
                sender: user,
                content: message,
                seen: true,
                createdAt: new Date()
            };

            dispatch(addMessage(userMessage));
            setMessage("");
            setShowEmojiPicker(false);

            dispatch(setGeneratingResponse(true));

            const messageHistory = activeChat.messages.slice(-10).map((msg) => ({
                role: msg.sender.id === user.id ? "user" : "assistant",
                content: msg.content
            }));

            messageHistory.push({ role: "user", content: message });
            try {
                const response = await ollama.chat({
                    model: "llama3.2:1b",
                    messages: messageHistory
                });
                const aiResponse = {
                    id: (Date.now() + 1).toString(),
                    chat: activeChat,
                    sender: activeChatUser!,
                    content: response.message.content,
                    seen: true,
                    createdAt: new Date()
                };
                dispatch(addMessage(aiResponse));
            } catch {
                const errorMessage = {
                    id: (Date.now() + 1).toString(),
                    chat: activeChat,
                    sender: activeChatUser!,
                    content: "Sorry, I encountered an error. Please try again.",
                    seen: true,
                    createdAt: new Date()
                };
                dispatch(addMessage(errorMessage));
            } finally {
                dispatch(setGeneratingResponse(false));
            }
            return;
        }

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
        if (!activeChat || !user || isChatbot) return;

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
                    disabled={isGeneratingResponse}
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
                            "&.Mui-disabled": {
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1F212F",
                                },
                            },
                        },
                        input: { color: "#FFFFFF" },
                    }}
                />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isGeneratingResponse ? "#8B5FBF" : "#A07ACD",
                        width: { xs: "48px", sm: "58px" },
                        height: { xs: "48px", sm: "58px" },
                        borderRadius: "5px",
                        cursor: isGeneratingResponse ? "not-allowed" : "pointer",
                        opacity: isGeneratingResponse ? 0.7 : 1,
                        "&:hover": {
                            backgroundColor: isGeneratingResponse ? "#8B5FBF" : "#8B5FBF",
                            transition: "all 0.2s ease-in-out",
                        },
                    }}
                    onClick={isGeneratingResponse ? undefined : handleSendMessage}
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
