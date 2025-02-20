"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";

// ไอคอน Strategy
const strategyIcons: Record<string, string> = {
  "Strategy 1": "/Strategy1Icon.png",
  "Strategy 2": "/Strategy2Icon.png",
  "Strategy 3": "/Strategy3Icon.png",
};

// ข้อมูล Strategy
const strategyData: Record<string, string> = {
  "Strategy 1": `t = t + 1  # keeping track of the turn number
m = 0  # number of random moves this turn
while (3 - m) {  # made less than 3 random moves
  if (budget - 100) then {} else done  # too poor to do anything else
  opponentLoc = opponent
  if (opponentLoc / 10 - 1)
  then  # opponent afar
    if (opponentLoc % 10 - 5) then move downleft
    else if (opponentLoc % 10 - 4) then move down
    else if (opponentLoc % 10 - 3) then move downright
    else if (opponentLoc % 10 - 2) then move right
    else if (opponentLoc % 10 - 1) then move upright
    else move up
}`,
  "Strategy 2": `t = t + 5  # keeping track of the turn number
m = 0  # number of random moves this turn
while (3 - m) {  # made less than 3 random moves
  if (budget - 100) then {} else done  # too poor to do anything else
  opponentLoc = opponent
  if (opponentLoc / 10 - 1)
  then  # opponent afar
    if (opponentLoc % 10 - 5) then move downleft
    else if (opponentLoc % 10 - 4) then move down
    else if (opponentLoc % 10 - 3) then move downright
    else if (opponentLoc % 10 - 2) then move right
    else if (opponentLoc % 10 - 1) then move upright
    else move up
}`,
};

export default function ChooseStrategy() {
  const router = useRouter();
  const [selectedStrategy, setSelectedStrategy] = useState<keyof typeof strategyData>("Strategy 1");
  const [customStrategy, setCustomStrategy] = useState<string>(strategyData["Strategy 1"]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleConfirm = () => {
    console.log("Selected strategy:", selectedStrategy);
    router.push("/next-page");
  };

  return (
    <div
      className="flex flex-row min-h-screen w-full bg-cover bg-center p-6"
      style={{ backgroundImage: `url('/backgroundHowTo.png')` }}
    >
      {/* 🔹 Strategy Text Editor (Left Panel) */}
      <div className="w-1/2">
        <div className="w-full h-[85vh] p-6 bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg">
          <Textarea
            className={`w-full h-full text-2xl leading-relaxed whitespace-pre-wrap border-none outline-none resize-none bg-transparent shadow-none overflow-y-auto 
              ${selectedStrategy === "Strategy 3" && !isEditing ? "text-gray-400" : "text-black"}`}
            value={selectedStrategy === "Strategy 3" ? customStrategy : strategyData[selectedStrategy]}
            onChange={(e) => {
              if (selectedStrategy === "Strategy 3") {
                setCustomStrategy(e.target.value);
                setIsEditing(true);
              }
            }}
            readOnly={selectedStrategy !== "Strategy 3"}
          />
        </div>
      </div>

      {/* 🔹 Strategy Selection (Right Panel) */}
      <div className="w-1/2 flex flex-col items-center justify-center mt-[-150px]">
        <h1 className="text-3xl text-white font-bold mb-8">Choose a strategy to equip your minions.</h1>

        <div className="space-y-6 w-[80%]">
          {Object.keys(strategyIcons).map((strategy) => (
            <Card
              key={strategy}
              onClick={() => {
                setSelectedStrategy(strategy as keyof typeof strategyData);
                setIsEditing(false);
                if (strategy === "Strategy 3") setCustomStrategy(strategyData["Strategy 1"]); // ใช้ Strategy 1 เป็นค่าตั้งต้น
              }}
              className={`cursor-pointer p-6 bg-opacity-0 ${
                selectedStrategy === strategy ? "border-2 border-white" : ""
              }`}
            >
              <CardContent className="flex items-center space-x-6">
                <Image src={strategyIcons[strategy]} alt={strategy} width={60} height={60} />
                <div>
                  <h2 className="text-2xl font-bold text-white">{strategy}</h2>
                  <p className="text-gray-300">{strategy === "Strategy 3" ? "Customizable strategy" : `${strategy} ability`}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Confirm Button */}
          <button onClick={handleConfirm} className="w-48 h-20 mt-6">
            <Image src="/ConfirmButton.png" alt="Confirm" width={192} height={80} />
          </button>
        </div>
      </div>
    </div>
  );
}
