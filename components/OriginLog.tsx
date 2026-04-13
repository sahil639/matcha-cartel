"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const LIME = "#8dff00";

const ALL_ERAS = [
  { id: "01", era: "Tang-Song Dynasty" },
  { id: "02", era: "12th Century" },
  { id: "03", era: "Kamakura-Muromachi" },
  { id: "04", era: "Zen & Tea Ceremony" },
  { id: "05", era: "Early Modern Japan" },
];

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
  card02Image?: string;     // card 02: bottom-left image path
  card02Texture?: string;   // card 02: texture overlay path
  card03Image?: string;     // card 03: center image path
  card03Texture?: string;   // card 03: texture overlay path
  card04Image?: string;     // card 04: landscape, duplicated + mirrored image
  card04Texture?: string;   // card 04: texture overlay path
  card05Image?: string;     // card 05: bottom area leaf image
  card05Texture?: string;   // card 05: texture overlay path
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
    bg: "#588309",
    color: "#a8c050",
    width: 520,
    height: 380,
    initialX: 180,
    initialY: 140,
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
      "Zen monks returned to Japan with tea seeds and preparation methods.",
      "Knowledge transfer occurred through monastic exchange. Cultivation began under regulated conditions.",
    ],
    fig: "FIG. 02",
    figLabel: "MATCHA\nTEA SEEDS",
    bg: "#8CCC00",           // base color — change here
    color: "#000",
    width: 356,              // width — change here
    height: 480,
    initialX: 160,
    initialY: 80,
    rotation: 0,
    initialZ: 3,
    card02Image: "/images/balls- sketch.png",
    card02Texture: "/images/CARD02_TEXTURE.avif",
  },
  {
    id: "03",
    era: "Kamakura-Muromachi",
    title: "FORMALIZATION",
    subtitle: "Kamakura-Muromachi Periods",
    body: [
      "Japan standardized powdered tea production.",
      "Shade-growing, stone-grinding, and leaf selection were formalized.",
    ],
    fig: "FIG. 03",
    figLabel: "STONE\nGRINDER",
    bg: "#DBE3EA",           // base color — change here
    color: "#000",
    width: 390,              // width — change here
    height: 422,        // height — change here (~1:1 ratio)
    initialX: 260,
    initialY: 60,
    rotation: 0,
    initialZ: 2,
    card03Image: "/images/cheese-sketch.png",
    card03Texture: "/images/CARD02_TEXTURE.avif",
  },
  {
    id: "04",
    era: "Zen & Tea Ceremony",
    title: "RITUALIZED USE",
    subtitle: "Zen & Tea Ceremony",
    body: [
      "Preparation was structured into ritual practice.",
      "Movement, timing, and sequence were regulated.",
      "Matcha functioned as a tool for focus.",
    ],
    fig: "FIG. 04",
    figLabel: "CHASEN (MATCHA WHISK)",
    bg: "#8796A1",           // base color — change here
    color: "#000",
    width: 620,              // width — change here (aspect ~1.82:1)
    height: 340,             // height — change here
    initialX: 80,
    initialY: 200,
    rotation: 0,
    initialZ: 1,
    card04Image: "/images/matcha-bruhs.png",
    card04Texture: "/images/CARD02_TEXTURE.avif",
  },
  {
    id: "05",
    era: "Early Modern Japan",
    title: "CONTROLLED\nCULTIVATION",
    subtitle: "Early Modern\nJapan",
    body: [
      "Production consolidated into specific regions.",
      "Uji established long-term quality standards.",
      "Origin and grade became traceable.",
    ],
    fig: "FIG. 05",
    figLabel: "FRESH TEA LEAF",
    bg: "#8CCC00",
    color: "#000",
    width: 380,
    height: 520,
    initialX: 320,
    initialY: 90,
    rotation: 0,
    initialZ: 5,
    card05Image: "/images/matcha-leaves-sketch.png",
    card05Texture: "/images/CARD02_TEXTURE.avif",
  },
];

// ─── Card content ─────────────────────────────────────────────────────────────

