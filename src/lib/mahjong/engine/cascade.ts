import type { GameState, PlayerBoard, PlayerId, Tile } from "../types";
import { countCompletedColumns, isColumnFull, replaceColumn } from "./board";

const OTHER: Record<PlayerId, PlayerId> = { p1: "p2", p2: "p1" };

type Classification = "p1" | "p2" | "lucky" | "cursed" | "neutral";

const classifyTile = (tile: Tile, p1Suit: string, p2Suit: string): Classification => {
  if (tile.kind === "suited") {
    if (tile.suit === p1Suit) return "p1";
    if (tile.suit === p2Suit) return "p2";
    return "neutral";
  }
  if (tile.kind === "dragon") {
    if (tile.dragon === "red") return "lucky";
    if (tile.dragon === "white") return "cursed";
    return "neutral";
  }
  return "neutral";
};

const endRoundDrawn = (state: GameState): GameState => ({
  ...state,
  phase: "round-end",
  pending: null,
  spotlight: null,
  result: { winner: null },
  message: "The wall ran dry — the round ends in a draw.",
});

const drawTile = (state: GameState): { tile: Tile; rest: Tile[] } | null => {
  if (state.wall.length === 0) return null;
  const [tile, ...rest] = state.wall;
  return { tile, rest };
};

export const resolveTile = (state: GameState, tile: Tile, candidate: PlayerId): GameState => {
  const p1Suit = state.players.p1.targetSuit;
  const p2Suit = state.players.p2.targetSuit;
  const classification = classifyTile(tile, p1Suit, p2Suit);
  const withSpotlight: GameState = { ...state, spotlight: tile };

  switch (classification) {
    case "p1":
    case "p2": {
      const owner = classification;
      const board = state.players[owner];
      const reason = owner === candidate ? "match" : "gift";

      if (tile.kind === "suited") {
        const targetCol = tile.rank - 1;
        if (isColumnFull(board.grid[targetCol], board.targetSuit)) {
          return continueWithDraw({ ...withSpotlight, discard: [...state.discard, tile] }, OTHER[owner]);
        }
      }

      const message =
        reason === "gift"
          ? `${state.players[candidate].name} can't use it — passed to ${board.name}!`
          : `${board.name} received a tile — place it in its column!`;
      return { ...withSpotlight, pending: { player: owner, tile, reason }, message };
    }

    case "lucky":
      return {
        ...withSpotlight,
        pending: { player: candidate, tile, reason: "lucky" },
        message: `${state.players[candidate].name} drew the Lucky Dragon — place it anywhere!`,
      };

    case "cursed":
      return applyCurse(withSpotlight, candidate, tile);

    case "neutral":
    default:
      return applyNeutralDiscard(withSpotlight, tile, candidate);
  }
};

const continueWithDraw = (state: GameState, candidate: PlayerId): GameState => {
  const draw = drawTile(state);
  if (!draw) return endRoundDrawn(state);
  return resolveTile({ ...state, wall: draw.rest }, draw.tile, candidate);
};

const applyNeutralDiscard = (state: GameState, tile: Tile, candidate: PlayerId): GameState => {
  const next: GameState = { ...state, discard: [...state.discard, tile] };
  return continueWithDraw(next, OTHER[candidate]);
};

const applyCurse = (state: GameState, candidate: PlayerId, cursedTile: Tile): GameState => {
  const player = state.players[candidate];
  const afterDiscard: GameState = { ...state, discard: [...state.discard, cursedTile] };

  if (!player.lastPlaced) {
    return continueWithDraw(
      { ...afterDiscard, message: `${player.name} drew the Cursed Dragon, but had nothing to undo.` },
      candidate,
    );
  }

  const draw = drawTile(afterDiscard);
  if (!draw) return endRoundDrawn(afterDiscard);

  const { column, row } = player.lastPlaced;
  const removedTile = player.grid[column][row];
  const newColumn = player.grid[column].slice();
  newColumn[row] = draw.tile;
  const newGrid = replaceColumn(player.grid, column, newColumn);

  const revealedIds = new Set(player.revealedIds);
  revealedIds.delete(removedTile.id);

  const updatedPlayer: PlayerBoard = {
    ...player,
    grid: newGrid,
    lastPlaced: null,
    revealedIds,
    completedColumns: countCompletedColumns(newGrid, player.targetSuit),
  };

  const next: GameState = {
    ...afterDiscard,
    players: { ...afterDiscard.players, [candidate]: updatedPlayer },
    wall: draw.rest,
    message: `${player.name} drew the Cursed Dragon — their last tile was re-flipped!`,
  };

  return resolveTile(next, removedTile, candidate);
};
