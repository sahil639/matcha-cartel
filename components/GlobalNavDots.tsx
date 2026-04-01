"use client";

import { useEffect, useState } from "react";

const TOTAL = 9;

export default function GlobalNavDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY   = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const pct = scrollY / maxScroll;
      setActive(Math.min(Math.floor(pct * TOTAL), TOTAL - 1));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // set initial state
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1000,           // below lockscreen (9999) → hidden during lock phase
        display: "flex",
        flexDirection: "column",
        gap: 3,
        padding: "5px 4px",
      }}
    >
      {Array.from({ length: TOTAL }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 10,
            border: "1px solid rgba(150,165,175,0.55)",
            backgroundColor: i === active ? "#6abf3c" : "transparent",
            transition: "background-color 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}
