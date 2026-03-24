import HeroGrid from "@/components/HeroGrid";
import LogoSwap from "@/components/LogoSwap";
import ScrollDownText from "@/components/ScrollDownText";

export default function Home() {
  return (
    <main
      className="relative flex flex-col"
      style={{
        minHeight: "100svh",
        backgroundColor: "var(--bg)",
      }}
    >
      {/* Grid section — takes up most of the viewport */}
      <div className="flex-1" style={{ minHeight: 0 }}>
        <HeroGrid />
      </div>

      {/* Logo + scroll hint row */}
      <div className="relative w-full" style={{ borderTop: "0.5px solid var(--text)" }}>
        <LogoSwap />

        {/* (scroll down) — bottom right */}
        <div className="absolute bottom-4 right-6 z-10">
          <ScrollDownText />
        </div>
      </div>
    </main>
  );
}
