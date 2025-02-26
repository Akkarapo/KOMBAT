"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface MinionsCardProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (card: string) => void;
  minionCount: number;
  minionNames: string[];
}

const MinionsCard: React.FC<MinionsCardProps> = ({ isOpen, onClose, onSelect, minionCount, minionNames }) => {
  if (!isOpen) return null;

  const searchParams = useSearchParams();
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // ✅ เก็บสถานะปุ่ม Buy

  // ✅ ดึง `defenseData` จาก URL และแปลงเป็น JSON
  const defenseDataString = searchParams.get("defenseData") || "";
  const defenseDataArray = defenseDataString
    ? defenseDataString.split(",").map((entry) => {
        const [id, name, defense, strategy] = entry.split(":");
        return { id: Number(id), name: decodeURIComponent(name), defense: Number(defense), strategy };
      })
    : [];

  console.log("Parsed defenseData:", defenseDataArray);

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center"
          onClick={() => {
            setActiveIndex(null); // ✅ ซ่อนปุ่ม Buy
            onClose(); // ✅ ปิด Popup MinionsCard
          }}
        >
          <div className="flex flex-wrap justify-center gap-6" onClick={(e) => e.stopPropagation()}>
            {Array.from({ length: minionCount }).map((_, index) => {
              const minion = defenseDataArray.find((m) => m.id === index + 1);
              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => setActiveIndex(index)} // ✅ เมื่อชี้ที่การ์ด ให้แสดงปุ่ม Buy
                >
                  {/* ✅ แสดงชื่อ Minion ที่ดึงจาก URL */}
                  <span className="text-black font-bold text-lg mt-[-20px] mb-2">
                    {minion?.name || `Minion ${index + 1}`}
                  </span>
                  <button
                    className="w-[180px] h-[240px] bg-transparent rounded-lg hover:scale-105 transition transform relative"
                    onClick={() => onSelect(minion?.name || `Minion ${index + 1}`)}
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

                    {/* ✅ แสดงไอคอนของกลยุทธ์ที่เลือก (ปรับตำแหน่งและ opacity) */}
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

                  {/* ✅ แสดงปุ่ม "BlackBuy.png" เมื่อมีการเลือกการ์ด */}
                  {activeIndex === index && (
                    <div className="absolute bottom-[-50px] flex justify-center w-full">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation(); // ✅ ป้องกัน event click ซ้อนกัน
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
  );
};

export default MinionsCard;
