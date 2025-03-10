"use client";

import React, { useState, useEffect } from "react";
import BuyButton from "../components/BuyButton";
import { initialGreenHexes } from "./dataGreen";
import { initialRedHexes } from "./dataRed";

const HEX_RADIUS = 40;
const COLS = 8;
const ROWS = 8;
const HEX_WIDTH = 2 * HEX_RADIUS;
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS;

interface PotentialHex {
  color: string;
  fadingOut: boolean;
}

interface HexGridProps {
  hexPurchaseCost: number;
  deductMoney: (amount: number) => void;
  greenCoin: number;
  redCoin: number;
  canAct: boolean;
  locked: boolean; 
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
  currentColor: "green" | "red";
  greenHexes: string[];
  redHexes: string[];
  setGreenHexes: React.Dispatch<React.SetStateAction<string[]>>;
  setRedHexes: React.Dispatch<React.SetStateAction<string[]>>;
  openMinionsCard: () => void;
  maxSpawns: number;
}

const HexGrid: React.FC<HexGridProps> = ({
  hexPurchaseCost,
  deductMoney,
  greenCoin,
  redCoin,
  canAct,
  locked,
  setLocked,
  currentColor,
  greenHexes,
  redHexes,
  setGreenHexes,
  setRedHexes,
  openMinionsCard,
  maxSpawns,
}) => {
  // ownedHexes: พื้นที่ที่ผู้เล่นครอบครองจริง
  const [ownedHexes, setOwnedHexes] = useState<Record<string, string>>({});
  // potentialHexes: พื้นที่ adjacent (สีเหลือง/แดงอ่อน) + สถานะ fadingOut
  const [potentialHexes, setPotentialHexes] = useState<Record<string, PotentialHex>>({});

  // สำหรับปุ่ม BUY
  const [pendingHex, setPendingHex] = useState<string | null>(null);
  const [buyButtonPosition, setBuyButtonPosition] = useState<{ x: number; y: number } | null>(null);

  // อัปเดต ownedHexes ทุกครั้งที่ greenHexes/redHexes เปลี่ยน
  useEffect(() => {
    const greenMap: Record<string, string> = {};
    greenHexes.forEach((key) => (greenMap[key] = "#68B671"));
    const redMap: Record<string, string> = {};
    redHexes.forEach((key) => (redMap[key] = "#B6696B"));
    setOwnedHexes({ ...greenMap, ...redMap });
  }, [greenHexes, redHexes]);

  // useEffect จัดการ potentialHexes
  useEffect(() => {
    // ฟังก์ชัน fade out
    const fadeOutAll = () => {
      setPotentialHexes((prev) => {
        const updated: Record<string, PotentialHex> = {};
        for (const k in prev) {
          updated[k] = { ...prev[k], fadingOut: true };
        }
        return updated;
      });
      setTimeout(() => {
        setPotentialHexes({});
      }, 500);
    };

    // เช็คจำนวนพื้นที่ที่ซื้อเพิ่มเติม
    const additional =
      currentColor === "green"
        ? greenHexes.filter((h) => !initialGreenHexes.includes(h))
        : redHexes.filter((h) => !initialRedHexes.includes(h));
    const canStillBuy = additional.length < maxSpawns;

    // ถ้า locked = false และยังซื้อได้ => คำนวณ adjacency แล้ว fade in
    if (!locked && canStillBuy) {
      // เคลียร์ของเก่า
      setPotentialHexes({});
      const adj = calculateAdjacentHexes(ownedHexes, currentColor);
      const keys = Object.keys(adj);
      const timeouts: NodeJS.Timeout[] = [];

      keys.forEach((k, index) => {
        const timeout = setTimeout(() => {
          setPotentialHexes((prev) => ({
            ...prev,
            [k]: { color: adj[k], fadingOut: false },
          }));
        }, index * 200);
        timeouts.push(timeout);
      });

      return () => {
        timeouts.forEach((t) => clearTimeout(t));
      };
    } else {
      // ถ้า locked = true หรือซื้อครบแล้ว => fade out
      fadeOutAll();
    }
  }, [ownedHexes, currentColor, locked, greenHexes, redHexes, maxSpawns]);

  // เมื่อเปลี่ยน currentColor => เคลียร์ปุ่ม BUY
  useEffect(() => {
    setPendingHex(null);
    setBuyButtonPosition(null);
  }, [currentColor]);

  // ฟังก์ชันคำนวณ adjacency
  const calculateAdjacentHexes = (
    currentHexes: Record<string, string>,
    turnColor: "green" | "red"
  ) => {
    const adjacent: Record<string, string> = {};
    for (const hex in currentHexes) {
      const color = currentHexes[hex];
      if (color !== "#68B671" && color !== "#B6696B") continue;

      const match = hex.match(/\((\d+),(\d+)\)/);
      if (!match) continue;
      const row = parseInt(match[1], 10);
      const col = parseInt(match[2], 10);
      const isGreen = color === "#68B671";

      if ((turnColor === "green" && isGreen) || (turnColor === "red" && !isGreen)) {
        const adjacentColor = isGreen ? "#F4D03F" : "#FFA07A";
        const directions =
          col % 2 === 0
            ? [
                [-1, 0],
                [-1, 1],
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, -1],
              ]
            : [
                [-1, 0],
                [0, 1],
                [1, 1],
                [1, 0],
                [1, -1],
                [0, -1],
              ];
        directions.forEach(([dr, dc]) => {
          const r2 = row + dr;
          const c2 = col + dc;
          const key = `(${r2},${c2})`;
          if (
            r2 > 0 &&
            r2 <= ROWS &&
            c2 > 0 &&
            c2 <= COLS &&
            !(key in currentHexes)
          ) {
            adjacent[key] = adjacentColor;
          }
        });
      }
    }
    return adjacent;
  };

  // เมื่อคลิกพื้นที่
  const handleHexClick = (row: number, col: number) => {
    if (!canAct || locked) return;
    const key = `(${row},${col})`;

    // รวม owned + potential
    const merged: Record<string, string> = { ...ownedHexes };
    for (const k in potentialHexes) {
      merged[k] = potentialHexes[k].color;
    }
    if (!(key in merged)) return;

    const colorClicked = merged[key];
    if (currentColor === "green") {
      if (colorClicked === "#68B671") {
        openMinionsCard();
        return;
      }
      if (colorClicked === "#F4D03F") {
        showOrToggleBuyButton(key);
        return;
      }
    }
    if (currentColor === "red") {
      if (colorClicked === "#B6696B") {
        openMinionsCard();
        return;
      }
      if (colorClicked === "#FFA07A") {
        showOrToggleBuyButton(key);
        return;
      }
    }
  };

  // แสดง/ซ่อนปุ่ม BUY
  const showOrToggleBuyButton = (hexKey: string) => {
    if (pendingHex === hexKey) {
      setPendingHex(null);
      setBuyButtonPosition(null);
      return;
    }
    setPendingHex(hexKey);

    const match = hexKey.match(/\((\d+),(\d+)\)/);
    if (!match) return;
    const row = parseInt(match[1], 10);
    const col = parseInt(match[2], 10);

    const xOffset = -20;
    const yOffset = 5;
    const x = col * HEX_WIDTH * 0.75 + xOffset;
    const y = row * HEX_HEIGHT + (col % 2 === 1 ? HEX_HEIGHT / 2 : 0) + yOffset;
    setBuyButtonPosition({ x, y });
  };

  // เมื่อซื้อพื้นที่
  const handleBuy = () => {
    if (!pendingHex) return;
    const additional =
      currentColor === "green"
        ? greenHexes.filter((h) => !initialGreenHexes.includes(h))
        : redHexes.filter((h) => !initialRedHexes.includes(h));
    if (additional.length >= maxSpawns) return;

    // เพิ่มเข้า greenHexes หรือ redHexes
    if (currentColor === "green") {
      setGreenHexes((prev) => [...prev, pendingHex]);
    } else {
      setRedHexes((prev) => [...prev, pendingHex]);
    }
    deductMoney(hexPurchaseCost);

    // ซื้อเสร็จ => locked = true → ให้ potential เฟดหาย
    setLocked(true);

    // ปิดปุ่ม BUY
    setPendingHex(null);
    setBuyButtonPosition(null);
  };

  // รวม owned + potential สำหรับ render
  const mergedHexes: Record<string, { color: string; fadingOut?: boolean }> = {};
  for (const k in ownedHexes) {
    mergedHexes[k] = { color: ownedHexes[k] };
  }
  for (const k in potentialHexes) {
    mergedHexes[k] = { color: potentialHexes[k].color, fadingOut: potentialHexes[k].fadingOut };
  }

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {/* 
        CSS เน้นเฉพาะ fill-opacity เพื่อให้ stroke (เส้นตาราง) ไม่หาย 
      */}
      <style jsx>{`
        @keyframes fadeInFill {
          0% {
            fill-opacity: 0;
          }
          100% {
            fill-opacity: 1;
          }
        }
        @keyframes fadeOutFill {
          0% {
            fill-opacity: 1;
          }
          100% {
            fill-opacity: 0;
          }
        }
        .fadeIn {
          animation: fadeInFill 0.5s ease forwards;
        }
        .fadeOut {
          animation: fadeOutFill 0.5s ease forwards;
        }
      `}</style>

      <svg
        width={COLS * HEX_WIDTH * 0.75 + HEX_RADIUS}
        height={ROWS * HEX_HEIGHT + HEX_HEIGHT / 2}
      >
        {Array.from({ length: ROWS }, (_, row) =>
          Array.from({ length: COLS }, (_, col) => {
            const x = (COLS - col - 1) * HEX_WIDTH * 0.75;
            const y = row * HEX_HEIGHT + (col % 2 === 1 ? HEX_HEIGHT / 2 : 0);
            const key = `(${row + 1},${COLS - col})`;
            const data = mergedHexes[key];
            const fillColor = data ? data.color : "transparent";

            let className = "";
            if (fillColor === "#F4D03F" || fillColor === "#FFA07A") {
              className = data?.fadingOut ? "fadeOut" : "fadeIn";
            }

            return (
              <g key={key} transform={`translate(${x},${y})`}>
                <polygon
                  points={`
                    ${HEX_RADIUS * 0.5},0 
                    ${HEX_RADIUS * 1.5},0 
                    ${HEX_RADIUS * 2},${HEX_HEIGHT / 2} 
                    ${HEX_RADIUS * 1.5},${HEX_HEIGHT} 
                    ${HEX_RADIUS * 0.5},${HEX_HEIGHT} 
                    0,${HEX_HEIGHT / 2}
                  `}
                  stroke="white"
                  strokeWidth={2}
                  style={{
                    fill: fillColor,
                    fillOpacity: fillColor !== "transparent" ? 1 : 0,
                    strokeOpacity: 1, // เส้นตารางไม่หาย
                    cursor: "pointer",
                  }}
                  className={className}
                  onClick={() => handleHexClick(row + 1, COLS - col)}
                />
              </g>
            );
          })
        )}
      </svg>

      {pendingHex && buyButtonPosition && (
        <BuyButton onBuy={handleBuy} position={buyButtonPosition} />
      )}
    </div>
  );
};

export default HexGrid;
