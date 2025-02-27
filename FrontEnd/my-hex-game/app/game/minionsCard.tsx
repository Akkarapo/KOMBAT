"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import MinionStrategyInformation from "./minionStrategyInformation"; // ✅ Import ป๊อปอัพข้อมูลกลยุทธ์

interface MinionsCardProps {
  isOpen: boolean;
  onClose: () => void;
  minionCount: number;
  minionNames: string[];
}

const MinionsCard: React.FC<MinionsCardProps> = ({ isOpen, onClose, minionCount, minionNames }) => {
  if (!isOpen) return null;

  const searchParams = useSearchParams();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedMinion, setSelectedMinion] = useState<{ id: number; name: string; defense: number; strategy: string } | null>(null);

  // ✅ ดึง `defenseData` จาก URL และแปลงเป็น JSON
  const defenseDataString = searchParams.get("defenseData") || "";
  const defenseDataArray = defenseDataString
    ? defenseDataString.split(",").map((entry) => {
        const [id, name, defense, strategy] = entry.split(":");
        return { id: Number(id), name: decodeURIComponent(name), defense: Number(defense), strategy };
      })
    : [];

  const minionImages: Record<number, string> = {
    1: "/CardMinion1.png",
    2: "/CardMinion2.png",
    3: "/CardMinion3.png",
    4: "/CardMinion4.png",
    5: "/CardMinion5.png",
  };

  // ✅ ไอคอนของแต่ละกลยุทธ์
  const strategyIcons: Record<string, string> = {
    "Strategy 1": "/Strategy1Icon.png",
    "Strategy 2": "/Strategy2Icon.png",
    "Strategy 3": "/Strategy3Icon.png",
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center"
            onClick={() => {
              setActiveIndex(null);
              onClose();
            }}
          >
            <div className="flex flex-wrap justify-center gap-6" onClick={(e) => e.stopPropagation()}>
              {Array.from({ length: minionCount }).map((_, index) => {
                const minion = defenseDataArray.find((m) => m.id === index + 1);
                return (
                  <div
                    key={index}
                    className="relative flex flex-col items-center"
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {/* ✅ แสดงชื่อ Minion */}
                    <span className="text-black font-bold text-lg mt-[-20px] mb-2">
                      {minion?.name || `Minion ${index + 1}`}
                    </span>
                    <button
                      className="w-[180px] h-[240px] bg-transparent rounded-lg hover:scale-105 transition transform relative"
                      onClick={() => {
                        if (minion) {
                          setSelectedMinion(minion);
                        }
                      }}
                    >
                      <img
                        src={minionImages[index + 1] || "/defaultCard.png"}
                        alt={minion?.name || `Minion ${index + 1}`}
                        className="w-full h-full object-contain rounded-lg"
                      />

                      {/* ✅ แสดงค่าป้องกัน (Defense) ที่ถูกต้อง */}
                      <div className="absolute" style={{ top: "5px", left: "55px", color: "#D3FFDC", fontSize: "18px", fontWeight: "bold" }}>
                        {searchParams.get("spawn_cost") || "0"} {/* ราคา */}
                      </div>
                      <div className="absolute" style={{ top: "30px", left: "55px", color: "#D3FFDC", fontSize: "18px", fontWeight: "bold" }}>
                        {minion?.defense ?? "0"} {/* ค่าป้องกัน */}
                      </div>
                      <div className="absolute" style={{ top: "55px", left: "55px", color: "#D3FFDC", fontSize: "18px", fontWeight: "bold" }}>
                        {searchParams.get("init_hp") || "0"} {/* ค่าเลือด */}
                      </div>

                      {/* ✅ แสดงไอคอนกลยุทธ์ */}
                      {minion?.strategy && strategyIcons[minion.strategy] && (
                        <img
                          src={strategyIcons[minion.strategy]}
                          alt={minion.strategy}
                          className="absolute"
                          style={{
                            top: "15px",
                            right: "30px",
                            width: "40px",
                            height: "40px",
                            opacity: 0.2,
                          }}
                        />
                      )}
                    </button>

                    {/* ✅ แสดงปุ่ม BUY สีดำ เมื่อ Hover */}
                    {activeIndex === index && (
                      <div className="absolute bottom-[-50px] flex justify-center w-full">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log(`Buying minion: ${minion?.name}`);
                          }}
                          className="block object-contain"
                          style={{
                            width: "120px",
                            height: "50px",
                            background: `url('/BlackBuy.png') no-repeat center/contain`,
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ ป๊อปอัพแสดงข้อมูลกลยุทธ์ */}
      {selectedMinion && (
        <MinionStrategyInformation
          minionId={selectedMinion.id} // ✅ ส่ง ID ของมินเนี่ยนไปยัง popup
          onClose={() => setSelectedMinion(null)}
        />
      )}
    </>
  );
};

export default MinionsCard;
