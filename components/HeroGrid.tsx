"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import GlitchNumber from "./GlitchNumber";

const GLITCH_NUMS = new Set(["01", "07", "10", "14"]);

const LOT_CODES = [
  "LOT\u201302\u2013KY", "LOT\u201389\u2013UJI", "LOT\u201313\u2013NR",
  "LOT\u201377\u2013KY", "LOT\u201356\u2013UJI", "LOT\u201331\u2013NR",
  "LOT\u201394\u2013UJI", "LOT\u201367\u2013KY", "LOT\u201328\u2013NR",
  "LOT\u201383\u2013UJI", "LOT\u201319\u2013KY", "LOT\u201362\u2013NR",
  "LOT\u201347\u2013UJI", "LOT\u201388\u2013KY", "LOT\u201335\u2013NR",
];

const IMAGES = Array.from({ length: 15 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { num: n, src: `/images/${n}.webp`, lot: LOT_CODES[i] };
});

const BORDER = "0.5px solid rgba(100,120,130,0.3)";
const HUD_BORDER = "1px solid rgba(100,120,130,0.75)";

const CORNERS: { pos: React.CSSProperties; border: React.CSSProperties }[] = [
  { pos: { top: -6, left: -6 }, border: { borderTop: HUD_BORDER, borderLeft: HUD_BORDER } },
  { pos: { top: -6, right: -6 }, border: { borderTop: HUD_BORDER, borderRight: HUD_BORDER } },
  { pos: { bottom: -6, left: -6 }, border: { borderBottom: HUD_BORDER, borderLeft: HUD_BORDER } },
  { pos: { bottom: -6, right: -6 }, border: { borderBottom: HUD_BORDER, borderRight: HUD_BORDER } },
];

// ─── Desktop image cell ───────────────────────────────────────────────────────

