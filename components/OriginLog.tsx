"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import NavDots from "./NavDots";

const LIME = "#8dff00";

// ─── Per-letter glitch (same pattern as ScrollDownText) ───────────────────────

function GlitchChar({ char, delay, color }: { char: string; delay: number; color: string }) {
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
          timerRef.current = setTimeout(flicker, 1200 + Math.random() * 2000);
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
    <span style={{ opacity, display: "inline-block", color }}>
      {char === " " ? "\u00A0" : char}
    </span>
  );
}

function GlitchLabel({ text, color }: { text: string; color: string }) {
  return (
    <span className="font-mono-frag" style={{ fontSize: 11, letterSpacing: "0.04em" }}>
      {text.split("").map((ch, i) => (
        <GlitchChar key={i} char={ch} delay={i * 110} color={color} />
      ))}
    </span>
  );
}

// ─── Card data ────────────────────────────────────────────────────────────────

interface CardData {
  id: string;
  era: string;
  title: string;
  subtitle: string;
  body: string[];
  fig: string;
  figLabel: string;
  bg: string;
  color: string;
  width: number;
  height: number;
  initialX: number;
  initialY: number;
  rotation: number;
  initialZ: number;
  landscape?: boolean;
  horizontalImage?: string; // card 01: right-side image path
}

const CARDS: CardData[] = [
  {
    id: "01",
    era: "Tang-Song Dynasty",
    title: "FIRST CONTACT",
    subtitle: "Tang-Song Dynasty China (7th\u201313th c.)",
    body: [
      "Powdered tea techniques originated in China.",
      "Tea leaves were steamed, dried, and ground for direct consumption.",
      "This form predates matcha.",
    ],
    fig: "FIG. 01",
    figLabel: "DRIED\nTEA LEAF",
    bg: "#3c4a1a",
    color: "#a8c050",
    width: 380,
    height: 560,
    initialX: 310,
    initialY: 70,
    rotation: 0,
    initialZ: 5,
    horizontalImage: "/images/matcha-dust-sketch.png",
  },
  {
    id: "02",
    era: "12th Century",
    title: "METHOD TRANSFER",
    subtitle: "12th Century",
    body: [
      "Zen monks returned with tea seeds and methods.",
      "Knowledge transferred through monasteries.",
      "Cultivation began under regulated conditions.",
    ],
    fig: "FIG. 02",
    figLabel: "MATCHA TEA SEEDS",
    bg: "#2e3c10",
    color: "#90a830",
    width: 360,
    height: 540,
    initialX: 55,
    initialY: 190,
    rotation: -1,
    initialZ: 3,
  },
  {
    id: "03",
    era: "Kamakura-Muromachi",
    title: "FORMALIZATION",
    subtitle: "Kamakura-Muromachi Periods",
    body: [],
    fig: "FIG. 03",
    figLabel: "STONE GRINDER",
    bg: "#c4ccd4",
    color: "#2a3038",
    width: 340,
    height: 500,
    initialX: 18,
    initialY: 32,
    rotation: -0.5,
    initialZ: 2,
  },
  {
    id: "04",
    era: "Zen & Tea Ceremony",
    title: "",
    subtitle: "",
    body: [],
    fig: "FIG. 04",
    figLabel: "CHASEN (MATCHA WHISK)",
    bg: "#7a8c9e",
    color: "#d0dce8",
    width: 650,
    height: 280,
    initialX: 170,
    initialY: 555,
    rotation: 0,
    initialZ: 1,
    landscape: true,
  },
  {
    id: "05",
    era: "Early Modern Japan",
    title: "CONTROLLED\nCULTIVATION",
    subtitle: "Early Modern Japan",
    body: [
      "Production consolidated into specific regions.",
      "Uji established long-term quality standards.",
      "Origin and grade became traceable.",
    ],
    fig: "FIG. 05",
    figLabel: "",
    bg: "#8fc010",
    color: "#1a2c00",
    width: 340,
    height: 520,
    initialX: 670,
    initialY: 60,
    rotation: 0,
    initialZ: 4,
  },
];

// ─── Card content ─────────────────────────────────────────────────────────────

