import { Box, CircularProgress, Typography } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { RootState } from "../../store/store";
import TypingIndicator from "../../components/TypingIndicator";

interface ChatMessageProps {
    messagesContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessage = ({ messagesContainerRef }: ChatMessageProps) => {
    const { activeChat, activeChatUser, isGeneratingResponse } = useSelector(
        (state: RootState) => state.chat
    );

    const { loading, user } = useSelector((state: RootState) => state.user);
    const isChatbot = activeChatUser?.id === "chatbot";

    return (
        <>
            <Box
                ref={messagesContainerRef}
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: { xs: 1.5, sm: 2 },
                    position: "relative",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#A07ACD #0F101A",
                }}
            >
                <Box
                    ref={messagesContainerRef}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        minHeight: "100%"
                    }}>
                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: "#FFFFFF",
                                }}
                            />
                        </Box>
                    ) : activeChat?.messages === undefined || activeChat?.messages?.length === 0 ? (
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
                        <>
                            {activeChat?.messages?.map((msg, index) => {
                                if (!msg.content) return null;
                                const timestamp = msg.createdAt;
                                const date = new Date(timestamp);
                                const hours = date
                                    .getHours()
                                    .toString()
                                    .padStart(2, "0");
                                const minutes = date
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
                                            maxWidth: { xs: "80%", sm: "60%" },
                                            alignSelf:
                                                msg.sender.id === user?.id
                                                    ? "flex-end"
                                                    : "flex-start",
                                            overflow: "hidden"
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
                                                    wordBreak: "break-word",
                                                    "& code": {
                                                        backgroundColor: "#1e1e1e",
                                                        padding: "2px 4px",
                                                        borderRadius: "4px",
                                                        fontSize: "0.9em",
                                                    },
                                                    "& pre": {
                                                        backgroundColor: "#1e1e1e",
                                                        padding: "12px 16px",
                                                        borderRadius: "8px",
                                                        overflow: "auto",
                                                        margin: "8px 0",
                                                        '& code': {
                                                            backgroundColor: "transparent",
                                                            padding: 0,
                                                            fontSize: "0.9em",
                                                            whiteSpace: "pre",
                                                        }
                                                    },
                                                    "& table": {
                                                        borderCollapse: "collapse",
                                                        width: "100%",
                                                    },
                                                    "& th, & td": {
                                                        border: "1px solid #ddd",
                                                        padding: "8px",
                                                        textAlign: "left",
                                                    },
                                                    "& th": {
                                                        backgroundColor: "#f2f2f2",
                                                        color: "#333",
                                                    },
                                                    "& a": {
                                                        color: "#A07ACD",
                                                    },
                                                    "& p": {
                                                        margin: isChatbot && msg.sender.username === "Ora Chatbot" ? "15px 0" : "0px",
                                                    }
                                                }}
                                            >
                                                {
                                                    msg.content.length > 0 &&
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                                }
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
                                        {msg.sender.id === user?.id && !isChatbot && (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                }}
                                            >
                                                {msg.seen ? (
                                                    <DoneAllIcon
                                                        sx={{
                                                            fontSize: {
                                                                xs: "12px",
                                                                sm: "14px",
                                                            },
                                                            color: "#4CB4DC",
                                                        }}
                                                    />
                                                ) : (
                                                    <DoneAllIcon
                                                        sx={{
                                                            fontSize: {
                                                                xs: "12px",
                                                                sm: "14px",
                                                            },
                                                            color: "#FFFFFF",
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                            {isGeneratingResponse && isChatbot && (
                                <Box
                                    sx={{
                                        px: { xs: 1.5, sm: 2 },
                                        py: 0.5,
                                        position: "relative",
                                        maxWidth: { xs: "70%", sm: "45%" },
                                        alignSelf: "flex-start",
                                        overflow: "hidden"
                                    }}
                                >
                                    <TypingIndicator />
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </>
    );
};
