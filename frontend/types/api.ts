import { User } from "./user";
import { Message } from "./message";

export interface ApiResponse<T = any> {
    message?: string;
    user?: T;
    users?: T[];
    messages?: T[];
    data?: T;
    error?: string;
}

export interface AuthResponse {
    message: string;
    user: User;
}

export interface MessagesResponse {
    messages: Message[];
}

export interface UsersResponse {
    users: User[];
}
