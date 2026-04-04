"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const CORRECT     = "MC26";
const BAR_COUNT   = 8;

// ── Live city clock ────────────────────────────────────────────────────────────
function CityTime({ tz }: { tz: string }) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    const tick = () =>
      setDisplay(
        new Date().toLocaleTimeString("en-US", {
          timeZone: tz,
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);
  return <>{display}</>;
}

const CITIES = [
  { name: "NEW YORK, USA",      tz: "America/New_York",   gmt: "GMT-5", align: "flex-start" },
  { name: "TOKYO, JPN",         tz: "Asia/Tokyo",          gmt: "GMT+9", align: "center" },
  { name: "RIO DE JANEIRO, BR", tz: "America/Sao_Paulo",  gmt: "GMT-3", align: "flex-end" },
] as const;

// ── Main component ─────────────────────────────────────────────────────────────
export default function LockScreen() {
  const [passcode, setPasscode]   = useState("");
  const [status, setStatus]       = useState<"idle" | "wrong" | "correct">("idle");
  const [visible, setVisible]     = useState(true);
  const [exiting, setExiting]     = useState(false);

  const barRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef  = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);

  const [tilt, setTilt]       = useState({ x: 0, y: 0 });
  const [shine, setShine]     = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  // ── Card 3D tilt + shine ──────────────────────────────────────────────────
  const onCardMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    const cx = (e.clientX - r.left) / r.width;
    const cy = (e.clientY - r.top) / r.height;
    setTilt({ x: (cy - 0.5) * -18, y: (cx - 0.5) * 18 });
    setShine({ x: cx * 100, y: cy * 100 });
  }, []);

  const onCardLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setHovering(false);
  }, []);

  // ── Passcode logic ────────────────────────────────────────────────────────
  const submit = useCallback(() => {
    const val = passcode.trim().toUpperCase();
    if (val === CORRECT) setStatus("correct");
    else if (val.length > 0) setStatus("wrong");
  }, [passcode]);

  const onKey = useCallback(
    (e: React.KeyboardEvent) => { if (e.key === "Enter") submit(); },
    [submit]
  );

  // ── Shutter exit animation ────────────────────────────────────────────────
  const handleAccess = useCallback(() => {
    if (exiting) return;
    setExiting(true);

    // 1. Fade out the content quickly
    gsap.to(contentRef.current, { opacity: 0, duration: 0.25, ease: "power1.in",
      onComplete: () => {
        // 2. Animate shutter bars: alternating up/down
        const bars = barRefs.current.filter(Boolean) as HTMLDivElement[];
        const upBars   = bars.filter((_, i) => i % 2 === 0);
        const downBars = bars.filter((_, i) => i % 2 === 1);

        gsap.to(upBars,   { y: "-100%", duration: 0.55, ease: "power2.inOut", stagger: 0.045 });
        gsap.to(downBars, {
          y: "100%", duration: 0.55, ease: "power2.inOut", stagger: 0.045,
          onComplete: () => setVisible(false),
        });
      },
    });
  }, [exiting]);

  if (!visible) return null;

  return (
    // Fixed overlay — no background (bars provide the black fill)
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {/* ── Shutter bars — each covers 1/BAR_COUNT of the screen ── */}
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={el => { barRefs.current[i] = el; }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${(i / BAR_COUNT) * 100}%`,
            height: `${100 / BAR_COUNT}%`,
            backgroundColor: "#000",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── UI content — above bars ── */}
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "text",
        }}
        onClick={() => inputRef.current?.focus()}
      >

        {/* ── Top: city clocks ── */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            padding: "16px 28px 0",
          }}
        >
          {CITIES.map((c) => (
            <div
              key={c.name}
              style={{ display: "flex", flexDirection: "column", alignItems: c.align }}
            >
              {/* Small square marker */}
              <div
                style={{
                  width: 7,
                  height: 7,
                  backgroundColor: "rgba(255,255,255,0.28)",
                  marginBottom: 6,
                }}
              />
              <div
                className="font-mono-frag"
                style={{
                  fontSize: "clamp(9px, 0.85vw, 12px)",
                  color: "rgba(255,255,255,0.45)",
                  letterSpacing: "0.05em",
                  lineHeight: 1.7,
                  textAlign: c.align === "flex-end" ? "right" : c.align === "center" ? "center" : "left",
                }}
              >
                {c.name}<br />
                <CityTime tz={c.tz} /> {c.gmt}
              </div>
            </div>
          ))}
        </div>

        {/* ── Center: card + input ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(24px, 4vh, 48px)",
            width: "100%",
          }}
        >
          {/* Card with 3D tilt + shine */}
          <div
            ref={cardRef}
            onMouseMove={(e) => { setHovering(true); onCardMove(e); }}
            onMouseLeave={onCardLeave}
            style={{
              position: "relative",
              width: "clamp(340px, 42vw, 620px)",
              transformStyle: "preserve-3d",
              transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: hovering ? "transform 0.06s ease-out" : "transform 0.55s ease-out",
              cursor: "default",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/access card.png"
              alt="Matcha Cartel Access Card"
              style={{ width: "100%", height: "auto", display: "block" }}
              draggable={false}
            />

            {/* Shine overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: hovering
                  ? `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.25) 0%, transparent 52%)`
                  : "none",
                mixBlendMode: "screen",
                transition: "background 0.08s ease",
              }}
            />
          </div>

          {/* Input / status area */}
          <div
            style={{ textAlign: "center", minHeight: 60 }}
            onClick={e => { e.stopPropagation(); inputRef.current?.focus(); }}
          >
            {status === "correct" ? (
              // "ACCESS THE SITE" — clickable
              <div
                className="font-hubot"
                onClick={handleAccess}
                style={{
                  fontSize: "clamp(20px, 2.8vw, 42px)",
                  color: "#ffffff",
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                ACCESS THE SITE
              </div>
            ) : (
              <>
                {/* Invisible real input, visible display div */}
                <input
                  ref={inputRef}
                  type="text"
                  value={passcode}
                  onChange={e => { setPasscode(e.target.value); setStatus("idle"); }}
                  onKeyDown={onKey}
                  placeholder="ENTER PASSCODE"
                  maxLength={10}
                  autoFocus
                  className="font-hubot lockscreen-input"
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#ffffff",
                    fontSize: "clamp(20px, 2.8vw, 42px)",
                    textAlign: "center",
                    letterSpacing: "0.06em",
                    width: "clamp(260px, 34vw, 500px)",
                    caretColor: "#ffffff",
                    display: "block",
                    margin: "0 auto",
                  }}
                />

                {status === "wrong" && (
                  <div
                    className="font-mono-frag"
                    style={{
                      fontSize: 11,
                      color: "#e53e3e",
                      letterSpacing: "0.12em",
                      marginTop: 10,
                    }}
                  >
                    INCORRECT PASSCODE
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Bottom: passcode hint + copyright ── */}
        <div style={{ paddingBottom: 28, textAlign: "center" }}>
          <div
            className="font-mono-frag"
            style={{
              fontSize: "clamp(9px, 0.85vw, 12px)",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.14em",
              marginBottom: 10,
            }}
          >
            PASSCODE : MC26
          </div>
          <div
            className="font-mono-frag"
            style={{
              fontSize: "clamp(8px, 0.72vw, 10px)",
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.06em",
              lineHeight: 1.8,
            }}
          >
            © 2026 MATCHA CARTEL. ALL RIGHTS RESERVED. PRODUCED BY MATCHA CARTEL.<br />
            DISTRIBUTED UNDER STRICT CONTROL. UNAUTHORIZED ACCESS, REPRODUCTION,<br />
            OR MODIFICATION IS PROHIBITED. NON-TRANSFERABLE. MC26-VLT.
          </div>
        </div>

      </div>
    </div>
  );
}
