"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Loader2, UserPlus, Mail, Lock, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store";
import { AuthShell } from "@/components/auth/auth-shell";

export function RegisterForm() {
  const router = useRouter();
  const { register, error, clearError, isLoading, user } = useAuthStore();

  const [form, setForm] = useState({ fullname: "", email: "", password: "" });

  useEffect(() => {
    if (user) {
      router.replace("/chat");
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await register(form);
      router.replace("/chat");
    } catch {
      // Error is handled in store and shown in UI.
    }
  };

  return (
    <AuthShell
      title="Create Account"
      subtitle="Start your secure chat journey with Gully Chat"
      footer={
        <>
          Already have account?{" "}
          <Link
            href="/auth"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="field-wrap">
          <UserRound className="field-icon" />
          <input
            className="field-input"
            type="text"
            placeholder="Full name"
            required
            value={form.fullname}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, fullname: e.target.value }))
            }
            onFocus={clearError}
          />
        </label>

        <label className="field-wrap">
          <Mail className="field-icon" />
          <input
            className="field-input"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            onFocus={clearError}
          />
        </label>

        <label className="field-wrap">
          <Lock className="field-icon" />
          <input
            className="field-input"
            type="password"
            placeholder="Password (min 6 chars)"
            required
            minLength={6}
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            onFocus={clearError}
          />
        </label>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-primary text-primary-foreground"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 size-4" />
              Register
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
