"use client";

import { useState } from "react";
import { Box, Paper, SimpleGrid, Stack, Text, Title, UnstyledButton } from "@mantine/core";
import { useGame } from "@/lib/mahjong/context";
import type { Difficulty, GameMode } from "@/lib/mahjong/types";

const DIFFICULTIES: { id: Difficulty; label: string; blurb: string }[] = [
  { id: "easy",   label: "Easy",   blurb: "Relaxed pace, forgiving choices" },
  { id: "normal", label: "Normal", blurb: "A balanced, attentive opponent" },
  { id: "hard",   label: "Hard",   blurb: "Sharp reads, efficient hands" },
];

export const MainMenu = () => {
  const { dispatch } = useGame();
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");

  const start = (mode: GameMode) => dispatch({ type: "START_GAME", mode, difficulty });

  return (
    <Stack
      align="center"
      justify="center"
      style={{ flex: 1, textAlign: "center" }}
      px="md"
      py={64}
      className="animate-fade-in-up"
    >
      <Box style={{ fontSize: "3rem", lineHeight: 1 }}>🀄</Box>

      <Title
        order={1}
        style={{
          color: "var(--color-accent-soft)",
          letterSpacing: "-0.02em",
          fontSize: "clamp(1.75rem, 5vw, 3rem)",
        }}
      >
        Fingertip Mahjong
      </Title>

      <Text size="sm" c="dimmed" maw={480} mt={4}>
        Each player hides a 9×4 grid of tiles, racing to flip their entire side face-up in a
        single suit. Reveal a tile, slot it into a column, and watch the cascade ripple — matches
        stay, lucky dragons go anywhere, and mismatches get pushed along to your opponent.
      </Text>

      <Stack w="100%" maw={384} gap="sm" mt="xl">
        <UnstyledButton
          onClick={() => start("vs-human")}
          style={{
            background: "var(--color-accent)",
            color: "var(--color-felt-dark)",
            borderRadius: "0.75rem",
            padding: "1rem 1.5rem",
            fontWeight: 600,
            fontSize: "0.9375rem",
            transition: "transform 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        >
          Play vs a Friend
          <Text size="xs" fw={400} style={{ opacity: 0.7 }}>Pass-and-play on this device</Text>
        </UnstyledButton>

        <Paper
          p="md"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(0,0,0,0.15)",
            borderRadius: "0.75rem",
            textAlign: "left",
          }}
        >
          <Text fw={600} size="sm" style={{ color: "rgba(244,234,214,0.8)" }}>
            Play vs Computer
          </Text>

          <SimpleGrid cols={3} mt="sm" spacing="xs">
            {DIFFICULTIES.map((d) => (
              <UnstyledButton
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                style={{
                  borderRadius: "0.5rem",
                  border: `1px solid ${difficulty === d.id ? "var(--color-accent)" : "rgba(255,255,255,0.1)"}`,
                  background: difficulty === d.id ? "rgba(216,166,87,0.2)" : "rgba(255,255,255,0.05)",
                  color: difficulty === d.id ? "var(--color-accent-soft)" : "rgba(244,234,214,0.6)",
                  padding: "0.375rem 0.5rem",
                  fontSize: "0.8125rem",
                  textAlign: "center",
                  transition: "background 0.15s, border-color 0.15s",
                }}
              >
                {d.label}
              </UnstyledButton>
            ))}
          </SimpleGrid>

          <Text size="xs" c="dimmed" mt="xs">
            {DIFFICULTIES.find((d) => d.id === difficulty)?.blurb}
          </Text>

          <UnstyledButton
            onClick={() => start("vs-computer")}
            style={{
              marginTop: "0.75rem",
              width: "100%",
              borderRadius: "0.5rem",
              background: "rgba(255,255,255,0.1)",
              color: "var(--color-foreground)",
              padding: "0.625rem 1.5rem",
              fontWeight: 600,
              fontSize: "0.875rem",
              textAlign: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          >
            Start vs Computer
          </UnstyledButton>
        </Paper>
      </Stack>

      <Text size="xs" c="dimmed" maw={480} mt="lg">
        First to turn every tile in their grid face-up — all in their assigned suit — wins the
        round. Red dragons are lucky wilds, white dragons curse your last move, and green dragons
        simply pass through.
      </Text>

      <Text size="xs" c="dimmed" maw={480} mt="lg">
        Created by Ron Vargas
      </Text>
    </Stack>
  );
};
