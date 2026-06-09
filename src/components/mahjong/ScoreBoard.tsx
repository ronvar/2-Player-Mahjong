"use client";

import { Box, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useGame } from "@/lib/mahjong/context";
import { SUIT_LABELS } from "@/lib/mahjong/constants";
import { GRID_COLUMNS } from "@/lib/mahjong/types";
import type { PlayerId } from "@/lib/mahjong/types";

const PlayerSummary = ({ playerId, align }: { playerId: PlayerId; align: "left" | "right" }) => {
  const { state } = useGame();
  const board = state.players[playerId];
  const isTurn = state.pending?.player === playerId;

  return (
    <Stack gap={2} align={align === "right" ? "flex-end" : "flex-start"}>
      <Group gap={6} style={{ flexDirection: align === "right" ? "row-reverse" : "row" }}>
        {isTurn && (
          <Box
            style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)", flexShrink: 0 }}
            className="animate-pulse-glow"
          />
        )}
        <Text fw={600} size="sm" style={{ color: "rgba(244,234,214,0.85)" }}>
          {board.name}
        </Text>
      </Group>
      <Text size="xs" c="dimmed" style={{ fontSize: 11 }}>
        Collecting {SUIT_LABELS[board.targetSuit]} · {board.completedColumns}/{GRID_COLUMNS} columns
      </Text>
      <Text size="xs" fw={500} style={{ color: "var(--color-accent-soft)" }}>
        Round wins: {state.scores[playerId]}
      </Text>
    </Stack>
  );
};

export const ScoreBoard = () => {
  const { state, dispatch } = useGame();

  return (
    <Group justify="space-between" align="flex-start" px="sm" py="xs">
      <PlayerSummary playerId="p1" align="left" />

      <Stack align="center" gap={4}>
        <Text
          size="xs"
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "rgba(244,234,214,0.35)",
            fontSize: 10,
          }}
        >
          Round {state.roundNumber}
        </Text>
        <UnstyledButton
          onClick={() => dispatch({ type: "RETURN_TO_MENU" })}
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(244,234,214,0.6)",
            borderRadius: "0.375rem",
            padding: "2px 10px",
            fontSize: 11,
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "rgba(244,234,214,0.85)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "rgba(244,234,214,0.6)";
          }}
        >
          Menu
        </UnstyledButton>
      </Stack>

      <PlayerSummary playerId="p2" align="right" />
    </Group>
  );
};
