"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EFFECTS = [
  {
    num: "01",
    title: "SUSTAINED\nFOCUS",
    subtitle: "Calm alertness without spikes.",
    body: [
      "Matcha delivers caffeine gradually through naturally occurring compounds.",
      "A slower release happens. Energy remains steady.",
    ],
  },
  {
    num: "02",
    title: "MENTAL\nCLARITY",
    subtitle: "Attention without agitation.",
    body: [
      "Historically associated with meditation and extended focus. Awareness is maintained without restlessness.",
    ],
  },
  {
    num: "03",
    title: "RITUALIZED\nENERGY",
    subtitle: "Energy shaped by preparation.",
    body: [
      "Preparation slows consumption. The act itself becomes part of the effect.",
    ],
  },
];

const HEADER_WORDS = ["Effects", "of", "Matcha."] as const;
const BORDER = "0.5px solid rgba(255,255,255,0.15)";

export default function EffectsOfMatcha() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
          const v = videoRef.current;
          if (v && v.duration && isFinite(v.duration)) {
            v.currentTime = self.progress * v.duration;
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleVideoLoad = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "auto 1fr",
      }}
    >
      {/* ── Background video ── */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={handleVideoLoad}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          zIndex: 0,
        }}
        src="/videos/PourAnimation_6.mp4"
      />

      {/* ── Dark gradient overlay (bottom) for text legibility ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 45%, transparent 70%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* ── Header row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          position: "relative",
          zIndex: 10,
        }}
      >
        {HEADER_WORDS.map((word, i) => (
          <div
            key={word}
            className="font-lockscreen"
            style={{
              padding: "10px 14px 8px",
              fontSize: "clamp(32px, 5.5vw, 78px)",
              lineHeight: 1,
              color: "#ffffff",
              letterSpacing: "0.01em",
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

      </div>

      {/* ── Bottom content row — 3 effect columns ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          position: "relative",
          zIndex: 10,
          alignItems: "end",
          minHeight: 0,
        }}
      >
        {EFFECTS.map((effect, i) => (
          <div
            key={effect.num}
            style={{
              padding: "0 20px 28px",
              borderRight: i < 2 ? BORDER : undefined,
              borderLeft: i === 0 ? BORDER : undefined,
              borderBottom: BORDER,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            {/* Number */}
            <div
              className="font-mono-frag"
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 6,
                letterSpacing: "0.04em",
              }}
            >
              {effect.num}
            </div>

            {/* Title */}
            <h2
              className="font-lockscreen uppercase"
              style={{
                fontSize: "clamp(22px, 3vw, 46px)",
                lineHeight: 1.0,
                color: "#ffffff",
                letterSpacing: "0.01em",
                marginBottom: 14,
                whiteSpace: "pre-line",
              }}
            >
              {effect.title}
            </h2>

            {/* Subtitle */}
            <p
              className="font-mono-frag"
              style={{
                fontSize: 15,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.85)",
                marginBottom: 10,
              }}
            >
              {effect.subtitle}
            </p>

            {/* Body */}
            {effect.body.map((line, j) => (
              <p
                key={j}
                className="font-mono-frag"
                style={{
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.6)",
                  marginTop: j > 0 ? 8 : 0,
                }}
              >
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
