"use client";

import { useState, useEffect } from "react";

// ---------- Interfaces สำหรับข้อมูลเกมและ Action ----------

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
  // สมมติว่าถ้าฝั่ง backend ส่งกลับพิกัดใหม่
  newPosition?: string;
}

// ---------- ฟังก์ชันเรียก API เพื่อ parse strategy ด้วย Java parser + GameState ----------
async function parseStrategy(strategy: string, gameState: GameState): Promise<Action[]> {
  // เปลี่ยนจาก "/api/parseStrategy" เป็น "http://localhost:8080/api/parseStrategy"
  // เพื่อชี้ไปที่ Spring Boot (ซึ่งรันบนพอร์ต 8080)
  const response = await fetch("http://localhost:8080/api/parseStrategy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ strategy, gameState }),
  });

  if (!response.ok) {
    throw new Error("Failed to parse strategy");
  }

  const data = await response.json();
  // สมมติว่า API ส่งกลับ { actions: Action[] }
  return data.actions as Action[];
}

// ---------- Hook useStrategy ----------
//
// รับ strategy string และ gameState
// จากนั้นเรียก parser ผ่าน API เพื่อให้ backend ประมวลผล
// ส่งกลับ action list
//
export function useStrategy(strategy: string, gameState: GameState): Action[] {
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    // เพิ่ม console.log เพื่อตรวจสอบว่า useStrategy ถูกเรียกจริงหรือไม่
    console.log("useStrategy called with strategy =", strategy);

    parseStrategy(strategy, gameState)
      .then((parsedActions) => {
        setActions(parsedActions);
      })
      .catch((error) => {
        console.error("Error parsing strategy:", error);
        setActions([]);
      });
  }, [strategy, gameState]);

  return actions;
}
