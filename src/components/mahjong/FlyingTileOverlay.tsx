"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  from: DOMRect;
  to: DOMRect;
  onDone: () => void;
}

type Phase = "ready" | "flying" | "landing";

export const FlyingTileOverlay = ({ from, to, onDone }: Props) => {
  const [phase, setPhase] = useState<Phase>("ready");

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => setPhase("flying"));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("landing"), 340);
    const t2 = setTimeout(onDone, 480);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
  const dy = (to.top + to.height / 2) - (from.top + from.height / 2);

  const isFlying = phase !== "ready";
  const isLanding = phase === "landing";

  const tileW = from.width;
  const tileH = from.height;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: from.top + tileH / 2,
        left: from.left + tileW / 2,
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: 999,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: tileW,
          height: tileH,
          translate: "-50% -50%",
          transform: isFlying
            ? `translate(${dx}px, ${dy}px) scale(${isLanding ? 1.3 : 1.15})`
            : "translate(0, 0) scale(1)",
          opacity: isLanding ? 0 : 1,
          transition: isFlying
            ? "transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s ease-in"
            : "none",
          borderRadius: "0.375rem",
          background: "linear-gradient(to bottom right, #065f46, #022c22)",
          border: "1px solid rgba(0,0,0,0.6)",
          boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.5)",
        }}
      />
    </div>,
    document.body
  );
};
