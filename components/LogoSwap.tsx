"use client";

import { useState } from "react";

export default function LogoSwap() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden cursor-default select-none"
      style={{ height: "clamp(48px, 8vw, 100px)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* English logo */}
      <div
        className="absolute inset-0 flex items-center px-2 transition-transform duration-500 ease-in-out"
        style={{ transform: hovered ? "translateY(-100%)" : "translateY(0)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/svgs/logo-en.svg"
          alt="MatchaCartel"
          className="w-full h-full"
          style={{ objectFit: "contain", objectPosition: "left center" }}
          draggable={false}
        />
      </div>

      {/* Japanese logo */}
      <div
        className="absolute inset-0 flex items-center px-2 transition-transform duration-500 ease-in-out"
        style={{ transform: hovered ? "translateY(0)" : "translateY(100%)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/svgs/logo-jp.svg"
          alt="抹茶カルテル"
          className="w-full h-full"
          style={{ objectFit: "contain", objectPosition: "left center" }}
          draggable={false}
        />
      </div>
    </div>
  );
}
