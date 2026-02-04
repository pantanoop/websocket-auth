import { io, Socket } from "socket.io-client";
const URL = process.env.NEXT_PUBLIC_API_URL;

socket: Socket;

export const socket = io(URL, { autoConnect: false });
