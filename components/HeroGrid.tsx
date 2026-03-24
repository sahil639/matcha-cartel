"use client";

import Image from "next/image";
import GlitchNumber from "./GlitchNumber";
import NavDots from "./NavDots";

const GLITCH_NUMS = new Set(["01", "07", "10", "14"]);

const IMAGES = Array.from({ length: 15 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { num: n, src: `/images/${n}.jpg` };
});

export default function HeroGrid() {
  return (
    <div
      className="relative w-full"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr)) minmax(0, 1fr)",
        gridTemplateRows: "repeat(5, 1fr)",
        height: "calc(100svh - clamp(100px, 18vw, 220px))",
      }}
    >
      {/* Render 15 image cells */}
      {IMAGES.map(({ num, src }, idx) => {
        const row = Math.floor(idx / 3); // 0-4
        const col = idx % 3; // 0-2
        const isGlitch = GLITCH_NUMS.has(num);

        return (
          <Cell key={num} row={row} col={col}>
            {/* Number label */}
            <div className="absolute top-2 left-3 z-10">
              <GlitchNumber label={`(${num})`} glitch={isGlitch} />
            </div>

            {/* Image */}
            <div className="absolute inset-0 flex items-center justify-center p-3 pt-7">
              <div className="relative w-full h-full">
                <Image
                  src={src}
                  alt={`Matcha ${num}`}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </div>
            </div>
          </Cell>
        );
      })}

      {/* Column 4 — row 1: top tagline */}
      <Cell row={0} col={3}>
        <div className="absolute top-3 left-4 right-4">
          <p
            className="font-hubot text-[11px] leading-[1.4] tracking-widest uppercase"
            style={{ color: "var(--text)" }}
          >
            THE WORLD&apos;S MOST<br />DESIRED GREEN POWDER.
          </p>
        </div>
        {/* Nav dots — right edge */}
        <div className="absolute top-3 right-3">
          <NavDots total={7} active={0} />
        </div>
      </Cell>

      {/* Column 4 — rows 2–4: empty */}
      <Cell row={1} col={3} />
      <Cell row={2} col={3} />
      <Cell row={3} col={3} />

      {/* Column 4 — row 5: bottom tagline */}
      <Cell row={4} col={3}>
        <div className="absolute bottom-3 left-4 right-4">
          <p
            className="font-hubot text-[11px] leading-[1.4] tracking-widest uppercase"
            style={{ color: "var(--text)" }}
          >
            TRACKED. GRADED. DISTRIBUTED.<br />
            WHAT LOOKS LIKE TEA<br />
            MOVES LIKE A COMMODITY.
          </p>
        </div>
      </Cell>

      {/* Crosshair markers at grid intersections */}
      <CrossMarkers rows={6} cols={5} />
    </div>
  );
}

// A grid cell — draws its own borders to form the grid lines
function Cell({
  row,
  col,
  children,
}: {
  row: number;
  col: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="relative"
      style={{
        gridColumn: col + 1,
        gridRow: row + 1,
        borderRight: "0.5px solid rgba(100,120,130,0.35)",
        borderBottom: "0.5px solid rgba(100,120,130,0.35)",
        borderLeft: col === 0 ? "0.5px solid rgba(100,120,130,0.35)" : undefined,
        borderTop: row === 0 ? "0.5px solid rgba(100,120,130,0.35)" : undefined,
      }}
    >
      {children}
    </div>
  );
}

// Overlay "+" crosshair markers at every grid intersection
function CrossMarkers({ rows, cols }: { rows: number; cols: number }) {
  const markers: React.ReactNode[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      markers.push(
        <div
          key={`${r}-${c}`}
          className="absolute pointer-events-none select-none z-20"
          style={{
            top: `${(r / (rows - 1)) * 100}%`,
            left: `${(c / (cols - 1)) * 100}%`,
            transform: "translate(-50%, -50%)",
            color: "rgba(100,120,130,0.55)",
            fontSize: 12,
            lineHeight: 1,
            fontFamily: "sans-serif",
          }}
        >
          +
        </div>
      );
    }
  }

  return <>{markers}</>;
}
