import HeroGrid from "@/components/HeroGrid";
import LogoSwap from "@/components/LogoSwap";
import ScrollDownText from "@/components/ScrollDownText";
import OriginLog from "@/components/OriginLog";
import ProductionChain from "@/components/ProductionChain";
import EffectsOfMatcha from "@/components/EffectsOfMatcha";
import Hyperfixation from "@/components/Hyperfixation";
import ConfiscatedGoods from "@/components/ConfiscatedGoods";
import PreparationProcedures from "@/components/PreparationProcedures";
import TheVault from "@/components/TheVault";
import Footer from "@/components/Footer";

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
        {/* Desktop-only bottom bar — hidden on mobile (HeroGrid handles its own bottom bar) */}
        <div
          className="relative w-full items-center hidden md:flex"
          style={{ borderTop: "0.5px solid var(--text)", gap: 24, paddingRight: 24 }}
        >
          <LogoSwap />
          <ScrollDownText />
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

      {/* ── Section 6: Confiscated Goods ── */}
      <ConfiscatedGoods />

      {/* ── Section 7: Preparation Procedures ── */}
      <PreparationProcedures />

      {/* ── Section 7: The Vault ── */}
      <TheVault />

      {/* ── Footer ── */}
      <Footer />
    </>
  );
}
