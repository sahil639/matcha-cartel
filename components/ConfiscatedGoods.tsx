"use client";

import { useState, useRef } from "react";

const ITEMS = [
  {
    num: "01",
    name: "CHAWAN",
    item: "/images/chawan.png",
    shadow: "/images/chawan-shadow.png",
    video: "/videos/Bowl.mp4",
    cx: "38%", cy: "49%",
    width: "clamp(323px, 36.96vw, 554px)",
    z: 3,
    labelCx: "19%", labelCy: "60%",
  },
  {
    num: "06",
    name: "KETTLE",
    item: "/images/kettle.png",
    shadow: "/images/kettle-shadow.png",
    video: "/videos/Kettle.mp4",
    cx: "70%", cy: "40%",
    width: "clamp(336px, 37.8vw, 574px)",
    z: 2,
    labelCx: "72%", labelCy: "54%",
  },
  {
    num: "05",
    name: "SIEVE",
    item: "/images/sieve.png",
    shadow: "/images/sieve-shadow.png",
    video: "/videos/Strainer.mp4",
    cx: "30%", cy: "71%",
    width: "clamp(340px, 37.8vw, 425px)",
    z: 4,
    labelCx: "5%", labelCy: "78%",
  },
  {
    num: "03",
    name: "CHASEN",
    item: "/images/chasen.png",
    shadow: "/images/chasen-shadow.png",
    video: "/videos/Chasen.mp4",
    cx: "58%", cy: "64%",
    width: "clamp(336px, 37.8vw, 567px)",
    z: 6,
    labelCx: "45%", labelCy: "74%",
  },
  {
    num: "04",
    name: "CHASEN STAND",
    item: "/images/chasenstand.png",
    shadow: "/images/chasenstandshadow.png",
    video: "/videos/ChasenHolder.mp4",
    cx: "39%", cy: "69%",
    width: "clamp(347px, 38.2vw, 590px)",
    z: 7,
    labelCx: "33%", labelCy: "78%",
  },
  {
    num: "02",
    name: "MATCHA POWDER",
    item: "/images/matcha powder.png",
    shadow: "/images/matcha powder-shadow.png",
    video: "/videos/MatchaCan.mp4",
    cx: "75%", cy: "70%",
    width: "clamp(360px, 40.5vw, 655px)",
    z: 4,
    labelCx: "67%", labelCy: "75%",
  },
  {
    num: "07",
    name: "CHASHAKU",
    item: "/images/chashaku.png",
    shadow: "/images/chashaku-shadow.png",
    video: "/videos/Spoon.mp4",
    cx: "50%", cy: "74%",
    width: "clamp(380px, 44vw, 660px)",
    z: 1,
    labelCx: "40%", labelCy: "90%",
  },
] as const;

const ASSEMBLY_LIST = [
  "01.  CHAWAN",
  "02.  MATCHA POWDER",
  "03.  CHASEN",
  "04.  CHASEN STAND",
  "05.  SIEVE",
  "06.  KETTLE",
  "07.  CHASHAKU",
];

const HUD_COLOR = "#8A96A0";

// Mobile-specific item positions (relative to the confiscated goods panel)
const MOBILE_POSITIONS = [
  { cx: "30%", cy: "40%", w: "58vw", lcx: "10%", lcy: "52%" }, // 01 CHAWAN
  { cx: "72%", cy: "32%", w: "55vw", lcx: "66%", lcy: "46%" }, // 06 KETTLE
  { cx: "27%", cy: "70%", w: "50vw", lcx:  "8%", lcy: "79%" }, // 05 SIEVE
  { cx: "60%", cy: "58%", w: "52vw", lcx: "49%", lcy: "69%" }, // 03 CHASEN
  { cx: "37%", cy: "61%", w: "54vw", lcx: "26%", lcy: "71%" }, // 04 CHASEN STAND
  { cx: "74%", cy: "64%", w: "58vw", lcx: "67%", lcy: "74%" }, // 02 MATCHA POWDER
  { cx: "50%", cy: "84%", w: "62vw", lcx: "39%", lcy: "92%" }, // 07 CHASHAKU
];

