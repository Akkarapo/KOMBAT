"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import HexGrid from "../../components/HexGrid";
import MinionsCard from "./minionsCard";
import { useUserStrategy, UserStrategyProvider } from "../choose-strategy/userStrategyData";

const Page = () => {
  const searchParams = useSearchParams();
  const { minions } = useUserStrategy();
  const [mode, setMode] = useState<string>("Loading...");
  const [minionCount, setMinionCount] = useState<number>(0);

  useEffect(() => {
    const gameMode = searchParams.get("mode") || "Default";
    setMode(gameMode);

    const count = parseInt(searchParams.get("count") || "0", 10);
    setMinionCount(count);
  }, [searchParams]);

  const minionNames = minions.map((minion) => minion.name);

  const [greenCoin, setGreenCoin] = useState<number>(2000);
  const [redCoin, setRedCoin] = useState<number>(2000);
  const [remainingTurns, setRemainingTurns] = useState<number>(100);
  const [canAct, setCanAct] = useState<boolean>(true);
  const [locked, setLocked] = useState<boolean>(false);
  const [currentTurn, setCurrentTurn] = useState<"green" | "red">("green");

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const initialGreenHexes = ["(1,1)", "(1,2)", "(2,1)", "(2,2)", "(1,3)"];
  const initialRedHexes = ["(7,7)", "(7,8)", "(8,6)", "(8,7)", "(8,8)"];

  const deductGreenCoin = (amount: number): void => {
    setGreenCoin((prev) => Math.max(0, prev - amount));
  };

  const deductRedCoin = (amount: number): void => {
    setRedCoin((prev) => Math.max(0, prev - amount));
  };

  const handleAction = () => {
    if (remainingTurns > 0 && canAct) {
      setRemainingTurns((prev) => prev - 1);
      setCanAct(true);
      setLocked(false);
      setCurrentTurn((prev) => (prev === "green" ? "red" : "green"));
    }
  };

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);
  const selectCard = (card: string) => {
    setSelectedCard(card);
    closePopup();
  };

  return (
    <UserStrategyProvider>
      <div className="relative w-full h-screen bg-[url('/public/background.png')] bg-cover bg-center flex items-center justify-center">
        {/* Player 2 Info */}
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

        {/* Player 1 Info */}
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

        {/* HexGrid */}
        <div className="relative w-[800px] h-[800px] flex items-center justify-center">
          <HexGrid
            deductMoney={currentTurn === "green" ? deductGreenCoin : deductRedCoin}
            greenCoin={greenCoin}
            redCoin={redCoin}
            canAct={canAct}
            locked={locked}
            setLocked={setLocked}
            currentColor={currentTurn}
            initialGreenHexes={initialGreenHexes}
            initialRedHexes={initialRedHexes}
          />
        </div>

        {/* Turns Counter */}
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

        {/* ปุ่มเลือกการ์ด */}
        <button
          className="absolute top-10 right-10 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={openPopup}
        >
          Choose Minion
        </button>

        {/* Minions Card Popup */}
        <MinionsCard
          isOpen={showPopup}
          onClose={closePopup}
          onSelect={selectCard}
          minionCount={minionCount}
          minionNames={minionNames}
        />

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
