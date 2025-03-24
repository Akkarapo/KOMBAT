"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { strategyData } from "./strategyData";
import { motion } from "framer-motion";
import { useUserStrategy } from "./userStrategyData";

// ไอคอน Strategy
const strategyIcons: Record<string, string> = {
  "Strategy 1": "/Strategy1Icon.png",
  "Strategy 2": "/Strategy2Icon.png",
  "Strategy 3": "/Strategy3Icon.png",
};

// Animation สำหรับปุ่ม Strategy
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
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/**
 * parseStrategyAndCode
 * ถ้า strat เป็น "Strategy X||encodedCode" -> return [ "Strategy X", decodeURIComponent(encodedCode) ]
 * ถ้าเป็น "Strategy X" อย่างเดียว -> return [ "Strategy X", default code จาก strategyData ]
 */
function parseStrategyAndCode(strat: string): [string, string] {
  if (strat.includes("||")) {
    const [name, encoded] = strat.split("||");
    return [name.trim(), decodeURIComponent(encoded)];
  }
  return [strat, strategyData[strat] || ""];
}

export default function ChooseStrategy() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const count = searchParams.get("count") || "1";
  const minionId = searchParams.get("minionId") || "1";
  const { setStrategy } = useUserStrategy();

  // เก็บ state สำหรับโค้ดของแต่ละ Strategy สำหรับมินเนี่ยนนี้
  const [codeS1, setCodeS1] = useState(strategyData["Strategy 1"]);
  const [codeS2, setCodeS2] = useState(strategyData["Strategy 2"]);
  const [codeS3, setCodeS3] = useState(strategyData["Strategy 3"]); // สำหรับ Strategy 3 custom

  const [selectedStrategy, setSelectedStrategy] = useState<string>("Strategy 1");

  // เมื่อเปิดหน้า choose-strategy ให้ดูค่า defenseData ของมินเนี่ยนนี้
  useEffect(() => {
    const defenseDataStr = searchParams.get("defenseData") || "";
    const mId = parseInt(minionId, 10);
    const entries = defenseDataStr.split(",");
    for (const entry of entries) {
      const [id, name, defense, strat] = entry.split(":");
      if (parseInt(id, 10) === mId) {
        const [sName, sCode] = parseStrategyAndCode(strat);
        setSelectedStrategy(sName);
        if (sName === "Strategy 1") {
          setCodeS1(sCode);
        } else if (sName === "Strategy 2") {
          setCodeS2(sCode);
        } else if (sName === "Strategy 3") {
          setCodeS3(sCode);
        }
        break;
      }
    }
  }, [searchParams, minionId]);

  const getCurrentCode = (): string => {
    if (selectedStrategy === "Strategy 1") return codeS1;
    if (selectedStrategy === "Strategy 2") return codeS2;
    return codeS3;
  };

  const setCurrentCode = (value: string) => {
    if (selectedStrategy === "Strategy 1") {
      setCodeS1(value);
    } else if (selectedStrategy === "Strategy 2") {
      setCodeS2(value);
    } else {
      setCodeS3(value);
    }
  };

  const handleConfirm = () => {
    const mId = parseInt(minionId, 10);
    setStrategy(mId, selectedStrategy);

    const defenseDataStr = searchParams.get("defenseData") || "";
    const updatedDefenseData = defenseDataStr
      .split(",")
      .map((entry) => {
        const [id, name, defense, oldStrat] = entry.split(":");
        if (parseInt(id, 10) === mId) {
          if (selectedStrategy === "Strategy 3") {
            const encoded = encodeURIComponent(getCurrentCode());
            return `${id}:${name}:${defense}:${selectedStrategy}||${encoded}`;
          } else if (selectedStrategy === "Strategy 2") {
            const encoded = encodeURIComponent(codeS2);
            return `${id}:${name}:${defense}:${selectedStrategy}||${encoded}`;
          } else {
            const encoded = encodeURIComponent(codeS1);
            return `${id}:${name}:${defense}:${selectedStrategy}||${encoded}`;
          }
        }
        return entry;
      })
      .join(",");
    router.push(`/choose-a-minion-type?count=${count}&minionId=${minionId}&defenseData=${updatedDefenseData}`);
  };

  const handleBack = () => {
    const defenseDataStr = searchParams.get("defenseData") || "";
    router.push(`/choose-a-minion-type?count=${count}&defenseData=${defenseDataStr}`);
  };

  return (
    <div
      className="flex flex-row min-h-screen w-full bg-cover bg-center p-6"
      style={{ backgroundImage: `url('/backgroundHowTo.png')` }}
    >
      {/* Left Panel: Strategy Editor */}
      <motion.div className="w-1/2" initial="hidden" animate="visible" variants={panelVariants}>
        <div className="w-full h-[75vh] p-6 bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg ml-[45px] mt-[45px]">
          <Textarea
            className="w-full h-full text-2xl leading-relaxed whitespace-pre-wrap border-none outline-none resize-none bg-transparent shadow-none overflow-y-auto text-black"
            value={getCurrentCode()}
            onChange={(e) => setCurrentCode(e.target.value)}
          />
        </div>
      </motion.div>
      
      {/* Right Panel: Strategy Selection */}
      <div className="w-1/2 flex flex-col items-center justify-center mt-[-40px]">
        <h1 className="text-3xl text-white font-bold mb-8">Choose a strategy to equip your minions.</h1>
        <div className="space-y-6 w-[80%]">
          {Object.keys(strategyIcons).map((strategy, index) => (
            <motion.div key={strategy} custom={index} initial="hidden" animate="visible" variants={cardVariants}>
              <Card
                onClick={() => {
                  setSelectedStrategy(strategy);
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
                        ? "Move towards the enemy if they are far away..."
                        : strategy === "Strategy 2"
                        ? "Protect and avoid enemies..."
                        : "Customizable strategy (edited individually)"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8 } }}
            style={{ position: "fixed", bottom: "30px", left: "65px", right: "95px", display: "flex", justifyContent: "space-between" }}>
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
