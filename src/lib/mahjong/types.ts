export type Suit = "dots" | "bamboo" | "characters";
export type Wind = "east" | "south" | "west" | "north";
export type Dragon = "red" | "green" | "white";

export type Tile =
  | { kind: "suited"; suit: Suit; rank: number; id: string }
  | { kind: "wind"; wind: Wind; id: string }
  | { kind: "dragon"; dragon: Dragon; id: string };

export type PlayerId = "p1" | "p2";

export const GRID_COLUMNS = 9;
export const GRID_ROWS = 4;

export type GridColumn = Tile[];

export interface PlayerBoard {
  id: PlayerId;
  name: string;
  targetSuit: Suit;
  grid: GridColumn[];
  lastPlaced: { column: number; row: number } | null;
  revealedIds: ReadonlySet<string>;
  completedColumns: number;
}

export type GamePhase = "menu" | "awaiting-placement" | "round-end";

export type PlacementReason = "match" | "lucky" | "gift";

export interface PendingPlacement {
  player: PlayerId;
  tile: Tile;
  reason: PlacementReason;
}

export type GameMode = "vs-human" | "vs-computer";
export type Difficulty = "easy" | "normal" | "hard";

export interface RoundResult {
  winner: PlayerId | null;
}

export interface GameState {
  phase: GamePhase;
  mode: GameMode;
  difficulty: Difficulty;
  players: Record<PlayerId, PlayerBoard>;
  wall: Tile[];
  discard: Tile[];
  spotlight: Tile | null;
  pending: PendingPlacement | null;
  result: RoundResult | null;
  scores: Record<PlayerId, number>;
  roundNumber: number;
  message: string | null;
  lastEjection: { tile: Tile; from: PlayerId } | null;
}

export type GameAction =
  | { type: "START_GAME"; mode: GameMode; difficulty: Difficulty }
  | { type: "PLACE_TILE"; column: number }
  | { type: "NEXT_ROUND" }
  | { type: "RETURN_TO_MENU" };
