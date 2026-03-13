import { GameBoard } from "@/components/game/GameBoard";
import type { ReactNode } from "react";

interface BattleV2ViewProps {
  hasGameState: boolean;
  fallback: ReactNode;
}

const BattleV2View = ({ hasGameState, fallback }: BattleV2ViewProps) => {
  if (!hasGameState) return <>{fallback}</>;
  return <GameBoard />;
};

export default BattleV2View;
