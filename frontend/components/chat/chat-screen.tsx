"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useChatStore } from "@/store";
import { ChatNavbar } from "@/components/chat/chat-navbar";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatWindow } from "@/components/chat/chat-window";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import { Message } from "@/types/message";

export function ChatScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const fetchUsers = useChatStore((state) => state.fetchUsers);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const addMessage = useChatStore((state) => state.addMessage);

  useEffect(() => {
    if (!isCheckingAuth && !user) {
      router.replace("/auth");
    }
  }, [isCheckingAuth, user, router]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  useEffect(() => {
    if (!user?._id) return;

    const socket = connectSocket(user._id);
    const onReceiveMessage = (incomingMessage: Message) => {
      if (!selectedUser?._id) return;

      const isForCurrentChat =
        (incomingMessage.senderId === selectedUser._id &&
          incomingMessage.receiverId === user._id) ||
        (incomingMessage.senderId === user._id &&
          incomingMessage.receiverId === selectedUser._id);

      if (isForCurrentChat) {
        addMessage(incomingMessage);
      }
    };

    socket.on("receiveMessage", onReceiveMessage);

    return () => {
      socket.off("receiveMessage", onReceiveMessage);
    };
  }, [user?._id, selectedUser?._id, addMessage]);

  useEffect(() => {
    return () => {
      const socket = getSocket();
      if (socket) {
        disconnectSocket();
      }
    };
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="chat-bg relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="blob blob-a" />
        <div className="blob blob-c" />
        <div className="grid-overlay" />
      </div>

      <div className="relative z-10 flex h-screen min-h-0 flex-col">
        <ChatNavbar />
        <main className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 sm:gap-4 sm:p-4 lg:grid-cols-[22rem_1fr]">
          <ChatSidebar />
          <ChatWindow />
        </main>
      </div>
    </div>
  );
}
