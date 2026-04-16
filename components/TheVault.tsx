"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollDownText from "./ScrollDownText";

gsap.registerPlugin(ScrollTrigger);

// ─── Mobile ───────────────────────────────────────────────────────────────────

function MobileTheVault() {
  return (
    <section
      style={{
        width: "100%",
        height: "100svh",
        background: "linear-gradient(to bottom, #8B97A1, #ffffff)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* "The" — top-left */}
      <div style={{ position: "absolute", top: 16, left: 20, zIndex: 20 }}>
        <span className="font-lockscreen" style={{ fontSize: 48, color: "#ffffff", lineHeight: 1, letterSpacing: "-0.01em" }}>
          The
        </span>
      </div>

      {/* "Vault" — top-right */}
      <div style={{ position: "absolute", top: 16, right: 20, zIndex: 20 }}>
        <span className="font-lockscreen" style={{ fontSize: 48, color: "#ffffff", lineHeight: 1, letterSpacing: "-0.01em" }}>
          Vault
        </span>
      </div>

      {/* Video — autoplay, centered */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90vw",
          height: "auto",
          display: "block",
          zIndex: 5,
        }}
        src="/videos/VAULT_TIMESTRECH_AE.webm"
      />

      {/* Bottom hint */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          whiteSpace: "nowrap",
        }}
      >
        <ScrollDownText />
      </div>
    </section>
  );
}

// ─── Desktop ──────────────────────────────────────────────────────────────────

export default function TheVault() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || section.clientWidth === 0) return;

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
    <>
      <div className="block md:hidden">
        <MobileTheVault />
      </div>
      <div className="hidden md:block">
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
          {/* "The" — top-left */}
          <div style={{ position: "absolute", top: 16, left: 20, zIndex: 20 }}>
            <span className="font-lockscreen" style={{ fontSize: "clamp(40px, 6.5vw, 100px)", color: "#ffffff", lineHeight: 1, letterSpacing: "-0.01em" }}>
              The
            </span>
          </div>

          {/* "Vault" — top-right */}
          <div style={{ position: "absolute", top: 16, right: 56, zIndex: 20 }}>
            <span className="font-lockscreen" style={{ fontSize: "clamp(40px, 6.5vw, 100px)", color: "#ffffff", lineHeight: 1, letterSpacing: "-0.01em" }}>
              Vault
            </span>
          </div>

          {/* Scroll-scrubbed video */}
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
              transform: "translate(-50%, -50%) scale(1)",
              width: "clamp(400px, 62vw, 660px)",
              height: "auto",
              display: "block",
              zIndex: 5,
            }}
            src="/videos/VAULT_TIMESTRECH_AE.webm"
          />

          {/* Bottom hint */}
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              whiteSpace: "nowrap",
            }}
          >
            <ScrollDownText />
          </div>
        </section>
      </div>
    </>
  );
}
