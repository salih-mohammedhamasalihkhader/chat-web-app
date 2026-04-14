"use client";

import { format } from "date-fns";
import { Message } from "@/types/message";

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl border px-3 py-2 sm:max-w-[70%] ${
          isMine
            ? "border-primary/50 bg-primary/20 text-foreground"
            : "border-white/20 bg-white/10 text-foreground"
        }`}
      >
        {message.text ? (
          <p className="whitespace-pre-wrap text-sm leading-6">
            {message.text}
          </p>
        ) : null}

        {message.image ? (
          <img
            src={message.image}
            alt="message"
            className="mt-2 max-h-72 w-full rounded-xl object-cover"
          />
        ) : null}

        <p className="mt-2 text-[11px] text-muted-foreground">
          {format(new Date(message.createdAt), "hh:mm a")}
        </p>
      </div>
    </div>
  );
}
