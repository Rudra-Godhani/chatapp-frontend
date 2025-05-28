import { io, Socket } from "socket.io-client";

console.log("socket file:", process.env.NEXT_PUBLIC_BACKEND_BASE_URL);
const URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL as string;
export const socket: Socket = io(URL);