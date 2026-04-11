"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollDownText from "./ScrollDownText";

gsap.registerPlugin(ScrollTrigger);

// Positions are % of the section viewport — adjust to match video frame
const VAULT_LABELS = [
  { num: "01", name: "CHAWAN", left: "36%", top: "62%" },
  { num: "02", name: "MATCHA POWDER", left: "58%", top: "40%" },
  { num: "03", name: "CHASEN", left: "50%", top: "62%" },
  { num: "04", name: "CHASEN STAND", left: "60%", top: "65%" },
  { num: "05", name: "CHASHAKU", left: "38%", top: "38%" },
];

const HUD_COLOR = "#8A96A0";
const NUM_W = 40;
const BAR_H = 36;

function VaultLabel({ num, name, visible }: { num: string; name: string; visible: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "stretch",
        height: BAR_H,
        border: `1px solid ${HUD_COLOR}`,
        overflow: "hidden",
        cursor: "default",
        userSelect: "none",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        whiteSpace: "nowrap",
      }}
    >
      {/* Number block — always visible */}
      <div
        style={{
          width: NUM_W,
          backgroundColor: HUD_COLOR,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span className="font-mono-frag" style={{ fontSize: 12, color: "#ffffff", letterSpacing: "0.06em" }}>
          {num}
        </span>
      </div>

      {/* Name block — slides in on hover */}
      <div
        style={{
          maxWidth: hovered ? 160 : 0,
          overflow: "hidden",
          backgroundColor: "#ffffff",
          borderLeft: hovered ? `1px solid ${HUD_COLOR}` : "none",
          display: "flex",
          alignItems: "center",
          paddingLeft: hovered ? 10 : 0,
          paddingRight: hovered ? 10 : 0,
          transition: "max-width 0.3s ease, padding 0.3s ease, border 0.15s ease",
        }}
      >
        <span className="font-mono-frag" style={{ fontSize: 12, color: "#8796a1", letterSpacing: "0.1em" }}>
          {name}
        </span>
      </div>
    </div>
  );
}

export default function TheVault() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [labelsVisible, setLabelsVisible] = useState(false);

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
        onUpdate(self) {
          const v = videoRef.current;
          if (v && v.duration && isFinite(v.duration)) {
            v.currentTime = self.progress * v.duration;
          }
          setLabelsVisible(self.progress >= 0.92);
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
        background: "linear-gradient(to bottom, #8B97A1, #ffffff)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── "The" — top-left ── */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 20,
          zIndex: 20,
        }}
      >
        <span
          className="font-lockscreen"
          style={{
            fontSize: "clamp(40px, 6.5vw, 100px)",
            color: "#ffffff",
            lineHeight: 1,
            letterSpacing: "-0.01em",
          }}
        >
          The
        </span>
      </div>

      {/* ── "Vault" — top-right ── */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 56,
          zIndex: 20,
        }}
      >
        <span
          className="font-lockscreen"
          style={{
            fontSize: "clamp(40px, 6.5vw, 100px)",
            color: "#ffffff",
            lineHeight: 1,
            letterSpacing: "-0.01em",
          }}
        >
          Vault
        </span>
      </div>

      {/* ── Scroll-scrubbed video — centered ── */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={handleVideoLoad}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(400px, 62vw, 660px)",
          height: "auto",
          display: "block",
          zIndex: 5,
        }}
        src="/videos/VAULT_TIMESTRECH_AE.webm"
      />

      {/* ── Item labels — appear at end of scroll ── */}
      {VAULT_LABELS.map((label, i) => (
        <div
          key={label.num}
          style={{
            position: "absolute",
            left: label.left,
            top: label.top,
            zIndex: 20,
            pointerEvents: labelsVisible ? "auto" : "none",
            transitionDelay: labelsVisible ? `${i * 60}ms` : "0ms",
          }}
        >
          <VaultLabel num={label.num} name={label.name} visible={labelsVisible} />
        </div>
      ))}

      {/* ── "(scroll down)" — bottom center ── */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
        }}
      >
        <ScrollDownText />
      </div>
    </section>
  );
}
