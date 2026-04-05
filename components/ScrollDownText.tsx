"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "(scroll down)".split("");

function GlitchChar({ char, delay }: { char: string; delay: number }) {
  const [opacity, setOpacity] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (char === " ") return;

    let running = true;

    function flicker() {
      if (!running) return;
      let count = 0;
      const burstCount = Math.floor(Math.random() * 5) + 3;

      function burst() {
        if (!running || count >= burstCount) {
          setOpacity(1);
          const rest = 1200 + Math.random() * 2000;
          timerRef.current = setTimeout(flicker, rest);
          return;
        }
        setOpacity(Math.random() > 0.5 ? 0.05 + Math.random() * 0.2 : 1);
        count++;
        timerRef.current = setTimeout(burst, 35 + Math.random() * 55);
      }

      burst();
    }

    timerRef.current = setTimeout(flicker, delay + Math.random() * 800);

    return () => {
      running = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [char, delay]);

  return (
    <span style={{ opacity, display: "inline-block" }}>
      {char === " " ? "\u00A0" : char}
    </span>
  );
}

export default function ScrollDownText() {
  return (
    <span className="font-mono-frag tracking-widest" style={{ color: "var(--text)", fontSize: 14 }}>
      {CHARS.map((ch, i) => (
        <GlitchChar key={i} char={ch} delay={i * 120} />
      ))}
    </span>
  );
}
