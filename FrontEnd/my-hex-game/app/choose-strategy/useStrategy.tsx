"use client";

import { useState, useEffect } from "react";

// ---------- Interfaces ----------

export interface GameState {
  budget: number;
  opponentLoc: number;
  nearby: Record<string, number>;
  random: number;
}

export type ActionType = "move" | "shoot" | "done";

export interface Action {
  type: ActionType;
  direction?: string;
  cost?: number;
  newPosition?: string;
}

// ---------- Fetch strategy from backend ----------

async function parseStrategy(strategy: string, gameState: GameState): Promise<Action[]> {
  console.log("Attempt to fetch =>", strategy, gameState);

  const response = await fetch("http://localhost:8080/api/parseStrategy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ strategy, gameState }),
  });

  console.log("fetch done => status =", response.status);

  if (!response.ok) {
    throw new Error("Failed to parse strategy");
  }

  const data = await response.json();
  return data.actions as Action[];
}

// ---------- useStrategy Hook (with callback) ----------

/**
 * @param strategy - string เช่น "move up"
 * @param gameState - สถานะของเกม
 * @param onActionsReady - callback ที่จะถูกเรียกเมื่อได้ actions กลับจาก backend
 */
export function useStrategy(
  strategy: string,
  gameState: GameState,
  onActionsReady?: (actions: Action[]) => void
): Action[] {
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    console.log("useStrategy called with strategy =", strategy);
    parseStrategy(strategy, gameState)
      .then((parsedActions) => {
        setActions(parsedActions);
        if (onActionsReady) {
          onActionsReady(parsedActions); // ✅ เรียก callback ส่งกลับ
        }
      })
      .catch((error) => {
        console.error("Error parsing strategy:", error);
        setActions([]);
      });
  }, [strategy, gameState]);

  return actions;
}
