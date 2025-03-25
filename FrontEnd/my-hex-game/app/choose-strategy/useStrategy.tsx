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
  try {
    console.log("Before fetch()", strategy, gameState);

    const response = await fetch("http://localhost:8080/api/parseStrategy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strategy, gameState }),
    });

    console.log("fetch done => status =", response.status);

    if (!response.ok) {
      throw new Error("Failed to parse strategy. status = " + response.status);
    }

    const data = await response.json();
    if (data.debug) {
      console.log("Backend debug =>", data.debug);
    }
    console.log("parseStrategy response data =>", data);
    return data.actions || [];
  } catch (err) {
    console.error("Fetch error =>", err);
    throw err;
  }
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

    // เรียก fetch strategy ทุกครั้งที่ค่า strategy หรือ gameState เปลี่ยน
    parseStrategy(strategy, gameState)
      .then((parsedActions) => {
        console.log("Parsed actions =>", parsedActions);
        setActions(parsedActions);
        if (onActionsReady) {
          onActionsReady(parsedActions); // เรียก callback ส่งกลับ actions
        }
      })
      .catch((error) => {
        console.error("Error parsing strategy:", error);
        setActions([]);
      });
  }, [strategy, gameState]);

  return actions;
}