function MobileConfiscatedGoods() {
  return (
    <section
      style={{
        width: "100%",
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Assembly Protocol panel ── */}
      <div
        style={{
          backgroundColor: "#0d0d0d",
          padding: "18px 16px 20px",
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          flexShrink: 0,
        }}
      >
        <h2
          className="font-lockscreen"
          style={{ fontSize: 26, color: "#ffffff", lineHeight: 1.05, margin: 0, flexShrink: 0, letterSpacing: "0.01em" }}
        >
          ASSEMBLY<br />PROTOCOL
        </h2>
        <div style={{ width: "0.5px", backgroundColor: "rgba(255,255,255,0.2)", alignSelf: "stretch", flexShrink: 0, marginTop: 2 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {ASSEMBLY_LIST.map((line) => (
            <div
              key={line}
              className="font-mono-frag"
              style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em", lineHeight: 1.6 }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* ── Confiscated Goods panel ── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          background: "radial-gradient(116.56% 67.63% at 50% 67.63%, #D7DCE3 6.05%, #A8AEBC 27.65%, #7E889A 58.67%, #5F6B7F 88.58%)",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* Heading */}
        <div style={{ position: "absolute", top: 14, left: 16, zIndex: 50 }}>
          <h2
            className="font-lockscreen"
            style={{ fontSize: 20, color: "#ffffff", margin: 0, lineHeight: 1, letterSpacing: "0.01em" }}
          >
            CONFISCATED GOODS
          </h2>
        </div>

        {/* Items */}
        {ITEMS.map((item, idx) => {
          const pos = MOBILE_POSITIONS[idx];
          return (
            <div key={item.num}>
              {/* Shadow */}
              <div
                style={{
                  position: "absolute",
                  left: pos.cx, top: pos.cy,
                  transform: "translate(-50%, -50%)",
                  width: pos.w,
                  zIndex: item.z,
                  pointerEvents: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.shadow} alt="" style={{ width: "100%", height: "auto", display: "block", opacity: 0.7 }} />
              </div>
              {/* Item image */}
              <div
                style={{
                  position: "absolute",
                  left: pos.cx, top: pos.cy,
                  transform: "translate(-50%, -50%)",
                  width: pos.w,
                  zIndex: item.z,
                  pointerEvents: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.item} alt={item.name} style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
              {/* Number badge */}
              <div
                style={{
                  position: "absolute",
                  left: pos.lcx, top: pos.lcy,
                  zIndex: item.z + 10,
                  backgroundColor: HUD_COLOR,
                  padding: "2px 6px",
                }}
              >
                <span className="font-mono-frag" style={{ fontSize: 10, color: "#ffffff", letterSpacing: "0.06em" }}>
                  {item.num}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ItemLabel({ num, name, video }: { num: string; name: string; video: string }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const BAR_H = 40;
  const NUM_W = 44;
  const CARD = 154;

  const handleEnter = () => {
    setHovered(true);
    const v = videoRef.current;
    if (v) { v.currentTime = 0; v.play(); }
  };

  const handleLeave = () => {
    setHovered(false);
    videoRef.current?.pause();
  };

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        userSelect: "none",
        cursor: "pointer",
        position: "relative",
        width: CARD,
        height: hovered ? CARD + BAR_H : BAR_H,
        whiteSpace: "nowrap",
        border: `1px solid ${HUD_COLOR}`,
        backgroundColor: "#ffffff",
        overflow: "hidden",
        transition: "height 0.35s ease",
      }}
    >
      {/* Video — padded above the bar */}
      <video
        ref={videoRef}
        src={video}
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 8, left: 8, right: 8,
          bottom: BAR_H + 8,
          width: `calc(100% - 16px)`,
          height: `calc(100% - ${BAR_H + 16}px)`,
          objectFit: "cover",
          display: "block",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s ease 0.2s",
        }}
      />

      {/* Label bar — pinned to bottom, always visible */}
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: BAR_H,
          display: "flex",
          borderTop: hovered ? `1px solid ${HUD_COLOR}` : "none",
        }}
      >
        <div
          style={{
            width: NUM_W,
            backgroundColor: "#8A96A0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span className="font-mono-frag" style={{ fontSize: 13, color: "#ffffff", letterSpacing: "0.06em" }}>
            {num}
          </span>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 120,
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
            borderLeft: `1px solid ${HUD_COLOR}`,
          }}
        >
          <span className="font-mono-frag" style={{ fontSize: 13, color: "#8796a1", letterSpacing: "0.1em" }}>
            {name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ConfiscatedGoods() {
  const desktop = (
    <section
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        background: "radial-gradient(116.56% 67.63% at 50% 67.63%, #D7DCE3 6.05%, #A8AEBC 27.65%, #7E889A 58.67%, #5F6B7F 88.58%)",
        overflow: "hidden",
      }}
    >
      {/* ── Left panel — items ── */}
      <div style={{ flex: 1, minWidth: 0, position: "relative", height: "100%" }}>

        {/* "CONFISCATED GOODS" heading */}
        <div style={{ position: "absolute", top: 20, left: 22, zIndex: 50 }}>
          <h2
            className="font-lockscreen"
            style={{
              fontSize: "clamp(16px, 2.2vw, 32px)",
              color: "#ffffff",
              margin: 0,
              lineHeight: 1,
              letterSpacing: "0.01em",
            }}
          >
            CONFISCATED GOODS
          </h2>
        </div>

        {/* "(inspect the labels)" hint */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 50,
          }}
        >
          <span
            className="font-mono-frag"
            style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}
          >
            (inspect the labels)
          </span>
        </div>

        {/* Items */}
        {ITEMS.map((item) => (
          <div key={item.num}>
            {/* Shadow */}
            {item.shadow && (
              <div
                style={{
                  position: "absolute",
                  left: item.cx,
                  top: item.cy,
                  transform: "translate(-50%, -50%)",
                  width: item.width,
                  zIndex: item.z,
                  pointerEvents: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.shadow} alt="" style={{ width: "100%", height: "auto", display: "block", opacity: 0.7 }} />
              </div>
            )}

            {/* Item image */}
            <div
              style={{
                position: "absolute",
                left: item.cx,
                top: item.cy,
                transform: "translate(-50%, -50%)",
                width: item.width,
                zIndex: item.z,
                pointerEvents: "none",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.item}
                alt={item.name}
                style={{ width: "100%", height: "auto", display: "block", position: "relative", zIndex: 1 }}
              />
            </div>

            {/* Label — bottom edge fixed at labelCy, grows upward on hover */}
            <div
              style={{
                position: "absolute",
                left: item.labelCx,
                top: item.labelCy,
                transform: "translateY(-100%)",
                zIndex: 40,
              }}
            >
              <ItemLabel num={item.num} name={item.name} video={item.video} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Right panel — dark sidebar ── */}
      <div
        style={{
          width: "clamp(200px, 18vw, 270px)",
          backgroundColor: "#0d0d0d",
          display: "flex",
          flexDirection: "column",
          padding: "16px 18px",
          borderLeft: "0.5px solid rgba(100,120,130,0.2)",
          flexShrink: 0,
        }}
      >
        <h2
          className="font-lockscreen"
          style={{
            fontSize: "clamp(20px, 2.8vw, 42px)",
            color: "#ffffff",
            margin: "0 0 32px 0",
            lineHeight: 1.05,
            letterSpacing: "0.01em",
          }}
        >
          ASSEMBLY<br />PROTOCOL
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {ASSEMBLY_LIST.map((line) => (
            <div
              key={line}
              className="font-mono-frag"
              style={{
                fontSize: "clamp(9px, 0.85vw, 12px)",
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.08em",
                lineHeight: 1.6,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <>
      <div className="block md:hidden">
        <MobileConfiscatedGoods />
      </div>
      <div className="hidden md:block">
        {desktop}
      </div>
    </>
  );
}
