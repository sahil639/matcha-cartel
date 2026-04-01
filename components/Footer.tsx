"use client";


const GREEN  = "#8dff00";
const INK    = "#111111";
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
        backgroundColor: GREEN,
        color: INK,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Top band: title + copyright ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          borderBottom: BORDER,
        }}
      >
        {/* Title block */}
        <div style={{ padding: "10px 16px 8px" }}>
          <div
            className="font-hubot"
            style={{
              fontSize: "clamp(64px, 11.5vw, 180px)",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
              color: INK,
              userSelect: "none",
            }}
          >
            MatchaCartel
          </div>
          <div
            className="font-hubot"
            style={{
              fontSize: "clamp(32px, 5.8vw, 90px)",
              lineHeight: 1.0,
              letterSpacing: "-0.01em",
              color: INK,
              marginTop: 6,
              userSelect: "none",
            }}
          >
            抹茶カルテル
          </div>
        </div>

        {/* Copyright + nav dots */}
        <div
          style={{
            borderLeft: BORDER,
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minWidth: "clamp(180px, 18vw, 280px)",
          }}
        >
          <div
            className="font-mono-frag"
            style={{
              fontSize: "clamp(8px, 0.75vw, 11px)",
              lineHeight: 1.8,
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
      </div>

      {/* ── Bottom band: 3 columns ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          minHeight: "clamp(260px, 36vh, 480px)",
        }}
      >
        {/* ── Col 1: Behind the Cartels ── */}
        <div
          style={{
            borderRight: BORDER,
            padding: "20px 18px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          <div
            className="font-mono-frag"
            style={{
              fontSize: "clamp(9px, 0.85vw, 13px)",
              letterSpacing: "0.12em",
              color: INK,
              borderBottom: BORDER,
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

        {/* ── Col 2: The Dealers ── */}
        <div
          style={{
            borderRight: BORDER,
            padding: "20px 18px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          <div
            className="font-mono-frag"
            style={{
              fontSize: "clamp(9px, 0.85vw, 13px)",
              letterSpacing: "0.12em",
              color: INK,
              borderBottom: BORDER,
              paddingBottom: 8,
              marginBottom: 16,
            }}
          >
            THE DEALERS
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {DEALERS.map((d) => (
              <div key={d.num} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                {/* Photo with multiply blend */}
                <div
                  style={{
                    flexShrink: 0,
                    width: "clamp(70px, 8vw, 115px)",
                    height: "clamp(85px, 10vw, 140px)",
                    overflow: "hidden",
                    mixBlendMode: "multiply",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.photo}
                    alt={d.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                      display: "block",
                      filter: "grayscale(100%) contrast(1.1)",
                    }}
                  />
                </div>

                {/* Info */}
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

        {/* ── Col 3: Syndicates ── */}
        <div
          style={{
            padding: "20px 18px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          <div
            className="font-mono-frag"
            style={{
              fontSize: "clamp(9px, 0.85vw, 13px)",
              letterSpacing: "0.12em",
              color: INK,
              borderBottom: BORDER,
              paddingBottom: 8,
              marginBottom: 16,
            }}
          >
            SYNDICATES
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {DEALERS.map((d) => (
              <div key={d.num} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {d.links.map((link) => (
                  <span
                    key={link}
                    className="font-mono-frag"
                    style={{
                      fontSize: "clamp(9px, 0.8vw, 12px)",
                      color: INK,
                      lineHeight: 1.9,
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                  >
                    {link}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
