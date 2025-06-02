export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    profileImage: {
        public_id: string;
        url: string;
    };
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
