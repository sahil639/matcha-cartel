"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavDots from "./NavDots";

gsap.registerPlugin(ScrollTrigger);

const LIME = "#8dff00";

// ─── Data ─────────────────────────────────────────────────────────────────────

const VIDEOS = [
  {
    src: "/videos/05_15L.mp4",
    counter: "(01/05)",
    coords: "°14'3.6'S  106°48'2.4 E",
    title: "15L OF MATCHA LATTE",
    location: "Moku Matcha, Jakarta, Indonesia",
    courtesy: "@onebigbite (instagram)",
    description:
      "Moku Matcha is a coffee shop in South Jakarta known for producing matcha at an unusually large scale. The shop offers a 15-liter matcha latte batch, prepared using Oku matcha and traditional chawan-based brewing methods. A single batch can yield up to 22 servings, with each chawan producing approximately four portions.",
  },
  {
    src: "/videos/04_MatchaBurger.mp4",
    counter: "(02/05)",
    coords: "22.3593° N,  114.1694° E",
    title: "MATCHA BURGER",
    location: "Hong Kong",
    courtesy: "@bumbulistine_cook (instagram)",
    description:
      "A matcha burger assembled by Hong Kong-based food content creator Charles of @bumbulistine_cook. Matcha is pressed into bread, cream, and fillings to form a compact, handheld form. The burger emphasizes visual impact and cohesion rather than flavor balance or traditional preparation.",
  },
  {
    src: "/videos/03_infus.mp4",
    counter: "(03/05)",
    coords: "8°39'27.0\"S  115°10'25.5\"E",
    title: "MATCHA IV DRIP",
    location: "Buba Tee, Bali, Indonesia",
    courtesy: "@bossue_ (tiktok)",
    description:
      "An IV drip-styled matcha drink served at Buba Tea, a Bali based beverage shop. Matcha is poured into transparent infusion bags and released through tubing directly into a glass, borrowing the visual language of medical treatment and emphasizing ritualized consumption.",
  },
  {
    src: "/videos/02_Table.mp4",
    counter: "(04/05)",
    coords: "40.7° N,  111.9° W",
    title: "GIANT MATCHA LATTE TABLE",
    location: "Salt Lake City, Utah",
    courtesy: "@kamlerlancreations (instagram)",
    description:
      "Created by Kamberland Creations, known for building furniture inspired by food. The Matcha Latte Table turns matcha into an object you can sit with, and serve from. What is usually a single drink becomes installation, scaling matcha into something excessive, communal, and impossible to ignore.",
  },
  {
    src: "/videos/01_MATCHA LIQUER.mp4",
    counter: "(05/05)",
    coords: "40.7128° N,  74.0060° W",
    title: "THE FIRST MATCHA LIQUEUR",
    location: "New York City, NY",
    courtesy: "@mblingushi (instagram)",
    description:
      "The first recorded matcha liqueur, combining ceremonial-grade Matcha with premium clear alcohol. This product formalizes Matcha as a shelf-stable spirit, shifting it from a brewed tea to a bottled liqueur designed for contemporary consumption.",
  },
];

// Images burst one-by-one from center, fly to a corner and exit off-screen.
// No rotation. tx/ty are the final off-screen positions in vw/vh.
const BURST = [
  { src: "/images/bigmatachcup.png",    w: 260, h: 185, tx: "-68vw", ty: "-55vh" }, // top-left
  { src: "/images/catmatcha.png",       w: 200, h: 200, tx:   "5vw", ty: "-72vh" }, // top-center
  { src: "/images/matchahand.png",      w: 240, h: 170, tx:  "65vw", ty: "-52vh" }, // top-right
  { src: "/images/matchaburger.png",    w: 250, h: 180, tx:  "72vw", ty:   "4vh" }, // right
  { src: "/images/matchalvbag.png",     w: 220, h: 155, tx:  "63vw", ty:  "55vh" }, // bottom-right
  { src: "/images/sppilled matcha.png", w: 230, h: 160, tx:   "4vw", ty:  "72vh" }, // bottom
  { src: "/images/matchagirldinner.png",w: 245, h: 175, tx: "-65vw", ty:  "54vh" }, // bottom-left
  { src: "/images/matchammee.png",      w: 215, h: 155, tx: "-72vw", ty:   "3vh" }, // left
];

