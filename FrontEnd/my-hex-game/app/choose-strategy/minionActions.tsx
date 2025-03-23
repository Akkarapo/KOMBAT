import { useEffect } from "react";
import { useStrategy, Action } from "./useStrategy";
import { GameState } from "./useStrategy";

interface MinionActionsProps {
  strategy: string;
  gameState: GameState;
  onAction: (action: Action) => void;
}

const MinionActions: React.FC<MinionActionsProps> = ({ strategy, gameState, onAction }) => {
  // ใช้ hook useStrategy เพื่อรับ action list จาก API
  const actions = useStrategy(strategy, gameState);

  useEffect(() => {
    // เมื่อได้ action listแล้ว ส่งแต่ละ actionไปให้ onAction เพื่อประมวลผล
    actions.forEach((action: Action) => {
      onAction(action);
    });
  }, [actions, onAction]);

  return null;
};

export default MinionActions;
