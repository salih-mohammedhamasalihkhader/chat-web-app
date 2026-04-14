import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocketUrl = () => {
    if (process.env.NEXT_PUBLIC_SOCKET_URL) {
        return process.env.NEXT_PUBLIC_SOCKET_URL;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    return apiUrl.replace(/\/api\/?$/, "");
};

export const connectSocket = (userId: string) => {
    if (socket?.connected) {
        return socket;
    }

    socket = io(getSocketUrl(), {
        withCredentials: true,
        query: { userId },
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;
