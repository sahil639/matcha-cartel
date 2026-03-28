import HeroGrid from "@/components/HeroGrid";
import LogoSwap from "@/components/LogoSwap";
import ScrollDownText from "@/components/ScrollDownText";
import OriginLog from "@/components/OriginLog";
import ProductionChain from "@/components/ProductionChain";
import EffectsOfMatcha from "@/components/EffectsOfMatcha";
import Hyperfixation from "@/components/Hyperfixation";

export default function Home() {
  return (
    <>
      {/* ── Section 1: Hero ── */}
      <main
        className="relative flex flex-col"
        style={{
          height: "100svh",
          backgroundColor: "var(--bg)",
          overflow: "hidden",
        }}
      >
        <div className="flex-1" style={{ minHeight: 0 }}>
          <HeroGrid />
        </div>
        <div
          className="relative w-full"
          style={{ borderTop: "0.5px solid var(--text)" }}
        >
          <LogoSwap />
          <div className="absolute bottom-4 right-6 z-10">
            <ScrollDownText />
          </div>
        </div>
      </main>
      

      {/* ── Section 2: Origin Log ── */}
      <OriginLog />

      {/* ── Section 3: Production Chain ── */}
      <ProductionChain />

      {/* ── Section 4: Effects of Matcha ── */}
      <EffectsOfMatcha />

      {/* ── Section 5: Hyperfixation ── */}
      <Hyperfixation />
    </>
  );
}
