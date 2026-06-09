"use client";

import { Box } from "@mantine/core";
import { GameProvider, useGame } from "@/lib/mahjong/context";
import { GameTable } from "./GameTable";
import { MainMenu } from "./MainMenu";

const Router = () => {
  const { state } = useGame();
  return state.phase === "menu" ? <MainMenu /> : <GameTable />;
};

export const GameShell = () => (
  <GameProvider>
    <Box style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: "100dvh" }}>
      <Router />
    </Box>
  </GameProvider>
);
