"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { ImagePlus, SendHorizontal, Smile, X } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  onSend: (payload: { text?: string; image?: string }) => Promise<void>;
  isSending: boolean;
}

export function MessageInput({ onSend, isSending }: MessageInputProps) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [showEmoji, setShowEmoji] = useState(false);

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(typeof reader.result === "string" ? reader.result : undefined);
    };
    reader.readAsDataURL(file);
  };

  const submitMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    await onSend({ text: text.trim() || undefined, image });
    setText("");
    setImage(undefined);
    setShowEmoji(false);
  };

  const onEmoji = (emojiData: EmojiClickData) => {
    setText((prev) => `${prev}${emojiData.emoji}`);
  };

  return (
    <div className="border-t border-white/20 p-3 sm:p-4">
      {image ? (
        <div className="mb-3 flex items-start gap-3 rounded-xl border border-white/20 bg-white/5 p-2">
          <img
            src={image}
            alt="preview"
            className="h-16 w-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Image ready to send</p>
          </div>
          <button
            className="rounded-full p-1 text-muted-foreground hover:bg-white/10"
            onClick={() => setImage(undefined)}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      <form
        onSubmit={submitMessage}
        className="relative flex items-center gap-2"
      >
        <button
          type="button"
          className="rounded-full border border-white/20 bg-white/10 p-2.5 backdrop-blur hover:bg-white/20"
          onClick={() => setShowEmoji((prev) => !prev)}
        >
          <Smile className="size-4" />
        </button>

        <label className="rounded-full border border-white/20 bg-white/10 p-2.5 backdrop-blur hover:bg-white/20">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
          />
          <ImagePlus className="size-4" />
        </label>

        <input
          className="h-11 flex-1 rounded-full border border-white/20 bg-white/10 px-4 text-sm outline-none backdrop-blur placeholder:text-muted-foreground"
          placeholder="Write your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Button
          type="submit"
          size="icon"
          className="h-11 w-11 rounded-full bg-primary text-primary-foreground"
          disabled={isSending || (!text.trim() && !image)}
        >
          <SendHorizontal className="size-4" />
        </Button>

        {showEmoji ? (
          <div className="absolute bottom-14 left-0 z-20">
            <EmojiPicker lazyLoadEmojis onEmojiClick={onEmoji} />
          </div>
        ) : null}
      </form>
    </div>
  );
}
