"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { HexData, imageMapping } from "./HexData";
import MinionStrategyInformation from "./minionStrategyInformation";

interface InformationForPlayersProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MinionData {
  id: number;
  name: string;
  defense: number;
  strategy: string;
}

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

const InformationForPlayers: React.FC<InformationForPlayersProps> = ({ isOpen, onClose }) => {
  const searchParams = useSearchParams();

  const [config, setConfig] = useState<{ [key: string]: string }>({});
  const [minions, setMinions] = useState<MinionData[]>([]);
  const [selectedMinionId, setSelectedMinionId] = useState<number | null>(null);
  const [folded, setFolded] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // reset state
      setFolded(false);
      setSelectedMinionId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // โหลด config
      const localConfig = localStorage.getItem("hexConfig");
      let parsedConfig = localConfig ? JSON.parse(localConfig) : {};

      // Override ด้วย query
      Object.keys(HexData).forEach((key) => {
        const paramValue = searchParams.get(key);
        if (paramValue) {
          parsedConfig[key] = paramValue;
        }
      });
      setConfig(parsedConfig);

      // โหลดมินเนี่ยน
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

  const keys = Object.keys(HexData);
  const leftFields = keys.slice(0, 5);
  const rightFields = keys.slice(5);

  if (!isOpen) return null;

  // คลิกการ์ด => พับ
  const handleCardClick = (id: number) => {
    setSelectedMinionId(id);
    setFolded(true);
  };

  // ปิด minionStrategy => กลับมา InfoForPlayers
  const handleMinionStrategyClose = () => {
    setFolded(false);
    setSelectedMinionId(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50"
        // ใช้ overlay เป็นสีดำโปร่งใส
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            width: "80%",
            maxWidth: "1000px",
            padding: "10px",
            position: "relative",
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ปุ่มปิด (X) */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "#555",
            }}
          >
            X
          </button>

          {/* ถ้ายังไม่ fold => แสดง InfoForPlayers */}
          {!folded && (
            <>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
                Game Configuration
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  columnGap: "2px",
                  rowGap: "2px",
                  width: "100%",
                }}
              >
                {[leftFields, rightFields].map((fields, colIndex) => (
                  <div key={colIndex} style={{ display: "flex", flexDirection: "column" }}>
                    {fields.map((key, index) => {
                      const value = config[key] || "";
                      const imgSrc = imageMapping[key] || "/default.png";
                      return (
                        <motion.div
                          key={key}
                          style={{
                            position: "relative",
                            minHeight: "50px",
                            marginBottom: "2px",
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: (colIndex * 5 + index) * 0.05 }}
                        >
                          <Image
                            src={imgSrc}
                            alt={key}
                            width={200}
                            height={50}
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
                              position: "relative",
                              top: "20px",
                              left: "70px",
                              fontSize: "14px",
                              color: "black",
                            }}
                          >
                            {value}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <h2 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px", marginBottom: "10px" }}>
                Minion Information
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  overflowX: "auto",
                  gap: "20px",
                }}
              >
                {minions.map((minion) => {
                  const cardImage = minionImages[minion.id] || "/defaultCard.png";
                  const iconPath = strategyIcons[minion.strategy] || null;
                  const spawnCost = config.spawn_cost || "0";
                  const initHp = config.init_hp || "0";

                  return (
                    <div
                      key={minion.id}
                      style={{
                        flex: "0 0 auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "black", fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>
                        {minion.name}
                      </span>
                      <div
                        style={{
                          width: "180px",
                          height: "240px",
                          position: "relative",
                          backgroundColor: "transparent",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleCardClick(minion.id)}
                      >
                        <img
                          src={cardImage}
                          alt={minion.name}
                          style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "8px" }}
                        />

                        {/* spawn_cost */}
                        <div
                          style={{
                            position: "absolute",
                            top: "5px",
                            left: "55px",
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
                            left: "55px",
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
                            left: "55px",
                            color: "#D3FFDC",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          {initHp}
                        </div>

                        {/* strategy icon */}
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
            </>
          )}

          {/* ถ้า folded = true => แสดง minionStrategyInformation */}
          {folded && selectedMinionId !== null && (
            <MinionStrategyInformation
              minionId={selectedMinionId}
              hideBuyButton={true}
              onClose={handleMinionStrategyClose} // ปิด => กลับมา InfoForPlayers
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InformationForPlayers;
