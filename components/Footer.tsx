"use client";

const GREEN = "#8ccc00";
const INK = "#111111";
const BORDER = `1px solid ${INK}`;

const DEALERS = [
  {
    num: "01",
    name: "AGNES ANDREYANA",
    role: "web designer",
    photo: "/images/agnes adreyana.png",
    bio: "An interaction designer and co-founder of Surd Studio, a digital design practice focused on crafting intuitive and highly satisfying web experiences.",
    links: ["(instagram)", "(linkedin)", "(surd.studio)"],
  },
  {
    num: "02",
    name: "WILDY RIFTIAN",
    role: "visual designer",
    photo: "/images/wildy riftian.png",
    bio: "A visual designer working across 3D motion, branding, and visual systems. Within Matcha Cartel, he focuses on visual language and world-building, translating abstract ideas into tangible design systems.",
    links: ["(instagram)", "(linkedin)", "(wildyriftian.com)"],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: GREEN,
        color: INK,
        position: "relative",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr 1fr clamp(140px, 14vw, 220px)",
        gridTemplateRows: "auto 1fr",
      }}
    >
      {/* ── Textures ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/foot1.png"
        alt=""
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", mixBlendMode: "exclusion",
          pointerEvents: "none", zIndex: 100,
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/foot2.png"
        alt=""
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", mixBlendMode: "multiply", opacity: 0.5,
          pointerEvents: "none", zIndex: 101,
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/foot3.png"
        alt=""
        style={{
          position: "absolute", right: 0, top: 0, height: "100%", width: "auto",
          mixBlendMode: "multiply", opacity: 0.5,
          pointerEvents: "none", zIndex: 102,
        }}
      />

      {/* ── ROW 1 Col 1–3: Logo block ── */}
      <div
        style={{
          gridColumn: "1 / 3",
          gridRow: "1",
          borderRight: BORDER,
          padding: "10px 16px 14px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          position: "relative",
        }}
      >
        {/* English logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/svgs/logo-en.svg"
          alt="MatchaCartel"
          style={{ width: "100%", height: "auto", display: "block", filter: "brightness(0)" }}
        />
        {/* Japanese logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/svgs/logo-jp.svg"
          alt="抹茶カルテル"
          style={{ width: "42%", height: "auto", display: "block", filter: "brightness(0)", marginTop: 6 }}
        />
      </div>

      {/* ── ROW 1 Col 4: Copyright ── */}
      <div
        style={{
          gridColumn: "3",
          gridRow: "1",
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
        }}
      >
        <div
          className="font-lockscreen"
          style={{
            fontSize: "clamp(7px, 0.65vw, 10px)",
            lineHeight: 1.85,
            letterSpacing: "0.04em",
            color: INK,
            textTransform: "uppercase",
          }}
        >
          ©2026 Matcha Cartel.<br />
          All Rights Reserved.<br />
          Distributed Under Strict Control.<br />
          Non-Transferable.
        </div>
      </div>

      {/* ── ROW 2 Col 1: Behind the Cartels ── */}
      <div
        style={{
          gridColumn: "1",
          gridRow: "2",
          padding: "16px 18px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
        }}
      >
        <div
          className="font-mono-frag"
          style={{
            fontSize: "clamp(9px, 0.85vw, 13px)",
            letterSpacing: "0.12em",
            color: INK,
            paddingBottom: 8,
            marginBottom: 16,
          }}
        >
          BEHIND THE CARTELS
        </div>
        <p
          className="font-mono-frag"
          style={{ fontSize: "clamp(9px, 0.8vw, 12px)", lineHeight: 1.75, color: INK, margin: "0 0 16px 0" }}
        >
          Matcha Cartel began as a shared interest in matcha and an observation of its rapid rise as a global trend. As demand grew, scarcity followed, shifting matcha from ritual ingredient to high-value commodity.
        </p>
        <p
          className="font-mono-frag"
          style={{ fontSize: "clamp(9px, 0.8vw, 12px)", lineHeight: 1.75, color: INK, margin: 0 }}
        >
          This project reframes matcha through a darker visual language, presenting it as something controlled, traded, and desired rather than purely ceremonial. Familiar wellness aesthetics are replaced with systems of restriction, excess, and spectacle.
        </p>
      </div>

      {/* ── ROW 2 Col 2: The Dealers ── */}
      <div
        style={{
          gridColumn: "2",
          gridRow: "2",
          padding: "16px 18px 24px",

          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
        }}
      >
        <div
          className="font-mono-frag"
          style={{
            fontSize: "clamp(9px, 0.85vw, 13px)",
            letterSpacing: "0.12em",
            color: INK,
            paddingBottom: 8,
            marginBottom: 16,
          }}
        >
          THE DEALERS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {DEALERS.map((d) => (
            <div key={d.num} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.photo}
                alt={d.name}
                style={{
                  flexShrink: 0,
                  width: "clamp(70px, 8vw, 115px)",
                  height: "clamp(85px, 10vw, 140px)",
                  objectFit: "cover", objectPosition: "top center",
                  display: "block",
                  filter: "grayscale(100%) contrast(1.1)",
                  mixBlendMode: "overlay",
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  className="font-mono-frag"
                  style={{ fontSize: "clamp(8px, 0.75vw, 11px)", color: INK, lineHeight: 1.9, marginBottom: 4 }}
                >
                  DEALER {d.num}:<br />
                  {d.name} ({d.role})
                </div>
                <p
                  className="font-mono-frag"
                  style={{ fontSize: "clamp(8px, 0.72vw, 11px)", color: INK, lineHeight: 1.75, margin: 0 }}
                >
                  {d.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ROW 2 Col 3: Syndicates ── */}
      <div
        style={{
          gridColumn: "3",
          gridRow: "2",
          padding: "16px 18px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
        }}
      >
        <div
          className="font-mono-frag"
          style={{
            fontSize: "clamp(9px, 0.85vw, 13px)",
            letterSpacing: "0.12em",
            color: INK,
            paddingBottom: 8,
            marginBottom: 16,
          }}
        >
          SYNDICATES
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {DEALERS.map((d) => (
            <div key={d.num} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {d.links.map((link) => (
                <span
                  key={link}
                  className="font-mono-frag"
                  style={{
                    fontSize: "clamp(9px, 0.8vw, 12px)",
                    color: INK,
                    lineHeight: 2,
                    cursor: "pointer",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                >
                  {link}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>


    </footer>
  );
}
