"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AvatarFallback } from "@/components/chat/avatar-fallback";
import { useChatStore } from "@/store";

export function ChatSidebar() {
  const [query, setQuery] = useState("");
  const users = useChatStore((state) => state.users);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const selectUser = useChatStore((state) => state.selectUser);
  const isLoadingUsers = useChatStore((state) => state.isLoadingUsers);

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return users;

    return users.filter((user) =>
      user.fullname.toLowerCase().includes(normalized),
    );
  }, [query, users]);

  return (
    <aside className="glass-panel flex h-full min-h-0 w-full flex-col overflow-hidden border-r border-white/20 lg:max-w-sm">
      <div className="border-b border-white/20 p-4">
        <label className="field-wrap h-11">
          <Search className="field-icon" />
          <input
            className="field-input"
            placeholder="Search users"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <div className="scroll-area min-h-0 flex-1 overflow-y-auto p-2">
        {isLoadingUsers ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            Loading users...
          </p>
        ) : filteredUsers.length ? (
          filteredUsers.map((user) => {
            const isActive = selectedUser?._id === user._id;
            return (
              <button
                key={user._id}
                className={`mb-1 flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  isActive
                    ? "border-primary/40 bg-primary/10"
                    : "border-transparent hover:border-white/25 hover:bg-white/10"
                }`}
                onClick={() => selectUser(user)}
              >
                <AvatarFallback
                  name={user.fullname}
                  src={user.profilePic}
                  className="size-11 rounded-full border border-white/20"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {user.fullname}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            No users found.
          </p>
        )}
      </div>
    </aside>
  );
}
