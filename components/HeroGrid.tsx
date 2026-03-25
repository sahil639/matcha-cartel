"use client";

import Image from "next/image";
import { useState } from "react";
import GlitchNumber from "./GlitchNumber";
import NavDots from "./NavDots";

const GLITCH_NUMS = new Set(["01", "07", "10", "14"]);

const LOT_CODES = [
  "LOT\u201302\u2013KY",  "LOT\u201389\u2013UJI", "LOT\u201313\u2013NR",
  "LOT\u201377\u2013KY",  "LOT\u201356\u2013UJI", "LOT\u201331\u2013NR",
  "LOT\u201394\u2013UJI", "LOT\u201367\u2013KY",  "LOT\u201328\u2013NR",
  "LOT\u201383\u2013UJI", "LOT\u201319\u2013KY",  "LOT\u201362\u2013NR",
  "LOT\u201347\u2013UJI", "LOT\u201388\u2013KY",  "LOT\u201335\u2013NR",
];

const IMAGES = Array.from({ length: 15 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { num: n, src: `/images/${n}.webp`, lot: LOT_CODES[i] };
});

const BORDER = "0.5px solid rgba(100,120,130,0.3)";
const HUD_BORDER = "1px solid rgba(100,120,130,0.75)";

// HUD corner bracket definitions
const CORNERS: { pos: React.CSSProperties; border: React.CSSProperties }[] = [
  { pos: { top: -6, left: -6 },   border: { borderTop: HUD_BORDER, borderLeft: HUD_BORDER } },
  { pos: { top: -6, right: -6 },  border: { borderTop: HUD_BORDER, borderRight: HUD_BORDER } },
  { pos: { bottom: -6, left: -6 },  border: { borderBottom: HUD_BORDER, borderLeft: HUD_BORDER } },
  { pos: { bottom: -6, right: -6 }, border: { borderBottom: HUD_BORDER, borderRight: HUD_BORDER } },
];

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
      {/* Number label — Fragment Mono, top-left */}
      <div className="absolute top-[6px] left-[6px] z-10">
        <GlitchNumber label={`(${num})`} glitch={isGlitch} />
      </div>

      {/* Centered image area */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Wrapper: 35% of cell height, strict 1:1 */}
        <div style={{ position: "relative", height: "35%", aspectRatio: "1 / 1" }}>

          {/* Image: scales + grayscale transition */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: hovered ? "scale(1.65)" : "scale(1)",
              filter: hovered ? "none" : "grayscale(100%)",
              transition: "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.3s ease",
              transformOrigin: "center center",
            }}
          >
            <Image
              src={src}
              alt={`Matcha ${num}`}
              fill
              className="object-cover"
              sizes="15vw"
            />
          </div>

          {/* HUD corner brackets — stay at wrapper corners (inside scaled image) */}
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

      {/* LOT label — below scaled image (82% from top of cell) */}
      <div
        style={{
          position: "absolute",
          top: "82%",
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
          style={{ fontSize: 9, color: "var(--text)", letterSpacing: "0.04em" }}
        >
          {lot}
        </span>
      </div>
    </div>
  );
}

export default function HeroGrid() {
  return (
    <div
      className="relative w-full"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr) 1fr",
        gridTemplateRows: "repeat(3, 1fr)",
        height: "calc(100svh - clamp(90px, 17vw, 215px))",
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

      {/* Text column — col 6 (index 5) */}

      {/* Row 1: top tagline + nav dots */}
      <div
        className="relative"
        style={{
          gridColumn: 6, gridRow: 1,
          borderRight: BORDER, borderBottom: BORDER, borderTop: BORDER,
        }}
      >
        <p
          className="font-hubot uppercase"
          style={{
            position: "absolute", top: 0, left: 0,
            fontSize: 10, lineHeight: 1.4, letterSpacing: "0.08em",
            color: "var(--text)",
          }}
        >
          THE WORLD&apos;S MOST<br />DESIRED GREEN POWDER.
        </p>
        <div style={{ position: "absolute", top: 0, right: 0 }}>
          <NavDots total={7} active={0} />
        </div>
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
          className="font-hubot uppercase"
          style={{
            position: "absolute", bottom: 0, left: 0,
            fontSize: 10, lineHeight: 1.4, letterSpacing: "0.08em",
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
              background: "var(--bg)",
              padding: "2px 4px",
              lineHeight: 1,
              color: "rgba(30,40,50,0.6)",
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
