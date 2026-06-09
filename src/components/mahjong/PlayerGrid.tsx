"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "@mantine/core";
import { isColumnComplete } from "@/lib/mahjong/engine/board";
import type { PlayerBoard } from "@/lib/mahjong/types";
import { Tile } from "./Tile";

interface PlayerGridProps {
  board: PlayerBoard;
  selectableColumns?: ReadonlyArray<number>;
  onSelectColumn?: (column: number) => void;
}

export const PlayerGrid = ({ board, selectableColumns = [], onSelectColumn }: PlayerGridProps) => {
  const epochRef = useRef(0);
  const lastPlacedRef = useRef(board.lastPlaced);
  const [animCol, setAnimCol] = useState<{ col: number; epoch: number } | null>(null);

  useEffect(() => {
    const prev = lastPlacedRef.current;
    const curr = board.lastPlaced;
    lastPlacedRef.current = curr;

    if (curr && (!prev || prev.column !== curr.column || prev.row !== curr.row)) {
      epochRef.current += 1;
      setAnimCol({ col: curr.column, epoch: epochRef.current });
    } else if (!curr) {
      setAnimCol(null);
    }
  }, [board.lastPlaced]);

  const isYourTurn = selectableColumns.length > 0;
  const singleTarget = selectableColumns.length === 1 ? selectableColumns[0] : null;
  const multiChoice = selectableColumns.length > 1;

  return (
    <Box
      px={8}
      py={4}
      style={{ borderRadius: "0.75rem", transition: "box-shadow 0.3s" }}
      className={isYourTurn ? "animate-pulse-glow" : ""}
    >
      <div className="inline-grid grid-cols-9 gap-1 mx-auto">
        {board.grid.map((column, colIndex) => {
          const complete = isColumnComplete(column, board.targetSuit);
          const isTarget = colIndex === singleTarget;
          const clickable = selectableColumns.includes(colIndex);
          const isAnimating = animCol?.col === colIndex;
          const epoch = animCol?.epoch ?? 0;

          return (
            <Box
              key={colIndex}
              data-board={board.id}
              data-col={colIndex}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
              aria-disabled={!clickable}
              onClick={clickable ? () => onSelectColumn?.(colIndex) : undefined}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectColumn?.(colIndex);
                      }
                    }
                  : undefined
              }
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                borderRadius: "0.375rem",
                padding: 2,
                cursor: clickable ? "pointer" : "default",
                transition: "background 0.15s",
                background: complete ? "rgba(216,166,87,0.2)" : "rgba(0,0,0,0.1)",
                outline: complete
                  ? "1px solid rgba(216,166,87,0.5)"
                  : isTarget
                  ? "2px solid var(--color-accent-soft)"
                  : "none",
              }}
              className={isTarget ? "animate-pulse-glow" : ""}
              onMouseEnter={
                clickable && multiChoice
                  ? (e) => (e.currentTarget.style.background = "rgba(216,166,87,0.2)")
                  : undefined
              }
              onMouseLeave={
                clickable && multiChoice
                  ? (e) => (e.currentTarget.style.background = complete ? "rgba(216,166,87,0.2)" : "rgba(0,0,0,0.1)")
                  : undefined
              }
            >
              {column.map((tile, rowIndex) => {
                const revealed = board.revealedIds.has(tile.id);
                const isLast = board.lastPlaced?.column === colIndex && board.lastPlaced?.row === rowIndex;
                const anim = isAnimating ? (rowIndex === 0 ? "deal" : "shift") : null;

                return (
                  <Tile
                    key={isAnimating ? `${colIndex}-${rowIndex}-${epoch}` : `${colIndex}-${rowIndex}`}
                    tile={revealed ? tile : undefined}
                    faceDown={!revealed}
                    size="sm"
                    highlighted={isLast}
                    animate={anim}
                    style={isAnimating && rowIndex > 0 ? { animationDelay: `${rowIndex * 35}ms` } : undefined}
                  />
                );
              })}
            </Box>
          );
        })}
      </div>
    </Box>
  );
};
