"use client";

import { useEffect, useRef, useState } from "react";

interface GlitchNumberProps {
  label: string;
  glitch?: boolean;
}

export default function GlitchNumber({ label, glitch = false }: GlitchNumberProps) {
  const [opacity, setOpacity] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!glitch) return;

    let running = true;

    function flicker() {
      if (!running) return;

      // rapid flicker burst
      let count = 0;
      const burstCount = Math.floor(Math.random() * 6) + 4;

      function burst() {
        if (!running || count >= burstCount) {
          setOpacity(1);
          // rest 0.8–1.8 seconds
          const rest = 800 + Math.random() * 1000;
          timerRef.current = setTimeout(flicker, rest);
          return;
        }
        const o = Math.random() > 0.5 ? 0.08 + Math.random() * 0.15 : 1;
        setOpacity(o);
        count++;
        timerRef.current = setTimeout(burst, 40 + Math.random() * 60);
      }

      burst();
    }

    // stagger start per element
    const delay = Math.random() * 1500;
    timerRef.current = setTimeout(flicker, delay);

    return () => {
      running = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [glitch]);

  return (
    <span
      className="font-mono-frag"
      style={{ opacity, color: "var(--text)", fontSize: 10, letterSpacing: "0.04em" }}
    >
      {label}
    </span>
  );
}
