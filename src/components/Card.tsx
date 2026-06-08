import type { ReactNode } from "react";

/** Surface container. Optional title rendered in the display face above the content. */
export default function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface p-4 ${className}`}
    >
      {title ? (
        <h3 className="mb-3 font-display text-sm font-medium tracking-wide text-fg">
          {title}
        </h3>
      ) : null}
      {children}
    </div>
  );
}
