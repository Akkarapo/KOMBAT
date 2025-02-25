"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MinionsCardProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (card: string) => void;
  minionCount: number;
  minionNames: string[];
}

const MinionsCard: React.FC<MinionsCardProps> = ({ isOpen, onClose, onSelect, minionCount, minionNames }) => {
  if (!isOpen) return null;

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
          onClick={onClose} // ✅ ปิด Popup เมื่อกดพื้นที่ด้านนอก
        >
          <div 
            className="flex flex-col items-center" 
            onClick={(e) => e.stopPropagation()} // ✅ ป้องกันการปิด Popup เมื่อกดที่การ์ด
          >
            {/* ✅ ใช้ flex และ gap-6 ให้การ์ดอยู่ตรงกลางแนวนอน */}
            <div className="flex flex-wrap justify-center gap-6">
              {Array.from({ length: minionCount }, (_, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* ✅ ชื่อมินเนี่ยนเป็นสีดำ */}
                  <span className="text-black font-bold text-lg mt-[-20px] mb-2">
                    {minionNames[index]}
                  </span>
                  <button
                    className="w-[180px] h-[240px] bg-transparent rounded-lg hover:scale-105 transition transform"
                    onClick={() => onSelect(minionNames[index])}
                  >
                    <img
                      src={minionImages[index + 1] || "/defaultCard.png"}
                      alt={minionNames[index]}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MinionsCard;
