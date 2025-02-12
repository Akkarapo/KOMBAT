"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HexGrid from "../../components/HexGrid";
import Coin from "../../components/coin";
import Turn from "../../components/Turn";

const Page = () => {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<string>("Loading...");

  useEffect(() => {
    const gameMode = searchParams.get("mode") || "Default";
    setMode(gameMode);
  }, [searchParams]);

  const [greenCoin, setGreenCoin] = useState<number>(2000);
  const [redCoin, setRedCoin] = useState<number>(2000);
  const [remainingTurns, setRemainingTurns] = useState<number>(100);
  const [canAct, setCanAct] = useState<boolean>(true);
  const [locked, setLocked] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>("green");

  const deductGreenCoin = (amount: number): void => {
    setGreenCoin((prev) => Math.max(0, prev - amount));
  };

  const deductRedCoin = (amount: number): void => {
    setRedCoin((prev) => Math.max(0, prev - amount));
  };

  const handleAction = () => {
    if (remainingTurns > 0 && canAct) {
      setRemainingTurns((prev) => prev - 1);
      setCanAct(false);
      setLocked(false);
    }
  };

  const toggleHexColor = () => {
    setCurrentColor(currentColor === "green" ? "red" : "green");
  };

  return (
    <div className="relative w-full h-screen bg-[url('/public/background.png')] bg-cover bg-center flex items-center justify-center">
      
      {/* Player 2 - บนซ้าย */}
      <div className="absolute top-4 left-4 bg-gray-300 rounded-lg px-4 py-2 shadow-md text-lg font-bold">
        Player 2
      </div>

      {/* Hex Grid - กลางจอ */}
      <div className="relative w-[600px] h-[600px] flex items-center justify-center">
        <HexGrid 
          deductMoney={deductGreenCoin} 
          greenCoin={greenCoin} 
          canAct={canAct} 
          locked={locked} 
          setLocked={setLocked} 
          currentColor={currentColor} 
        />
      </div>

      {/* ปุ่มเงิน และปุ่มนาฬิกา - ด้านขวากลางจอ */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-4">
        {/* นาฬิกา */}
        <Turn
          remainingTurns={remainingTurns}
          onAction={handleAction}
          disabled={remainingTurns <= 0 || !canAct}
          toggleColor={toggleHexColor}
        />

        {/* เงินของ Player 1 */}
        <div className="bg-gray-300 rounded-lg px-4 py-2 flex items-center space-x-2 shadow-md">
          <span className="text-gray-700 font-bold">{greenCoin}</span>
          <span>💰</span>
        </div>
      </div>

      {/* Player 1 - ล่างขวา */}
      <div className="absolute bottom-4 right-4 bg-gray-300 rounded-lg px-4 py-2 shadow-md text-lg font-bold">
        Player 1
      </div>

      {/* ปุ่ม Back to Menu - ล่างซ้าย */}
      <button
        className="absolute bottom-4 left-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-md text-lg font-bold hover:bg-red-700 transition"
        onClick={() => window.location.href = "/pageMenu"}
      >
        Back to Menu
      </button>
    </div>
  );
};

export default Page;
