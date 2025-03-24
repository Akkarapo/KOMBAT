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
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/**
 * parseStrategyAndCode
 * ถ้า strat เป็น "Strategy 3||encodedCode" -> return ["Strategy 3", decodeURIComponent(encodedCode)]
 * ถ้าเป็น "Strategy 1" หรือ "Strategy 2" -> return [strat, strategyData[strat] || ""]
 */
function parseStrategyAndCode(strat: string): [string, string] {
  if (strat.startsWith("Strategy 3||")) {
    const encoded = strat.replace("Strategy 3||", "");
    return ["Strategy 3", decodeURIComponent(encoded)];
  }
  // ถ้าไม่ใช่ Strategy 3|| => น่าจะเป็น Strategy 1 หรือ 2
  return [strat, strategyData[strat] || ""];
}

export default function ChooseStrategy() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ดึงค่า count และ minionId จาก URL
  const count = searchParams.get("count") || "1";
  const minionId = searchParams.get("minionId") || "1";

  // ใช้ context เพื่อเก็บค่า strategy
  const { setStrategy } = useUserStrategy();

  // ⭐ เก็บ code ของ Strategy 1, 2, 3 แยกกัน เพื่อไม่ให้หายเมื่อสลับคลิก
  const [codeS1, setCodeS1] = useState(strategyData["Strategy 1"]);
  const [codeS2, setCodeS2] = useState(strategyData["Strategy 2"]);
  const [codeS3, setCodeS3] = useState(strategyData["Strategy 3"]);

  // อันนี้คือ strategy ที่เลือกปัจจุบัน
  const [selectedStrategy, setSelectedStrategy] = useState<string>("Strategy 1");

  // โหลด strategy ปัจจุบันของ minionId จาก defenseData
  useEffect(() => {
    const defenseDataStr = searchParams.get("defenseData") || "";
    const mId = parseInt(minionId, 10);

    const parts = defenseDataStr.split(",");
    for (const entry of parts) {
      const [id, name, defense, strat] = entry.split(":");
      if (parseInt(id, 10) === mId) {
        // แยกได้เป็น [strategyName, code]
        const [sName, sCode] = parseStrategyAndCode(strat);

        // ถ้า sName === "Strategy 1" => set codeS1 เป็น sCode
        // ถ้า sName === "Strategy 2" => set codeS2 เป็น sCode
        // ถ้า sName === "Strategy 3" => set codeS3 เป็น sCode
        if (sName === "Strategy 1") {
          setSelectedStrategy("Strategy 1");
          setCodeS1(sCode);
        } else if (sName === "Strategy 2") {
          setSelectedStrategy("Strategy 2");
          setCodeS2(sCode);
        } else {
          // Strategy 3
          setSelectedStrategy("Strategy 3");
          setCodeS3(sCode);
        }
        break;
      }
    }
  }, [searchParams, minionId]);

  // ฟังก์ชัน getCurrentCode: คืน code ของ strategy ที่เลือก
  const getCurrentCode = (): string => {
    if (selectedStrategy === "Strategy 1") return codeS1;
    if (selectedStrategy === "Strategy 2") return codeS2;
    return codeS3; // Strategy 3
  };

  // ฟังก์ชัน setCurrentCode: เขียน code กลับไปยัง state ของ strategy ที่เลือก
  const setCurrentCode = (value: string) => {
    if (selectedStrategy === "Strategy 1") {
      setCodeS1(value);
    } else if (selectedStrategy === "Strategy 2") {
      setCodeS2(value);
    } else {
      setCodeS3(value);
    }
  };

  // เมื่อกด Confirm => เขียนกลับไปยัง defenseData
  const handleConfirm = () => {
    console.log("Selected strategy:", selectedStrategy);
    const mId = parseInt(minionId, 10);

    // setStrategy context
    setStrategy(mId, selectedStrategy);

    // ดึง defenseData
    const defenseDataStr = searchParams.get("defenseData") || "";

    // แก้เฉพาะมินเนี่ยนที่ตรงกับ mId
    const updatedDefenseData = defenseDataStr
      .split(",")
      .map((entry) => {
        const [id, name, defense, oldStrat] = entry.split(":");
        if (parseInt(id, 10) === mId) {
          if (selectedStrategy === "Strategy 3") {
            // encode codeS3
            const encoded = encodeURIComponent(codeS3);
            return `${id}:${name}:${defense}:Strategy 3||${encoded}`;
          } else if (selectedStrategy === "Strategy 2") {
            return `${id}:${name}:${defense}:${selectedStrategy}||${encodeURIComponent(codeS2)}`;
          } else if (selectedStrategy === "Strategy 1") {
            return `${id}:${name}:${defense}:${selectedStrategy}||${encodeURIComponent(codeS1)}`;
          }
        }
        return entry;
      })
      .join(",");

    router.push(
      `/choose-a-minion-type?count=${count}&minionId=${minionId}&defenseData=${updatedDefenseData}`
    );
  };

  // ปุ่ม Back
  const handleBack = () => {
    router.push(`/choose-a-minion-type?count=${count}`);
  };

  return (
    <div
      className="flex flex-row min-h-screen w-full bg-cover bg-center p-6"
      style={{ backgroundImage: `url('/backgroundHowTo.png')` }}
    >
      {/* 🔹 Strategy Text Editor (Left Panel) */}
      <motion.div
        className="w-1/2"
        initial="hidden"
        animate="visible"
        variants={panelVariants}
      >
        <div className="w-full h-[75vh] p-6 bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg ml-[45px] mt-[45px]">
          <Textarea
            className={`w-full h-full text-2xl leading-relaxed whitespace-pre-wrap border-none outline-none resize-none bg-transparent shadow-none overflow-y-auto 
              ${
                selectedStrategy === "Strategy 3" && getCurrentCode().trim() === ""
                  ? "text-gray-400"
                  : "text-black"
              }`}
            // อ่าน/เขียนจาก state ตาม strategy ที่เลือก
            value={getCurrentCode()}
            onChange={(e) => setCurrentCode(e.target.value)}
            // ถ้าต้องการ lock readOnly เฉพาะ strategy 1,2 => สามารถใส่
            // readOnly={selectedStrategy !== "Strategy 3"}
          />
        </div>
      </motion.div>

      {/* 🔹 Strategy Selection (Right Panel) */}
      <div className="w-1/2 flex flex-col items-center justify-center mt-[-40px]">
        <h1 className="text-3xl text-white font-bold mb-8">
          Choose a strategy to equip your minions.
        </h1>

        <div className="space-y-6 w-[80%]">
          {Object.keys(strategyIcons).map((strategy, index) => (
            <motion.div
              key={strategy}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card
                onClick={() => {
                  // เปลี่ยน selectedStrategy
                  setSelectedStrategy(strategy);
                }}
                className={`cursor-pointer p-6 h-[150px] bg-white bg-opacity-30 ${
                  selectedStrategy === strategy ? "border-[4px] border-black" : "border-[2px] border-gray-300"
                }`}
              >
                <CardContent className="flex items-start space-x-6">
                  <Image
                    src={strategyIcons[strategy]}
                    alt={strategy}
                    width={60}
                    height={60}
                    style={{ marginTop: "-10px" }}
                  />
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
            style={{
              position: "fixed",
              bottom: "30px",
              left: "65px",
              right: "95px",
              display: "flex",
              justifyContent: "space-between",
            }}
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
