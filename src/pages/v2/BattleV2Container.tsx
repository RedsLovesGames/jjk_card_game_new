import { useGame } from "@/context/GameContext";
import BattleScreen from "@/pages/BattleScreen";
import BattleV2View from "./BattleV2View";

const BattleV2Container = () => {
  const { gameState } = useGame();

  return <BattleV2View hasGameState={Boolean(gameState)} fallback={<BattleScreen />} />;
};

export default BattleV2Container;
