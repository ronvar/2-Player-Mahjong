"use client";

import { useState } from "react";
import { Box, Stack, Text } from "@mantine/core";
import { useGame } from "@/lib/mahjong/context";
import { useAITurn } from "@/lib/mahjong/hooks/useAITurn";
import { getValidColumns } from "@/lib/mahjong/engine/board";
import { ScoreBoard } from "./ScoreBoard";
import { SpotlightArea } from "./SpotlightArea";
import { PlayerGrid } from "./PlayerGrid";
import { RoundEndOverlay } from "./RoundEndOverlay";
import { FlyingTileOverlay } from "./FlyingTileOverlay";
import type { PlayerId } from "@/lib/mahjong/types";

interface FlyState {
  from: DOMRect;
  to: DOMRect;
}

export const GameTable = () => {
  const { state, dispatch } = useGame();
  const [flyState, setFlyState] = useState<FlyState | null>(null);

  const place = (column: number) => {
    if (!state.pending) {
      dispatch({ type: "PLACE_TILE", column });
      return;
    }

    const placerId = state.pending.player;
    const colEl = document.querySelector<HTMLElement>(
      `[data-board="${placerId}"][data-col="${column}"]`
    );
    const bottomCell = colEl?.lastElementChild as HTMLElement | null;
    const spotlightEl = document.getElementById("spotlight-container");

    if (bottomCell && spotlightEl) {
      setFlyState({
        from: bottomCell.getBoundingClientRect(),
        to: spotlightEl.getBoundingClientRect(),
      });
      setTimeout(() => dispatch({ type: "PLACE_TILE", column }), 340);
    } else {
      dispatch({ type: "PLACE_TILE", column });
    }
  };

  useAITurn(place);

  const selectableCols = (playerId: PlayerId): number[] => {
    if (!state.pending || state.pending.player !== playerId) return [];
    if (state.mode === "vs-computer" && playerId === "p2") return [];
    const board = state.players[playerId];
    return getValidColumns(state.pending, board.grid, board.targetSuit);
  };

  return (
    <Box style={{ position: "relative", display: "flex", flexDirection: "column", flex: 1, padding: "8px 16px" }}>
      <ScoreBoard />

      <Stack gap="md" py="xs">
        <Stack align="center" gap={4}>
          <Text
            size="xs"
            style={{ textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(244,234,214,0.4)", fontSize: 11 }}
          >
            {state.players.p2.name}
          </Text>
          <Box style={{ transform: "rotate(180deg)" }}>
            <PlayerGrid
              board={state.players.p2}
              selectableColumns={selectableCols("p2")}
              onSelectColumn={place}
            />
          </Box>
        </Stack>

        <Box style={{ display: "flex", justifyContent: "center" }}>
          <SpotlightArea viewerId="p1" />
        </Box>

        <Stack align="center" gap={4}>
          <PlayerGrid
            board={state.players.p1}
            selectableColumns={selectableCols("p1")}
            onSelectColumn={place}
          />
          <Text
            size="xs"
            style={{ textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(244,234,214,0.4)", fontSize: 11 }}
          >
            {state.players.p1.name}
          </Text>
        </Stack>
      </Stack>

      <RoundEndOverlay />

      {flyState && (
        <FlyingTileOverlay
          from={flyState.from}
          to={flyState.to}
          onDone={() => setFlyState(null)}
        />
      )}
    </Box>
  );
};
