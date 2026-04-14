"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Loader2, LogIn, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store";
import { AuthShell } from "@/components/auth/auth-shell";

export function LoginForm() {
  const router = useRouter();
  const { login, error, clearError, isLoading, user } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user) {
      router.replace("/chat");
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(form);
      router.replace("/chat");
    } catch {
      // Error is handled in store and shown in UI.
    }
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Login to continue your conversations"
      footer={
        <>
          New here?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            Create account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Password"
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
              Logging in...
            </>
          ) : (
            <>
              <LogIn className="mr-2 size-4" />
              Login
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
