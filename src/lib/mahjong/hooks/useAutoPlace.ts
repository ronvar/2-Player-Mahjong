"use client";

import { useEffect } from "react";
import { getValidColumns } from "../engine/board";
import { useGame } from "../context";

const PULSE_DELAY_MS = 700;

export const useAutoPlace = () => {
  const { state, dispatch } = useGame();
  const pending = state.pending;

  const pendingTileId = pending?.tile.id;
  const pendingPlayer = pending?.player;
  const pendingReason = pending?.reason;

  useEffect(() => {
    if (!pending || pendingReason === "lucky") return;
    if (state.phase !== "awaiting-placement") return;

    const board = state.players[pending.player];
    const valid = getValidColumns(pending, board.grid, board.targetSuit);
    if (valid.length !== 1) return;

    const col = valid[0];
    const timer = setTimeout(() => {
      dispatch({ type: "PLACE_TILE", column: col });
    }, PULSE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [pendingTileId, pendingPlayer, pendingReason]);
};
