"use client";

import { useLayoutEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: "01",
    name: "SIFT",
    src: "/images/step1.png",
    description:
      "Sift matcha into the bowl to remove clumps\nand standardize texture before hydration.",
  },
  {
    num: "02",
    name: "DISSOLVE",
    src: "/images/step2.png",
    description:
      "Add hot water gradually, allowing the powder\nto bloom and dissolve evenly.",
  },
  {
    num: "03",
    name: "WHISK",
    src: "/images/step3.png",
    description:
      "Whisk with a chasen until fully suspended,\nproducing a smooth, uniform mixture.",
  },
];

const TORCH_R = 300; // px radius of flashlight

export default function PreparationProcedures() {
  const sectionRef  = useRef<HTMLElement>(null);
  const stepRef     = useRef(0);
  const [step, setStep]           = useState(0);
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 });
  const [hovering, setHovering]   = useState(false);

  // ── Mouse tracking ─────────────────────────────────────────────────────────
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHovering(true);
  }, []);

  const onMouseLeave = useCallback(() => setHovering(false), []);

  // ── GSAP pinned scroll — 3 snap positions ──────────────────────────────────
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=200%",
        pin: true,
        pinSpacing: true,
        snap: {
          snapTo: [0, 0.5, 1],
          duration: { min: 0.2, max: 0.5 },
          ease: "power1.inOut",
        },
        onUpdate(self) {
          const p = self.progress;
          // Map snap points [0, 0.5, 1.0] → steps [0, 1, 2]
          const newStep = p >= 0.85 ? 2 : p >= 0.45 ? 1 : 0;
          if (newStep !== stepRef.current) {
            stepRef.current = newStep;
            setStep(newStep);
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // ── Derived styles ─────────────────────────────────────────────────────────
  const overlayBg = hovering
    ? `radial-gradient(circle ${TORCH_R}px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`
    : "black";

  const s = STEPS[step];

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#000",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Always-visible heading ── */}
      <div style={{ position: "absolute", top: 20, left: 24, zIndex: 50 }}>
        <h2
          className="font-lockscreen"
          style={{
            fontSize: "clamp(16px, 2.2vw, 34px)",
            color: "#ffffff",
            margin: 0,
            lineHeight: 1,
            letterSpacing: "0.01em",
          }}
        >
          PREPARATION PROCEDURES
        </h2>
      </div>

      {/* ── Center images (all stacked, one visible at a time) ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) translateY(-8%)",
          width: "clamp(320px, 48vw, 680px)",
          height: "clamp(280px, 44vh, 560px)",
          zIndex: 5,
        }}
      >
        {STEPS.map((st, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={st.src}
            alt={st.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              opacity: i === step ? 1 : 0,
              transition: "opacity 0.5s ease",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>

      {/* ── Dark overlay with torch cut-out ── */}
      {/* Sits above images (z=10) but below UI text (z=20+) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          background: overlayBg,
          transition: hovering ? "none" : "background 0.6s ease",
          pointerEvents: "none",
        }}
      />

      {/* ── "Move here" hint (only visible when not hovering) ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 20,
          pointerEvents: "none",
          opacity: hovering ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        <span
          className="font-mono-frag"
          style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}
        >
          (move here to turn on flashlight)
        </span>
      </div>

      {/* ── Step label + description (always above overlay) ── */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <div
          className="font-mono-frag"
          style={{
            fontSize: 14,
            color: "#ffffff",
            letterSpacing: "0.18em",
            lineHeight: 1.8,
          }}
        >
          STEP {s.num}
        </div>
        <div
          className="font-mono-frag"
          style={{
            fontSize: 14,
            color: "#ffffff",
            letterSpacing: "0.18em",
            lineHeight: 1.8,
            marginBottom: 14,
          }}
        >
          {s.name}
        </div>
        <p
          className="font-mono-frag"
          style={{
            fontSize: 11,
            color: "#dbe3ea",
            lineHeight: 1.75,
            whiteSpace: "pre-line",
            margin: 0,
          }}
        >
          {s.description}
        </p>
      </div>

      {/* ── "(scroll down)" left + right ── */}
      {(["left", "right"] as const).map(side => (
        <div
          key={side}
          style={{
            position: "absolute",
            [side]: 24,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <span
            className="font-mono-frag"
            style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}
          >
            (scroll down)
          </span>
        </div>
      ))}
    </section>
  );
}
