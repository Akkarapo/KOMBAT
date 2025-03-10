"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import HexGrid from "../../components/HexGrid";
import MinionsCard from "./minionsCard";
import { useUserStrategy, UserStrategyProvider } from "../choose-strategy/userStrategyData";

// Popup
import InformationForPlayers from "./InformationForPlayers";
import MinionStrategyInformation from "./minionStrategyInformation";

// นำเข้าพื้นที่เริ่มต้น (ปรับ path ตามโปรเจกต์จริง)
import { initialGreenHexes } from "../../components/dataGreen";
import { initialRedHexes } from "../../components/dataRed";

// ---------- (1) ประกาศตัวแปร style สำหรับ Player ปกติ และ Blooming ----------
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
  width: "79.5px",
  height: "79.5px",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
};

const bloomingGreenStyle = {
  width: "79px",
  height: "79px",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
};

// ---------- (2) ประกาศ variants สำหรับเอฟเฟกต์ wipe ----------
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

// Blooming ที่ไม่ต้องการอนิเมชั่นใด ๆ
const noAnimationVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

const Page = () => {
  const searchParams = useSearchParams();
  const { minions } = useUserStrategy();

  // ดึงค่าคอนฟิกจาก query string (หรือใช้ default)
  const param_spawn_cost = parseInt(searchParams.get("spawn_cost") || "50", 10);
  const param_hex_purchase_cost = parseInt(searchParams.get("hex_purchase_cost") || "100", 10);
  const param_init_budget = parseInt(searchParams.get("init_budget") || "2000", 10);
  const param_init_hp = parseInt(searchParams.get("init_hp") || "10", 10);
  const param_turn_budget = parseInt(searchParams.get("turn_budget") || "50", 10);
  const param_max_budget = parseInt(searchParams.get("max_budget") || "5000", 10);
  const param_interest_pct = parseFloat(searchParams.get("interest_pct") || "0.05");
  const param_max_turns = parseInt(searchParams.get("max_turns") || "100", 10);
  const param_max_spawns = parseInt(searchParams.get("max_spawns") || "5", 10);

  // โหลดค่าจาก URL (เช่น mode, count)
  const [mode, setMode] = useState<string>("Loading...");
  const [minionCount, setMinionCount] = useState<number>(0);

  useEffect(() => {
    const gameMode = searchParams.get("mode") || "Default";
    setMode(gameMode);

    const count = parseInt(searchParams.get("count") || "0", 10);
    setMinionCount(count);
  }, [searchParams]);

  // ประกาศ minionNames เพื่อใช้ส่งให้ MinionsCard
  const minionNames = minions.map((m) => m.name);

  // State สำหรับระบบเกม
  const [greenCoin, setGreenCoin] = useState<number>(param_init_budget);
  const [redCoin, setRedCoin] = useState<number>(param_init_budget);
  const [remainingTurns, setRemainingTurns] = useState<number>(param_max_turns);
  const [canAct, setCanAct] = useState<boolean>(true);
  const [locked, setLocked] = useState<boolean>(false);

  // กำหนด Player 1 = green, Player 2 = red
  // ผู้ใช้ต้องการ Player 1 อยู่ "ซ้ายบน", Player 2 อยู่ "ขวาล่าง"
  const [currentTurn, setCurrentTurn] = useState<"green" | "red">("green");

  // พื้นที่เริ่มต้น
  const [greenHexes, setGreenHexes] = useState<string[]>([...initialGreenHexes]);
  const [redHexes, setRedHexes] = useState<string[]>([...initialRedHexes]);

  // ฟังก์ชันหักเงิน
  const deductGreenCoin = (amount: number) => {
    setGreenCoin((prev) => Math.max(0, prev - amount));
  };
  const deductRedCoin = (amount: number) => {
    setRedCoin((prev) => Math.max(0, prev - amount));
  };

  // เมื่อกดเปลี่ยนเทิร์น
  // เมื่อกดเปลี่ยนเทิร์น
const handleAction = () => {
  if (remainingTurns > 0 && canAct) {
    setRemainingTurns((prev) => prev - 1);
    setCanAct(true);
    setLocked(false);

    // กำหนดฐานของ log ที่ต้องการใช้ (10 หรือ Math.E)
    const interestBase = 10; // เปลี่ยนเป็น Math.E หากต้องการใช้ ln

    // เพิ่ม budget + ดอกเบี้ยแบบลดทอนการเติบโต
    if (currentTurn === "green") {
      setGreenCoin((prev) => {
        let newBudget = prev + param_turn_budget;
        // คำนวณดอกเบี้ยตามสูตร I = r * log_b(A + 1)
        const interest = Math.floor(
          param_interest_pct * Math.log(newBudget + 1) / Math.log(interestBase)
        );
        newBudget += interest;
        newBudget = Math.min(newBudget, param_max_budget);
        return newBudget;
      });
    } else {
      setRedCoin((prev) => {
        let newBudget = prev + param_turn_budget;
        const interest = Math.floor(
          param_interest_pct * Math.log(newBudget + 1) / Math.log(interestBase)
        );
        newBudget += interest;
        newBudget = Math.min(newBudget, param_max_budget);
        return newBudget;
      });
    }

    // สลับเทิร์น
    setCurrentTurn((prev) => (prev === "green" ? "red" : "green"));
  }
};


  // Popup MinionsCard
  const [showPopup, setShowPopup] = useState(false);
  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const selectCard = (card: string) => {
    setSelectedCard(card);
    closePopup();
  };

  // Popup InformationForPlayers
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  // Popup MinionStrategyInformation
  const [showStrategyPopup, setShowStrategyPopup] = useState(false);
  const [strategyMinionId, setStrategyMinionId] = useState<number | null>(null);

  const openStrategy = (id: number) => {
    setShowInfoPopup(false);
    setStrategyMinionId(id);
    setShowStrategyPopup(true);
  };
  const closeStrategy = () => {
    setShowStrategyPopup(false);
    setStrategyMinionId(null);
    setShowInfoPopup(true);
  };

  return (
    <UserStrategyProvider>
      <div className="relative w-full h-screen bg-[url('/public/background.png')] bg-cover bg-center flex items-center justify-center">

        {/* ปุ่ม Show Info มุมขวาบน */}
        <button
          className="absolute top-10 right-10 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={() => setShowInfoPopup(true)}
        >
          Show Info
        </button>

        {/* -------------------------
            Player 1 = Green
            ต้องการให้ "ซ้ายบน" คือ Player 1
            ถ้าเป็นเทิร์น green => playerGreen.png + "Player 1"
            ถ้าไม่ใช่ => BloomingRed (ไม่มีข้อความ)
        ------------------------- */}
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
              currentTurn === "green"
                ? "url('/playerRed.png')"
                : "url('/BloomingGreen.png')",
          }}
        >
          {/* ถ้าเทิร์น green => แสดง "Player 1" */}
          {currentTurn === "green" && (
            <motion.span
              className="absolute text-2xl font-bold"
              style={{
                top: "18px",
                left: "110px",
                color: "#362C22",
              }}
            >
              Player 1
            </motion.span>
          )}
        </motion.div>

        {/* -------------------------
            Player 2 = Red
            ต้องการให้ "ขวาล่าง" คือ Player 2
            ถ้าเป็นเทิร์น red => playerRed.png + "Player 2"
            ถ้าไม่ใช่ => BloomingGreen (ไม่มีข้อความ)
        ------------------------- */}
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
              currentTurn === "red"
                ? "url('/playerGreen.png')"
                : "url('/BloomingRed.png')",
          }}
        >
          {/* ถ้าเทิร์น red => แสดง "Player 2" */}
          {currentTurn === "red" && (
            <motion.span
              className="absolute text-2xl font-bold"
              style={{
                top: "19px",
                left: "60px",
                color: "#362C22",
              }}
            >
              Player 2
            </motion.span>
          )}
        </motion.div>

        {/* HexGrid ตรงกลาง */}
        <div className="relative w-[800px] h-[800px] flex items-center justify-center">
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
            openMinionsCard={openPopup}
            maxSpawns={param_max_spawns}
          />
        </div>

        {/* Turns Counter + ปุ่มเปลี่ยนเทิร์น (SandTime) */}
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
        <div className="absolute right-14 bottom-72 flex items-center" style={{ gap: "10px" }}>
          <span className="text-gray-700 text-2xl font-bold">
            {currentTurn === "green" ? greenCoin : redCoin}
          </span>
          <img src="/Coin2.png" alt="Coin" className="w-[50px] h-[50px]" />
        </div>

        {/* Popup MinionsCard */}
        <MinionsCard
          isOpen={showPopup}
          onClose={closePopup}
          onSelect={selectCard}
          minionCount={minionCount}
          minionNames={minionNames}
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
    </UserStrategyProvider>
  );
};

export default Page;
