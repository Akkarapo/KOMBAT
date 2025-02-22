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
  "Strategy 2": `t = t + 1  # keeping track of the turn number
m = 0  # number of defensive moves this turn
while (3 - m) {  # made less than 3 defensive moves
  if (budget - 100) then {} else done  # too poor to do anything

  opponentLoc = opponent
  if (opponentLoc / 10 - 1)
  then  # opponent detected, decide whether to flee or block
    if (opponentLoc % 10 - 5) then move upleft
    else if (opponentLoc % 10 - 4) then move up
    else if (opponentLoc % 10 - 3) then move upright
    else if (opponentLoc % 10 - 2) then move right
    else if (opponentLoc % 10 - 1) then move downright
    else move down
  else if (opponentLoc)
  then  # opponent adjacent, prioritize defense
    shield = 5 * (nearby % 100)  # calculate shield cost based on nearby enemies
    if (budget - shield) then activate shield shield else {}

  else {  # no visible opponent; reposition strategically
    try = 0  # keep track of number of attempts
    while (3 - try) {  # no more than 3 attempts
      success = 1
      dir = random % 6
      # (nearby <dir> % 10 + 1) ^ 2 is positive if adjacent cell is safe
      if ((dir - 4) * (nearby upleft % 10 + 1) ^ 2) then move upleft
      else if ((dir - 3) * (nearby up % 10 + 1) ^ 2) then move up
      else if ((dir - 2) * (nearby upright % 10 + 1) ^ 2) then move upright
      else if ((dir - 1) * (nearby right % 10 + 1) ^ 2) then move right
      else if (dir * (nearby downright % 10 + 1) ^ 2) then move downright
      else if ((nearby down % 10 + 1) ^ 2) then move down
      else success = 0
      if (success) then try = 3 else try = try + 1
    }
    m = m + 1
  }
}  # end while`,
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

  const handleBack = () => {
    console.log("Back button clicked");
    router.push("/previous-page");
  };

  return (
    <div
      className="flex flex-row min-h-screen w-full bg-cover bg-center p-6"
      style={{ backgroundImage: `url('/backgroundHowTo.png')` }}
    >
      {/* 🔹 Strategy Text Editor (Left Panel) */}
      <div className="w-1/2">
        <div className="w-full h-[75vh] p-6 bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg ml-[45px] mt-[45px]">
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
      <div className="w-1/2 flex flex-col items-center justify-center mt-[-40px]">
        <h1 className="text-3xl text-white font-bold mb-8">Choose a strategy to equip your minions.</h1>

        <div className="space-y-6 w-[80%]">
          {Object.keys(strategyIcons).map((strategy) => (
            <Card
              key={strategy}
              onClick={() => {
                setSelectedStrategy(strategy as keyof typeof strategyData);
                setIsEditing(false);
                if (strategy === "Strategy 3") setCustomStrategy(strategyData["Strategy 1"]);
              }}
              className={`cursor-pointer p-6 h-[150px] bg-white bg-opacity-30 ${
                selectedStrategy === strategy ? "border-[4px] border-black" : "border-[2px] border-gray-300"
              }`}
            >                  
              <CardContent className="flex items-start space-x-6">
                <Image src={strategyIcons[strategy]} alt={strategy} width={60} height={60} style={{ marginTop: "-10px" }} />
                <div className="mt-[-15px]">
                    <h2 className="text-2xl font-bold text-black">{strategy}</h2>
                    <p className="text-black">
                    {strategy === "Strategy 1"
                      ? "Move towards the enemy if they are far away. Attack if nearby and have enough budget. Move if there are no enemies in range."
                      : strategy === "Strategy 2"
                      ? "Protect and avoid enemies. Activate your shield when near enemies. Flee when encountering enemies in the distance. Adjust your position to a safe spot if no enemies are nearby."
                      : "Customizable strategy"}
                  </p>
                </div>
              </CardContent>

            </Card>
          ))}

          {/* Back & Confirm Buttons */}
          <div style={{ position: "fixed", bottom: "30px", left: "65px", right: "95px", display: "flex", justifyContent: "space-between" }}>
            <button onClick={handleBack} style={{ width: "192px", height: "80px" }}>
              <Image src="/BackButton.png" alt="Back" width={192} height={80} />
            </button>
            <button onClick={handleConfirm} style={{ width: "192px", height: "80px" }}>
              <Image src="/ConfirmButton.png" alt="Confirm" width={192} height={80} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
