"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavDots from "./NavDots";
import ScrollDownText from "./ScrollDownText";

gsap.registerPlugin(ScrollTrigger);

export default function TheVault() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);

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
        backgroundColor: "var(--bg)",
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
          className="font-hubot"
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
          right: 56, // offset for nav dots
          zIndex: 20,
        }}
      >
        <span
          className="font-hubot"
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

      {/* ── Nav dots ── */}
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 30 }}>
        <NavDots total={7} active={6} />
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
          width: "clamp(400px, 62vw, 1020px)",
          height: "auto",
          display: "block",
          zIndex: 5,
        }}
        src="/videos/VAULT_TIMESTRECH_AE.webm"
      />

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
