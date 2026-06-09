import type { Dragon, Suit, Tile, Wind } from "./types";

const CHARACTER_GLYPHS = ["🀇", "🀈", "🀉", "🀊", "🀋", "🀌", "🀍", "🀎", "🀏"];
const BAMBOO_GLYPHS = ["🀐", "🀑", "🀒", "🀓", "🀔", "🀕", "🀖", "🀗", "🀘"];
const DOTS_GLYPHS = ["🀙", "🀚", "🀛", "🀜", "🀝", "🀞", "🀟", "🀠", "🀡"];

const WIND_GLYPHS: Record<Wind, string> = {
  east: "🀀",
  south: "🀁",
  west: "🀂",
  north: "🀃",
};

const DRAGON_GLYPHS: Record<Dragon, string> = {
  red: "🀄",
  green: "🀅",
  white: "🀆",
};

export const SUIT_LABELS: Record<Suit, string> = {
  characters: "Characters",
  bamboo: "Bamboo",
  dots: "Dots",
};

export const WIND_LABELS: Record<Wind, string> = {
  east: "East",
  south: "South",
  west: "West",
  north: "North",
};

export const DRAGON_LABELS: Record<Dragon, string> = {
  red: "Red Dragon",
  green: "Green Dragon",
  white: "White Dragon",
};

export const tileGlyph = (tile: Tile): string => {
  switch (tile.kind) {
    case "suited": {
      const glyphs =
        tile.suit === "characters"
          ? CHARACTER_GLYPHS
          : tile.suit === "bamboo"
            ? BAMBOO_GLYPHS
            : DOTS_GLYPHS;
      return glyphs[tile.rank - 1];
    }
    case "wind":
      return WIND_GLYPHS[tile.wind];
    case "dragon":
      return DRAGON_GLYPHS[tile.dragon];
  }
};

export const tileLabel = (tile: Tile): string => {
  switch (tile.kind) {
    case "suited":
      return `${tile.rank} ${SUIT_LABELS[tile.suit]}`;
    case "wind":
      return WIND_LABELS[tile.wind];
    case "dragon":
      return DRAGON_LABELS[tile.dragon];
  }
};

export const tileSortKey = (tile: Tile): number => {
  switch (tile.kind) {
    case "suited": {
      const suitOrder = { characters: 0, bamboo: 1, dots: 2 }[tile.suit];
      return suitOrder * 10 + tile.rank;
    }
    case "wind": {
      const order = { east: 0, south: 1, west: 2, north: 3 }[tile.wind];
      return 100 + order;
    }
    case "dragon": {
      const order = { red: 0, green: 1, white: 2 }[tile.dragon];
      return 200 + order;
    }
  }
};

export const tileTypeKey = (tile: Tile): string => {
  switch (tile.kind) {
    case "suited":
      return `suited-${tile.suit}-${tile.rank}`;
    case "wind":
      return `wind-${tile.wind}`;
    case "dragon":
      return `dragon-${tile.dragon}`;
  }
};

export const sameTileType = (a: Tile, b: Tile): boolean => tileTypeKey(a) === tileTypeKey(b);
