"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollDownText from "./ScrollDownText";

gsap.registerPlugin(ScrollTrigger);

const HUD_COLOR = "#8A96A0";
const NUM_W = 40;
const BAR_H = 36;

interface LabelData {
  num: string;
  labelName: string;   // short name shown on hover
  name: string;        // full name shown in detail panel
  left: string;
  top: string;
  videoLeft: string;   // video horizontal position when detail is open
  videoTop: string;    // video vertical position when detail is open
  videoScale: number;  // video scale when detail is open
  price: string;
  description: string;
  specs: string[];
  soldOut?: boolean;
  side?: "left" | "right";
}

// Positions are % of the section viewport — adjust to match video frame
// videoLeft/videoScale control where the video moves when that item is selected
const VAULT_LABELS: LabelData[] = [
  {
    num: "01", labelName: "CHAWAN", name: "CHAWAN",
    left: "36%", top: "62%",
    videoLeft: "72%", videoTop: "50%", videoScale: 1.7,
    price: "$25 USD",
    description: "Wide ceramic bowl used for whisking and serving. Form allows unrestricted movement and visual monitoring.",
    specs: [
      "Primary material: Glazed ceramic",
      "Finish: Semi matte glaze with pooled interior surface",
      "Form variance: Hand shaped, minor irregularities expected",
      "Detail: Green-dipped base (signature mark)",
      "Capacity: Single preparation volume",
    ],
    soldOut: true,
  },
  {
    num: "02", labelName: "MATCHA POWDER", name: "MATCHA POWDER",
    left: "58%", top: "40%",
    videoLeft: "29%", videoTop: "60%", videoScale: 1.7,
    price: "$35 USD",
    description: "Finely milled ceremonial grade matcha stored in an airtight metal canister. Designed to preserve color, aroma, and potency under controlled conditions.",
    specs: [
      "Contents: Stone ground green tea powder",
      "Container: Aluminum with sealed lid",
      "Origin: Uji, Japan",
      "Net weight: 30g",
    ],
    soldOut: true,
    side: "right",
  },
  {
    num: "03", labelName: "CHASEN", name: "CHASEN",
    left: "50%", top: "62%",
    videoLeft: "30%", videoTop: "50%", videoScale: 1.7,
    price: "$25 USD",
    description: "Traditional bamboo whisk for controlled matcha preparation. Designed to dissolve powder evenly through repetitive motion.",
    specs: [
      "Primary material: Natural white bamboo",
      "Construction: Hand-split tines, cotton-bound",
      "Finish: Untreated, uncoated surface",
      "Detail: Green-dipped base (signature mark)",
      "Variation: Natural — each unit unique",
    ],
    soldOut: true,
    side: "right",
  },
  {
    num: "04", labelName: "CHASEN STAND", name: "CHASEN STAND",
    left: "60%", top: "65%",
    videoLeft: "28%", videoTop: "50%", videoScale: 1.7,
    price: "$20 USD",
    description: "A sculpted stand designed to support and preserve the shape of the chasen between uses. Maintains tine spacing and promotes even drying.",
    specs: [
      "Primary material: Glazed ceramic",
      "Finish: Semi-matte glaze with pooled interior surface",
      "Form variance: Hand-shaped; minor irregularities expected",
      "Detail: Green-dipped base (signature mark)",
    ],
    soldOut: true,
    side: "right",
  },
  {
    num: "05", labelName: "CHASAKU", name: "CHASHAKU",
    left: "38%", top: "38%",
    videoLeft: "72%", videoTop: "60%", videoScale: 1.7,
    price: "$20 USD",
    description: "A traditional bamboo scoop used to transfer matcha from storage to bowl. Designed for ritual consistency rather than exact measurement.",
    specs: [
      "Material: Heat-bent bamboo",
      "Finish: Untreated",
      "Form: Curved tip, flattened handle",
      "Dose reference: Approx. one scoop per serving",
      "Detail: Green-dipped base (signature mark)",
    ],
    soldOut: true,
  },
];

function VaultLabel({ num, labelName, visible, onClick }: { num: string; labelName: string; visible: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "stretch",
        height: BAR_H,
        border: `1px solid ${HUD_COLOR}`,
        overflow: "hidden",
        cursor: "pointer",
        userSelect: "none",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        whiteSpace: "nowrap",
      }}
    >
      {/* Number block */}
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
          {labelName}
        </span>
      </div>
    </div>
  );
}

