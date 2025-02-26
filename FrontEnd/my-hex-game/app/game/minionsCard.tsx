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

  const searchParams = useSearchParams(); // ✅ ใช้ดึงค่าจาก URL

  // ✅ ตรวจสอบค่าที่ดึงมา
  console.log("minionCount:", minionCount);
  console.log("minionNames:", minionNames);

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
            {Array.from({ length: minionCount }).map((_, index) => (
              <div key={index} className="relative flex flex-col items-center">
                {/* ✅ แสดงชื่อมินเนี่ยน */}
                <span className="text-black font-bold text-lg mt-[-20px] mb-2">
                  {minionNames[index] || `Minion ${index + 1}`}
                </span>
                <button
                  className="w-[180px] h-[240px] bg-transparent rounded-lg hover:scale-105 transition transform relative"
                  onClick={() => onSelect(minionNames[index])}
                >
                  <img
                    src={minionImages[index + 1] || "/defaultCard.png"}
                    alt={minionNames[index]}
                    className="w-full h-full object-contain rounded-lg"
                  />

                  {/* ✅ ดึงค่าตัวเลขจาก URL และกำหนดตำแหน่งแบบ `px` */}
                  <div className="absolute" style={{ top: "5px", left: "55px", color: "#D3FFDC", fontSize: "18px", fontWeight: "bold" }}>
                    {searchParams.get("spawn_cost") || "0"} {/* ค่าราคา */}
                  </div>
                  <div className="absolute" style={{ top: "30px", left: "55px", color: "#D3FFDC", fontSize: "18px", fontWeight: "bold" }}>
                    {searchParams.get("hex_purchase_cost") || "0"} {/* ค่าป้องกัน */}
                  </div>
                  <div className="absolute" style={{ top: "55px", left: "55px", color: "#D3FFDC", fontSize: "18px", fontWeight: "bold" }}>
                    {searchParams.get("init_hp") || "0"} {/* ค่าเลือด */}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MinionsCard;
