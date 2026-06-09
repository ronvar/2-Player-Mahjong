"use client";

import { useEffect, useRef } from "react";
import { chooseColumn } from "../ai/decisions";
import { useGame } from "../context";

const AI_PLAYER = "p2";
const THINK_DELAY_MS = [450, 1000] as const;

const randomDelay = () => {
  const [min, max] = THINK_DELAY_MS;
  return min + Math.random() * (max - min);
};

export const useAITurn = (onPlace?: (column: number) => void) => {
  const { state, dispatch } = useGame();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onPlaceRef = useRef(onPlace);
  onPlaceRef.current = onPlace;

  useEffect(() => {
    if (state.mode !== "vs-computer") return;
    if (state.phase !== "awaiting-placement" || !state.pending) return;
    if (state.pending.player !== AI_PLAYER) return;

    timerRef.current = setTimeout(() => {
      const column = chooseColumn(state, AI_PLAYER);
      if (onPlaceRef.current) {
        onPlaceRef.current(column);
      } else {
        dispatch({ type: "PLACE_TILE", column });
      }
    }, randomDelay());

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state, dispatch]);
};
