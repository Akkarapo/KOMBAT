// ถ้าไฟล์นี้ไม่มีการ render UI ไม่จำเป็นต้องใส่ "use client";
export const HexData = {
    spawn_cost: "the cost of spawning a new minion",
    hex_purchase_cost: "the cost of purchasing a hex to make it spawnable",
    init_budget: "the initial budget",
    init_hp: "the initial HP for a newly spawned minion",
    turn_budget: "the amount of additional budget for each turn",
    max_budget: "maximum allowable budget",
    interest_pct: "interest rate percentage",
    max_turns: "maximum turns allowed per game",
    max_spawns: "maximum number of spawns",
  };
  
  // รวม imageMapping ไว้ในไฟล์เดียวกัน
  export const imageMapping: { [key: string]: string } = {
    spawn_cost: "/Spawncost.png",
    hex_purchase_cost: "/HexPurchaseCost.png",
    init_budget: "/InitBudget.png",
    init_hp: "/InitHp.png",
    turn_budget: "/TurnBudget.png",
    max_budget: "/MaxBudget.png",
    interest_pct: "/InterestPct.png",
    max_turns: "/MaxTurns.png",
    max_spawns: "/MaxSpawns.png",
  };
  