"use client";

import { Box, UnstyledButton } from "@mantine/core";
import { tileGlyph, tileLabel } from "@/lib/mahjong/constants";
import type { Tile as TileT } from "@/lib/mahjong/types";

const SIZE_STYLES: Record<string, React.CSSProperties> = {
  sm: { width: 36, height: 48, fontSize: "1.25rem" },
  md: { width: 44, height: 56, fontSize: "1.5rem" },
  lg: { width: 52, height: 68, fontSize: "1.875rem" },
};

interface TileProps {
  tile?: TileT;
  faceDown?: boolean;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  highlighted?: boolean;
  onClick?: () => void;
  className?: string;
  animate?: "deal" | "fly-in" | "shift" | "discard" | null;
  style?: React.CSSProperties;
}

export const Tile = ({
  tile,
  faceDown = false,
  size = "md",
  selected = false,
  highlighted = false,
  onClick,
  className = "",
  animate = null,
  style,
}: TileProps) => {
  const interactive = Boolean(onClick);

  const animationClass =
    animate === "deal" ? "animate-tile-deal" :
    animate === "fly-in" ? "animate-tile-fly-in" :
    animate === "shift" ? "animate-tile-shift" :
    animate === "discard" ? "animate-tile-discard" : "";

  const sharedStyle: React.CSSProperties = {
    ...SIZE_STYLES[size],
    position: "relative",
    flexShrink: 0,
    borderRadius: "0.375rem",
    border: faceDown ? "1px solid rgba(0,0,0,0.6)" : "1px solid rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    background: faceDown ? "linear-gradient(to bottom right, #065f46, #022c22)" : "var(--color-tile-face)",
    color: faceDown ? undefined : "#27272a",
    boxShadow: faceDown
      ? "inset 0 0 0 2px rgba(255,255,255,0.06)"
      : "0 2px 0 rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6)",
    transform: selected ? "translateY(-10px)" : undefined,
    outline: highlighted ? "2px solid var(--color-accent-soft)" : undefined,
    cursor: interactive ? "pointer" : "default",
    ...style,
  };

  const className_ = [highlighted ? "animate-pulse-glow" : "", animationClass, className]
    .filter(Boolean)
    .join(" ");

  const glyph = !faceDown && tile
    ? <span style={{ lineHeight: 1 }}>{tileGlyph(tile)}</span>
    : null;

  if (!interactive) {
    return (
      <Box title={tile ? tileLabel(tile) : undefined} style={sharedStyle} className={className_}>
        {glyph}
      </Box>
    );
  }

  return (
    <UnstyledButton
      onClick={onClick}
      title={tile ? tileLabel(tile) : undefined}
      style={sharedStyle}
      className={className_}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = selected ? "translateY(-10px)" : "translateY(0)")}
    >
      {glyph}
    </UnstyledButton>
  );
};
