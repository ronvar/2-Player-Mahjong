import { getValidColumns, isColumnComplete } from "../engine/board";
import type { Difficulty, GameState, PlayerId } from "../types";

interface DifficultyProfile {
  precision: number;
}

const PROFILES: Record<Difficulty, DifficultyProfile> = {
  easy: { precision: 0.35 },
  normal: { precision: 0.7 },
  hard: { precision: 0.95 },
};

export const chooseColumn = (state: GameState, playerId: PlayerId, rng: () => number = Math.random): number => {
  if (!state.pending) return 0;

  const profile = PROFILES[state.difficulty];
  const board = state.players[playerId];
  const valid = getValidColumns(state.pending, board.grid, board.targetSuit);

  if (valid.length === 0) return 0;
  if (valid.length === 1) return valid[0];

  const scored = valid.map((index) => {
    const correct = board.grid[index].filter(
      (t) => (t.kind === "suited" && t.suit === board.targetSuit) || (t.kind === "dragon" && t.dragon === "red"),
    ).length;
    const complete = isColumnComplete(board.grid[index], board.targetSuit);
    return { index, score: complete ? -1 : correct };
  });
  scored.sort((a, b) => b.score - a.score);

  if (rng() < profile.precision) return scored[0].index;
  return scored[Math.floor(rng() * scored.length)].index;
};
