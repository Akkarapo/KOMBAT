"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import HexGrid from "../../components/HexGrid";
import MinionsCard from "./minionsCard";
import { useUserStrategy, UserStrategyProvider } from "../choose-strategy/userStrategyData";

// Import Popup สำหรับแสดงข้อมูล
import InformationForPlayers from "./InformationForPlayers";
import MinionStrategyInformation from "./minionStrategyInformation";

const Page = () => {
  const searchParams = useSearchParams();
  const { minions } = useUserStrategy();

  const [mode, setMode] = useState<string>("Loading...");
  const [minionCount, setMinionCount] = useState<number>(0);

  // โหลดค่าจาก URL
  useEffect(() => {
    const gameMode = searchParams.get("mode") || "Default";
    setMode(gameMode);

    const count = parseInt(searchParams.get("count") || "0", 10);
    setMinionCount(count);
  }, [searchParams]);

  const minionNames = minions.map((m) => m.name);

  // -------------------------------
  // State สำหรับระบบเกมทั่วไป
  // -------------------------------
  const [greenCoin, setGreenCoin] = useState<number>(2000);
  const [redCoin, setRedCoin] = useState<number>(2000);
  const [remainingTurns, setRemainingTurns] = useState<number>(100);
  const [canAct, setCanAct] = useState<boolean>(true);
  const [locked, setLocked] = useState<boolean>(false);
  const [currentTurn, setCurrentTurn] = useState<"green" | "red">("green");

  const [greenHexes, setGreenHexes] = useState<string[]>([
    "(1,1)", "(1,2)", "(2,1)", "(2,2)", "(1,3)"
  ]);
  const [redHexes, setRedHexes] = useState<string[]>([
    "(7,7)", "(7,8)", "(8,6)", "(8,7)", "(8,8)"
  ]);

  const deductGreenCoin = (amount: number): void => {
    setGreenCoin((prev) => Math.max(0, prev - amount));
  };
  const deductRedCoin = (amount: number): void => {
    setRedCoin((prev) => Math.max(0, prev - amount));
  };

  // ฟังก์ชันเปลี่ยนเทิร์น (กด SandTime)
  const handleAction = () => {
    if (remainingTurns > 0 && canAct) {
      setRemainingTurns((prev) => prev - 1);
      setCanAct(true);
      setLocked(false);
      setCurrentTurn((prev) => (prev === "green" ? "red" : "green"));
    }
  };

  // -------------------------------
  // Popup MinionsCard
  // -------------------------------
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const selectCard = (card: string) => {
    setSelectedCard(card);
    closePopup();
  };

  // -------------------------------
  // Popup InformationForPlayers
  // -------------------------------
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  // -------------------------------
  // Popup MinionStrategyInformation
  // -------------------------------
  const [showStrategyPopup, setShowStrategyPopup] = useState(false);
  const [strategyMinionId, setStrategyMinionId] = useState<number | null>(null);

  // ฟังก์ชันเปิด popup Strategy (เมื่อคลิกมินเนี่ยนใน Info)
  const openStrategy = (id: number) => {
    // ปิด Info ก่อน
    setShowInfoPopup(false);

    // เก็บ ID
    setStrategyMinionId(id);
    setShowStrategyPopup(true);
  };

  // ฟังก์ชันปิด popup Strategy
  const closeStrategy = () => {
    setShowStrategyPopup(false);
    setStrategyMinionId(null);

    // กลับมาเปิด Info ต่อ
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

        {/* Player 2 Info (บนซ้าย) */}
        <motion.div
          className="absolute w-[250px] h-[90px]"
          style={{
            top: "20px",
            left: "30px",
            backgroundImage: "url('/playerRed.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        >
          <motion.span
            className="absolute text-2xl font-bold text-black"
            style={{ top: "25px", left: "100px" }}
          >
            Player 2
          </motion.span>
        </motion.div>

        {/* Player 1 Info (ล่างขวา) */}
        <motion.div
          className="absolute w-[250px] h-[90px]"
          style={{
            bottom: "20px",
            right: "30px",
            backgroundImage: "url('/playerGreen.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        >
          <motion.span
            className="absolute text-2xl font-bold text-black"
            style={{ top: "25px", left: "60px" }}
          >
            Player 1
          </motion.span>
        </motion.div>

        {/* HexGrid ตรงกลาง */}
        <div className="relative w-[800px] h-[800px] flex items-center justify-center">
          <HexGrid
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

        {/* Popup MinionStrategyInformation (ไม่มีปุ่ม BUY) */}
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