export default function TheVault() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [labelsVisible, setLabelsVisible] = useState(false);
  const [selected, setSelected] = useState<LabelData | null>(null);

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

  const detailOpen = selected !== null;

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
      <div style={{ position: "absolute", top: 16, left: 20, zIndex: 20 }}>
        <span className="font-lockscreen" style={{ fontSize: "clamp(40px, 6.5vw, 100px)", color: "#ffffff", lineHeight: 1, letterSpacing: "-0.01em" }}>
          The
        </span>
      </div>

      {/* ── "Vault" — top-right ── */}
      <div style={{ position: "absolute", top: 16, right: 56, zIndex: 20 }}>
        <span className="font-lockscreen" style={{ fontSize: "clamp(40px, 6.5vw, 100px)", color: "#ffffff", lineHeight: 1, letterSpacing: "-0.01em" }}>
          Vault
        </span>
      </div>

      {/* ── Scroll-scrubbed video — shifts away from detail panel ── */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={handleVideoLoad}
        style={{
          position: "absolute",
          top: detailOpen ? (selected?.videoTop ?? "50%") : "50%",
          left: detailOpen ? (selected?.videoLeft ?? "50%") : "50%",
          transform: detailOpen
            ? `translate(-50%, -50%) scale(${selected?.videoScale ?? 1})`
            : "translate(-50%, -50%) scale(1)",
          width: "clamp(400px, 62vw, 660px)",
          height: "auto",
          display: "block",
          zIndex: 5,
          transition: "left 0.7s cubic-bezier(0.65,0,0.35,1), top 0.7s cubic-bezier(0.65,0,0.35,1), transform 0.7s cubic-bezier(0.65,0,0.35,1)",
        }}
        src="/videos/VAULT_TIMESTRECH_AE.webm"
      />

      {/* ── Item labels — hidden when detail is open ── */}
      {VAULT_LABELS.map((label, i) => (
        <div
          key={label.num}
          style={{
            position: "absolute",
            left: label.left,
            top: label.top,
            zIndex: 20,
            pointerEvents: labelsVisible && !detailOpen ? "auto" : "none",
            opacity: detailOpen ? 0 : 1,
            transition: `opacity 0.35s ease, transform 0.4s ease`,
            transitionDelay: labelsVisible && !detailOpen ? `${i * 60}ms` : "0ms",
          }}
        >
          <VaultLabel
            num={label.num}
            labelName={label.labelName}
            visible={labelsVisible && !detailOpen}
            onClick={() => setSelected(label)}
          />
        </div>
      ))}

      {/* ── Product detail panel ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          ...(selected?.side === "right" ? { right: 0 } : { left: 0 }),
          width: "40%",
          height: "100%",
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 40px 40px",
          opacity: detailOpen ? 1 : 0,
          transform: detailOpen
            ? "translateX(0)"
            : (selected as LabelData | null)?.side === "right" ? "translateX(24px)" : "translateX(-24px)",
          pointerEvents: detailOpen ? "auto" : "none",
          transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
        }}
      >
        {/* Back link */}
        <div
          onClick={() => setSelected(null)}
          style={{ cursor: "pointer", marginBottom: 32 }}
        >
          <span className="font-mono-frag" style={{ fontSize: 13, color: "#5a6470", letterSpacing: "0.08em" }}>
            {"< back to all products"}
          </span>
        </div>

        {selected && (
          <>
            <div className="font-mono-frag" style={{ fontSize: 20, color: "#1a1a1a", letterSpacing: "0.14em", marginBottom: 8 }}>
              {selected.name}
            </div>
            <div className="font-mono-frag" style={{ fontSize: 16, color: "#1a1a1a", letterSpacing: "0.08em", marginBottom: 20 }}>
              {selected.price}
            </div>
            <p className="font-mono-frag" style={{ fontSize: 13, color: "#3a3a3a", lineHeight: 1.7, marginBottom: 24 }}>
              {selected.description}
            </p>
            <div className="font-mono-frag" style={{ fontSize: 12, color: "#5a6470", letterSpacing: "0.06em", marginBottom: 10 }}>
              Material Specification
            </div>
            <ul style={{ listStyle: "disc", paddingLeft: 18, margin: 0 }}>
              {selected.specs.map((s, i) => (
                <li key={i} className="font-mono-frag" style={{ fontSize: 12, color: "#3a3a3a", lineHeight: 1.9 }}>
                  {s}
                </li>
              ))}
            </ul>
            {selected.soldOut && (
              <div className="font-mono-frag" style={{ fontSize: 16, color: "#1a1a1a", letterSpacing: "0.1em", marginTop: 28 }}>
                (SOLD OUT)
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Bottom hint ── */}
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
        <div style={{ opacity: labelsVisible ? 0 : 1, transition: "opacity 0.4s ease", position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 0 }}>
          <ScrollDownText />
        </div>
        <div style={{ opacity: labelsVisible && !detailOpen ? 1 : 0, transition: "opacity 0.4s ease" }}>
          <span className="font-mono-frag" style={{ fontSize: 13, color: "#8A96A0", letterSpacing: "0.1em" }}>
            (click on the labels for product info)
          </span>
        </div>
      </div>
    </section>
  );
}
