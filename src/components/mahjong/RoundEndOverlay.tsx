"use client";

import { Modal, Stack, Text, Title, UnstyledButton } from "@mantine/core";
import { useGame } from "@/lib/mahjong/context";

export const RoundEndOverlay = () => {
  const { state, dispatch } = useGame();
  if (state.phase !== "round-end" || !state.result) return null;

  const { winner } = state.result;
  const winnerName = winner ? state.players[winner].name : null;
  const headline = winnerName ? `${winnerName} wins the round!` : "The wall ran out — round drawn.";
  const isYou = winner === "p1";

  return (
    <Modal
      opened
      onClose={() => {}}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      centered
      styles={{
        content: {
          background: "rgba(9,48,36,0.97)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "1rem",
        },
        overlay: {
          backdropFilter: "blur(4px)",
          background: "rgba(0,0,0,0.55)",
        },
      }}
    >
      <Stack align="center" ta="center" gap="xs">
        <Text style={{ fontSize: "2.5rem", lineHeight: 1 }}>
          {winner ? (isYou ? "🎉" : "🀄") : "🤝"}
        </Text>

        <Title order={2} mt={4} style={{ color: "var(--color-accent-soft)" }}>
          {headline}
        </Title>

        {winner && (
          <Text size="sm" c="dimmed">
            Filled all {state.players[winner].grid.length} columns with{" "}
            {state.players[winner].name === "You" ? "your" : "their"} suit.
          </Text>
        )}

        <Text size="sm" style={{ color: "rgba(244,234,214,0.7)" }}>
          Score — You: {state.scores.p1} · {state.players.p2.name}: {state.scores.p2}
        </Text>

        <Stack w="100%" mt="md" gap="xs">
          <UnstyledButton
            onClick={() => dispatch({ type: "NEXT_ROUND" })}
            style={{
              background: "var(--color-accent)",
              color: "var(--color-felt-dark)",
              borderRadius: "0.75rem",
              padding: "0.75rem 1.5rem",
              fontWeight: 600,
              fontSize: "0.875rem",
              textAlign: "center",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          >
            Next Round
          </UnstyledButton>

          <UnstyledButton
            onClick={() => dispatch({ type: "RETURN_TO_MENU" })}
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "rgba(244,234,214,0.7)",
              borderRadius: "0.75rem",
              padding: "0.75rem 1.5rem",
              fontSize: "0.875rem",
              textAlign: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          >
            Back to Menu
          </UnstyledButton>
        </Stack>
      </Stack>
    </Modal>
  );
};
