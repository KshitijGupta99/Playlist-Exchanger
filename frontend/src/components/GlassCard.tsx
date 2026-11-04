import type { ReactNode } from "react";

export default function GlassCard({
  children,
  className = "",
  strong = false,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
}) {
  return <div className={`glass-card rounded-3xl ${strong ? "glass-card-strong" : ""} ${className}`}>{children}</div>;
}
