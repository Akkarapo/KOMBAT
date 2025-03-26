import { useEffect } from "react";
import { useStrategy, Action } from "./useStrategy";
import { GameState } from "./useStrategy";

interface MinionActionsProps {
  strategy: string;            // โค้ด (หรือชื่อ + โค้ด) ของ Strategy
  gameState: GameState;        // สถานะเกม (budget, nearby, ...)
  onAction: (action: Action) => void; // callback เพื่อบอกให้ parent จัดการ
}

const MinionActions: React.FC<MinionActionsProps> = ({ strategy, gameState, onAction }) => {
  // เรียก useStrategy เพื่อไป fetch กับ Backend => ได้ action list กลับมา
  const actions = useStrategy(strategy, gameState);

  useEffect(() => {
    // เมื่อ actions เปลี่ยน → เรียก onAction(action) ทีละตัว
    actions.forEach((action: Action) => {
      onAction(action);
    });
  }, [actions, onAction]);

  return null;
};

export default MinionActions;
