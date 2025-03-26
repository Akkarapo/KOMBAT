"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import MinionStrategyInformation from "./minionStrategyInformation";

interface MinionsCardProps {
  /**
   * ควบคุมการแสดงผล Popup
   */
  isOpen: boolean;

  /**
   * ฟังก์ชันปิด Popup
   */
  onClose: () => void;

  /**
   * จำนวนมินเนี่ยนทั้งหมดที่ต้องการแสดง
   */
  minionCount: number;

  /**
   * ชื่อมินเนี่ยนแต่ละตัว (ใช้ loop แสดงการ์ด)
   */
  minionNames: string[];

  /**
   * Callback เมื่อคลิกตัวการ์ด (ไม่ใช่ปุ่ม Buy สีดำ)
   * ตัวอย่างเช่นถ้าอยากให้เลือกการ์ดเฉย ๆ
   */
  onSelect?: (card: string) => void;

  /**
   * ✅ Callback เมื่อกดปุ่ม Buy สีดำบนการ์ด
   * จะส่งชื่อมินเนี่ยน (minionName) กลับไปให้ parent
   */
  onBuyMinion?: (minionName: string) => void;
}

const MinionsCard: React.FC<MinionsCardProps> = ({
  isOpen,
  onClose,
  minionCount,
  minionNames,
  onSelect,
  onBuyMinion,
}) => {
  const searchParams = useSearchParams();

  // state ควบคุมเปิด/ปิด Popup
  const [isMinionCardOpen, setIsMinionCardOpen] = useState(isOpen);
  // state จดจำว่าเคยเปิด Popup แล้วปิดไปเพราะเลือกมินเนี่ยน (เพื่อจัดการ Animation)
  const [wasMinionCardOpen, setWasMinionCardOpen] = useState(false);

  // state มินเนี่ยนที่เลือกแล้ว (สำหรับแสดงข้อมูล Strategy)
  const [selectedMinion, setSelectedMinion] = useState<{
    id: number;
    name: string;
    defense: number;
    strategy: string;
  } | null>(null);

  // index ของการ์ดที่ hover อยู่ (เพื่อแสดงปุ่ม Buy สีดำ)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // เมื่อมีการเลือกมินเนี่ยน (กดตัวการ์ด)
  useEffect(() => {
    if (selectedMinion) {
      setWasMinionCardOpen(true);
      setIsMinionCardOpen(false);
    }
  }, [selectedMinion]);

  // ถ้าออกจาก Strategy แล้วจะกลับมาเปิด Popup การ์ดอีกครั้ง
  useEffect(() => {
    if (!selectedMinion && wasMinionCardOpen) {
      setIsMinionCardOpen(true);
      setWasMinionCardOpen(false);
    }
  }, [selectedMinion, wasMinionCardOpen]);

  // sync ค่า isOpen จากภายนอก
  useEffect(() => {
    setIsMinionCardOpen(isOpen);
  }, [isOpen]);

  // ดึงข้อมูลมินเนี่ยนจาก query ?defenseData=...
  const defenseDataString = searchParams.get("defenseData") || "";
  const defenseDataArray = defenseDataString
    ? defenseDataString.split(",").map((entry) => {
        const [id, name, defense, strategy] = entry.split(":");
        return {
          id: Number(id),
          name: decodeURIComponent(name),
          defense: Number(defense),
          strategy,
        };
      })
    : [];

  // รูปการ์ดแต่ละใบ
  const minionImages: Record<number, string> = {
    1: "/CardMinion1.png",
    2: "/CardMinion2.png",
    3: "/CardMinion3.png",
    4: "/CardMinion4.png",
    5: "/CardMinion5.png",
  };

  // ไอคอน Strategy
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
              // เมื่อคลิกฉากหลัง -> ปิด Popup
              setActiveIndex(null);
              setIsMinionCardOpen(false);
              onClose();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="flex flex-wrap justify-center gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* สร้างการ์ดตามจำนวน minionCount */}
              {Array.from({ length: minionCount }).map((_, index) => {
                // หามินเนี่ยนใน defenseDataArray ที่ id === index+1
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

                    {/* ปุ่มสำหรับคลิกตัวการ์ด (ถ้าอยากใช้ onSelect) */}
                    <button
                      className="w-[180px] h-[240px] bg-transparent rounded-lg hover:scale-105 transition transform relative"
                      onClick={() => {
                        if (minion) {
                          setSelectedMinion(minion);
                          onSelect?.(minion.name);
                        }
                      }}
                    >
                      {/* ภาพการ์ด */}
                      <img
                        src={minionImages[index + 1] || "/defaultCard.png"}
                        alt={minion?.name || `Minion ${index + 1}`}
                        className="w-full h-full object-contain rounded-lg"
                      />

                      {/* ค่าต่าง ๆ spawn_cost / defense / init_hp */}
                      <div
                        className="absolute"
                        style={{
                          top: "5px",
                          left: "50px",
                          color: "#D3FFDC",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        {searchParams.get("spawn_cost") || "0"}
                      </div>
                      <div
                        className="absolute"
                        style={{
                          top: "30px",
                          left: "50px",
                          color: "#D3FFDC",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        {minion?.defense ?? "0"}
                      </div>
                      <div
                        className="absolute"
                        style={{
                          top: "55px",
                          left: "50px",
                          color: "#D3FFDC",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        {searchParams.get("init_hp") || "0"}
                      </div>

                      {/* ไอคอน Strategy ถ้ามี */}
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
                            // เรียก callback ส่งชื่อมินเนี่ยนกลับ
                            if (minion) {
                              onBuyMinion?.(minion.name);
                            }
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

      {/* Popup แสดง Strategy ของมินเนี่ยนที่เลือก (selectedMinion) */}
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
