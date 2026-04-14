import { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
        <div className="grid-overlay" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-6">
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium tracking-[0.3em] text-primary/80">
              GULLY CHAT
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          {footer}
        </div>
      </div>
    </div>
  );
}