function CardContent({ card }: { card: CardData }) {
  const mono = "font-mono-frag";

  // ── Card 01: landscape layout matching reference design ──
  if (card.horizontalImage) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Sketch image — absolute, right side, multiply blend */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.horizontalImage}
          alt=""
          style={{
            position: "absolute",
            right: "-19%",
            top: "-6%",
            width: "112%",
            height: "112%",
            objectFit: "contain",
            objectPosition: "center",
            mixBlendMode: "multiply",
            display: "block",
            zIndex: 1,
          }}
        />

        {/* Texture overlay — highest z-index */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/firstcontacttex.avif"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "multiply",
            display: "block",
            zIndex: 99,
            pointerEvents: "none",
          }}
        />

        {/* Vertical rule — full height, 12px from left */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 12,
            bottom: 0,
            width: "0.5px",
            backgroundColor: "#000",
            opacity: 0.6,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* FIG. 01 — top right */}
        <div
          className={mono}
          style={{
            position: "absolute",
            top: 10,
            right: 14,
            fontSize: 11,
            letterSpacing: "0.08em",
            lineHeight: 1,
            color: "#000",
            zIndex: 3,
          }}
        >
          {card.fig}
        </div>

        {/* Header block: number + title, then horizontal rule right after */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            paddingLeft: 24,
            paddingTop: 10,
            paddingRight: 14,
          }}
        >
          <div
            className={mono}
            style={{
              fontSize: 24,
              letterSpacing: "0.02em",
              lineHeight: 1,
              color: "#000",
              marginBottom: 4,
            }}
          >
            {card.id}.
          </div>
          <div
            className={mono}
            style={{
              fontSize: 20,
              letterSpacing: "0.02em",
              lineHeight: 1.05,
              color: "#000",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {card.title}
          </div>
          {/* Horizontal rule — exactly under title, spans full card width */}
          <div
            style={{
              height: "0.5px",
              backgroundColor: "#000",
              opacity: 0.6,
              marginLeft: -24,
              marginRight: -14,
            }}
          />
        </div>

        {/* Left text block — subtitle + body, below rule */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            paddingLeft: 24,
            paddingTop: 14,
            paddingRight: "55%",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {card.subtitle && (
            <div
              className={mono}
              style={{
                fontSize: 13,
                letterSpacing: "0.04em",
                lineHeight: 1.5,
                color: "#000",
              }}
            >
              {card.subtitle}
            </div>
          )}
          {card.body.map((line, i) => (
            <p
              key={i}
              className={mono}
              style={{
                fontSize: 13,
                letterSpacing: "0.04em",
                lineHeight: 1.65,
                color: "#000",
                margin: 0,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Fig label — bottom right */}
        <div
          className={mono}
          style={{
            position: "absolute",
            bottom: 14,
            right: 14,
            fontSize: 11,
            letterSpacing: "0.08em",
            lineHeight: 1.4,
            color: "#000",
            textAlign: "right",
            zIndex: 3,
            whiteSpace: "pre-line",
          }}
        >
          {card.figLabel}
        </div>
      </div>
    );
  }

  // ── Card 02: portrait, image bottom-left, text right-shifted ──
  if (card.card02Image) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Bottom-left image — offset down slightly, multiply blend */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.card02Image}
          alt=""
          style={{
            position: "absolute",
            left: "-8%",
            bottom: "-10%",       // slight y-axis offset downward
            width: "75%",
            height: "60%",
            objectFit: "contain",
            objectPosition: "left bottom",
            mixBlendMode: "multiply",
            display: "block",
            zIndex: 1,
          }}
        />

        {/* Texture overlay */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.card02Texture}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "multiply",
            display: "block",
            zIndex: 99,
            pointerEvents: "none",
          }}
        />

        {/* Vertical rule — 12px from left, full height */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 12, bottom: 0,
            width: "0.5px",
            backgroundColor: "#000",
            opacity: 0.5,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Header block: number + title, then horizontal rule */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            paddingLeft: 24,
            paddingTop: 10,
            paddingRight: 14,
          }}
        >
          <div
            className={mono}
            style={{
              fontSize: 24,         /* letterSpacing: "0.02em", lineHeight: 1 */
              letterSpacing: "0.02em",
              lineHeight: 1,
              color: "#000",
              marginBottom: 4,
            }}
          >
            {card.id}.
          </div>
          <div
            className={mono}
            style={{
              fontSize: 20,         /* letterSpacing: "0.02em", lineHeight: 1.05 */
              letterSpacing: "0.02em",
              lineHeight: 1.05,
              color: "#000",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {card.title}
          </div>
          {/* Horizontal rule — exactly under title */}
          <div
            style={{
              height: "0.5px",
              backgroundColor: "#000",
              opacity: 0.5,
              marginLeft: -24,
              marginRight: -14,
            }}
          />
        </div>

        {/* Text block — shifted right */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            paddingLeft: "28%",     // shifted right relative to card
            paddingRight: 18,
            paddingTop: 18,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {card.subtitle && (
            <div
              className={mono}
              style={{
                fontSize: 13,       /* letterSpacing: "0.04em", lineHeight: 1.5 */
                letterSpacing: "0.04em",
                lineHeight: 1.5,
                color: "#000",
              }}
            >
              {card.subtitle}
            </div>
          )}
          {card.body.map((line, i) => (
            <p
              key={i}
              className={mono}
              style={{
                fontSize: 13,       /* letterSpacing: "0.04em", lineHeight: 1.65 */
                letterSpacing: "0.04em",
                lineHeight: 1.65,
                color: "#000",
                margin: 0,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* FIG. 02 + label — bottom right */}
        <div
          className={mono}
          style={{
            position: "absolute",
            bottom: 14,
            right: 14,
            fontSize: 11,           /* letterSpacing: "0.08em", lineHeight: 1.4 */
            letterSpacing: "0.08em",
            lineHeight: 1.4,
            color: "#000",
            textAlign: "right",
            zIndex: 3,
            whiteSpace: "pre-line",
          }}
        >
          {card.fig}{"\n"}{card.figLabel}
        </div>
      </div>
    );
  }

  // ── Card 03: portrait, center image, text right-shifted below image ──
  if (card.card03Image) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Center image — multiply blend */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.card03Image}
          alt=""
          style={{
            position: "absolute",
            left: "50%",
            top: "38%",
            transform: "translate(-50%, -44%)",
            width: "55%",
            height: "55%",
            objectFit: "contain",
            mixBlendMode: "multiply",
            display: "block",
            zIndex: 1,
          }}
        />

        {/* Texture overlay */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.card03Texture}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "multiply",
            display: "block",
            zIndex: 99,
            pointerEvents: "none",
          }}
        />

        {/* Vertical rule — 12px from left, full height */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 12, bottom: 0,
            width: "0.5px",
            backgroundColor: "#000",
            opacity: 0.4,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Header block: number + title on same line, then horizontal rule */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            paddingLeft: 24,
            paddingTop: 10,
            paddingRight: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 24,
              marginBottom: 8,
            }}
          >
            <div
              className={mono}
              style={{
                fontSize: 24,           /* letterSpacing: "0.02em", lineHeight: 1 */
                letterSpacing: "0.02em",
                lineHeight: 1,
                color: "#000",
                flexShrink: 0,
              }}
            >
              {card.id}.
            </div>
            <div
              className={mono}
              style={{
                fontSize: 20,           /* letterSpacing: "0.02em", lineHeight: 1.05 */
                letterSpacing: "0.02em",
                lineHeight: 1.05,
                color: "#000",
                textTransform: "uppercase",
              }}
            >
              {card.title}
            </div>
          </div>
          {/* Horizontal rule — exactly under title */}
          <div
            style={{
              height: "0.5px",
              backgroundColor: "#000",
              opacity: 0.4,
              marginLeft: -24,
              marginRight: -14,
            }}
          />
        </div>

        {/* Subtitle — right-shifted, just under headline */}
        {card.subtitle && (
          <div
            className={mono}
            style={{
              position: "relative",
              zIndex: 3,
              paddingLeft: "30%",
              paddingRight: 14,
              paddingTop: 10,
              fontSize: 13,             /* letterSpacing: "0.04em", lineHeight: 1.5 */
              letterSpacing: "0.04em",
              lineHeight: 1.5,
              color: "#000",
            }}
          >
            {card.subtitle}
          </div>
        )}

        {/* Body text — right-shifted, below the image */}
        <div
          style={{
            position: "absolute",
            bottom: 15,
            left: "30%",
            right: 14,
            zIndex: 3,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {card.body.map((line, i) => (
            <p
              key={i}
              className={mono}
              style={{
                fontSize: 13,           /* letterSpacing: "0.04em", lineHeight: 1.65 */
                letterSpacing: "0.04em",
                lineHeight: 1.65,
                color: "#000",
                margin: 0,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* FIG. 03 + STONE GRINDER — left side, vertically centered */}
        <div
          className={mono}
          style={{
            position: "absolute",
            left: 24,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 11,               /* letterSpacing: "0.08em", lineHeight: 1.6 */
            letterSpacing: "0.08em",
            lineHeight: 1.6,
            color: "#000",
            zIndex: 3,
            whiteSpace: "pre-line",
          }}
        >
          {card.fig}{"\n\n"}{card.figLabel}
        </div>
      </div>
    );
  }

  // ── Card 04: landscape, duplicated + mirrored image ──
  if (card.card04Image) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Texture overlay */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.card04Texture}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "multiply",
            display: "block",
            zIndex: 99,
            pointerEvents: "none",
          }}
        />

        {/* Vertical rule — 12px from left, full height */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 12, bottom: 0,
            width: "0.5px",
            backgroundColor: "#000",
            opacity: 0.4,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Header: "04." left, "RITUALIZED USE" centered, then horizontal rule */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            paddingLeft: 24,
            paddingTop: 10,
            paddingRight: 14,
          }}
        >
          <div style={{ position: "relative", display: "flex", alignItems: "baseline", marginBottom: 8 }}>
            {/* 04. — left */}
            <div
              className={mono}
              style={{
                fontSize: 24,
                letterSpacing: "0.02em",
                lineHeight: 1,
                color: "#000",
                flexShrink: 0,
              }}
            >
              {card.id}.
            </div>
            {/* RITUALIZED USE — centered in full card width */}
            <div
              className={mono}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: 20,
                letterSpacing: "0.02em",
                lineHeight: 1.05,
                color: "#000",
                textTransform: "uppercase",
                pointerEvents: "none",
              }}
            >
              {card.title}
            </div>
          </div>
          {/* Horizontal rule */}
          <div
            style={{
              height: "0.5px",
              backgroundColor: "#000",
              opacity: 0.4,
              marginLeft: -24,
              marginRight: -14,
            }}
          />

          {/* Subtitle + body text — under headline */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              paddingTop: 10,
            }}
          >
            {/* Subtitle — left */}
            <div
              className={mono}
              style={{
                fontSize: 13,
                letterSpacing: "0.04em",
                lineHeight: 1.5,
                color: "#000",
                flexShrink: 0,
                width: "28%",
              }}
            >
              {card.subtitle}
            </div>
            {/* Body text — right */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              {card.body.map((line, i) => (
                <p
                  key={i}
                  className={mono}
                  style={{
                    fontSize: 13,
                    letterSpacing: "0.04em",
                    lineHeight: 1.55,
                    color: "#000",
                    margin: 0,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Matcha whisk image 2 — flipped, left side */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.card04Image}
          alt=""
          style={{
            position: "absolute",
            top: "29%",
            left: -38,
            width: "70%",
            height: "70%",
            rotate: "8deg",
            objectFit: "contain",
            mixBlendMode: "multiply",
            display: "block",
            pointerEvents: "none",
            transform: "scaleX(-1)",
          }}
        />

        {/* Matcha whisk image 1 — original, right side */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.card04Image}
          alt=""
          style={{
            position: "absolute",
            top: "29%",
            right: -38,
            width: "70%",
            height: "70%",
            objectFit: "contain",
            mixBlendMode: "multiply",
            display: "block",
            pointerEvents: "none",
          }}
        />

        {/* FIG. 04 — bottom left, CHASEN (MATCHA WHISK) — bottom center */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            paddingLeft: 24,
            zIndex: 3,
          }}
        >
          <div
            className={mono}
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "#000",
            }}
          >
            {card.fig}
          </div>
          <div
            className={mono}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "#000",
              pointerEvents: "none",
            }}
          >
            {card.figLabel}
          </div>
        </div>
      </div>
    );
  }

  // ── Card 05: portrait, stacked heading, two-col text, leaf image ──
  if (card.card05Image) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Texture overlay */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.card05Texture}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "multiply",
            display: "block",
            zIndex: 99,
            pointerEvents: "none",
          }}
        />

        {/* Vertical rule — 12px from left, full height */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 12, bottom: 0,
            width: "0.5px",
            backgroundColor: "#000",
            opacity: 0.5,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Header: 05. / CONTROLLED / CULTIVATION stacked, then horizontal rule */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            paddingLeft: 24,
            paddingTop: 10,
            paddingRight: 14,
          }}
        >
          <div
            className={mono}
            style={{ marginBottom: 8 }}
          >
            <div
              className={mono}
              style={{
                fontSize: 24,
                letterSpacing: "0.02em",
                lineHeight: 1,
                color: "#000",
                marginBottom: 4,
              }}
            >
              {card.id}.
            </div>
            <div
              className={mono}
              style={{
                fontSize: 20,
                letterSpacing: "0.02em",
                lineHeight: 1.05,
                color: "#000",
                textTransform: "uppercase",
                whiteSpace: "pre-line",
              }}
            >
              {card.title}
            </div>
          </div>
          {/* Horizontal rule */}
          <div
            style={{
              height: "0.5px",
              backgroundColor: "#000",
              opacity: 0.5,
              marginLeft: -24,
              marginRight: -14,
            }}
          />
        </div>

        {/* Two-column text block */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            paddingLeft: 24,
            paddingRight: 14,
            paddingTop: 14,
            display: "flex",
            gap: 20,
          }}
        >
          {/* Left — subtitle */}
          <div
            className={mono}
            style={{
              fontSize: 13,
              letterSpacing: "0.04em",
              lineHeight: 1.5,
              color: "#000",
              flexShrink: 0,
              width: "35%",
              whiteSpace: "pre-line",
            }}
          >
            {card.subtitle}
          </div>
          {/* Right — body paragraphs */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            {card.body.map((line, i) => (
              <p
                key={i}
                className={mono}
                style={{
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  lineHeight: 1.55,
                  color: "#000",
                  margin: 0,
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Leaf image — absolute, lower portion of card */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.card05Image}
          alt=""
          style={{
            position: "absolute",
            bottom: "0%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "120%",
            height: "50%",
            objectFit: "contain",
            mixBlendMode: "multiply",
            display: "block",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* FIG. 05 left, FRESH TEA LEAF right — bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 24,
            right: 14,
            display: "flex",
            justifyContent: "space-between",
            zIndex: 3,
          }}
        >
          <span className={mono} style={{ fontSize: 11, letterSpacing: "0.08em", color: "#000" }}>
            {card.fig}
          </span>
          <span className={mono} style={{ fontSize: 11, letterSpacing: "0.08em", color: "#000" }}>
            {card.figLabel}
          </span>
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

function DraggableCard({
  card, zIndex, onFocus, animateIn, animateInDelay, targetX, targetY, canvasRef,
}: {
  card: CardData;
  zIndex: number;
  onFocus: () => void;
  animateIn: boolean;
  animateInDelay: number;
  targetX: number;
  targetY: number;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  // Start off-screen left, rotation 10deg
  const posRef = useRef({ x: -(card.width + 200), y: targetY });
  const rotRef = useRef(24);
  const velRef = useRef({ x: 0, y: 0 });
  const entryDone = useRef(false);
  const dragging = useRef(false);
  const lastPtr = useRef({ x: 0, y: 0, t: 0 });
  const rafRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const applyTransform = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        `translate(${posRef.current.x}px, ${posRef.current.y}px) rotate(${rotRef.current}deg)`;
    }
  }, []);

  const getBounds = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { minX: 0, maxX: 9999, minY: 0, maxY: 9999 };
    const NAV_H = 80;
    return {
      minX: 0,
      maxX: Math.max(0, canvas.clientWidth - card.width),
      minY: 0,
      maxY: Math.max(0, canvas.clientHeight - card.height - NAV_H),
    };
  }, [canvasRef, card.width, card.height]);

  // Set initial off-screen position
  useEffect(() => {
    applyTransform();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [applyTransform]);

  // Entry animation: spring in from left, rotation 10→0
  useEffect(() => {
    if (!animateIn) return;
    posRef.current = { x: -(card.width + 200), y: targetY };
    rotRef.current = 24;
    applyTransform();

    const tid = setTimeout(() => {
      let vx = 0, vy = 0, vrot = 0;
      const K = 0.08, D = 0.75;

      function spring() {
        vx += (targetX - posRef.current.x) * K; vx *= D;
        vy += (targetY - posRef.current.y) * K; vy *= D;
        vrot += (0 - rotRef.current) * K; vrot *= D;

        posRef.current.x += vx;
        posRef.current.y += vy;
        rotRef.current += vrot;
        applyTransform();

        const done =
          Math.abs(vx) < 0.1 && Math.abs(posRef.current.x - targetX) < 0.5 &&
          Math.abs(vy) < 0.1 && Math.abs(posRef.current.y - targetY) < 0.5;

        if (done) {
          posRef.current = { x: targetX, y: targetY };
          rotRef.current = 0;
          applyTransform();
          entryDone.current = true;
          return;
        }
        rafRef.current = requestAnimationFrame(spring);
      }
      rafRef.current = requestAnimationFrame(spring);
    }, animateInDelay);

    return () => clearTimeout(tid);
  }, [animateIn, animateInDelay, targetX, targetY, card.width, applyTransform]);

  useEffect(() => {
    // Update posRef if targetX/targetY change before animation starts
    if (!entryDone.current && !animateIn) {
      posRef.current.y = targetY;
    }
  }, [targetX, targetY, animateIn]);

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
    const b = getBounds();
    posRef.current.x = Math.max(b.minX, Math.min(b.maxX, posRef.current.x + dx));
    posRef.current.y = Math.max(b.minY, Math.min(b.maxY, posRef.current.y + dy));
    applyTransform();
    lastPtr.current = { x: e.clientX, y: e.clientY, t: now };
  }, [applyTransform, getBounds]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    setIsDragging(false);
    const animate = () => {
      const b = getBounds();
      const x = posRef.current.x;
      const y = posRef.current.y;
      const clampX = Math.max(b.minX, Math.min(b.maxX, x));
      const clampY = Math.max(b.minY, Math.min(b.maxY, y));
      const oob = Math.abs(clampX - x) > 0.5 || Math.abs(clampY - y) > 0.5;

      if (oob) {
        // Spring back toward nearest valid position
        velRef.current.x += (clampX - x) * 0.12;
        velRef.current.y += (clampY - y) * 0.12;
        velRef.current.x *= 0.7;
        velRef.current.y *= 0.7;
      } else {
        velRef.current.x *= 0.9;
        velRef.current.y *= 0.9;
      }

      posRef.current.x += velRef.current.x;
      posRef.current.y += velRef.current.y;
      applyTransform();

      const settled = Math.abs(velRef.current.x) < 0.15 && Math.abs(velRef.current.y) < 0.15 && !oob;
      if (settled) {
        posRef.current.x = Math.max(b.minX, Math.min(b.maxX, posRef.current.x));
        posRef.current.y = Math.max(b.minY, Math.min(b.maxY, posRef.current.y));
        applyTransform();
        return;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
  }, [applyTransform, getBounds]);

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

// ─── Mobile: stacked swipeable cards ─────────────────────────────────────────

const DISPLAY_W = 280; // target card display width
const DISPLAY_H = 370; // target card display height

const STACK_CONFIGS = [
  { scale: 1,    x:  0, y:   0, opacity: 1,    z: 50 },
  { scale: 0.95, x: 12, y: -10, opacity: 0.85, z: 40 },
  { scale: 0.90, x: 24, y: -20, opacity: 0.7,  z: 30 },
  { scale: 0.85, x: 36, y: -30, opacity: 0.55, z: 20 },
  { scale: 0.80, x: 48, y: -40, opacity: 0.4,  z: 10 },
];

function MobileOriginLog() {
  const [order, setOrder] = useState(CARDS.map((_, i) => i));
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const touchStartX = useRef(0);
  const isAnimating = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (isAnimating.current) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) < 40) return;
    isAnimating.current = true;
    const dir = delta > 0 ? "right" : "left";
    setSwipeDir(dir);
    setTimeout(() => {
      setOrder(prev => {
        const next = [...prev];
        const first = next.shift()!;
        next.push(first);
        return next;
      });
      setSwipeDir(null);
      setTimeout(() => { isAnimating.current = false; }, 60);
    }, 380);
  };

  return (
    <section style={{ width: "100%", height: "100svh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── Header — white panel ── */}
      <div style={{ backgroundColor: "#ffffff", padding: "24px 20px 20px", flexShrink: 0, borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
        <h1 className="font-lockscreen" style={{ fontSize: "clamp(32px, 9vw, 56px)", color: "#111", lineHeight: 1, margin: "0 0 14px 0" }}>
          ORIGIN LOG: MATCHA
        </h1>
        <h2 className="font-mono-frag" style={{ fontSize: "clamp(13px, 3.5vw, 18px)", color: "#111", lineHeight: 1.4, margin: "0 0 14px 0", fontWeight: 400 }}>
          DOCUMENTED HISTORY OF THE GREEN POWDER
        </h2>
        <p className="font-mono-frag" style={{ fontSize: 12, color: "#333", lineHeight: 1.7, margin: 0 }}>
          An overview of matcha&apos;s early development, including changes in production methods, use, and standardization.
        </p>
      </div>

      {/* ── Canvas — black, stacked cards ── */}
      <div
        style={{ flex: 1, minHeight: 0, backgroundColor: "#000", position: "relative" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Swipe hint */}
        <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", zIndex: 200, pointerEvents: "none", whiteSpace: "nowrap" }}>
          <GlitchLabel text="(swipe to browse)" color={LIME} />
        </div>

        {/* Cards — rendered back to front */}
        {[...order].reverse().map((cardIdx, revIdx) => {
          const stackPos = order.length - 1 - revIdx; // 0 = front
          const card = CARDS[cardIdx];
          const isTop = stackPos === 0;
          const cfg = STACK_CONFIGS[Math.min(stackPos, STACK_CONFIGS.length - 1)];

          // Scale card content to fit DISPLAY_W × DISPLAY_H
          const scaleX = DISPLAY_W / card.width;
          const scaleY = DISPLAY_H / card.height;
          const contentScale = Math.min(scaleX, scaleY);
          const displayW = card.width * contentScale;
          const displayH = card.height * contentScale;

          // Swipe-off transform for the top card
          const swipeTransform = isTop && swipeDir
            ? swipeDir === "left"
              ? `translate(calc(-50% + ${cfg.x}px), calc(-50% + ${cfg.y}px)) scale(${cfg.scale}) translateX(-140%) rotate(-12deg)`
              : `translate(calc(-50% + ${cfg.x}px), calc(-50% + ${cfg.y}px)) scale(${cfg.scale}) translateX(140%) rotate(12deg)`
            : `translate(calc(-50% + ${cfg.x}px), calc(-50% + ${cfg.y}px)) scale(${cfg.scale})`;

          return (
            <div
              key={card.id}
              style={{
                position: "absolute",
                left: "50%",
                top: "52%",
                width: displayW,
                height: displayH,
                overflow: "hidden",
                zIndex: cfg.z,
                transform: swipeTransform,
                opacity: cfg.opacity,
                transition: isTop && swipeDir
                  ? "transform 0.38s cubic-bezier(0.4,0,0.6,1)"
                  : "transform 0.4s ease, opacity 0.4s ease",
                backgroundColor: card.bg,
              }}
            >
              {/* CardContent scaled to fit display size */}
              <div style={{
                width: card.width,
                height: card.height,
                transform: `scale(${contentScale})`,
                transformOrigin: "top left",
              }}>
                <CardContent card={card} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function OriginLog() {

  const maxZRef = useRef(CARDS.length);
  const [zIndexes, setZIndexes] = useState<Record<string, number>>(() =>
    Object.fromEntries(CARDS.map((c) => [c.id, c.initialZ]))
  );
  const [animateIn, setAnimateIn] = useState(false);
  const [navChars, setNavChars] = useState<number[]>(ALL_ERAS.map(() => 0));

  // Right panel typewriter strings
  const RIGHT_HEADING = "ORIGIN\nLOG:\nMATCHA";
  const RIGHT_SUBHEADING = "DOCUMENTED\nHISTORY OF\nTHE GREEN\nPOWDER";
  const RIGHT_DESC = "An overview of matcha's early development, including changes in production methods, use, and standardization.";
  const [rightChars, setRightChars] = useState([0, 0, 0]);
  const hasAnimated = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Random target positions per card, computed once on mount
  const targets = useRef<{ x: number; y: number }[]>([]);

  const bringToFront = useCallback((id: string) => {
    maxZRef.current += 1;
    setZIndexes((prev) => ({ ...prev, [id]: maxZRef.current }));
  }, []);

  // IntersectionObserver — trigger entry animation once
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const cw = canvas.clientWidth;
        const ch = canvas.clientHeight;
        const navHeight = 80;
        targets.current = CARDS.map((card) => ({
          x: Math.random() * Math.max(0, cw - card.width - 40) + 20,
          y: Math.random() * Math.max(0, ch - card.height - navHeight - 20) + 20,
        }));
        setAnimateIn(true);
      }
    }, { threshold: 0.25 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Typewriter for nav — starts when animateIn fires, each era staggered
  useEffect(() => {
    if (!animateIn) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    ALL_ERAS.forEach((item, eraIdx) => {
      const total = item.era.length;
      let count = 0;
      const startDelay = eraIdx * 60;
      const t = setTimeout(() => {
        const iv = setInterval(() => {
          count++;
          setNavChars(prev => {
            const next = [...prev];
            next[eraIdx] = count;
            return next;
          });
          if (count >= total) clearInterval(iv);
        }, 55);
      }, startDelay);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [animateIn]);

  // Typewriter for right panel texts
  useEffect(() => {
    if (!animateIn) return;
    const texts = [RIGHT_HEADING, RIGHT_SUBHEADING, RIGHT_DESC];
    const speeds = [25, 20, 10];
    const startDelays = [0, 300, 700];
    const timers: ReturnType<typeof setTimeout>[] = [];

    texts.forEach((text, i) => {
      let count = 0;
      const t = setTimeout(() => {
        const iv = setInterval(() => {
          count++;
          setRightChars(prev => { const next = [...prev]; next[i] = count; return next; });
          if (count >= text.length) clearInterval(iv);
        }, speeds[i]);
      }, startDelays[i]);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [animateIn]);

  return (
    <>
      <div className="block md:hidden">
        <MobileOriginLog />
      </div>
      <div className="hidden md:block">
      <section
        ref={sectionRef}
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
        ref={canvasRef}
        style={{
          flex: "0 0 82.4%",
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
        {CARDS.map((card, idx) => (
          <DraggableCard
            key={card.id}
            card={card}
            zIndex={zIndexes[card.id]}
            onFocus={() => bringToFront(card.id)}
            animateIn={animateIn}
            animateInDelay={idx * 100}
            targetX={targets.current[idx]?.x ?? card.initialX}
            targetY={targets.current[idx]?.y ?? card.initialY}
            canvasRef={canvasRef}
          />
        ))}

        {/* Bottom nav — typewriter on section entry */}
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
          {ALL_ERAS.map((item, eraIdx) => (
            <div
              key={item.id}
              className="font-mono-frag"
              style={{
                flex: 1,
                padding: "20px 14px",
                color: LIME,
                fontSize: 14,
                lineHeight: 1.5,
                cursor: "default",
              }}
            >
              <div>{item.id}.</div>
              <div>{item.era.slice(0, navChars[eraIdx])}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — white bg, dark text ── */}
      <div
        style={{
          flex: "0 0 17.6%",
          height: "100%",
          backgroundColor: "#ffffff",
          position: "relative",
          borderLeft: "0.5px solid rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          padding: "14px 16px 20px",
        }}
      >
        {/* ORIGIN LOG: MATCHA — top, typewriter */}
        <div
          className="font-lockscreen uppercase"
          style={{ fontSize: "clamp(32px, 3.6vw, 58px)", lineHeight: 1.0, color: "#111111", letterSpacing: "0.01em" }}
        >
          {RIGHT_HEADING.slice(0, rightChars[0]).split("\n").map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div>
          {/* DOCUMENTED HISTORY… typewriter */}
          <div
            className="font-mono-frag uppercase"
            style={{ fontSize: 28, lineHeight: 1.25, color: "#111111", letterSpacing: "0.04em" }}
          >
            {RIGHT_SUBHEADING.slice(0, rightChars[1]).split("\n").map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </div>

          <div style={{ height: 42 }} />

          {/* Description typewriter */}
          <p className="font-mono-frag" style={{ fontSize: 14, lineHeight: 1.75, color: "#555555" }}>
            {RIGHT_DESC.slice(0, rightChars[2])}
          </p>
        </div>
      </div>
      </section>
      </div>
    </>
  );
}
