import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { AppDispatch } from "../store";
import { Chat, User } from "@/app/type/type";
import { BASE_URL } from "@/app/constants/const";
import { resetChatState } from "./chatSlice";

// Define response types for each API call
type RegisterResponse = { user: User; message: string };
type LoginResponse = { user: User; message: string };
type GetAllUsersResponse = { users: User[] };
type GetUserChatsResponse = { chats: Chat[] };
type StartChatResponse = { chats: Chat[] };
type GetUserResponse = { user: User };
type LogoutResponse = { message: string };

// Union type for all possible API responses
type ApiResponse =
    | RegisterResponse
    | LoginResponse
    | GetAllUsersResponse
    | GetUserChatsResponse
    | StartChatResponse
    | GetUserResponse
    | LogoutResponse;

interface AuthState {
    loading: boolean;
    isAuthenticated: boolean;
    user: User | null;
    users: User[] | [];
    chats: Chat[] | [];
    error: string | null;
    message: string | null;
}

const initialState: AuthState = {
    loading: false,
    isAuthenticated: false,
    user: null,
    users: [],
    chats: [],
    error: null,
    message: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        registerRequest: (state) => {
            state.loading = true;
        },
        registerSuccess: (
            state,
            action: PayloadAction<{
                user: User;
                message: string;
            }>
        ) => {
            state.loading = false;
            state.user = action.payload.user;
            state.message = action.payload.message;
        },
        registerFailed: (state, action: PayloadAction<{ message: string }>) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        loginRequest: (state) => {
            state.loading = true;
        },
        loginSuccess: (
            state,
            action: PayloadAction<{
                user: User;
                message: string;
            }>
        ) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.message = action.payload.message;
        },
        loginFailed: (state, action: PayloadAction<{ message: string }>) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload.message;
        },
        fetchAllUserRequest: (state) => {
            state.loading = true;
        },
        fetchAllUserSuccess: (
            state,
            action: PayloadAction<{
                users: User[];
            }>
        ) => {
            state.loading = false;
            state.users = action.payload.users;
        },
        fetchAllUserFailed: (
            state,
            action: PayloadAction<{ message: string }>
        ) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        fetchUserChatsRequest: (state) => {
            state.loading = true;
        },
        fetchUserChatsSuccess: (
            state,
            action: PayloadAction<{ chats: Chat[] }>
        ) => {
            state.loading = false;
            state.chats = action.payload.chats;
        },
        fetchUserChatsFailed: (
            state,
            action: PayloadAction<{ message: string }>
        ) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        fetchUserRequest: (state) => {
            state.loading = true;
        },
        fetchUserSuccess: (
            state,
            action: PayloadAction<{
                user: User;
            }>
        ) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        fetchUserFailed: (state, action: PayloadAction<{
            message: string
        }>) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload.message;
        },
        logoutRequest: (state) => {
            state.loading = true;
        },
        logoutSuccess: (
            state,
            action: PayloadAction<{
                message: string;
            }>
        ) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.chats = [];
            state.message = action.payload.message;
        },
        logoutFailed: (state, action: PayloadAction<{ message: string }>) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        updateUserStatus: (
            state,
            action: PayloadAction<{ userId: string; online: boolean }>
        ) => {
            state.users = state.users.map((user) =>
                user.id === action.payload.userId
                    ? { ...user, online: action.payload.online }
                    : user
            );

            state.chats = state.chats.map((chat) => ({
                ...chat,
                user1:
                    chat.user1.id === action.payload.userId
                        ? { ...chat.user1, online: action.payload.online }
                        : chat.user1,
                user2:
                    chat.user2.id === action.payload.userId
                        ? { ...chat.user2, online: action.payload.online }
                        : chat.user2,
            }));
        },
        clearAllUserErrorsAndMsgs(state) {
            state.message = null;
            state.error = null;
        },
    },
});

