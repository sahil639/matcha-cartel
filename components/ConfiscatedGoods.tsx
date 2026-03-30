"use client";

import NavDots from "./NavDots";

// Each item: position as % of the left panel, z-index, sizes.
// All coordinates are the item CENTER point, then we translate(-50%,-50%).
// labelAnchor is where the label box appears relative to the item center.
const ITEMS = [
  {
    num: "01",
    name: "CHAWAN",
    item:   "/images/chawan.png",
    shadow: "/images/chawan-shadow.png",
    // Large bowl, center-left, mid-depth
    cx: "28%", cy: "46%",
    width: "clamp(200px, 23vw, 340px)",
    shadowOffsetX: "4%", shadowOffsetY: "6%",
    z: 3,
    labelCx: "19%", labelCy: "64%",
  },
  {
    num: "02",
    name: "MATCHA POWDER",
    item:   "/images/matcha powder.png",
    shadow: "/images/matcha powder-shadow.png",
    // Round tin, right of chasen
    cx: "66%", cy: "58%",
    width: "clamp(130px, 14vw, 210px)",
    shadowOffsetX: "3%", shadowOffsetY: "5%",
    z: 4,
    labelCx: "62%", labelCy: "76%",
  },
  {
    num: "03",
    name: "CHASEN",
    item:   "/images/chasen.png",
    shadow: "/images/chasen-shadow.png",
    // Bamboo whisk, center-front
    cx: "52%", cy: "50%",
    width: "clamp(120px, 13vw, 200px)",
    shadowOffsetX: "2%", shadowOffsetY: "5%",
    z: 7,
    labelCx: "51%", labelCy: "72%",
  },
  {
    num: "04",
    name: "CHASEN STAND",
    item:   "/images/chasen-stand.png",
    shadow: null,
    // Small cup holder, center-left of chasen
    cx: "38%", cy: "57%",
    width: "clamp(90px, 10vw, 155px)",
    shadowOffsetX: "0", shadowOffsetY: "0",
    z: 5,
    labelCx: "34%", labelCy: "73%",
  },
  {
    num: "05",
    name: "SIEVE",
    item:   "/images/sieve.png",
    shadow: "/images/sieve-shadow.png",
    // Strainer, far lower-left
    cx: "13%", cy: "65%",
    width: "clamp(140px, 16vw, 240px)",
    shadowOffsetX: "3%", shadowOffsetY: "4%",
    z: 6,
    labelCx: "10%", labelCy: "83%",
  },
  {
    num: "06",
    name: "KETTLE",
    item:   "/images/kettle.png",
    shadow: "/images/kettle-shadow.png",
    // Tall dark kettle, back-right
    cx: "58%", cy: "32%",
    width: "clamp(180px, 20vw, 300px)",
    shadowOffsetX: "4%", shadowOffsetY: "6%",
    z: 2,
    labelCx: "65%", labelCy: "56%",
  },
  {
    num: "07",
    name: "CHASHAKU",
    item:   "/images/chashaku.png",
    shadow: "/images/chashaku-shadow.png",
    // Long bamboo scoop, horizontal at bottom
    cx: "48%", cy: "82%",
    width: "clamp(300px, 34vw, 520px)",
    shadowOffsetX: "1%", shadowOffsetY: "3%",
    z: 1,
    labelCx: "46%", labelCy: "89%",
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

function ItemLabel({ num, name }: { num: string; name: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(4px)",
        padding: "3px 8px 3px 6px",
        gap: 0,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <span
        className="font-mono-frag"
        style={{ fontSize: 10, color: "#1a1a1a", letterSpacing: "0.04em", paddingRight: 7 }}
      >
        {num}
      </span>
      {/* Divider */}
      <div style={{ width: 1, height: 12, backgroundColor: "rgba(0,0,0,0.25)", marginRight: 7 }} />
      <span
        className="font-mono-frag"
        style={{ fontSize: 10, color: "#1a1a1a", letterSpacing: "0.08em" }}
      >
        {name}
      </span>
    </div>
  );
}

export default function ConfiscatedGoods() {
  return (
    <section
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        backgroundColor: "var(--bg)",
        overflow: "hidden",
      }}
    >
      {/* ── Left panel — items ── */}
      <div style={{ flex: 1, position: "relative" }}>

        {/* "CONFISCATED GOODS" heading */}
        <div style={{ position: "absolute", top: 20, left: 22, zIndex: 50 }}>
          <h2
            className="font-hubot"
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
            style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}
          >
            (inspect the labels)
          </span>
        </div>

        {/* Items */}
        {ITEMS.map((item) => (
          <div key={item.num}>
            {/* Shadow layer */}
            {item.shadow && (
              <div
                style={{
                  position: "absolute",
                  left: item.cx,
                  top:  item.cy,
                  transform: `translate(calc(-50% + ${item.shadowOffsetX}), calc(-50% + ${item.shadowOffsetY}))`,
                  width: item.width,
                  zIndex: item.z,
                  pointerEvents: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.shadow}
                  alt=""
                  style={{ width: "100%", height: "auto", display: "block", opacity: 0.6 }}
                />
              </div>
            )}

            {/* Item image */}
            <div
              style={{
                position: "absolute",
                left: item.cx,
                top:  item.cy,
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
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            {/* Label */}
            <div
              style={{
                position: "absolute",
                left: item.labelCx,
                top:  item.labelCy,
                transform: "translate(-50%, -50%)",
                zIndex: 40,
              }}
            >
              <ItemLabel num={item.num} name={item.name} />
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
        {/* Nav dots */}
        <div style={{ alignSelf: "flex-end", marginBottom: 20 }}>
          <NavDots total={7} active={4} />
        </div>

        {/* "ASSEMBLY PROTOCOL" heading */}
        <h2
          className="font-hubot"
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

        {/* Numbered list */}
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
}
