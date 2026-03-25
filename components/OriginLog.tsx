"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import NavDots from "./NavDots";

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
    figLabel: "DRIED TEA LEAF",
    bg: "#3c4a1a",
    color: "#a8c050",
    width: 380,
    height: 560,
    initialX: 310,
    initialY: 70,
    rotation: 0,
    initialZ: 5,
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
    fig: "04",
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
    subtitle: "",
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

// ─── Draggable card ───────────────────────────────────────────────────────────

function DraggableCard({
  card,
  zIndex,
  onFocus,
}: {
  card: CardData;
  zIndex: number;
  onFocus: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: card.initialX, y: card.initialY });
  const velRef = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPtr = useRef({ x: 0, y: 0, t: 0 });
  const rafRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const applyTransform = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        `translate(${posRef.current.x}px, ${posRef.current.y}px) rotate(${card.rotation}deg)`;
    }
  }, [card.rotation]);

  useEffect(() => {
    applyTransform();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [applyTransform]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      dragging.current = true;
      setIsDragging(true);
      lastPtr.current = { x: e.clientX, y: e.clientY, t: performance.now() };
      velRef.current = { x: 0, y: 0 };
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      onFocus();
    },
    [onFocus]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const now = performance.now();
      const dt = now - lastPtr.current.t;
      const dx = e.clientX - lastPtr.current.x;
      const dy = e.clientY - lastPtr.current.y;
      if (dt > 0) {
        velRef.current = { x: (dx / dt) * 16, y: (dy / dt) * 16 };
      }
      posRef.current.x += dx;
      posRef.current.y += dy;
      applyTransform();
      lastPtr.current = { x: e.clientX, y: e.clientY, t: now };
    },
    [applyTransform]
  );

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
        top: 0,
        left: 0,
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

// ─── Card content ─────────────────────────────────────────────────────────────

function CardContent({ card }: { card: CardData }) {
  const mono = "font-mono-frag";
  const hubot = "font-hubot";

  if (card.landscape) {
    return (
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {/* Image placeholder — full bleed */}
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
          <span
            className={mono}
            style={{ fontSize: 9, color: card.color, opacity: 0.35, letterSpacing: "0.15em" }}
          >
            [ IMAGE PLACEHOLDER ]
          </span>
        </div>
        {/* Labels */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 14,
            right: 14,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span className={mono} style={{ fontSize: 10, color: card.color }}>
            {card.fig}
          </span>
          <span className={mono} style={{ fontSize: 10, color: card.color }}>
            {card.figLabel}
          </span>
        </div>
      </div>
    );
  }

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
      {/* Number */}
      <div className={mono} style={{ fontSize: 13, color: card.color, marginBottom: 3 }}>
        {card.id}.
      </div>

      {/* Title */}
      <div
        className={`${hubot} uppercase`}
        style={{
          fontSize: 28,
          lineHeight: 1.05,
          color: card.color,
          marginBottom: 10,
          letterSpacing: "0.01em",
          whiteSpace: "pre-line",
        }}
      >
        {card.title}
      </div>

      {/* Rule */}
      <div
        style={{
          height: "0.5px",
          backgroundColor: card.color,
          opacity: 0.4,
          marginBottom: 10,
          flexShrink: 0,
        }}
      />

      {/* Subtitle */}
      {card.subtitle && (
        <div className={mono} style={{ fontSize: 10, color: card.color, marginBottom: 14 }}>
          {card.subtitle}
        </div>
      )}

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {card.body.map((line, i) => (
          <p key={i} className={mono} style={{ fontSize: 10, lineHeight: 1.65, color: card.color }}>
            {line}
          </p>
        ))}
      </div>

      {/* Image placeholder */}
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

      {/* Figure label */}
      <div
        style={{
          marginTop: 6,
          display: "flex",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span className={mono} style={{ fontSize: 8, color: card.color, opacity: 0.7 }}>
          {card.fig}
        </span>
        {card.figLabel && (
          <span className={mono} style={{ fontSize: 8, color: card.color, opacity: 0.7 }}>
            {card.figLabel}
          </span>
        )}
      </div>
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
    const z = maxZRef.current;
    setZIndexes((prev) => ({ ...prev, [id]: z }));
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
        {/* Drag hint */}
        <div
          className="font-mono-frag"
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 11,
            color: "rgba(200,215,225,0.45)",
            zIndex: 300,
            pointerEvents: "none",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          (drag around to view)
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

        {/* Bottom nav */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: "0.5px solid rgba(200,215,225,0.15)",
            display: "flex",
            backgroundColor: "#000",
            zIndex: 200,
          }}
        >
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              className="font-mono-frag"
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRight:
                  i < CARDS.length - 1
                    ? "0.5px solid rgba(200,215,225,0.12)"
                    : undefined,
                color: "rgba(200,215,225,0.45)",
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

      {/* ── Right panel ── */}
      <div
        style={{
          flex: "0 0 22%",
          height: "100%",
          backgroundColor: "var(--bg)",
          position: "relative",
          borderLeft: "0.5px solid rgba(100,120,130,0.3)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Nav dots */}
        <div style={{ position: "absolute", top: 8, right: 8 }}>
          <NavDots total={7} active={1} />
        </div>

        {/* Text content */}
        <div
          style={{
            padding: "18px 14px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Large heading */}
          <div
            className="font-hubot uppercase"
            style={{
              fontSize: "clamp(36px, 3.8vw, 62px)",
              lineHeight: 1.0,
              color: "var(--logo-color)",
              letterSpacing: "0.02em",
              marginBottom: "clamp(20px, 3vh, 40px)",
            }}
          >
            ORIGIN<br />LOG:<br />MATCHA
          </div>

          {/* Section title */}
          <div
            className="font-hubot uppercase"
            style={{
              fontSize: "clamp(14px, 1.6vw, 22px)",
              lineHeight: 1.2,
              color: "var(--logo-color)",
              letterSpacing: "0.05em",
              marginBottom: "clamp(14px, 2.5vh, 28px)",
            }}
          >
            DOCUMENTED<br />HISTORY OF<br />THE GREEN<br />POWDER
          </div>

          {/* Description */}
          <p
            className="font-mono-frag"
            style={{
              fontSize: 11,
              lineHeight: 1.75,
              color: "var(--text)",
              marginTop: "auto",
              paddingBottom: 16,
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
