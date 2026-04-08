"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LIME = "#8dff00";

// ─── Glitch per-character (same pattern as other sections) ───────────────────

function GlitchChar({ char }: { char: string }) {
  const [opacity, setOpacity] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (char === " " || char === "°" || char === '"') return;
    let running = true;
    function flicker() {
      if (!running) return;
      let count = 0;
      const burstCount = Math.floor(Math.random() * 4) + 2;
      function burst() {
        if (!running || count >= burstCount) {
          setOpacity(1);
          timerRef.current = setTimeout(flicker, 1000 + Math.random() * 2500);
          return;
        }
        setOpacity(Math.random() > 0.5 ? 0.08 + Math.random() * 0.2 : 1);
        count++;
        timerRef.current = setTimeout(burst, 30 + Math.random() * 60);
      }
      burst();
    }
    timerRef.current = setTimeout(flicker, Math.random() * 1500);
    return () => { running = false; if (timerRef.current) clearTimeout(timerRef.current); };
  }, [char]);

  return <span style={{ opacity, display: "inline-block" }}>{char === " " ? "\u00A0" : char}</span>;
}

function GlitchText({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <GlitchChar key={i} char={ch} />
      ))}
    </>
  );
}

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

const BURST = [
  { src: "/images/bigmatachcup.png",     w: 260, h: 185, tx: "-68vw", ty: "-55vh" },
  { src: "/images/catmatcha.png",        w: 200, h: 200, tx:   "5vw", ty: "-72vh" },
  { src: "/images/matchahand.png",       w: 240, h: 170, tx:  "65vw", ty: "-52vh" },
  { src: "/images/matchaburger.png",     w: 250, h: 180, tx:  "72vw", ty:   "4vh" },
  { src: "/images/matchalvbag.png",      w: 220, h: 155, tx:  "63vw", ty:  "55vh" },
  { src: "/images/sppilled matcha.png",  w: 230, h: 160, tx:   "4vw", ty:  "72vh" },
  { src: "/images/matchagirldinner.png", w: 245, h: 175, tx: "-65vw", ty:  "54vh" },
  { src: "/images/matchammee.png",       w: 215, h: 155, tx: "-72vw", ty:   "3vh" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Hyperfixation() {
  const sectionRef      = useRef<HTMLElement>(null);
  const titleRef        = useRef<HTMLDivElement>(null);
  const attributionRef  = useRef<HTMLDivElement>(null);
  const imageRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const videoLayoutRef  = useRef<HTMLDivElement>(null);
  const leftPanelRef    = useRef<HTMLDivElement>(null);
  const rightPanelRef   = useRef<HTMLDivElement>(null);
  const videoColumnRef  = useRef<HTMLDivElement>(null);
  const activeVideoRef  = useRef(0);
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

      // ── Stage 1: Images burst one-by-one ─────────────────────────────────
      BURST.forEach((conf, i) => {
        const el = imageRefs.current[i];
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: 0, x: 0, y: 0, scale: 0 },
          { opacity: 1, x: conf.tx, y: conf.ty, scale: 1, duration: 2, ease: "power2.inOut" },
          i * 1.5
        );
      });
      tl.to({}, { duration: 0.5 });

      // ── Stage 2: Title fades, video layout scales in ──────────────────────
      tl.to(titleRef.current,     { opacity: 0, y: -40, duration: 1 }, 13);
      tl.to(attributionRef.current, { opacity: 0, duration: 0.5 },     13);
      tl.fromTo(
        videoLayoutRef.current,
        { opacity: 0, scale: 0.05 },
        { opacity: 1, scale: 1, duration: 2, ease: "power3.inOut" },
        13.3
      );

      // ── Stage 3: Left + right panels slide in ─────────────────────────────
      tl.fromTo(leftPanelRef.current,  { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1.2 }, 15.3);
      tl.fromTo(rightPanelRef.current, { opacity: 0, x:  30 }, { opacity: 1, x: 0, duration: 1.2 }, 15.3);
      tl.to({}, { duration: 3.5 });

      // ── Stage 4: Scroll-up video transitions (no fade) ────────────────────
      let cursor = 20;
      for (let i = 1; i < VIDEOS.length; i++) {
        tl.to(videoColumnRef.current, {
          y: `-${i * 100}%`,
          duration: 1.2,
          ease: "power2.inOut",
        }, cursor);
        cursor += 2.5;
      }
      tl.to({}, { duration: 1 }, 29);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ width: "100%", height: "100vh", backgroundColor: "#000", overflow: "hidden", position: "relative" }}
    >
      {/* ── Burst images ── */}
      {BURST.map((img, i) => (
        <div
          key={i}
          ref={el => { imageRefs.current[i] = el; }}
          style={{
            position: "absolute",
            left: "50%", top: "50%",
            width: img.w, height: img.h,
            marginLeft: -img.w / 2, marginTop: -img.h / 2,
            opacity: 0, overflow: "hidden", zIndex: 20,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      ))}

      {/* ── Title screen ── */}
      <div
        ref={titleRef}
        style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 48, zIndex: 30, pointerEvents: "none",
        }}
      >
        {/*
          "Hyperfixation." — font-lockscreen
          clamp(52px, 8vw, 128px)
        */}
        <h1
          className="font-lockscreen"
          style={{
            fontSize: "clamp(52px, 8vw, 128px)",
            color: LIME,
            lineHeight: 1,
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          Hyperfixation.
        </h1>
        {/* scroll hint — 48px below title via gap */}
        <span
          className="font-mono-frag"
          style={{ fontSize: 11, color: LIME, letterSpacing: "0.15em" }}
        >
          (scroll down)
        </span>
      </div>

      {/* ── Attribution — bottom left, white, fades on scroll ── */}
      <div
        ref={attributionRef}
        style={{ position: "absolute", bottom: 24, left: 20, zIndex: 35, pointerEvents: "none" }}
      >
        {/*
          Attribution text — font-mono-frag, 10px, white
        */}
        <div
          className="font-mono-frag"
          style={{ fontSize: 10, color: "#ffffff", lineHeight: 1.6 }}
        >
          Images sourced from Instagram and Pinterest.<br />
          Rights belong to respective owners.
        </div>
      </div>

      {/* ── Video layout (3-col grid) ── */}
      <div
        ref={videoLayoutRef}
        style={{
          position: "absolute", inset: 0, opacity: 0, zIndex: 40,
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          backgroundColor: "#000",
        }}
      >
        {/* ── Left panel ── */}
        <div
          ref={leftPanelRef}
          style={{
            padding: "36px 28px 28px",
            display: "flex", flexDirection: "column",
            opacity: 0,
            borderRight: "0.5px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Heading + description side by side */}
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            {/*
              "Obsession Archives." — font-lockscreen
              clamp(22px, 2.8vw, 42px)
            */}
            <h2
              className="font-lockscreen"
              style={{
                fontSize: "clamp(22px, 2.8vw, 42px)",
                color: LIME, lineHeight: 1.1,
                margin: 0, flexShrink: 0,
              }}
            >
              Obsession<br />Archives.
            </h2>
            {/*
              Description — font-mono-frag, 12px, green
            */}
            <p
              className="font-mono-frag"
              style={{ fontSize: 12, color: LIME, lineHeight: 1.7, margin: 0 }}
            >
              A record of unconventional uses and excess consumption, reflecting matcha&apos;s fixation beyond tradition.
            </p>
          </div>

          {/* Push thumbnails + scroll down to bottom */}
          <div style={{ flex: 1 }} />

          {/* Thumbnail strip — 9:16 ratio */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            {VIDEOS.map((v, i) => (
              <div
                key={i}
                style={{
                  width: 44,
                  aspectRatio: "9 / 16",
                  border: `1px solid ${i === activeVideo ? LIME : "rgba(255,255,255,0.12)"}`,
                  overflow: "hidden", flexShrink: 0,
                  transition: "border-color 0.4s",
                }}
              >
                <video
                  src={v.src}
                  muted playsInline preload="metadata"
                  style={{
                    width: "100%", height: "100%", objectFit: "cover", display: "block",
                    filter: i === activeVideo ? "none" : "grayscale(100%)",
                    transition: "filter 0.4s",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Scroll down — bottom of left column, paddingBottom 28px applied by panel */}
          <span
            className="font-mono-frag"
            style={{ fontSize: 11, color: LIME, letterSpacing: "0.15em" }}
          >
            (scroll down)
          </span>
        </div>

        {/* ── Center: scroll-up video column ── */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          {/* Column of videos — translateY'd by GSAP */}
          <div
            ref={videoColumnRef}
            style={{ display: "flex", flexDirection: "column", height: "100%", willChange: "transform" }}
          >
            {VIDEOS.map((v, i) => (
              <div
                key={i}
                style={{
                  height: "100%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "20px 8px",
                }}
              >
                <video
                  src={v.src}
                  autoPlay muted loop playsInline
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div
          ref={rightPanelRef}
          style={{
            padding: "36px 28px 28px",
            display: "flex", flexDirection: "column",
            opacity: 0,
            borderLeft: "0.5px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* TOP: counter + glitch coords */}
          <div>
            {/*
              Counter — font-mono-frag, 12px, green
            */}
            <div
              className="font-mono-frag"
              style={{ fontSize: 12, color: LIME, marginBottom: 6 }}
            >
              {vid.counter}
            </div>
            {/*
              Coordinates — font-mono-frag, 10px, green, glitch effect
            */}
            <div
              className="font-mono-frag"
              style={{ fontSize: 10, color: LIME, letterSpacing: "0.06em" }}
            >
              <GlitchText text={vid.coords} />
            </div>
          </div>

          {/* Spacer — pushes everything below to the bottom */}
          <div style={{ flex: 1 }} />

          {/* BOTTOM: title, location, courtesy, description */}
          <div>
            {/*
              Title — font-mono-frag, clamp(13px, 1.5vw, 22px), green
            */}
            <h3
              className="font-mono-frag"
              style={{
                fontSize: "clamp(13px, 1.5vw, 22px)",
                color: LIME, letterSpacing: "0.04em",
                lineHeight: 1.25, margin: "0 0 20px 0",
              }}
            >
              {vid.title}
            </h3>

            {/*
              Location / Courtesy — font-mono-frag, 11px, green
            */}
            <div className="font-mono-frag" style={{ fontSize: 11, color: LIME, lineHeight: 2.1 }}>
              <div>LOCATION : {vid.location}</div>
              <div style={{ marginTop: 2 }}>COURTESY OF: {vid.courtesy}</div>
              <div style={{ marginTop: 2, opacity: 0.55 }}>(link to original source)</div>
            </div>

            {/*
              Description — font-mono-frag, 11px, green
            */}
            <p
              className="font-mono-frag"
              style={{ fontSize: 11, color: LIME, lineHeight: 1.75, marginTop: 24 }}
            >
              {vid.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
