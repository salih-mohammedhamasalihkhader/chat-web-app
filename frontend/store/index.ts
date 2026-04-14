import { create } from "zustand";
import { User, AuthUser } from "@/types/user";
import { Message } from "@/types/message";
import { authAPI, messagesAPI } from "@/lib/api/client";

const normalizeProfilePic = (value: unknown): string | undefined => {
    if (typeof value !== "string") return undefined;

    const trimmedValue = value.trim();
    if (!trimmedValue || trimmedValue === "null" || trimmedValue === "undefined") {
        return undefined;
    }

    return trimmedValue;
};

const normalizeUser = <T extends Record<string, any>>(user: T | null | undefined): T | null => {
    if (!user) return null;

    const profilePic = normalizeProfilePic(
        user.profilePic ?? user.profilepic ?? user.avatar ?? user.avatarUrl,
    );

    return {
        ...user,
        profilePic,
    };
};

interface AuthStore {
    user: AuthUser | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    error: string | null;

    register: (data: { fullname: string; email: string; password: string }) => Promise<void>;
    login: (data: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    updateProfile: (data: { profilePic: string }) => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isLoading: false,
    isCheckingAuth: false,
    error: null,

    register: async (data) => {
        try {
            set({ isLoading: true, error: null });
            const response = await authAPI.register(data);
            set({ user: normalizeUser(response.data.user) as AuthUser | null, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "خرابی ڕویدا",
                isLoading: false
            });
            throw error;
        }
    },

    login: async (data) => {
        try {
            set({ isLoading: true, error: null });
            const response = await authAPI.login(data);
            set({ user: normalizeUser(response.data.user) as AuthUser | null, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "خرابی ڕویدا",
                isLoading: false
            });
            throw error;
        }
    },

    logout: async () => {
        try {
            set({ isLoading: true });
            await authAPI.logout();
            set({ user: null, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "خرابی ڕویدا",
                isLoading: false
            });
        }
    },

    checkAuth: async () => {
        try {
            set({ isCheckingAuth: true });
            const response = await authAPI.checkAuth();
            set({ user: normalizeUser(response.data.user) as AuthUser | null, isCheckingAuth: false });
        } catch (error) {
            set({ user: null, isCheckingAuth: false });
        }
    },

    updateProfile: async (data) => {
        try {
            set({ isLoading: true, error: null });
            const response = await authAPI.updateProfile(data);
            set({ user: normalizeUser(response.data.user) as AuthUser | null, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "خرابی ڕویدا",
                isLoading: false
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));

interface ChatStore {
    users: User[];
    selectedUser: User | null;
    messages: Message[];
    isLoadingUsers: boolean;
    isLoadingMessages: boolean;
    isSendingMessage: boolean;
    error: string | null;

    fetchUsers: () => Promise<void>;
    selectUser: (user: User) => void;
    fetchMessages: (userId: string) => Promise<void>;
    sendMessage: (userId: string, data: { text?: string; image?: string }) => Promise<Message | undefined>;
    addMessage: (message: Message) => void;
    setMessages: (messages: Message[]) => void;
    clearError: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    users: [],
    selectedUser: null,
    messages: [],
    isLoadingUsers: false,
    isLoadingMessages: false,
    isSendingMessage: false,
    error: null,

    fetchUsers: async () => {
        try {
            set({ isLoadingUsers: true, error: null });
            const response = await messagesAPI.getUsers();
            const users = Array.isArray(response.data.users)
                ? response.data.users.map((user: User) => normalizeUser(user) as User)
                : [];

            set({ users, isLoadingUsers: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "خرابی ڕویدا",
                isLoadingUsers: false
            });
        }
    },

    selectUser: (user) => set({ selectedUser: user }),

    fetchMessages: async (userId) => {
        try {
            set({ isLoadingMessages: true, error: null });
            const response = await messagesAPI.getMessages(userId);
            set({ messages: response.data.messages, isLoadingMessages: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "خرابی ڕویدا",
                isLoadingMessages: false
            });
        }
    },

    sendMessage: async (userId, data) => {
        try {
            set({ isSendingMessage: true, error: null });
            const response = await messagesAPI.sendMessage(userId, data);
            const createdMessage = response.data?.newMessage as Message | undefined;

            if (createdMessage) {
                set((state) => {
                    const exists = state.messages.some((message) => message._id === createdMessage._id);
                    if (exists) {
                        return { isSendingMessage: false };
                    }

                    return {
                        isSendingMessage: false,
                        messages: [...state.messages, createdMessage],
                    };
                });
                return createdMessage;
            }

            set({ isSendingMessage: false });
            return undefined;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "خرابی ڕویدا",
                isSendingMessage: false
            });
            throw error;
        }
    },

    addMessage: (message) =>
        set((state) => {
            const exists = state.messages.some((item) => item._id === message._id);
            if (exists) {
                return state;
            }

            return { messages: [...state.messages, message] };
        }),

    setMessages: (messages) => set({ messages }),

    clearError: () => set({ error: null }),
}));
