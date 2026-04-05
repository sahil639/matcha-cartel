"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollDownText from "./ScrollDownText";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const PHASES = [
  {
    label: "PHASE 01",
    title: "SHADE-GROWN LEAVES",
    description:
      "Leaves are grown under shade prior to harvest. Shading increases chlorophyll and amino acid content.",
  },
  {
    label: "PHASE 02",
    title: "STEAMED & DRIED",
    description:
      "Harvested leaves are steamed to prevent oxidation, then dried. Stems and veins are removed to produce tencha.",
  },
  {
    label: "PHASE 03",
    title: "STONE GROUND",
    description:
      "Dried tencha is ground using stone mills. Grinding is performed slowly to limit heat and preserve texture.",
  },
  {
    label: "PHASE 04",
    title: "SEALED & PACKED",
    description:
      "Ground matcha is sealed to reduce exposure to air, light, and moisture. Packaging is intended to maintain quality during storage.",
  },
];

// ─── Typewriter ───────────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 22) {
  const [displayed, setDisplayed] = useState(text);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayed("");
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length && timerRef.current) {
        clearInterval(timerRef.current);
      }
    }, speed);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed]);

  return displayed;
}

// ─── HUD corner brackets ──────────────────────────────────────────────────────

function HudFrame({
  color = "rgba(100,120,130,0.65)",
  size = 14,
  offset = 6,
}: {
  color?: string;
  size?: number;
  offset?: number;
}) {
  const b = `1px solid ${color}`;
  const corners: React.CSSProperties[] = [
    { top: -offset, left: -offset, borderTop: b, borderLeft: b },
    { top: -offset, right: -offset, borderTop: b, borderRight: b },
    { bottom: -offset, left: -offset, borderBottom: b, borderLeft: b },
    { bottom: -offset, right: -offset, borderBottom: b, borderRight: b },
  ];
  return (
    <>
      {corners.map((style, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: size,
            height: size,
            pointerEvents: "none",
            ...style,
          }}
        />
      ))}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductionChain() {
  const sectionRef = useRef<HTMLElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const secVideoRef = useRef<HTMLVideoElement>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const phaseRef = useRef(0);

  const phase = PHASES[currentPhase];
  const displayedTitle = useTypewriter(phase.title, 18);
  const displayedDesc = useTypewriter(phase.description, 10);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=300%",
        pin: true,
        pinSpacing: true,
        scrub: 0.3,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          const mv = mainVideoRef.current;
          if (mv && mv.duration && isFinite(mv.duration)) {
            mv.currentTime = p * mv.duration;
          }

          const sv = secVideoRef.current;
          if (sv && sv.duration && isFinite(sv.duration)) {
            sv.currentTime = p * sv.duration;
          }

          const newPhase = Math.min(Math.floor(p * 4), 3);
          if (newPhase !== phaseRef.current) {
            phaseRef.current = newPhase;
            setCurrentPhase(newPhase);
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleVideoLoad = useCallback(
    (ref: React.RefObject<HTMLVideoElement | null>) => () => {
      const v = ref.current;
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    },
    []
  );

  const BORDER = "0.5px solid rgba(100,120,130,0.3)";

  // Green line progress: percentage from top to current phase marker
  // Phases are placed at 20%, 40%, 60%, 80% of panel height
  const PHASE_TOPS = [20, 38, 56, 74]; // percentage positions
  const greenHeight = PHASE_TOPS[currentPhase];

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#ffffff",           // ← white bg
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "auto 1fr",
        overflow: "hidden",
      }}
    >
      {/* ── Header row ── */}
      {(["Matcha", "Production", "Chain."] as const).map((word, i) => (
        <div
          key={word}
          className="font-hubot"
          style={{
            padding: "10px 14px 8px",
            // Font: font-hubot = Hubot Sans Variable (wdth:75, weight:800)
            fontSize: "clamp(32px, 5.5vw, 78px)", // ← current size
            lineHeight: 1,
            color: "var(--logo-color)",
            letterSpacing: "-0.01em",             // ← tightened to match lock screen style
            borderBottom: BORDER,
            borderRight: i < 2 ? BORDER : undefined,
            borderLeft: i === 0 ? BORDER : undefined,
            borderTop: BORDER,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          {word}
        </div>
      ))}

      {/* ── Left panel: phase nav + main video ── */}
      <div
        style={{
          gridColumn: "1 / 3",
          gridRow: 2,
          position: "relative",
          overflow: "hidden",
          borderLeft: BORDER,
          borderBottom: BORDER,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 0,
        }}
      >
        {/* Main video — 75% of container size, centred */}
        <video
          ref={mainVideoRef}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleVideoLoad(mainVideoRef)}
          style={{
            width: "75%",
            height: "75%",
            objectFit: "contain",
            display: "block",
            position: "relative",
            zIndex: 1,
          }}
          src="/videos/section-3-main.mp4"
        />

        {/* ── Vertical progress line + phase nav ── */}
        <div
          style={{
            position: "absolute",
            left: 28,
            top: "10%",
            bottom: "10%",
            zIndex: 20,
          }}
        >
          {/* Full grey track */}
          <div
            style={{
              position: "absolute",
              left: 4,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: "rgba(100,120,130,0.25)",
            }}
          />

          {/* Green progress fill */}
          <div
            style={{
              position: "absolute",
              left: 4,
              top: 0,
              width: 1,
              height: `${greenHeight}%`,
              backgroundColor: "#6abf3c",
              transition: "height 0.5s ease",
            }}
          />

          {/* Phase markers */}
          {PHASES.map((p, i) => {
            const isActive = i === currentPhase;
            return (
              <div
                key={p.label}
                style={{
                  position: "absolute",
                  top: `${PHASE_TOPS[i]}%`,
                  left: 0,
                  transform: "translateY(-50%)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {/* Square on the line */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: isActive ? "#6abf3c" : "rgba(100,120,130,0.3)",
                    flexShrink: 0,
                    transition: "background-color 0.3s ease",
                  }}
                />
                {/* Label — active shifts right 6px */}
                <span
                  className="font-mono-frag"
                  style={{
                    fontSize: 10,             // ← current size
                    letterSpacing: "0.06em",
                    color: isActive
                      ? "var(--logo-color)"
                      : "rgba(100,120,130,0.4)",
                    fontWeight: isActive ? 700 : 400,
                    transform: isActive ? "translateX(6px)" : "translateX(0)",
                    transition: "color 0.3s ease, transform 0.3s ease",
                  }}
                >
                  {p.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right content panel (col 3) ── */}
      <div
        style={{
          gridColumn: 3,
          gridRow: 2,
          position: "relative",
          borderRight: BORDER,
          borderBottom: BORDER,
          borderLeft: BORDER,
          display: "flex",
          flexDirection: "column",
          padding: "18px 14px 14px",
          overflow: "hidden",
          minHeight: 0,
          justifyContent: "flex-end",        // ← text block pinned to bottom
        }}
      >
        {/* Phase title + description — at bottom */}
        <div>
          <h2
            className="font-mono-frag"
            style={{
              fontSize: "clamp(13px, 1.3vw, 18px)",  // ← current size
              lineHeight: 1.3,
              color: "var(--logo-color)",
              letterSpacing: "0.06em",
              whiteSpace: "pre-line",
              minHeight: "2.6em",
            }}
          >
            {displayedTitle}
          </h2>

          <p
            className="font-mono-frag"
            style={{
              fontSize: 11,                          // ← current size
              lineHeight: 1.75,
              color: "var(--text)",
              marginTop: 12,
              minHeight: "5.25em",
            }}
          >
            {displayedDesc}
          </p>
        </div>

        {/* Secondary video (B&W) + HUD frame */}
        <div
          style={{
            position: "relative",
            marginTop: 24,
            flex: "0 0 auto",
            height: "clamp(130px, 18vh, 220px)",
            alignSelf: "flex-start",
            width: "calc(100% - 24px)",
            marginLeft: 12,
          }}
        >
          <HudFrame color="rgba(100,120,130,0.6)" size={12} offset={6} />
          <video
            ref={secVideoRef}
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={handleVideoLoad(secVideoRef)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%) contrast(1.4) brightness(0.9)",
              display: "block",
            }}
            src="/videos/MPC_STAMP EFFECTT.mp4"   // ← updated to B&W card video
          />
        </div>

        {/* Scroll down */}
        <div style={{ marginTop: 14, alignSelf: "flex-start" }}>
          <ScrollDownText />
        </div>
      </div>
    </section>
  );
}
