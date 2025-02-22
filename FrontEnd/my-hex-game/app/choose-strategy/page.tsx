"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { strategyData } from "./strategyData";
import { motion } from "framer-motion"; // ✅ ใช้ Framer Motion

// ไอคอน Strategy
const strategyIcons: Record<string, string> = {
  "Strategy 1": "/Strategy1Icon.png",
  "Strategy 2": "/Strategy2Icon.png",
  "Strategy 3": "/Strategy3Icon.png",
};

// Animation Variants สำหรับปุ่ม Strategy
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.2, duration: 0.5, ease: "easeOut" },
  }),
};

// Animation สำหรับกล่อง Strategy
const panelVariants = {
  hidden: { opacity: 0, x: -50 }, // กล่องจะเลื่อนมาจากซ้าย
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
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
      {/* 🔹 Strategy Text Editor (Left Panel) - มีอนิเมชันแล้ว ✅ */}
      <motion.div
        className="w-1/2"
        initial="hidden"
        animate="visible"
        variants={panelVariants}
      >
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
      </motion.div>

      {/* 🔹 Strategy Selection (Right Panel) */}
      <div className="w-1/2 flex flex-col items-center justify-center mt-[-40px]">
        <h1 className="text-3xl text-white font-bold mb-8">Choose a strategy to equip your minions.</h1>

        <div className="space-y-6 w-[80%]">
          {Object.keys(strategyIcons).map((strategy, index) => (
            <motion.div
              key={strategy}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants} // ✅ ใช้ Framer Motion Animation
            >
              <Card
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
            </motion.div>
          ))}

          {/* Back & Confirm Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8 } }}
            style={{ position: "fixed", bottom: "30px", left: "65px", right: "95px", display: "flex", justifyContent: "space-between" }}
          >
            <button onClick={handleBack} style={{ width: "192px", height: "80px" }}>
              <Image src="/BackButton.png" alt="Back" width={192} height={80} />
            </button>
            <button onClick={handleConfirm} style={{ width: "192px", height: "80px" }}>
              <Image src="/ConfirmButton.png" alt="Confirm" width={192} height={80} />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
