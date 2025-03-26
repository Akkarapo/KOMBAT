"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { HexData, imageMapping } from "./HexData";

interface InformationForPlayersProps {
  isOpen: boolean;
  onClose: () => void;
  onMinionCardClick?: (id: number) => void; // ฟังก์ชัน callback เมื่อคลิกการ์ดมินเนี่ยน
}

// **สำคัญ** ประกาศ MinionData ให้มี id: number
interface MinionData {
  id: number;        // มีฟิลด์ id เพื่อป้องกัน error Property 'id' does not exist
  name: string;
  defense: number;
  strategy: string;
}

// รูปการ์ดมินเนี่ยน
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

const InformationForPlayers: React.FC<InformationForPlayersProps> = ({
  isOpen,
  onClose,
  onMinionCardClick,
}) => {
  const searchParams = useSearchParams();

  const [config, setConfig] = useState<Record<string, string>>({});
  const [minions, setMinions] = useState<MinionData[]>([]);

  useEffect(() => {
    if (isOpen) {
      // โหลด config จาก localStorage
      const localConfig = localStorage.getItem("hexConfig");
      let parsedConfig = localConfig ? JSON.parse(localConfig) : {};

      // Override ค่าจาก query (หากมี)
      Object.keys(HexData).forEach((key) => {
        const paramValue = searchParams.get(key);
        if (paramValue) {
          parsedConfig[key] = paramValue;
        }
      });
      setConfig(parsedConfig);

      // โหลดข้อมูลมินเนี่ยนจาก query defenseData (เช่น "1:MinionOne:5:Strategy 1,2:MinionTwo:3:Strategy 2,...")
      const defenseDataString = searchParams.get("defenseData") || "";
      if (defenseDataString) {
        const arr = defenseDataString.split(",").map((entry) => {
          const [id, name, defense, strategy] = entry.split(":");
          return {
            id: Number(id),
            name: decodeURIComponent(name),
            defense: Number(defense),
            strategy,
          };
        });
        setMinions(arr);
      }
    }
  }, [isOpen, searchParams]);

  // แยก key ของ HexData เป็น 2 คอลัมน์ (สำหรับโชว์ใน UI)
  type HexDataKeys = keyof typeof HexData;
  const allKeys = Object.keys(HexData) as HexDataKeys[];
  const half = Math.ceil(allKeys.length / 2);
  const leftKeys = allKeys.slice(0, half);
  const rightKeys = allKeys.slice(half);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            style={{
              borderRadius: "8px",
              width: "80%",
              maxWidth: "1000px",
              padding: "20px",
              position: "relative",
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // หยุด event ไม่ให้ปิด popup
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
                textAlign: "left",
              }}
            >
              Game Configuration
            </h2>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 0,
                marginBottom: "20px",
                maxWidth: "800px",
                display: "flex",
                gap: "20px",
              }}
            >
              {/* คอลัมน์ซ้าย */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                {leftKeys.map((cfgKey) => {
                  const value = config[cfgKey] || "N/A";
                  const iconPath = imageMapping[cfgKey] || "";

                  return (
                    <div
                      key={cfgKey}
                      style={{
                        position: "relative",
                        width: "400px",
                        height: "50px",
                      }}
                    >
                      <img
                        src={iconPath}
                        alt={cfgKey}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "20px",
                          left: "70px",
                          color: "black",
                          fontSize: "14px",
                          fontWeight: "normal",
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* คอลัมน์ขวา */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                {rightKeys.map((cfgKey) => {
                  const value = config[cfgKey] || "N/A";
                  const iconPath = imageMapping[cfgKey] || "";

                  return (
                    <div
                      key={cfgKey}
                      style={{
                        position: "relative",
                        width: "400px",
                        height: "50px",
                      }}
                    >
                      <img
                        src={iconPath}
                        alt={cfgKey}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "20px",
                          left: "70px",
                          color: "black",
                          fontSize: "14px",
                          fontWeight: "normal",
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
                textAlign: "left",
              }}
            >
              Minion Information
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {minions.map((minion) => {
                // ใช้ minion.id ได้โดยไม่ error เพราะใน interface มีประกาศไว้แล้ว
                const cardImage = minionImages[minion.id] || "/defaultCard.png";
                const iconPath = strategyIcons[minion.strategy] || null;
                const spawnCost = config.spawn_cost || "0";
                const initHp = config.init_hp || "0";

                return (
                  <div
                    key={minion.id}
                    style={{
                      width: "180px",
                      height: "240px",
                      position: "relative",
                      backgroundColor: "transparent",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                    onClick={() => onMinionCardClick?.(minion.id)}
                  >
                    <span
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginBottom: "4px",
                      }}
                    >
                      {minion.name}
                    </span>

                    <div style={{ width: "100%", height: "100%", position: "relative" }}>
                      <img
                        src={cardImage}
                        alt={minion.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          borderRadius: "8px",
                        }}
                      />
                      {/* spawn_cost */}
                      <div
                        style={{
                          position: "absolute",
                          top: "5px",
                          left: "50px",
                          color: "#D3FFDC",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        {spawnCost}
                      </div>
                      {/* defense */}
                      <div
                        style={{
                          position: "absolute",
                          top: "30px",
                          left: "50px",
                          color: "#D3FFDC",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        {minion.defense}
                      </div>
                      {/* init_hp */}
                      <div
                        style={{
                          position: "absolute",
                          top: "55px",
                          left: "50px",
                          color: "#D3FFDC",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        {initHp}
                      </div>

                      {/* ไอคอน Strategy ถ้ามี */}
                      {iconPath && (
                        <img
                          src={iconPath}
                          alt={minion.strategy}
                          style={{
                            position: "absolute",
                            top: "15px",
                            right: "30px",
                            width: "40px",
                            height: "40px",
                            opacity: 0.2,
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InformationForPlayers;
