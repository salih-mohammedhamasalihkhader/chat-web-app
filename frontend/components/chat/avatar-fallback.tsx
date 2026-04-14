"use client";

import { useEffect, useMemo, useState } from "react";

interface AvatarFallbackProps {
  name: string;
  src?: string;
  className?: string;
}

export function AvatarFallback({
  name,
  src,
  className = "",
}: AvatarFallbackProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const safeSrc = useMemo(() => {
    if (typeof src !== "string") return "";

    const trimmed = src.trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") {
      return "";
    }

    return trimmed;
  }, [src]);

  useEffect(() => {
    setHasImageError(false);
  }, [safeSrc]);

  if (safeSrc && !hasImageError) {
    return (
      <img
        src={safeSrc}
        alt={name}
        className={`object-cover ${className}`}
        loading="lazy"
        onError={() => setHasImageError(true)}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-primary/80 text-xs font-semibold text-primary-foreground ${className}`}
    >
      {initials}
    </div>
  );
}
