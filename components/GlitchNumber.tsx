"use client";

import { useEffect, useRef, useState } from "react";

// Each character gets its own independent flicker timer so the
// glitch effect applies per-character at random intervals.
function GlitchChar({ char, active }: { char: string; active: boolean }) {
  const [opacity, setOpacity] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) return;

    let running = true;

    function flicker() {
      if (!running) return;

      let count = 0;
      const burstCount = Math.floor(Math.random() * 5) + 3;

      function burst() {
        if (!running || count >= burstCount) {
          setOpacity(1);
          // Each character rests for a different random duration
          const rest = 500 + Math.random() * 2500;
          timerRef.current = setTimeout(flicker, rest);
          return;
        }
        const o = Math.random() > 0.5 ? 0.05 + Math.random() * 0.2 : 1;
        setOpacity(o);
        count++;
        timerRef.current = setTimeout(burst, 30 + Math.random() * 70);
      }

      burst();
    }

    // Stagger start per character
    const delay = Math.random() * 2500;
    timerRef.current = setTimeout(flicker, delay);

    return () => {
      running = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active]);

  return (
    <span style={{ opacity, display: "inline-block" }}>
      {char}
    </span>
  );
}

interface GlitchNumberProps {
  label: string;
  glitch?: boolean;
}

export default function GlitchNumber({ label, glitch = false }: GlitchNumberProps) {
  return (
    <span
      className="font-mono-frag"
      style={{ color: "var(--text)", fontSize: 10, letterSpacing: "0.04em" }}
    >
      {label.split("").map((char, i) => (
        <GlitchChar key={i} char={char} active={glitch} />
      ))}
    </span>
  );
}
