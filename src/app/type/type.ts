export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    online: boolean;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Message{
    id:string;
    chat: Chat;
    sender: User;
    content: string;
    seen: boolean;
    createdAt: Date;
}

export interface Chat {
    id: string;
    user1: User;
    user2: User;
    messages: Message[];
}

export type RegisterResponse = { user: User; message: string };
export type LoginResponse = { user: User; message: string };
export type GetAllUsersResponse = { users: User[] };
export type GetUserChatsResponse = { chats: Chat[] };
export type StartChatResponse = { 
    success: boolean;
    chat: Chat;
    message: string;
};
export type GetUserResponse = { user: User };
export type LogoutResponse = { message: string };

export type ApiResponse =
    | RegisterResponse
    | LoginResponse
    | GetAllUsersResponse
    | GetUserChatsResponse
    | StartChatResponse
    | GetUserResponse
    | LogoutResponse;