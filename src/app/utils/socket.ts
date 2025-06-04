import { io, Socket } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL as string;
export const socket: Socket = io(URL, { autoConnect: false });