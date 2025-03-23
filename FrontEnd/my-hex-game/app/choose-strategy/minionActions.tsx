import { useEffect } from "react";
import { useStrategy, Action } from "./useStrategy";
import { GameState } from "./useStrategy";

interface MinionActionsProps {
  strategy: string;
  gameState: GameState;
  onAction: (action: Action) => void;
}

const MinionActions: React.FC<MinionActionsProps> = ({ strategy, gameState, onAction }) => {
  const actions = useStrategy(strategy, gameState);

  useEffect(() => {
    actions.forEach((action: Action) => {
      onAction(action);
    });
  }, [actions, onAction]);

  return null;
};

export default MinionActions;