function ImageCell({
  num, src, lot, isGlitch, row, col,
}: {
  num: string; src: string; lot: string; isGlitch: boolean; row: number; col: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      style={{
        gridColumn: col + 1,
        gridRow: row + 1,
        borderRight: BORDER,
        borderBottom: BORDER,
        borderLeft: col === 0 ? BORDER : undefined,
        borderTop: row === 0 ? BORDER : undefined,
        overflow: "visible",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Number label */}
      <div className="absolute top-[6px] left-[6px] z-10">
        <GlitchNumber label={`(${num})`} glitch={isGlitch} />
      </div>

      {/* Centered image area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          style={{
            position: "relative",
            height: hovered ? "56%" : "40%",
            aspectRatio: hovered ? "23 / 15" : "1 / 1",
            transition: "height 0.35s ease, aspect-ratio 0.35s ease",
            overflow: "hidden",
          }}
        >
          <Image
            src={src}
            alt={`Matcha ${num}`}
            fill
            priority
            className="object-cover"
            sizes="15vw"
          />

          {/* Color blend overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#8796a1",
              mixBlendMode: "color",
              opacity: hovered ? 0 : 1,
              transition: "opacity 0.3s ease",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          {/* HUD corner brackets */}
          {CORNERS.map((c, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 10,
                height: 10,
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.2s ease",
                pointerEvents: "none",
                zIndex: 10,
                ...c.pos,
                ...c.border,
              }}
            />
          ))}
        </div>
      </div>

      {/* LOT label */}
      <div
        style={{
          position: "absolute",
          top: "calc(78% + 4px)",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s ease",
          zIndex: 15,
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        <span
          className="font-mono-frag"
          style={{ fontSize: 9, color: "#000", letterSpacing: "0.04em" }}
        >
          {lot}
        </span>
      </div>
    </div>
  );
}

// ─── Mobile image cell ────────────────────────────────────────────────────────

function MobileImageCell({
  num, src, isGlitch, row, col,
}: {
  num: string; src: string; isGlitch: boolean; row: number; col: number;
}) {
  return (
    <div
      className="relative"
      style={{
        gridColumn: col + 1,
        gridRow: row + 1,
        borderRight: BORDER,
        borderBottom: BORDER,
        borderLeft: col === 0 ? BORDER : undefined,
        borderTop: row === 0 ? BORDER : undefined,
        overflow: "hidden",
      }}
    >
      {/* Number label */}
      <div style={{ position: "absolute", top: 4, left: 4, zIndex: 10 }}>
        <GlitchNumber label={`(${num})`} glitch={isGlitch} fontSize={14} />
      </div>

      {/* Image — natural green, no grey overlay, no hover */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div style={{ position: "relative", width: "56%", aspectRatio: "1 / 1", overflow: "hidden" }}>
          <Image
            src={src}
            alt={`Matcha ${num}`}
            fill
            priority
            className="object-cover"
            sizes="33vw"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Mobile layout ────────────────────────────────────────────────────────────

function MobileHeroGrid() {
  return (
    <div
      style={{
        width: "100%",
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 3×5 image grid */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(5, 1fr)",
          position: "relative",
          overflow: "visible",
        }}
      >
        {IMAGES.map(({ num, src }, idx) => (
          <MobileImageCell
            key={num}
            num={num}
            src={src}
            isGlitch={GLITCH_NUMS.has(num)}
            row={Math.floor(idx / 3)}
            col={idx % 3}
          />
        ))}
        <CrossMarkers rows={5} cols={3} />
      </div>

      {/* Extra text row — no column dividers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          borderTop: BORDER,
          borderBottom: BORDER,
          borderLeft: BORDER,
          borderRight: BORDER,
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "6px 8px" }}>
          <p
            className="font-lockscreen uppercase"
            style={{ fontSize: 9, lineHeight: 1.3, letterSpacing: ".3px", color: "var(--text)", margin: 0 }}
          >
            THE WORLD&apos;S MOST DESIRED GREEN POWDER.
          </p>
        </div>
        {/* Center cell — empty, no dividers */}
        <div />
        <div style={{ padding: "6px 8px" }}>
          <p
            className="font-lockscreen uppercase"
            style={{ fontSize: 9, lineHeight: 1.3, letterSpacing: ".3px", color: "var(--text)", margin: 0 }}
          >
            TRACKED. GRADED. DISTRIBUTED. WHAT LOOKS LIKE TEA MOVES LIKE A COMMODITY.
          </p>
        </div>
      </div>

      {/* MatchaCartel logo + scroll hint */}
      <div
        style={{
          flexShrink: 0,
          borderTop: BORDER,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          height: 60,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/svgs/logo-en.svg"
          alt="MatchaCartel"
          style={{ height: 40, width: "auto", display: "block", objectFit: "contain" }}
          draggable={false}
        />
        <span
          className="font-mono-frag"
          style={{ fontSize: 9, color: "var(--text)", letterSpacing: "0.12em" }}
        >
          (scroll down)
        </span>
      </div>
    </div>
  );
}

// ─── Desktop layout ───────────────────────────────────────────────────────────

export default function HeroGrid() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) return <MobileHeroGrid />;

  return (
    <div
      className="relative w-full"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr) 1fr",
        gridTemplateRows: "repeat(3, 1fr)",
        height: "100%",
        overflow: "visible",
      }}
    >
      {/* 15 image cells — 5 cols × 3 rows */}
      {IMAGES.map(({ num, src, lot }, idx) => (
        <ImageCell
          key={num}
          num={num}
          src={src}
          lot={lot}
          isGlitch={GLITCH_NUMS.has(num)}
          row={Math.floor(idx / 5)}
          col={idx % 5}
        />
      ))}

      {/* Text column — col 6 */}

      {/* Row 1: top tagline */}
      <div
        className="relative"
        style={{
          gridColumn: 6, gridRow: 1,
          borderRight: BORDER, borderBottom: BORDER, borderTop: BORDER,
        }}
      >
        <p
          className="font-lockscreen uppercase"
          style={{
            position: "absolute", top: 0, left: 0,
            fontSize: 18, lineHeight: 1, letterSpacing: ".4px",
            color: "var(--text)",
          }}
        >
          THE WORLD&apos;S MOST<br />DESIRED GREEN POWDER.
        </p>
      </div>

      {/* Row 2: empty */}
      <div
        style={{
          gridColumn: 6, gridRow: 2,
          borderRight: BORDER, borderBottom: BORDER,
        }}
      />

      {/* Row 3: bottom tagline */}
      <div
        className="relative"
        style={{
          gridColumn: 6, gridRow: 3,
          borderRight: BORDER, borderBottom: BORDER,
        }}
      >
        <p
          className="font-lockscreen uppercase"
          style={{
            position: "absolute", bottom: 0, left: 0,
            fontSize: 18, lineHeight: 1, letterSpacing: ".4px",
            color: "var(--text)",
          }}
        >
          TRACKED. GRADED. DISTRIBUTED.<br />
          WHAT LOOKS LIKE TEA<br />
          MOVES LIKE A COMMODITY.
        </p>
      </div>

      {/* Crosshair markers at all grid intersections */}
      <CrossMarkers rows={3} cols={6} />
    </div>
  );
}

function CrossMarkers({ rows, cols }: { rows: number; cols: number }) {
  const markers: React.ReactNode[] = [];
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      markers.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: "absolute",
            top: `${(r / rows) * 100}%`,
            left: `${(c / cols) * 100}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 20,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            style={{
              padding: "4px 5px",
              lineHeight: 1,
              color: "#000",
              fontSize: 11,
              fontFamily: "sans-serif",
              fontWeight: 300,
            }}
          >
            +
          </div>
        </div>
      );
    }
  }
  return <>{markers}</>;
}