// ─── Timeline plan (30 total units) ───────────────────────────────────────────
// Stage 1 — image burst:      t=0  → 13   (8 images, stagger 1.5, dur 2 each)
// Stage 2 — transition:       t=13 → 16.5 (fade title, grow video layout)
// Stage 3 — text panels:      t=16.5 → 20 (slide in left+right, hold)
// Stage 4 — video sequence:   t=20 → 30   (4 transitions × 2.5 units)
//
// Progress thresholds for setActiveVideo:
//   vid 1 → p ≥ 0.667 (t=20)
//   vid 2 → p ≥ 0.75  (t=22.5)
//   vid 3 → p ≥ 0.833 (t=25)
//   vid 4 → p ≥ 0.917 (t=27.5)

// ─── Component ────────────────────────────────────────────────────────────────

export default function Hyperfixation() {
  const sectionRef     = useRef<HTMLElement>(null);
  const titleRef       = useRef<HTMLDivElement>(null);
  const scrollHintRef  = useRef<HTMLDivElement>(null);
  const imageRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const videoLayoutRef = useRef<HTMLDivElement>(null);
  const leftPanelRef   = useRef<HTMLDivElement>(null);
  const rightPanelRef  = useRef<HTMLDivElement>(null);
  const videoWrapRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const activeVideoRef = useRef(0);
  const [activeVideo, setActiveVideo] = useState(0);

  const vid = VIDEOS[activeVideo];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=500%",
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate(self) {
            const p = self.progress;
            const vIdx =
              p >= 0.917 ? 4 :
              p >= 0.833 ? 3 :
              p >= 0.75  ? 2 :
              p >= 0.667 ? 1 : 0;
            if (vIdx !== activeVideoRef.current) {
              activeVideoRef.current = vIdx;
              setActiveVideo(vIdx);
            }
          },
        },
      });

      // ── Stage 1: Images burst one-by-one, grow from 0, fly off-screen ─────
      // Each image: scale 0+opacity 0 at center → scale 1+opacity 1 at exit corner.
      // Stagger: 1.5 units between starts (minimal overlap = "one by one" feel).
      BURST.forEach((conf, i) => {
        const el = imageRefs.current[i];
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: 0, x: 0, y: 0, scale: 0 },
          { opacity: 1, x: conf.tx, y: conf.ty, scale: 1, duration: 2, ease: "power2.inOut" },
          i * 1.5 // absolute start position in timeline
        );
      });
      // After last image (starts at 10.5, ends at 12.5), hold briefly to t=13
      tl.to({}, { duration: 0.5 }); // playhead → 13

      // ── Stage 2: Transition — title fades, video layout scales from center ─
      tl.to(titleRef.current,      { opacity: 0, y: -40, duration: 1 },   13);
      tl.to(scrollHintRef.current, { opacity: 0, duration: 0.5 },          13);
      // Video layout grows from near-zero (left+right panels still opacity:0,
      // so only the center column is visible as it expands — looks like the
      // center video growing from the middle of the screen)
      tl.fromTo(
        videoLayoutRef.current,
        { opacity: 0, scale: 0.05 },
        { opacity: 1, scale: 1, duration: 2, ease: "power3.inOut" },
        13.3 // ends at 15.3
      );

      // ── Stage 3: Left + right panels slide in, hold on first video ─────────
      tl.fromTo(leftPanelRef.current,  { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1.2 }, 15.3);
      tl.fromTo(rightPanelRef.current, { opacity: 0, x:  30 }, { opacity: 1, x: 0, duration: 1.2 }, 15.3);
      // Panels finish at 16.5. Hold to t=20 before video transitions begin.
      tl.to({}, { duration: 3.5 }); // playhead → 20

      // ── Stage 4: Stacked video transitions (t=20 → 30) ────────────────────
      // 4 transitions × 2.5 units each. Previous fades while next grows from center.
      let cursor = 20;
      for (let i = 1; i < VIDEOS.length; i++) {
        const prev = videoWrapRefs.current[i - 1];
        const curr = videoWrapRefs.current[i];
        if (!prev || !curr) { cursor += 2.5; continue; }

        tl.to(prev,   { opacity: 0, scale: 0.9, duration: 1 },                              cursor);
        tl.fromTo(curr,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
          cursor + 0.3
        );
        cursor += 2.5;
      }
      // Ensure timeline reaches exactly t=30 so progress thresholds are correct
      tl.to({}, { duration: 1 }, 29);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ width: "100%", height: "100vh", backgroundColor: "#000", overflow: "hidden", position: "relative" }}
    >
      {/* ── Nav dots ── */}
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 100 }}>
        <NavDots total={7} active={4} />
      </div>

      {/* ── Burst images ── */}
      {/* Each starts centered at (0,0) with scale=0, flies to its corner exit */}
      {BURST.map((img, i) => (
        <div
          key={i}
          ref={el => { imageRefs.current[i] = el; }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: img.w,
            height: img.h,
            marginLeft: -img.w / 2,
            marginTop:  -img.h / 2,
            opacity: 0,
            overflow: "hidden",
            zIndex: 20,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      ))}

      {/* ── Main title (always on top during Stage 1) ── */}
      <div
        ref={titleRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 30,
          pointerEvents: "none",
        }}
      >
        <h1
          className="font-hubot"
          style={{
            fontSize: "clamp(52px, 8vw, 128px)",
            color: LIME,
            lineHeight: 1,
            letterSpacing: "-0.01em",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          Hyperfixation.
        </h1>
      </div>

      {/* ── Scroll hint + attribution ── */}
      <div
        ref={scrollHintRef}
        style={{ position: "absolute", bottom: 24, left: 0, right: 0, zIndex: 35, pointerEvents: "none" }}
      >
        <div style={{ textAlign: "center" }}>
          <span className="font-mono-frag" style={{ fontSize: 11, color: LIME, letterSpacing: "0.15em" }}>
            (scroll down)
          </span>
        </div>
        <div
          className="font-mono-frag"
          style={{
            position: "absolute",
            bottom: -4,
            left: 20,
            fontSize: 10,
            color: "rgba(255,255,255,0.22)",
            lineHeight: 1.6,
          }}
        >
          Images sourced from Instagram and Pinterest.<br />
          Rights belong to respective owners.
        </div>
      </div>

      {/* ── Video layout (3-col grid, scales up from center in Stage 2) ── */}
      <div
        ref={videoLayoutRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          zIndex: 40,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          backgroundColor: "#000",
        }}
      >
        {/* Left panel */}
        <div
          ref={leftPanelRef}
          style={{
            padding: "36px 28px 28px",
            display: "flex",
            flexDirection: "column",
            opacity: 0,
            borderRight: "0.5px solid rgba(255,255,255,0.08)",
          }}
        >
          <h2
            className="font-hubot"
            style={{ fontSize: "clamp(22px, 2.8vw, 42px)", color: LIME, lineHeight: 1.1, margin: "0 0 18px 0" }}
          >
            Obsession<br />Archives.
          </h2>
          <p
            className="font-mono-frag"
            style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 260, margin: 0 }}
          >
            A record of unconventional uses and excess consumption, reflecting matcha&apos;s fixation beyond tradition.
          </p>

          {/* Thumbnail strip */}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
            {VIDEOS.map((v, i) => (
              <div
                key={i}
                style={{
                  width: 50,
                  height: 50,
                  border: `1px solid ${i === activeVideo ? LIME : "rgba(255,255,255,0.12)"}`,
                  overflow: "hidden",
                  flexShrink: 0,
                  transition: "border-color 0.4s",
                }}
              >
                <video
                  src={v.src}
                  muted
                  playsInline
                  preload="metadata"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    filter: i === activeVideo ? "none" : "grayscale(100%)",
                    transition: "filter 0.4s",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Center: stacked videos */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          {VIDEOS.map((v, i) => (
            <div
              key={i}
              ref={el => { videoWrapRefs.current[i] = el; }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 8px",
                opacity: i === 0 ? 1 : 0,
              }}
            >
              <video
                src={v.src}
                autoPlay
                muted
                loop
                playsInline
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
              />
            </div>
          ))}

          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <span
              className="font-mono-frag"
              style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", whiteSpace: "nowrap" }}
            >
              (scroll down)
            </span>
          </div>
        </div>

        {/* Right panel — driven by activeVideo state */}
        <div
          ref={rightPanelRef}
          style={{
            padding: "36px 28px 28px",
            display: "flex",
            flexDirection: "column",
            opacity: 0,
            borderLeft: "0.5px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="font-mono-frag" style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginBottom: 6 }}>
            {vid.counter}
          </div>
          <div
            className="font-mono-frag"
            style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", marginBottom: 28, letterSpacing: "0.06em" }}
          >
            {vid.coords}
          </div>

          <h3
            className="font-mono-frag"
            style={{
              fontSize: "clamp(13px, 1.5vw, 22px)",
              color: LIME,
              letterSpacing: "0.04em",
              lineHeight: 1.25,
              margin: "0 0 20px 0",
            }}
          >
            {vid.title}
          </h3>

          <div className="font-mono-frag" style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", lineHeight: 2.1 }}>
            <div>LOCATION : {vid.location}</div>
            <div style={{ marginTop: 2 }}>COURTESY OF: {vid.courtesy}</div>
            <div style={{ marginTop: 2, color: "rgba(255,255,255,0.22)" }}>(link to original source)</div>
          </div>

          <p
            className="font-mono-frag"
            style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.75, marginTop: 24 }}
          >
            {vid.description}
          </p>
        </div>
      </div>
    </section>
  );
}
