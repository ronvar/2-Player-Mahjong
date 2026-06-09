"use client";

import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import { createInitialState, gameReducer } from "./engine/reducer";
import type { GameAction, GameState } from "./types";

interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextValue => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
};
