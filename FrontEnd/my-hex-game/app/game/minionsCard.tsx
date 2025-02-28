"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import MinionStrategyInformation from "./minionStrategyInformation"; // ✅ Import ป๊อปอัพข้อมูลกลยุทธ์

interface MinionsCardProps {
  isOpen: boolean;
  onClose: () => void;
  minionCount: number;
  minionNames: string[];
  onSelect?: (card: string) => void; // ✅ เพิ่ม onSelect (ไม่บังคับ)
}

const MinionsCard: React.FC<MinionsCardProps> = ({ isOpen, onClose, minionCount, minionNames, onSelect }) => {
  const searchParams = useSearchParams();
  const [isMinionCardOpen, setIsMinionCardOpen] = useState(isOpen);
  const [wasMinionCardOpen, setWasMinionCardOpen] = useState(false);
  const [selectedMinion, setSelectedMinion] = useState<{ id: number; name: string; defense: number; strategy: string } | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedMinion) {
      setWasMinionCardOpen(true);
      setIsMinionCardOpen(false);
    }
  }, [selectedMinion]);

  useEffect(() => {
    if (!selectedMinion && wasMinionCardOpen) {
      setIsMinionCardOpen(true);
      setWasMinionCardOpen(false);
    }
  }, [selectedMinion]);

  useEffect(() => {
    setIsMinionCardOpen(isOpen);
  }, [isOpen]);

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

  const strategyIcons: Record<string, string> = {
    "Strategy 1": "/Strategy1Icon.png",
    "Strategy 2": "/Strategy2Icon.png",
    "Strategy 3": "/Strategy3Icon.png",
  };

  return (
    <>
      <AnimatePresence>
        {isMinionCardOpen && (
          <motion.div
            className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center"
            onClick={() => {
              setActiveIndex(null);
              setIsMinionCardOpen(false);
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
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <span className="text-black font-bold text-lg mt-[-20px] mb-2">
                      {minion?.name || `Minion ${index + 1}`}
                    </span>
                    <button
                      className="w-[180px] h-[240px] bg-transparent rounded-lg hover:scale-105 transition transform relative"
                      onClick={() => {
                        if (minion) {
                          setSelectedMinion(minion);
                          onSelect?.(minion.name);
                        }
                      }}
                    >
                      <img
                        src={minionImages[index + 1] || "/defaultCard.png"}
                        alt={minion?.name || `Minion ${index + 1}`}
                        className="w-full h-full object-contain rounded-lg"
                      />

                      <div className="absolute" style={{ top: "5px", left: "55px", color: "#D3FFDC", fontSize: "18px", fontWeight: "bold" }}>
                        {searchParams.get("spawn_cost") || "0"}
                      </div>
                      <div className="absolute" style={{ top: "30px", left: "55px", color: "#D3FFDC", fontSize: "18px", fontWeight: "bold" }}>
                        {minion?.defense ?? "0"}
                      </div>
                      <div className="absolute" style={{ top: "55px", left: "55px", color: "#D3FFDC", fontSize: "18px", fontWeight: "bold" }}>
                        {searchParams.get("init_hp") || "0"}
                      </div>

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

                    {/* ✅ ปุ่ม BUY สีดำแสดงเมื่อ hover */}
                    {activeIndex === index && isMinionCardOpen && (
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

      {selectedMinion && (
        <MinionStrategyInformation
          minionId={selectedMinion.id}
          onClose={() => setSelectedMinion(null)}
        />
      )}
    </>
  );
};

export default MinionsCard;
