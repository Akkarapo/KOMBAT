"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import HexGrid from "../../components/HexGrid";
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

  const initialGreenHexes = ["(1,1)", "(1,2)", "(2,1)", "(2,2)", "(1,3)"];

  const deductGreenCoin = (amount: number): void => {
    setGreenCoin((prev) => Math.max(0, prev - amount));
  };

  const handleAction = () => {
    if (remainingTurns > 0 && canAct) {
      setRemainingTurns((prev) => prev - 1);
      setCanAct(true);
      setLocked(false);
      setCurrentColor("green");
    }
  };

  return (
    <div className="relative w-full h-screen bg-[url('/public/background.png')] bg-cover bg-center flex items-center justify-center">
      <motion.div className="absolute w-[250px] h-[90px]" initial={{ y: "-100px", opacity: 0 }} animate={{ y: "0px", opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ backgroundImage: "url('/playerRed.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", top: "20px", left: "30px" }}>
        <motion.span className="absolute text-2xl font-bold text-black" initial={{ y: "-20px", opacity: 0 }} animate={{ y: "0px", opacity: 1 }} transition={{ duration: 1, ease: "easeOut" }} style={{ top: "25px", left: "100px" }}>Player 2</motion.span>
      </motion.div>
      <div className="relative w-[600px] h-[600px] flex items-center justify-center">
        <HexGrid deductMoney={deductGreenCoin} greenCoin={greenCoin} canAct={canAct} locked={locked} setLocked={setLocked} currentColor={currentColor} initialGreenHexes={initialGreenHexes} />
      </div>
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex items-center space-x-4">
        <div className="text-4xl font-bold text-black">{remainingTurns}</div>
        <button onClick={handleAction} disabled={remainingTurns <= 0}>
          <img src="/SandTime.png" alt="Turn Timer" className={`w-[100px] h-[100px] transition-opacity ${remainingTurns <= 0 ? "opacity-50" : "opacity-100 hover:opacity-80"}`} />
        </button>
      </div>
      <div className="absolute right-14 bottom-72 flex items-center" style={{ gap: '10px' }}>
        <span className="text-gray-700 text-2xl font-bold">{greenCoin}</span>
        <img src="/Coin2.png" alt="Coin" className="w-[50px] h-[50px]" />
      </div>
      <motion.div className="absolute w-[250px] h-[90px]" initial={{ y: "100px", opacity: 0 }} animate={{ y: "0px", opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ backgroundImage: "url('/playerGreen.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", bottom: "20px", right: "30px" }}>
        <motion.span className="absolute text-2xl font-bold text-black" initial={{ y: "20px", opacity: 0 }} animate={{ y: "0px", opacity: 1 }} transition={{ duration: 1, ease: "easeOut" }} style={{ top: "25px", left: "60px" }}>Player 1</motion.span>
      </motion.div>
      <button className="absolute bottom-4 left-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-md text-lg font-bold hover:bg-red-700 transition" onClick={() => window.location.href = "/pageMenu"}>Back to Menu</button>
    </div>
  );
};

export default Page;
