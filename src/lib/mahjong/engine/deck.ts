import type { Dragon, Suit, Tile, Wind } from "../types";

const SUITS: Suit[] = ["characters", "bamboo", "dots"];
const WINDS: Wind[] = ["east", "south", "west", "north"];
const DRAGONS: Dragon[] = ["red", "green", "white"];

export const createDeck = (): Tile[] => {
  const tiles: Tile[] = [];
  let counter = 0;

  for (const suit of SUITS) {
    for (let rank = 1; rank <= 9; rank++) {
      for (let copy = 0; copy < 4; copy++) {
        tiles.push({ kind: "suited", suit, rank, id: `t${counter++}` });
      }
    }
  }
  for (const wind of WINDS) {
    for (let copy = 0; copy < 4; copy++) {
      tiles.push({ kind: "wind", wind, id: `t${counter++}` });
    }
  }
  for (const dragon of DRAGONS) {
    for (let copy = 0; copy < 4; copy++) {
      tiles.push({ kind: "dragon", dragon, id: `t${counter++}` });
    }
  }

  return tiles;
};

export const shuffle = <T>(items: T[], rng: () => number = Math.random): T[] => {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
