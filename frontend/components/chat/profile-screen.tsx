"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AvatarFallback } from "@/components/chat/avatar-fallback";
import { useAuthStore } from "@/store";

export function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [image, setImage] = useState<string | undefined>();

  useEffect(() => {
    if (!isCheckingAuth && !user) {
      router.replace("/auth");
    }
  }, [isCheckingAuth, user, router]);

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(typeof reader.result === "string" ? reader.result : undefined);
    };
    reader.readAsDataURL(file);
  };

  const onSave = async () => {
    if (!image) return;

    await updateProfile({ profilePic: image });
    setImage(undefined);
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="chat-bg min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/chat"
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to chat
        </Link>

        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your avatar
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            <AvatarFallback
              name={user.fullname}
              src={image || user.profilePic}
              className="size-28 rounded-full border border-white/20"
            />

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur hover:bg-white/20">
              <Upload className="size-4" />
              Choose photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageChange}
              />
            </label>

            <div className="text-center text-sm">
              <p className="font-medium">{user.fullname}</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>

            <Button
              onClick={onSave}
              disabled={!image || isLoading}
              className="mt-2 rounded-full bg-primary px-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
