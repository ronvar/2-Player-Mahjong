import type { GameAction, GameState, PlayerBoard, PlayerId } from "../types";
import { GRID_COLUMNS } from "../types";
import { countCompletedColumns, getValidColumns, insertTile, isColumnComplete, replaceColumn, setupBoards } from "./board";
import { createDeck, shuffle } from "./deck";
import { resolveTile } from "./cascade";

const OTHER: Record<PlayerId, PlayerId> = { p1: "p2", p2: "p1" };

const emptyBoard = (id: PlayerId, name: string): PlayerBoard => ({
  id, name, targetSuit: "dots", grid: [], lastPlaced: null, revealedIds: new Set(), completedColumns: 0,
});

export const createInitialState = (): GameState => ({
  phase: "menu",
  mode: "vs-computer",
  difficulty: "normal",
  players: {
    p1: emptyBoard("p1", "You"),
    p2: emptyBoard("p2", "Opponent"),
  },
  wall: [],
  discard: [],
  spotlight: null,
  pending: null,
  result: null,
  scores: { p1: 0, p2: 0 },
  roundNumber: 0,
  message: null,
  lastEjection: null,
});

const startRound = (
  state: GameState,
  options: { mode?: GameState["mode"]; difficulty?: GameState["difficulty"] },
): GameState => {
  const deck = shuffle(createDeck());
  const names = { p1: state.players.p1.name, p2: state.players.p2.name };
  const { boards, wall } = setupBoards(deck, names);
  const firstPlayer: PlayerId = Math.random() < 0.5 ? "p1" : "p2";

  const base: GameState = {
    ...state,
    phase: "awaiting-placement",
    mode: options.mode ?? state.mode,
    difficulty: options.difficulty ?? state.difficulty,
    players: boards,
    wall,
    discard: [],
    spotlight: null,
    pending: null,
    result: null,
    lastEjection: null,
    roundNumber: state.roundNumber + 1,
    message: `${boards[firstPlayer].name} rolls highest and goes first!`,
  };

  if (wall.length === 0) return base;
  const [tile, ...rest] = wall;
  return resolveTile({ ...base, wall: rest }, tile, firstPlayer);
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "START_GAME": {
      const fresh = createInitialState();
      return startRound({ ...fresh, scores: { p1: 0, p2: 0 } }, { mode: action.mode, difficulty: action.difficulty });
    }

    case "PLACE_TILE": {
      if (state.phase !== "awaiting-placement" || !state.pending) return state;
      const { player: placerId, tile } = state.pending;
      const board = state.players[placerId];
      const validCols = getValidColumns(state.pending, board.grid, board.targetSuit);
      if (!validCols.includes(action.column)) return state;
      const targetColumn = board.grid[action.column];

      const { column: newColumn, ejected } = insertTile(targetColumn, tile);
      const newGrid = replaceColumn(board.grid, action.column, newColumn);
      const completedColumns = countCompletedColumns(newGrid, board.targetSuit);

      const revealedIds = new Set(board.revealedIds);
      revealedIds.delete(ejected.id);
      revealedIds.add(tile.id);

      const updatedBoard: PlayerBoard = {
        ...board,
        grid: newGrid,
        lastPlaced: { column: action.column, row: 0 },
        revealedIds,
        completedColumns,
      };

      const next: GameState = {
        ...state,
        players: { ...state.players, [placerId]: updatedBoard },
        pending: null,
        lastEjection: { tile: ejected, from: placerId },
        message: `${board.name}: ${completedColumns}/${GRID_COLUMNS} columns complete.`,
      };

      if (completedColumns === GRID_COLUMNS) {
        return {
          ...next,
          phase: "round-end",
          spotlight: null,
          result: { winner: placerId },
          scores: { ...next.scores, [placerId]: next.scores[placerId] + 1 },
          message: `${board.name} completed their grid and wins the round!`,
        };
      }

      return resolveTile(next, ejected, placerId);
    }

    case "NEXT_ROUND":
      return startRound(state, {});

    case "RETURN_TO_MENU":
      return { ...createInitialState(), mode: state.mode, difficulty: state.difficulty };

    default:
      return state;
  }
};

export { OTHER };
