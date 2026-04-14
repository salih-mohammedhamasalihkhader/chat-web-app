"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    if (isCheckingAuth) return;
    router.replace(user ? "/chat" : "/auth");
  }, [router, user, isCheckingAuth]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Preparing your chat...</p>
    </div>
  );
}
