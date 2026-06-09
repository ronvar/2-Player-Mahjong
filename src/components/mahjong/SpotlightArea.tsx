"use client";

import { Box, Stack, Text } from "@mantine/core";
import { useGame } from "@/lib/mahjong/context";
import { tileLabel } from "@/lib/mahjong/constants";
import { Tile } from "./Tile";

interface SpotlightAreaProps {
  viewerId: "p1" | "p2";
  animDelay?: number;
}

export const SpotlightArea = ({ viewerId, animDelay = 0 }: SpotlightAreaProps) => {
  const { state } = useGame();
  const pending = state.pending;
  const isYourCall = pending?.player === viewerId;

  let caption = state.message ?? "";
  if (isYourCall) {
    if (pending?.reason === "lucky") caption = "Lucky Dragon! Place it in any column.";
    else if (pending?.reason === "gift") caption = "It's your suit — choose a column!";
    else caption = "It's a match — choose a column!";
  } else if (pending) {
    caption = `${state.players[pending.player].name} is deciding where to place it…`;
  }

  return (
    <Stack align="center" gap="xs" py={4}>
      <Box id="spotlight-container">
        {state.spotlight ? (
          <Tile
            key={state.spotlight.id}
            tile={state.spotlight}
            size="lg"
            animate={animDelay > 0 ? "fly-in" : "deal"}
            highlighted={isYourCall}
            style={animDelay > 0 ? { animationDelay: `${animDelay}ms` } : undefined}
          />
        ) : (
          <Box
            style={{
              width: 44,
              height: 60,
              borderRadius: 6,
              border: "1px dashed rgba(255,255,255,0.15)",
            }}
          />
        )}
      </Box>

      <Text size="xs" c="dimmed" maw={320} ta="center" className="animate-fade-in-up" key={caption}>
        {caption}
      </Text>

      {state.spotlight && (
        <Text
          size="xs"
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "rgba(244,234,214,0.35)",
            fontSize: 10,
          }}
        >
          {tileLabel(state.spotlight)}
        </Text>
      )}
    </Stack>
  );
};
