"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

/** Button/link that leans toward the cursor — the award-site staple. */
export default function MagneticButton({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  };

  return (
    <a
      ref={ref}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={
        "inline-block rounded-full px-6 py-3 font-medium transition-[transform,background,box-shadow] duration-200 ease-out will-change-transform " +
        (primary
          ? "bg-gradient-to-r from-cyan to-violet text-space shadow-[0_0_32px_rgba(34,211,238,0.35)] hover:shadow-[0_0_48px_rgba(139,92,246,0.5)]"
          : "glass text-ink hover:bg-[rgba(232,234,240,0.07)]")
      }
    >
      {children}
    </a>
  );
}
