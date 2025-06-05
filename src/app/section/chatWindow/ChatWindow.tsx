"use client";

import {
    Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { useEffect, useState, useRef } from "react";
import { addMessage, setTyping } from "@/app/store/slices/chatSlice";
import { socket } from "../../utils/socket";
import {  updateChatMessages } from "@/app/store/slices/userSlice";
import { Message } from "@/app/type/type";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

const ChatWindow = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { activeChat, activeChatUser } = useSelector(
        (state: RootState) => state.chat
    );
    const { user } = useSelector((state: RootState) => state.user);
    const [message, setMessage] = useState("");
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = (smooth = false) => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: smooth ? "smooth" : "auto",
            });
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            scrollToBottom(true);
        }, 200);

        return () => clearTimeout(timer);
    }, [activeChat]);

    

    useEffect(() => {
        if (activeChat?.id) {
            console.log("before chat joined 1");
            socket.emit("joinChat", activeChat.id);
            console.log("before chat joined 2");
            socket.emit("markMessagesSeen", {
                chatId: activeChat.id,
                userId: user?.id,
            });
            console.log("after chat joined");

            setTimeout(() => {
                scrollToBottom(false);
            }, 0);
        }

        socket.on("receiveMessage", (newMessage) => {
            console.log("New message received:", newMessage);
            if (activeChat && activeChat.id === newMessage.chat.id) {
                dispatch(addMessage(newMessage));
                dispatch(updateChatMessages(newMessage.chat.id, newMessage));
                
                if (user?.id) {
                    socket.emit("markMessagesSeen", {
                        chatId: activeChat.id,
                        userId: user.id,
                    });
                }
            }
        });

        socket.on("messagesSeen", (updatedMessages) => {
            console.log("Messages seen updated:", updatedMessages);
            updatedMessages.forEach((msg: Message) => {
                dispatch(addMessage(msg));
                dispatch(updateChatMessages(msg.chat.id, msg));
            });
        });

        socket.on("typing", ({ userId }) => {
            if (userId !== user?.id && activeChatUser?.id === userId) {
                dispatch(setTyping(true));
            }
        });

        socket.on("stopTyping", ({ userId }) => {
            if (userId !== user?.id && activeChatUser?.id === userId) {
                dispatch(setTyping(false));
            }
        });

        return () => {
            socket.off("receiveMessage");
            socket.off("messagesSeen");
            socket.off("typing");
            socket.off("stopTyping");
        };
    }, [activeChat?.id, activeChatUser?.id, dispatch, user?.id]);

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
            <ChatHeader />
            <ChatMessage messagesContainerRef={messagesContainerRef} />
            <ChatInput message={message} setMessage={setMessage} />
        </Box>
    );
};

export default ChatWindow;
