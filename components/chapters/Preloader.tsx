"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  "calibrating sensors …",
  "loading 144,000 light curves …",
  "listening to vital signs …",
  "mapping 23,954 papers …",
  "signal lock",
];

/** Sensor-boot choreography → hands off to the hero. */
export default function Preloader() {
  const [line, setLine] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setGone(true);
      return;
    }
    const iv = setInterval(() => {
      setLine((l) => {
        if (l >= BOOT_LINES.length - 1) {
          clearInterval(iv);
          setTimeout(() => setGone(true), 550);
          return l;
        }
        return l + 1;
      });
    }, 420);
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      className={`preloader-exit fixed inset-0 z-[60] flex items-center justify-center bg-space ${
        gone ? "invisible opacity-0" : "opacity-100"
      }`}
      aria-hidden={gone}
    >
      <div className="text-center">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-dim">
          {BOOT_LINES[line]}
        </div>
        <div className="mx-auto mt-4 h-px w-40 overflow-hidden rounded bg-[rgba(232,234,240,0.1)]">
          <div
            className="h-full bg-gradient-to-r from-cyan to-violet transition-all duration-400"
            style={{ width: `${((line + 1) / BOOT_LINES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
