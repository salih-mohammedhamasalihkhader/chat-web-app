"use client";

import { LogOut, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/chat/theme-toggle";
import { AvatarFallback } from "@/components/chat/avatar-fallback";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";

export function ChatNavbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.replace("/auth");
  };

  return (
    <header className="glass-nav sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/20 px-4 sm:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80">
          Gully Chat
        </p>
        <h1 className="text-lg font-semibold tracking-tight">گوڵێ چات</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-white/20 bg-white/10 px-2.5 backdrop-blur"
          onClick={() => router.push("/profile")}
        >
          <UserCircle2 className="size-4" />
          <span className="hidden sm:inline">Profile</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-white/20 bg-white/10 px-2.5 backdrop-blur"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>

        {user ? (
          <AvatarFallback
            name={user.fullname}
            src={user.profilePic}
            className="size-9 rounded-full border border-white/20"
          />
        ) : null}
      </div>
    </header>
  );
}
