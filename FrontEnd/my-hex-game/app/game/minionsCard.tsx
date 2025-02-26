"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={onClose}
        >
          <div className="flex flex-wrap justify-center gap-6" onClick={(e) => e.stopPropagation()}>
            {Array.from({ length: minionCount }).map((_, index) => {
              const minion = defenseDataArray.find((m) => m.id === index + 1);
              return (
                <div key={index} className="relative flex flex-col items-center">
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
                  </button>
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
