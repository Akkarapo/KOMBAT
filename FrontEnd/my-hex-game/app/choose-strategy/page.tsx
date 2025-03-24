"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { strategyData } from "./strategyData";
import { motion } from "framer-motion";
import { useUserStrategy } from "./userStrategyData";

// ---------- ไอคอน Strategy ----------
const strategyIcons: Record<string, string> = {
  "Strategy 1": "/Strategy1Icon.png",
  "Strategy 2": "/Strategy2Icon.png",
  "Strategy 3": "/Strategy3Icon.png",
};

// ---------- Animation ----------
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.2, duration: 0.5, ease: "easeOut" },
  }),
};

const panelVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ---------- ฟังก์ชัน decode แบบปลอดภัย ----------
function safeDecode(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    // ถ้า decode ไม่ได้ => return str เดิม (ป้องกัน URIError)
    return str;
  }
}

/**
 * parseStrategyAndCode(strat):
 * - ถ้า strat มี "||" => เช่น "Strategy 3||encoded" => แยกแล้ว decode
 * - ถ้าเป็น "Strategy 1" / "Strategy 2" / "Strategy 3" -> คืน default code จาก strategyData
 */
function parseStrategyAndCode(strat: string): [string, string] {
  if (strat.includes("||")) {
    const [name, encoded] = strat.split("||");
    return [name.trim(), safeDecode(encoded)];
  }
  return [strat, strategyData[strat] || ""];
}

/**
 * initStrategyStates(defenseDataStr, mId):
 * - อ่านค่า strategy ของมินเนี่ยน mId จาก defenseDataStr
 * - ถ้าไม่พบ => ใช้ค่าเริ่มต้น "Strategy 1"
 */
function initStrategyStates(defenseDataStr: string, mId: number) {
  let selectedStrategy = "Strategy 1"; // default
  let codeS1 = strategyData["Strategy 1"];
  let codeS2 = strategyData["Strategy 2"];
  let codeS3 = strategyData["Strategy 3"];

  if (defenseDataStr) {
    const entries = defenseDataStr.split(",");
    for (const entry of entries) {
      const [id, name, defense, strat] = entry.split(":");
      if (parseInt(id, 10) === mId) {
        const [sName, sCode] = parseStrategyAndCode(strat);
        selectedStrategy = sName;
        if (sName === "Strategy 1") codeS1 = sCode;
        else if (sName === "Strategy 2") codeS2 = sCode;
        else codeS3 = sCode;
        break;
      }
    }
  }
  return { selectedStrategy, codeS1, codeS2, codeS3 };
}

export default function ChooseStrategy() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ดึงค่า count / minionId จาก URL
  const count = searchParams.get("count") || "1";
  const mId = parseInt(searchParams.get("minionId") || "1", 10);

  const { setStrategy } = useUserStrategy();

  // -- parse defenseData ก่อนสร้าง state --
  const defenseDataStr = searchParams.get("defenseData") || "";
  const initStates = initStrategyStates(defenseDataStr, mId);

  // สร้าง state ด้วยค่าที่ parse ได้ => render ครั้งแรกก็จะเห็น strategy ที่เคยตั้ง หรือ "Strategy 1" ถ้าไม่มี
  const [selectedStrategy, setSelectedStrategy] = useState(initStates.selectedStrategy);
  const [codeS1, setCodeS1] = useState(initStates.codeS1);
  const [codeS2, setCodeS2] = useState(initStates.codeS2);
  const [codeS3, setCodeS3] = useState(initStates.codeS3);

  // ฟังก์ชันอ่านโค้ดปัจจุบัน
  const getCurrentCode = (): string => {
    if (selectedStrategy === "Strategy 1") return codeS1;
    if (selectedStrategy === "Strategy 2") return codeS2;
    return codeS3;
  };

  // ฟังก์ชันเขียนโค้ด
  const setCurrentCode = (value: string) => {
    if (selectedStrategy === "Strategy 1") setCodeS1(value);
    else if (selectedStrategy === "Strategy 2") setCodeS2(value);
    else setCodeS3(value);
  };

  // -- Confirm --
  const handleConfirm = () => {
    setStrategy(mId, selectedStrategy);

    // สร้าง defenseData ใหม่
    const updated = defenseDataStr
      .split(",")
      .map((entry) => {
        const [id, name, defense, oldStrat] = entry.split(":");
        if (parseInt(id, 10) === mId) {
          // เขียน "Strategy X||encode"
          if (selectedStrategy === "Strategy 3") {
            return `${id}:${name}:${defense}:Strategy 3||${encodeURIComponent(codeS3)}`;
          } else if (selectedStrategy === "Strategy 2") {
            return `${id}:${name}:${defense}:Strategy 2||${encodeURIComponent(codeS2)}`;
          } else {
            return `${id}:${name}:${defense}:Strategy 1||${encodeURIComponent(codeS1)}`;
          }
        }
        return entry;
      })
      .join(",");

    // กลับไปหน้า choose-a-minion-type
    router.push(`/choose-a-minion-type?count=${count}&minionId=${mId}&defenseData=${updated}`);
  };

  // -- Back => ไม่แก้ไข defenseData --
  const handleBack = () => {
    router.push(`/choose-a-minion-type?count=${count}&defenseData=${defenseDataStr}`);
  };

  return (
    <div
      className="flex flex-row min-h-screen w-full bg-cover bg-center p-6"
      style={{ backgroundImage: `url('/backgroundHowTo.png')` }}
    >
      {/* Left Panel */}
      <motion.div className="w-1/2" initial="hidden" animate="visible" variants={panelVariants}>
        <div className="w-full h-[75vh] p-6 bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg ml-[45px] mt-[45px]">
          <Textarea
            className="w-full h-full text-2xl leading-relaxed whitespace-pre-wrap border-none outline-none resize-none bg-transparent shadow-none overflow-y-auto text-black"
            value={getCurrentCode()}
            onChange={(e) => setCurrentCode(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Right Panel */}
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
                onClick={() => setSelectedStrategy(strategy)}
                className={`cursor-pointer p-6 h-[150px] bg-white bg-opacity-30 ${
                  selectedStrategy === strategy
                    ? "border-[4px] border-black"
                    : "border-[2px] border-gray-300"
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
