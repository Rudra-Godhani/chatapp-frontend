import { Chat, Message, User } from "@/app/type/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
    selectedUsers: User[];
    activeChatUser: User | null;
    activeChat: Chat | null;
    isTyping: boolean;
    isGeneratingResponse: boolean;
}

const initialState: ChatState = {
    selectedUsers: [],
    activeChatUser: null,
    activeChat: null,
    isTyping: false,
    isGeneratingResponse: false,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSelectedUsers(state, action: PayloadAction<User>) {
            if (
                !state.selectedUsers.some(
                    (user) => user.email === action.payload.email
                )
            ) {
                state.selectedUsers.push(action.payload);
            }
        },

        setActiveChatUser(state, action: PayloadAction<User | null>) {
            state.activeChatUser = action.payload;
        },

        setActiveChat(
            state,
            action: PayloadAction<{ chat: Chat | null; currentUserId: string }>
        ) {
            if (action.payload.chat) {
                state.activeChat = action.payload.chat;
                state.activeChatUser =
                    action.payload.chat.user1.id ===
                    action.payload.currentUserId
                        ? action.payload.chat.user2
                        : action.payload.chat.user1;
            } else {
                state.activeChatUser = null;
            }
        },

        addMessage: (state, action: PayloadAction<Message>) => {
            if (state.activeChat && state.activeChat.id === action.payload.chat.id) {
                if (!state.activeChat.messages) {
                    state.activeChat.messages = [];
                }
                const existingMessageIndex = state.activeChat.messages.findIndex(
                    (msg) => msg.id === action.payload.id
                );
                if (existingMessageIndex !== -1) {
                    state.activeChat.messages[existingMessageIndex] = action.payload;
                } else {
                    state.activeChat.messages.push(action.payload);
                }
            }
        },

        updateAIMessage: (state, action: PayloadAction<{ content: string }>) => {
            if (state.activeChat && state.activeChat.messages) {
                const lastMessage = state.activeChat.messages[state.activeChat.messages.length - 1];
                if (lastMessage && lastMessage.sender.id === "chatbot") {
                    lastMessage.content += action.payload.content;
                }
            }
        },

        setTyping: (state, action: PayloadAction<boolean>) => {
            state.isTyping = action.payload;
        },

        setGeneratingResponse: (state, action: PayloadAction<boolean>) => {
            state.isGeneratingResponse = action.payload;
        },

        updateActiveChatUserStatus: (
            state,
            action: PayloadAction<{ userId: string; online: boolean }>
        ) => {
            if (state.activeChatUser?.id === action.payload.userId) {
                state.activeChatUser = {
                    ...state.activeChatUser,
                    online: action.payload.online,
                };
            }

            if (state.activeChat) {
                if (state.activeChat.user1.id === action.payload.userId) {
                    state.activeChat = {
                        ...state.activeChat,
                        user1: {
                            ...state.activeChat.user1,
                            online: action.payload.online,
                        },
                    };
                } else if (
                    state.activeChat.user2.id === action.payload.userId
                ) {
                    state.activeChat = {
                        ...state.activeChat,
                        user2: {
                            ...state.activeChat.user2,
                            online: action.payload.online,
                        },
                    };
                }
            }
        },

        resetChatState: () => {
            return initialState;
        },
    },
});

export const {
    setSelectedUsers,
    setActiveChatUser,
    setActiveChat,
    addMessage,
    updateAIMessage,
    setTyping,
    setGeneratingResponse,
    updateActiveChatUserStatus,
    resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
