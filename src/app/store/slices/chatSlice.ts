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

    clearSelectedUsers(state) {
      state.selectedUsers = [];
      state.activeChatUser = null;
      state.activeChat = null;
      state.messages = [];
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

    resetChatState: () => {
      return initialState;
    },
  },
});

export const { 
  setSelectedUsers, 
  clearSelectedUsers, 
  setActiveChatUser, 
  setActiveChat, 
  addMessage,
  resetChatState 
} = chatSlice.actions;

export default chatSlice.reducer;