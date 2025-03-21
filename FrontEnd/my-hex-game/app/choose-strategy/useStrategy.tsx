import { useState, useEffect } from "react";

// ---------- Interfaces สำหรับข้อมูลเกมและ Action ----------

export interface GameState {
  budget: number;
  opponentLoc: number;
  // nearby เป็น object ที่เก็บค่าตัวเลขของ cell ในแต่ละทิศ เช่น { up: 3, down: 2, upleft: 1, ... }
  nearby: Record<string, number>;
  // ค่าสุ่ม (random) ที่อาจใช้ใน strategy (ตัวอย่าง)
  random: number;
}

export type ActionType = "move" | "shoot" | "done";

export interface Action {
  type: ActionType;
  // direction เช่น "upleft", "down", "upright" เป็นต้น
  direction?: string;
  // cost (สำหรับ action แบบ shoot) ถ้ามี
  cost?: number;
  // คุณสามารถเพิ่ม field อื่น ๆ ตามที่ engine ของคุณรองรับ
}

// ---------- ฟังก์ชันเรียก API เพื่อ parse strategy ด้วย Java parser ----------

/**
 * parseStrategy
 * ส่ง strategy string ไปยัง backend API ที่ใช้ Java parser (ExprParser/StatementParser)
 * แล้วรับผลลัพธ์เป็น action list ในรูปแบบ JSON
 */
async function parseStrategy(strategy: string): Promise<Action[]> {
  const response = await fetch("/api/parseStrategy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ strategy }),
  });
  if (!response.ok) {
    throw new Error("Failed to parse strategy");
  }
  const data = await response.json();
  // สมมุติว่า API ส่งกลับ { actions: Action[] }
  return data.actions as Action[];
}

// ---------- Hook useStrategy ----------

/**
 * useStrategy
 * รับ strategy string (เช่นจาก strategyData.ts) และสถานะเกม (gameState)
 * จากนั้นเรียก parser ผ่าน API เพื่อแปลง strategy เป็น action list
 * และสามารถนำ gameState ไปปรับ interpreter logic ได้ในฝั่ง client (หรือ backend)
 */
export function useStrategy(strategy: string, gameState: GameState): Action[] {
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    // เรียก parser ผ่าน API
    parseStrategy(strategy)
      .then((parsedActions) => {
        // ในที่นี้เราใช้ผลลัพธ์โดยตรง
        // คุณสามารถเพิ่มขั้นตอนการปรับเปลี่ยน action list โดยใช้ gameState ได้ที่นี่
        // ตัวอย่างเช่น ถ้างบประมาณไม่พอ อาจเปลี่ยน action shoot เป็น done เป็นต้น
        setActions(parsedActions);
      })
      .catch((error) => {
        console.error("Error parsing strategy:", error);
        setActions([]);
      });
  }, [strategy, gameState]);

  return actions;
}
