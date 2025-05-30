// store/slices/chatSlice.ts
import { Chat, Message, User } from "@/app/type/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  selectedUsers: User[];
  activeChatUser: User | null;
  activeChat: Chat | null;
  messages: Message[];
}

const initialState: ChatState = {
  selectedUsers: [],
  activeChatUser: null,
  activeChat: null,
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedUsers(state, action: PayloadAction<User>) {
      if (!state.selectedUsers.some((user) => user.email === action.payload.email)) {
        state.selectedUsers.push(action.payload);
      }
    },

    setActiveChatUser(state, action: PayloadAction<User | null>) {
      state.activeChatUser = action.payload;
    },

    setActiveChat(state, action: PayloadAction<{ chat: Chat | null; currentUserId: string }>) {
      if (action.payload.chat) {
        state.activeChat = action.payload.chat;
        state.activeChatUser = action.payload.chat.user1.id === action.payload.currentUserId 
          ? action.payload.chat.user2 
          : action.payload.chat.user1;
        state.messages = action.payload.chat.messages || [];
      } else {
        state.activeChatUser = null;
        state.messages = [];
      }
    },

    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },

    updateActiveChatUserStatus: (state, action: PayloadAction<{ userId: string; online: boolean }>) => {
      if (state.activeChatUser?.id === action.payload.userId) {
        state.activeChatUser = { ...state.activeChatUser, online: action.payload.online };
      }
      
      // Update status in activeChat if it exists
      if (state.activeChat) {
        if (state.activeChat.user1.id === action.payload.userId) {
          state.activeChat = {
            ...state.activeChat,
            user1: { ...state.activeChat.user1, online: action.payload.online }
          };
        } else if (state.activeChat.user2.id === action.payload.userId) {
          state.activeChat = {
            ...state.activeChat,
            user2: { ...state.activeChat.user2, online: action.payload.online }
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
  updateActiveChatUserStatus,
  resetChatState 
} = chatSlice.actions;

export default chatSlice.reducer;