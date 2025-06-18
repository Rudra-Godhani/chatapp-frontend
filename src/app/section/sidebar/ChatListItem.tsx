import { Box, Typography, Avatar, Badge } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Chat, Message, User } from "@/app/type/type";
import { formatMessageTimestamp } from "@/app/utils/formatMessageTimestamp";
import { getInitials } from "@/app/utils/getInitials";

interface ChatListItemProps {
    otherUser: User;
    user: User | null;
    activeChat: Chat | null;
    userChat: Chat | undefined;
    onSelectUser: (user: User) => void;
}

const ChatListItem = ({
    otherUser,
    user,
    activeChat,
    userChat,
    onSelectUser,
}: ChatListItemProps) => {
    const unseenMessageCount =
        userChat?.messages.filter(
            (msg: Message) => msg.seen === false && msg.sender.id !== user?.id
        ).length || 0;

    const latestMessage = userChat?.messages?.[userChat.messages.length - 1];
    const timestampLabel = formatMessageTimestamp(latestMessage?.createdAt);

    return (
        <Box
            sx={{
                mt: 1,
                p: 2,
                borderRadius: 2,
                bgcolor:
                    activeChat &&
                    ((activeChat.user1.id === user?.id &&
                        activeChat.user2.id === otherUser.id) ||
                        (activeChat.user1.id === otherUser.id &&
                            activeChat.user2.id === user?.id))
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
            onClick={() => onSelectUser(otherUser)}
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
                            justifyContent: "space-between",
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
                            justifyContent: "space-between",
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
                            {latestMessage?.sender?.id === user?.id && (
                                <Box>
                                    {latestMessage?.seen ? (
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
                            <Typography
                                sx={{
                                    color: "#B0B3B8",
                                    fontSize: {
                                        xs: "12px",
                                        sm: "14px",
                                    },
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                                title={
                                    latestMessage?.content || "No messages yet"
                                }
                            >
                                {latestMessage?.content || "No messages yet"}
                            </Typography>
                        </Box>
                        {unseenMessageCount > 0 && (
                            <Box
                                sx={{
                                    pr: "10px",
                                }}
                            >
                                <Badge
                                    badgeContent={unseenMessageCount}
                                    sx={{
                                        "& .MuiBadge-badge": {
                                            backgroundColor: "#1DAA61",
                                            color: "#000000",
                                            fontSize: "10px",
                                            minWidth: "18px",
                                            height: "18px",
                                            borderRadius: "50%",
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
};

export default ChatListItem; 