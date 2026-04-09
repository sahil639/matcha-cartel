"use client";

// Each item: position as % of the left panel, z-index, sizes.
// shadowOffset: how far the shadow shifts relative to the item center (should be ~0 so shadow sits under item)
const ITEMS = [
  {
    num: "01",
    name: "CHAWAN",
    item:   "/images/chawan.png",
    shadow: "/images/chawan-shadow.png",
    cx: "28%", cy: "44%",
    width: "clamp(308px, 35.2vw, 528px)",
    shadowOffsetX: "0%", shadowOffsetY: "0%",
    z: 3,
    labelCx: "19%", labelCy: "64%",
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
            style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}
          >
            (inspect the labels)
          </span>
        </div>

        {/* Items */}
        {ITEMS.map((item) => (
          <div key={item.num}>
            {/* Shadow — same center as item, sits directly under it */}
            {item.shadow && (
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
                  src={item.shadow}
                  alt=""
                  style={{ width: "100%", height: "auto", display: "block", opacity: 0.7 }}
                />
              </div>
            )}

            {/* Item image — same center, higher z within same z band via isolation */}
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
                style={{ width: "100%", height: "auto", display: "block", position: "relative", zIndex: 1 }}
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
        {/* "ASSEMBLY PROTOCOL" heading */}
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
