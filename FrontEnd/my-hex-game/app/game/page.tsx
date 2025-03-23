"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { calculateWinner } from "./winningConditions";
import HexGrid from "../../components/HexGrid";
import MinionsCard from "./minionsCard";
import { useUserStrategy } from "../choose-strategy/userStrategyData";
import type { MinionData } from "../choose-strategy/userStrategyData";
import InformationForPlayers from "./InformationForPlayers";
import MinionStrategyInformation from "./minionStrategyInformation";
import { initialGreenHexes, GreenHexData } from "../../components/dataGreen";
import { initialRedHexes, RedHexData } from "../../components/dataRed";

// นำเข้า MinionActions และ interfaces จาก useStrategy
import MinionActions from "../choose-strategy/minionActions";
import { Action, GameState } from "../choose-strategy/useStrategy";

// ---------- ตัวแปร style สำหรับ Player / Blooming ----------
const playerRedStyle = {
  width: "250px",
  height: "90px",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
};

const playerGreenStyle = {
  width: "250px",
  height: "90px",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
};

const bloomingRedStyle = {
  width: "79px",
  height: "79px",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
};

const bloomingGreenStyle = {
  width: "80px",
  height: "80px",
  top: "628.5px",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
};

// ---------- variants สำหรับเอฟเฟกต์ wipe ----------
const wipeFromLeft = {
  hidden: {
    clipPath: "inset(0 100% 0 0)",
    opacity: 0,
  },
  visible: {
    clipPath: "inset(0 0 0 0)",
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

const wipeFromRight = {
  hidden: {
    clipPath: "inset(0 0 0 100%)",
    opacity: 0,
  },
  visible: {
    clipPath: "inset(0 0 0 0)",
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

// Blooming ที่ไม่ต้องการอนิเมชั่น
const noAnimationVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

/** Helper: แปลงสตริง "(row,col)" เป็น { row: number, col: number } */
function parseKey(key: string): { row: number; col: number } {
  // ตัวอย่าง key = "(2,3)"
  // ตัดวงเล็บออก แล้ว split ด้วย ','
  const trimmed = key.replace(/[()]/g, ""); // "2,3"
  const [r, c] = trimmed.split(",");
  return { row: parseInt(r, 10), col: parseInt(c, 10) };
}

/** Helper: สร้าง key "(row,col)" จาก row,col */
function buildKey(row: number, col: number): string {
  return `(${row},${col})`;
}

/** ฟังก์ชันหาว่า Minion ตัวนี้อยู่ Hex ไหน (return key) */
function findHexKeyOfMinion(
  minion: MinionData,
  color: "green" | "red",
  greenHexes: GreenHexData[],
  redHexes: RedHexData[]
): string | null {
  if (color === "green") {
    for (const hex of greenHexes) {
      if (hex.minions.some((m) => m.minionId === minion.minionId)) {
        return hex.key;
      }
    }
  } else {
    for (const hex of redHexes) {
      if (hex.minions.some((m) => m.minionId === minion.minionId)) {
        return hex.key;
      }
    }
  }
  return null;
}

/** ฟังก์ชันคำนวณตำแหน่งใหม่จาก direction (ตัวอย่าง) */
function calcNewPosition(oldRow: number, oldCol: number, direction: string): { row: number; col: number } {
  let newRow = oldRow;
  let newCol = oldCol;

  // ตัวอย่าง: ถ้า Hex เป็นแบบ Odd-r หรือ Even-r ให้ปรับ logic ตาม
  // สมมติใช้ Even-r (col%2 === 0 จะ offset ต่างจาก col%2 === 1)
  // นี่เป็นแค่ตัวอย่าง:
  const isEvenCol = (oldCol % 2 === 0);

  switch (direction) {
    case "downleft":
      newRow = oldRow + (isEvenCol ? 0 : 1);
      newCol = oldCol - 1;
      break;
    case "downright":
      newRow = oldRow + (isEvenCol ? 0 : 1);
      newCol = oldCol + 1;
      break;
    case "upleft":
      newRow = oldRow - (isEvenCol ? 1 : 0);
      newCol = oldCol - 1;
      break;
    case "upright":
      newRow = oldRow - (isEvenCol ? 1 : 0);
      newCol = oldCol + 1;
      break;
    case "down":
      newRow = oldRow + 1;
      break;
    case "up":
      newRow = oldRow - 1;
      break;
    default:
      // ไม่รู้จัก direction → ไม่ขยับ
      break;
  }

  return { row: newRow, col: newCol };
}

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { minions } = useUserStrategy(); // ข้อมูล MinionData[]

  // ค่า config ต่าง ๆ
  const param_spawn_cost = parseInt(searchParams.get("spawn_cost") || "50", 10);
  const param_hex_purchase_cost = parseInt(searchParams.get("hex_purchase_cost") || "100", 10);
  const param_init_budget = parseInt(searchParams.get("init_budget") || "2000", 10);
  const param_init_hp = parseInt(searchParams.get("init_hp") || "10", 10);
  const param_turn_budget = parseInt(searchParams.get("turn_budget") || "50", 10);
  const param_max_budget = parseInt(searchParams.get("max_budget") || "5000", 10);
  const param_interest_pct = parseFloat(searchParams.get("interest_pct") || "0.05");
  const param_max_turns = parseInt(searchParams.get("max_turns") || "100", 10);
  const param_max_spawns = parseInt(searchParams.get("max_spawns") || "5", 10);

  const [mode, setMode] = useState<string>("Loading...");
  const [minionCount, setMinionCount] = useState<number>(0);

  useEffect(() => {
    const gameMode = searchParams.get("mode") || "Default";
    setMode(gameMode);
    const count = parseInt(searchParams.get("count") || "0", 10);
    setMinionCount(count);
  }, [searchParams]);

  // State ระบบเกม
  const [greenCoin, setGreenCoin] = useState<number>(param_init_budget);
  const [redCoin, setRedCoin] = useState<number>(param_init_budget);
  const [remainingTurns, setRemainingTurns] = useState<number>(param_max_turns);
  const [canAct, setCanAct] = useState<boolean>(true);
  const [locked, setLocked] = useState<boolean>(false);

  // ฝั่งที่เล่นปัจจุบัน
  const [currentTurn, setCurrentTurn] = useState<"green" | "red">("green");

  // Hex เริ่มต้นของแต่ละฝั่ง
  const [greenHexes, setGreenHexes] = useState<GreenHexData[]>([...initialGreenHexes]);
  const [redHexes, setRedHexes] = useState<RedHexData[]>([...initialRedHexes]);

  // เมื่อคลิก Hex สีเรา → ซื้อ Minion
  const [selectedHexForMinion, setSelectedHexForMinion] = useState<string | null>(null);
  const handleOwnedHexClick = (hexKey: string) => {
    setSelectedHexForMinion(hexKey);
    setShowMinionsCard(true);
  };

  // หักเงิน
  const deductGreenCoin = (amount: number) => {
    setGreenCoin((prev) => Math.max(0, prev - amount));
  };
  const deductRedCoin = (amount: number) => {
    setRedCoin((prev) => Math.max(0, prev - amount));
  };

  // เปลี่ยนเทิร์น
  const handleAction = () => {
    if (remainingTurns > 0 && canAct) {
      setRemainingTurns((prev) => prev - 1);
      setCanAct(true);
      setLocked(false);

      const interestBase = 10;
      if (currentTurn === "green") {
        setGreenCoin((prev) => {
          let newBudget = prev + param_turn_budget;
          const interest = Math.floor(param_interest_pct * Math.log(newBudget + 1) / Math.log(interestBase));
          newBudget += interest;
          newBudget = Math.min(newBudget, param_max_budget);
          return newBudget;
        });
      } else {
        setRedCoin((prev) => {
          let newBudget = prev + param_turn_budget;
          const interest = Math.floor(param_interest_pct * Math.log(newBudget + 1) / Math.log(interestBase));
          newBudget += interest;
          newBudget = Math.min(newBudget, param_max_budget);
          return newBudget;
        });
      }
      setCurrentTurn((prev) => (prev === "green" ? "red" : "green"));
    }
  };

  // Popup MinionsCard
  const [showMinionsCard, setShowMinionsCard] = useState(false);
  const openMinionsCard = () => setShowMinionsCard(true);
  const closeMinionsCard = () => setShowMinionsCard(false);

  // เมื่อกดปุ่ม Buy ในการ์ด
  const handleBuyMinion = (minionName: string) => {
    if (!selectedHexForMinion) return;
    const found = minions.find((m) => m.name === minionName);
    if (found) {
      if (currentTurn === "green") {
        setGreenHexes((prev) =>
          prev.map((hex) =>
            hex.key === selectedHexForMinion
              ? {
                  ...hex,
                  minions: [...hex.minions, { minionId: found.minionId, name: found.name }],
                }
              : hex
          )
        );
      } else {
        setRedHexes((prev) =>
          prev.map((hex) =>
            hex.key === selectedHexForMinion
              ? {
                  ...hex,
                  minions: [...hex.minions, { minionId: found.minionId, name: found.name }],
                }
              : hex
          )
        );
      }
    }
    setSelectedHexForMinion(null);
    setShowMinionsCard(false);
  };

  // Popup InformationForPlayers
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  // Popup MinionStrategyInformation
  const [showStrategyPopup, setShowStrategyPopup] = useState(false);
  const [strategyMinionId, setStrategyMinionId] = useState<number | null>(null);

  const openStrategy = (minionId: number) => {
    setShowInfoPopup(false);
    setStrategyMinionId(minionId);
    setShowStrategyPopup(true);
  };
  const closeStrategy = () => {
    setShowStrategyPopup(false);
    setStrategyMinionId(null);
    setShowInfoPopup(true);
  };

  // สร้าง gameState ให้ส่งไป backend
  const gameState: GameState = {
    budget: currentTurn === "green" ? greenCoin : redCoin,
    opponentLoc: 42, // สมมติ
    nearby: { up: 1, down: 2, upleft: 1, upright: 1, downleft: 2, downright: 2 },
    random: Math.floor(Math.random() * 100),
  };

  // ★★ ตรงนี้คือฟังก์ชันย่อย: เมื่อได้รับ "move" → คำนวณตำแหน่งใหม่
  const doMove = (minion: MinionData, direction: string) => {
    // 1) หา oldKey
    const oldKey = findHexKeyOfMinion(minion, currentTurn, greenHexes, redHexes);
    if (!oldKey) {
      console.log(`ไม่พบ minion ${minion.name} ใน HexGrid`);
      return;
    }
    const { row: oldRow, col: oldCol } = parseKey(oldKey);

    // 2) คำนวณ newRow, newCol จาก direction
    const { row: newRow, col: newCol } = calcNewPosition(oldRow, oldCol, direction);
    const newKey = buildKey(newRow, newCol);

    // 3) ลบ minion ออกจาก oldKey และใส่ใน newKey
    if (currentTurn === "green") {
      // ลบจาก greenHexes + ใส่ใน newKey (ถ้ามีอยู่แล้วก็ push, ถ้าไม่มีสร้างใหม่)
      setGreenHexes((prev) => {
        // ลบออกจาก oldKey
        const newHexes = prev.map((hex) => {
          if (hex.key === oldKey) {
            return {
              ...hex,
              minions: hex.minions.filter((m) => m.minionId !== minion.minionId),
            };
          }
          return hex;
        });

        // ใส่ใน newKey
        // ถ้ามีอยู่แล้ว
        const indexTarget = newHexes.findIndex((h) => h.key === newKey);
        if (indexTarget !== -1) {
          newHexes[indexTarget] = {
            ...newHexes[indexTarget],
            minions: [
              ...newHexes[indexTarget].minions,
              { minionId: minion.minionId, name: minion.name },
            ],
          };
        } else {
          // ยังไม่มี hex นี้ → สร้างใหม่
          newHexes.push({
            key: newKey,
            minions: [{ minionId: minion.minionId, name: minion.name }],
          });
        }
        return newHexes;
      });
    } else {
      // เหมือนกัน แต่กับ redHexes
      setRedHexes((prev) => {
        const newHexes = prev.map((hex) => {
          if (hex.key === oldKey) {
            return {
              ...hex,
              minions: hex.minions.filter((m) => m.minionId !== minion.minionId),
            };
          }
          return hex;
        });
        const indexTarget = newHexes.findIndex((h) => h.key === newKey);
        if (indexTarget !== -1) {
          newHexes[indexTarget] = {
            ...newHexes[indexTarget],
            minions: [
              ...newHexes[indexTarget].minions,
              { minionId: minion.minionId, name: minion.name },
            ],
          };
        } else {
          newHexes.push({
            key: newKey,
            minions: [{ minionId: minion.minionId, name: minion.name }],
          });
        }
        return newHexes;
      });
    }
  };

  // ฟังก์ชันจัดการ action ที่ได้จาก MinionActions
  const handleMinionAction = (action: Action, minion: MinionData) => {
    if (action.type === "move") {
      console.log(`Minion ${minion.name} move to direction = ${action.direction}`);
      if (action.direction) {
        doMove(minion, action.direction);
      }
    } else if (action.type === "shoot") {
      console.log(`Minion ${minion.name} shoot ${action.direction} with cost ${action.cost}`);
      // TODO: ยิง/หักเงิน
    } else if (action.type === "done") {
      console.log(`Minion ${minion.name} did no action`);
    }
  };

  // เช็คว่าหมดเทิร์นรึยัง
  useEffect(() => {
    if (remainingTurns <= 0) {
      const greenMinionCount = greenHexes.reduce((acc, hex) => acc + hex.minions.length, 0);
      const redMinionCount = redHexes.reduce((acc, hex) => acc + hex.minions.length, 0);
      const winner = calculateWinner({
        greenMinions: greenMinionCount,
        redMinions: redMinionCount,
        greenBudget: greenCoin,
        redBudget: redCoin,
        initHp: param_init_hp,
      });
      router.push(`/congratulations?winner=${winner}`);
    }
  }, [remainingTurns, greenHexes, redHexes, greenCoin, redCoin, param_init_hp, router]);

  return (
    <div className="relative w-full h-screen bg-[url('/background.png')] bg-cover bg-center flex items-center justify-center">
      {/* ★★ เรียก MinionActions สำหรับแต่ละมินเนี่ยน */}
      {minions.map((m) => (
        <MinionActions
          key={m.minionId}
          strategy={m.strategy}
          gameState={gameState}
          onAction={(action) => handleMinionAction(action, m)}
        />
      ))}

      {/* ปุ่ม Show Info */}
      <button
        className="absolute top-10 right-10 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        onClick={() => setShowInfoPopup(true)}
      >
        Show Info
      </button>

      {/* Player 1 = Green */}
      <motion.div
        key={`player1-${currentTurn}`}
        variants={currentTurn === "green" ? wipeFromLeft : noAnimationVariants}
        initial="hidden"
        animate="visible"
        className="absolute"
        style={{
          top: "20px",
          left: "30px",
          ...(currentTurn === "green" ? playerGreenStyle : bloomingRedStyle),
          backgroundImage:
            currentTurn === "green" ? "url('/playerRed.png')" : "url('/BloomingGreen.png')",
        }}
      >
        {currentTurn === "green" && (
          <motion.span
            className="absolute text-2xl font-bold"
            style={{ top: "18px", left: "110px", color: "#362C22" }}
          >
            Player 1
          </motion.span>
        )}
      </motion.div>

      {/* Player 2 = Red */}
      <motion.div
        key={`player2-${currentTurn}`}
        variants={currentTurn === "red" ? wipeFromRight : noAnimationVariants}
        initial="hidden"
        animate="visible"
        className="absolute"
        style={{
          bottom: "20px",
          right: "30px",
          ...(currentTurn === "red" ? playerRedStyle : bloomingGreenStyle),
          backgroundImage:
            currentTurn === "red" ? "url('/playerGreen.png')" : "url('/BloomingRed.png')",
        }}
      >
        {currentTurn === "red" && (
          <motion.span
            className="absolute text-2xl font-bold"
            style={{ top: "19px", left: "60px", color: "#362C22" }}
          >
            Player 2
          </motion.span>
        )}
      </motion.div>

      {/* HexGrid ตรงกลาง */}
      <div className="relative w-[800px] h-[800px] flex items-center justify-center top-[100px] right-[-150px]">
        <HexGrid
          hexPurchaseCost={param_hex_purchase_cost}
          deductMoney={currentTurn === "green" ? deductGreenCoin : deductRedCoin}
          greenCoin={greenCoin}
          redCoin={redCoin}
          canAct={canAct}
          locked={locked}
          setLocked={setLocked}
          currentColor={currentTurn}
          greenHexes={greenHexes}
          redHexes={redHexes}
          setGreenHexes={setGreenHexes}
          setRedHexes={setRedHexes}
          maxSpawns={param_max_spawns}
          onOwnedHexClick={handleOwnedHexClick}
        />
      </div>

      {/* Turns Counter + ปุ่มเปลี่ยนเทิร์น */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex items-center space-x-4">
        <div className="text-4xl font-bold text-black">{remainingTurns}</div>
        <button onClick={handleAction} disabled={remainingTurns <= 0}>
          <img
            src="/SandTime.png"
            alt="Turn Timer"
            className={`w-[100px] h-[100px] ${
              remainingTurns <= 0 ? "opacity-50" : "opacity-100 hover:opacity-80"
            }`}
          />
        </button>
      </div>

      {/* Coin Display */}
      <div
        className="relative right-30 bottom-72 flex items-center top-[100px] right-[-240px]"
        style={{ gap: "10px" }}
      >
        <span className="text-gray-700 text-2xl font-bold">
          {currentTurn === "green" ? greenCoin : redCoin}
        </span>
        <img src="/Coin2.png" alt="Coin" className="w-[50px] h-[50px]" />
      </div>

      {/* Popup MinionsCard */}
      <MinionsCard
        isOpen={showMinionsCard}
        onClose={closeMinionsCard}
        minionCount={minionCount}
        minionNames={minions.map((m) => m.name)}
        onBuyMinion={handleBuyMinion}
      />

      {/* Popup InformationForPlayers */}
      <InformationForPlayers
        isOpen={showInfoPopup}
        onClose={() => setShowInfoPopup(false)}
        onMinionCardClick={openStrategy}
      />

      {/* Popup MinionStrategyInformation */}
      {showStrategyPopup && strategyMinionId !== null && (
        <MinionStrategyInformation
          minionId={strategyMinionId}
          hideBuyButton={true}
          onClose={closeStrategy}
        />
      )}

      {/* Back to Menu Button */}
      <button
        className="absolute bottom-4 left-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-md text-lg font-bold hover:bg-red-700 transition"
        onClick={() => (window.location.href = "/pageMenu")}
      >
        Back to Menu
      </button>
    </div>
  );
};

export default Page;