// Updated handleApiCall with generic type
const handleApiCall = async <T extends ApiResponse>(
    dispatch: AppDispatch,
    requestAction: () => AnyAction,
    successAction: (data: T) => AnyAction,
    failureAction: (data: { message: string }) => AnyAction,
    apiCall: () => Promise<{ data: T }>
) => {
    dispatch(requestAction());
    try {
        const response = await apiCall();
        dispatch(successAction(response.data));
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        dispatch(
            failureAction({
                message:
                    err.response?.data?.message ||
                    "Something went wrong. Please try again.",
            })
        );
    }
};

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export const register =
    (data: RegisterData) => async (dispatch: AppDispatch) => {
        console.log("register 1");
        console.log(BASE_URL);
        await handleApiCall<RegisterResponse>(
            dispatch,
            userSlice.actions.registerRequest,
            userSlice.actions.registerSuccess,
            userSlice.actions.registerFailed,
            () =>
                axios.post(`${BASE_URL}/user/register`, data, {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                })
        );
    };

interface LoginData {
    email: string;
    password: string;
}

export const login = (data: LoginData) => async (dispatch: AppDispatch) => {
    await handleApiCall<LoginResponse>(
        dispatch,
        userSlice.actions.loginRequest,
        userSlice.actions.loginSuccess,
        userSlice.actions.loginFailed,
        () =>
            axios.post(`${BASE_URL}/user/login`, data, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            })
    );
};

export const getAllUsers = () => async (dispatch: AppDispatch) => {
    await handleApiCall<GetAllUsersResponse>(
        dispatch,
        userSlice.actions.fetchAllUserRequest,
        userSlice.actions.fetchAllUserSuccess,
        userSlice.actions.fetchAllUserFailed,
        () =>
            axios.get(`${BASE_URL}/user/getallusers`, {
                withCredentials: true,
            })
    );
};

export const getUserChats =
    (userId: string) => async (dispatch: AppDispatch) => {
        await handleApiCall<GetUserChatsResponse>(
            dispatch,
            userSlice.actions.fetchUserChatsRequest,
            userSlice.actions.fetchUserChatsSuccess,
            userSlice.actions.fetchUserChatsFailed,
            () =>
                axios.get(`${BASE_URL}/chat/user/${userId}`, {
                    withCredentials: true,
                })
        );
    };

export const startChat =
    (userId1: string, userId2: string) => async (dispatch: AppDispatch) => {
        await handleApiCall<StartChatResponse>(
            dispatch,
            userSlice.actions.fetchUserChatsRequest,
            (data) => {
                dispatch(getUserChats(userId1));
                return userSlice.actions.fetchUserChatsSuccess({ chats: data.chats });
            },
            userSlice.actions.fetchUserChatsFailed,
            () =>
                axios.post(
                    `${BASE_URL}/chat/start`,
                    { userId1, userId2 },
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                )
        );
    };

export const getUser = () => async (dispatch: AppDispatch) => {
    await handleApiCall<GetUserResponse>(
        dispatch,
        userSlice.actions.fetchUserRequest,
        userSlice.actions.fetchUserSuccess,
        userSlice.actions.fetchUserFailed,
        () =>
            axios.get(`${BASE_URL}/user/getuser`, {
                withCredentials: true,
            })
    );
};

export const updateUserStatus =
    (userId: string, online: boolean) => (dispatch: AppDispatch) => {
        dispatch(userSlice.actions.updateUserStatus({ userId, online }));
    };

export const logout = () => async (dispatch: AppDispatch) => {
    await handleApiCall<LogoutResponse>(
        dispatch,
        userSlice.actions.logoutRequest,
        (data) => {
            dispatch(resetChatState());
            return userSlice.actions.logoutSuccess(data);
        },
        userSlice.actions.logoutFailed,
        () =>
            axios.get(`${BASE_URL}/user/logout`, {
                withCredentials: true,
            })
    );
};

export const clearAllUserErrorsAndMessages = () => (dispatch: AppDispatch) => {
    dispatch(userSlice.actions.clearAllUserErrorsAndMsgs());
};

export default userSlice.reducer;