import { GRID_COLUMNS, GRID_ROWS } from "../types";
import type { GridColumn, PendingPlacement, PlayerBoard, PlayerId, Suit, Tile } from "../types";
import { shuffle } from "./deck";

export const isColumnComplete = (column: GridColumn, suit: Suit): boolean =>
  column.every(
    (t) =>
      (t.kind === "suited" && t.suit === suit) ||
      (t.kind === "dragon" && t.dragon === "red"),
  );

export const isColumnFull = (column: GridColumn, suit: Suit): boolean =>
  column.every((t) => t.kind === "suited" && t.suit === suit);

export const countCompletedColumns = (grid: GridColumn[], suit: Suit): number =>
  grid.filter((column) => isColumnComplete(column, suit)).length;

export const replaceColumn = (grid: GridColumn[], index: number, column: GridColumn): GridColumn[] => {
  const next = grid.slice();
  next[index] = column;
  return next;
};

export const insertTile = (column: GridColumn, tile: Tile): { column: GridColumn; ejected: Tile } => {
  const ejected = column[column.length - 1];
  return { column: [tile, ...column.slice(0, -1)], ejected };
};

export const getValidColumns = (
  pending: PendingPlacement,
  grid: GridColumn[],
  targetSuit: Suit,
): number[] => {
  if (pending.reason === "lucky") {
    return grid.map((_, i) => i).filter((i) => !isColumnFull(grid[i], targetSuit));
  }
  if (pending.tile.kind === "suited") {
    const col = pending.tile.rank - 1;
    if (col >= 0 && col < grid.length && !isColumnFull(grid[col], targetSuit)) {
      return [col];
    }
  }
  return [];
};

const makeBoard = (id: PlayerId, name: string, targetSuit: Suit, tiles: Tile[]): PlayerBoard => {
  const grid: GridColumn[] = [];
  for (let c = 0; c < GRID_COLUMNS; c++) {
    grid.push(tiles.slice(c * GRID_ROWS, (c + 1) * GRID_ROWS));
  }
  return {
    id,
    name,
    targetSuit,
    grid,
    lastPlaced: null,
    revealedIds: new Set(),
    completedColumns: countCompletedColumns(grid, targetSuit),
  };
};

const ALL_SUITS: Suit[] = ["dots", "bamboo", "characters"];

export const setupBoards = (
  deck: Tile[],
  names: Record<PlayerId, string>,
): { boards: Record<PlayerId, PlayerBoard>; wall: Tile[] } => {
  const [suitA, suitB] = shuffle(ALL_SUITS);
  const cellsPerGrid = GRID_COLUMNS * GRID_ROWS;

  const p1Tiles = deck.slice(0, cellsPerGrid);
  const p2Tiles = deck.slice(cellsPerGrid, cellsPerGrid * 2);
  const wall = deck.slice(cellsPerGrid * 2);

  return {
    boards: {
      p1: makeBoard("p1", names.p1, suitA, p1Tiles),
      p2: makeBoard("p2", names.p2, suitB, p2Tiles),
    },
    wall,
  };
};
