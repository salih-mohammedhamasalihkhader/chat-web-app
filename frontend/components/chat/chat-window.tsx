"use client";

import { useEffect, useMemo, useRef } from "react";
import { MessageCircleMore } from "lucide-react";
import { useAuthStore, useChatStore } from "@/store";
import { AvatarFallback } from "@/components/chat/avatar-fallback";
import { MessageBubble } from "@/components/chat/message-bubble";
import { MessageInput } from "@/components/chat/message-input";

export function ChatWindow() {
  const user = useAuthStore((state) => state.user);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const messages = useChatStore((state) => state.messages);
  const isLoadingMessages = useChatStore((state) => state.isLoadingMessages);
  const isSendingMessage = useChatStore((state) => state.isSendingMessage);
  const fetchMessages = useChatStore((state) => state.fetchMessages);
  const sendMessage = useChatStore((state) => state.sendMessage);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedUser?._id) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser?._id, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const emptyState = useMemo(() => {
    if (!selectedUser) {
      return "Select a user from sidebar to start chatting.";
    }
    if (!messages.length && !isLoadingMessages) {
      return "No messages yet. Say hi 👋";
    }
    return "";
  }, [selectedUser, messages.length, isLoadingMessages]);

  if (!selectedUser) {
    return (
      <section className="glass-panel flex h-full flex-1 items-center justify-center">
        <div className="text-center">
          <MessageCircleMore className="mx-auto size-12 text-primary/70" />
          <p className="mt-4 text-sm text-muted-foreground">{emptyState}</p>
        </div>
      </section>
    );
  }

  const onSend = async (payload: { text?: string; image?: string }) => {
    if (!selectedUser?._id) return;
    await sendMessage(selectedUser._id, payload);
  };

  return (
    <section className="glass-panel flex h-full min-h-0 flex-1 flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-white/20 px-4 sm:px-6">
        <AvatarFallback
          name={selectedUser.fullname}
          src={selectedUser.profilePic}
          className="size-10 rounded-full border border-white/20"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {selectedUser.fullname}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {selectedUser.email}
          </p>
        </div>
      </div>

      <div className="scroll-area min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-6">
        {isLoadingMessages ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Loading messages...
          </p>
        ) : messages.length ? (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isMine={message.senderId === user?._id}
            />
          ))
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {emptyState}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={onSend} isSending={isSendingMessage} />
    </section>
  );
}
