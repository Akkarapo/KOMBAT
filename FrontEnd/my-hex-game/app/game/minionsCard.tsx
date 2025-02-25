"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MinionsCardProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (card: string) => void;
  minionCount: number;
  minionNames: string[]; // ✅ เพิ่ม prop นี้ให้รองรับ
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
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Select a Minion Card</h2>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: minionCount }, (_, index) => (
                <button
                  key={index}
                  className="relative w-[150px] h-[200px] bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  onClick={() => onSelect(minionNames[index])} // ✅ ใช้ชื่อมินเนี่ยนที่ได้จาก props
                >
                  <img
                    src={minionImages[index + 1] || "/defaultCard.png"}
                    alt={minionNames[index]} // ✅ แสดงชื่อที่ตั้งไว้จริง ๆ
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <span className="absolute top-2 left-2 text-black font-bold bg-white px-2 py-1 rounded">
                    {minionNames[index]} {/* ✅ แสดงชื่อบนการ์ด */}
                  </span>
                </button>
              ))}
            </div>
            <button className="mt-4 text-red-500 font-bold" onClick={onClose}>
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MinionsCard;