function CardContent({ card }: { card: CardData }) {
  const mono = "font-mono-frag";

  // ── Card 01: horizontal layout — text left, sketch image right ──
  if (card.horizontalImage) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Left: text */}
        <div
          style={{
            flex: "0 0 52%",
            padding: "16px 12px 12px 16px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Number */}
          <div className={mono} style={{ fontSize: 13, color: card.color, marginBottom: 4 }}>
            {card.id}.
          </div>

          {/* Title — mono, not hubot */}
          <div
            className={mono}
            style={{
              fontSize: 18,
              lineHeight: 1.1,
              color: card.color,
              marginBottom: 10,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
            }}
          >
            {card.title}
          </div>

          {/* Rule */}
          <div style={{ height: "0.5px", backgroundColor: card.color, opacity: 0.4, marginBottom: 10, flexShrink: 0 }} />

          {/* Subtitle */}
          {card.subtitle && (
            <div className={mono} style={{ fontSize: 9, color: card.color, marginBottom: 14, lineHeight: 1.5 }}>
              {card.subtitle}
            </div>
          )}

          {/* Body */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {card.body.map((line, i) => (
              <p key={i} className={mono} style={{ fontSize: 9, lineHeight: 1.65, color: card.color }}>
                {line}
              </p>
            ))}
          </div>

          {/* Fig label — bottom */}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            <span className={mono} style={{ fontSize: 8, color: card.color, opacity: 0.7 }}>
              {card.fig}
            </span>
            <span className={mono} style={{ fontSize: 8, color: card.color, opacity: 0.7, whiteSpace: "pre-line" }}>
              {card.figLabel}
            </span>
          </div>
        </div>

        {/* Right: sketch image with overlay blend */}
        <div
          style={{
            flex: "0 0 48%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.horizontalImage}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              mixBlendMode: "overlay",
              display: "block",
            }}
          />
        </div>
      </div>
    );
  }

  // ── Landscape card (card 04) ──
  if (card.landscape) {
    return (
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: `color-mix(in srgb, ${card.color} 12%, transparent)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className={mono} style={{ fontSize: 9, color: card.color, opacity: 0.35, letterSpacing: "0.15em" }}>
            [ IMAGE PLACEHOLDER ]
          </span>
        </div>
        <div style={{ position: "absolute", bottom: 12, left: 14, right: 14, display: "flex", justifyContent: "space-between" }}>
          <span className={mono} style={{ fontSize: 10, color: card.color }}>{card.fig}</span>
          <span className={mono} style={{ fontSize: 10, color: card.color }}>{card.figLabel}</span>
        </div>
      </div>
    );
  }

  // ── Default portrait card ──
  return (
    <div
      style={{
        padding: "18px 18px 14px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div className={mono} style={{ fontSize: 13, color: card.color, marginBottom: 3 }}>
        {card.id}.
      </div>
      <div
        className="font-hubot uppercase"
        style={{ fontSize: 28, lineHeight: 1.05, color: card.color, marginBottom: 10, letterSpacing: "0.01em", whiteSpace: "pre-line" }}
      >
        {card.title}
      </div>
      <div style={{ height: "0.5px", backgroundColor: card.color, opacity: 0.4, marginBottom: 10, flexShrink: 0 }} />
      {card.subtitle && (
        <div className={mono} style={{ fontSize: 10, color: card.color, marginBottom: 14 }}>{card.subtitle}</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {card.body.map((line, i) => (
          <p key={i} className={mono} style={{ fontSize: 10, lineHeight: 1.65, color: card.color }}>{line}</p>
        ))}
      </div>
      <div
        style={{
          marginTop: "auto",
          paddingTop: 14,
          flexShrink: 0,
          height: card.body.length > 0 ? "32%" : "55%",
          backgroundColor: `color-mix(in srgb, ${card.color} 10%, transparent)`,
          border: `0.5px solid color-mix(in srgb, ${card.color} 30%, transparent)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className={mono} style={{ fontSize: 8, color: card.color, opacity: 0.5, letterSpacing: "0.1em" }}>
          [ {card.figLabel || card.fig} ]
        </span>
      </div>
      <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
        <span className={mono} style={{ fontSize: 8, color: card.color, opacity: 0.7 }}>{card.fig}</span>
        {card.figLabel && (
          <span className={mono} style={{ fontSize: 8, color: card.color, opacity: 0.7 }}>{card.figLabel}</span>
        )}
      </div>
    </div>
  );
}

// ─── Draggable card ───────────────────────────────────────────────────────────

function DraggableCard({ card, zIndex, onFocus }: { card: CardData; zIndex: number; onFocus: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const posRef  = useRef({ x: card.initialX, y: card.initialY });
  const velRef  = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPtr  = useRef({ x: 0, y: 0, t: 0 });
  const rafRef   = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const applyTransform = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        `translate(${posRef.current.x}px, ${posRef.current.y}px) rotate(${card.rotation}deg)`;
    }
  }, [card.rotation]);

  useEffect(() => {
    applyTransform();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [applyTransform]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = true;
    setIsDragging(true);
    lastPtr.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    velRef.current = { x: 0, y: 0 };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    onFocus();
  }, [onFocus]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const now = performance.now();
    const dt = now - lastPtr.current.t;
    const dx = e.clientX - lastPtr.current.x;
    const dy = e.clientY - lastPtr.current.y;
    if (dt > 0) velRef.current = { x: (dx / dt) * 16, y: (dy / dt) * 16 };
    posRef.current.x += dx;
    posRef.current.y += dy;
    applyTransform();
    lastPtr.current = { x: e.clientX, y: e.clientY, t: now };
  }, [applyTransform]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    setIsDragging(false);
    const animate = () => {
      velRef.current.x *= 0.9;
      velRef.current.y *= 0.9;
      if (Math.abs(velRef.current.x) < 0.15 && Math.abs(velRef.current.y) < 0.15) return;
      posRef.current.x += velRef.current.x;
      posRef.current.y += velRef.current.y;
      applyTransform();
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
  }, [applyTransform]);

  return (
    <div
      ref={cardRef}
      style={{
        position: "absolute",
        top: 0, left: 0,
        width: card.width,
        height: card.height,
        backgroundColor: card.bg,
        zIndex,
        userSelect: "none",
        cursor: isDragging ? "grabbing" : "grab",
        willChange: "transform",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <CardContent card={card} />
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function OriginLog() {
  const maxZRef = useRef(CARDS.length);
  const [zIndexes, setZIndexes] = useState<Record<string, number>>(() =>
    Object.fromEntries(CARDS.map((c) => [c.id, c.initialZ]))
  );

  const bringToFront = useCallback((id: string) => {
    maxZRef.current += 1;
    setZIndexes((prev) => ({ ...prev, [id]: maxZRef.current }));
  }, []);

  return (
    <section
      style={{
        width: "100%",
        height: "100svh",
        display: "flex",
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* ── Left canvas ── */}
      <div
        style={{
          flex: "0 0 78%",
          height: "100%",
          backgroundColor: "#000",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Drag hint — green + glitch */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 300,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <GlitchLabel text="(drag around to view)" color={LIME} />
        </div>

        {/* Cards */}
        {CARDS.map((card) => (
          <DraggableCard
            key={card.id}
            card={card}
            zIndex={zIndexes[card.id]}
            onFocus={() => bringToFront(card.id)}
          />
        ))}

        {/* Bottom nav — green, no dividers */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            backgroundColor: "#000",
            zIndex: 200,
            borderTop: "0.5px solid rgba(255,255,255,0.06)",
          }}
        >
          {CARDS.map((card) => (
            <div
              key={card.id}
              className="font-mono-frag"
              style={{
                flex: 1,
                padding: "10px 14px",
                color: LIME,
                fontSize: 10,
                lineHeight: 1.5,
                cursor: "default",
              }}
            >
              <div>{card.id}.</div>
              <div>{card.era}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — white bg, dark text ── */}
      <div
        style={{
          flex: "0 0 22%",
          height: "100%",
          backgroundColor: "#ffffff",
          position: "relative",
          borderLeft: "0.5px solid rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          padding: "14px 16px 20px",
        }}
      >
        {/* Nav dots */}
        <div style={{ alignSelf: "flex-end", marginBottom: 10 }}>
          <NavDots total={7} active={1} />
        </div>

        {/* ORIGIN LOG: MATCHA — top */}
        <div
          className="font-hubot uppercase"
          style={{
            fontSize: "clamp(32px, 3.6vw, 58px)",
            lineHeight: 1.0,
            color: "#111111",
            letterSpacing: "0.01em",
          }}
        >
          ORIGIN<br />LOG:<br />MATCHA
        </div>

        {/* Push bottom content to bottom */}
        <div style={{ flex: 1 }} />

        {/* Bottom content block */}
        <div>
          {/* "DOCUMENTED HISTORY OF THE GREEN POWDER" */}
          <div
            className="font-hubot uppercase"
            style={{
              fontSize: "clamp(12px, 1.4vw, 20px)",
              lineHeight: 1.25,
              color: "#111111",
              letterSpacing: "0.04em",
            }}
          >
            DOCUMENTED<br />HISTORY OF<br />THE GREEN<br />POWDER
          </div>

          {/* 42px gap */}
          <div style={{ height: 42 }} />

          {/* Description */}
          <p
            className="font-mono-frag"
            style={{
              fontSize: 11,
              lineHeight: 1.75,
              color: "#555555",
            }}
          >
            An overview of matcha&apos;s early development, including changes
            in production methods, use, and standardization.
          </p>
        </div>
      </div>
    </section>
  );
}
