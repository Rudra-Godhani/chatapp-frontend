import { Box, CircularProgress, Typography } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

interface ChatMessageProps {
    messagesContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessage = ({ messagesContainerRef }: ChatMessageProps) => {
    const { activeChat } = useSelector(
        (state: RootState) => state.chat
    );

    const { loading, user } = useSelector((state: RootState) => state.user);

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
                    ) : activeChat?.messages.length === 0 ? (
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
                        activeChat?.messages.map((msg, index) => {
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
                                    {msg.sender.id === user?.id && (
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
                        })
                    )}
                </Box>
            </Box>
        </>
    );
};
