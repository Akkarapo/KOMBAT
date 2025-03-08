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

interface HexGridProps {
  hexPurchaseCost: number;
  deductMoney: (amount: number) => void;
  greenCoin: number;
  redCoin: number;
  canAct: boolean;
  locked: boolean; // บอกว่าในเทิร์นนี้ได้ซื้อไปแล้วหรือยัง
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
  // เก็บสีของแต่ละ Hex
  const [selectedHexes, setSelectedHexes] = useState<Record<string, string>>({});

  // เก็บข้อมูล Hex ที่กำลังจะแสดงปุ่ม BUY
  const [pendingHex, setPendingHex] = useState<string | null>(null);
  const [buyButtonPosition, setBuyButtonPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // 1) สร้าง map ของพื้นที่ที่ผู้เล่นถือครอง
    const greenMap: Record<string, string> = {};
    greenHexes.forEach((key) => (greenMap[key] = "#68B671")); // พื้นที่สีเขียว

    const redMap: Record<string, string> = {};
    redHexes.forEach((key) => (redMap[key] = "#B6696B")); // พื้นที่สีแดง

    // 2) รวมสีพื้นฐานของทั้งสองฝั่ง
    let newSelectedHexes = {
      ...greenMap,
      ...redMap,
    };

    // 3) ถ้ายังไม่ locked (ยังไม่ได้ซื้อในเทิร์นนี้) → ค่อยคำนวณ adjacency
    if (!locked) {
      const additionalGreen = greenHexes.filter(hex => !initialGreenHexes.includes(hex));
      const additionalRed = redHexes.filter(hex => !initialRedHexes.includes(hex));

      // เช็คจำนวนพื้นที่ที่ซื้อไปแล้วว่ายังไม่เกิน maxSpawns
      if (
        (currentColor === "green" && additionalGreen.length < maxSpawns) ||
        (currentColor === "red" && additionalRed.length < maxSpawns)
      ) {
        newSelectedHexes = {
          ...newSelectedHexes,
          ...calculateAdjacentHexes(newSelectedHexes, currentColor),
        };
      }
    }

    setSelectedHexes(newSelectedHexes);
  }, [greenHexes, redHexes, currentColor, locked]);

  // ฟังก์ชันคำนวณ adjacency
  const calculateAdjacentHexes = (
    currentHexes: Record<string, string>,
    currentColor: "green" | "red"
  ) => {
    const adjacentHexes: Record<string, string> = {};

    Object.keys(currentHexes).forEach((hex) => {
      const color = currentHexes[hex];
      if (color !== "#68B671" && color !== "#B6696B") return;

      const match = hex.match(/\((\d+),(\d+)\)/);
      if (!match) return;

      const row = parseInt(match[1], 10);
      const col = parseInt(match[2], 10);
      const isGreen = color === "#68B671";

      if ((currentColor === "green" && isGreen) || (currentColor === "red" && !isGreen)) {
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
          const adjRow = row + dr;
          const adjCol = col + dc;
          const adjKey = `(${adjRow},${adjCol})`;

          if (
            adjRow > 0 &&
            adjRow <= ROWS &&
            adjCol > 0 &&
            adjCol <= COLS &&
            !(adjKey in currentHexes)
          ) {
            adjacentHexes[adjKey] = adjacentColor;
          }
        });
      }
    });
    return adjacentHexes;
  };

  // เคลียร์ปุ่ม BUY เมื่อ currentColor เปลี่ยน
  useEffect(() => {
    setPendingHex(null);
    setBuyButtonPosition(null);
  }, [currentColor]);

  // ฟังก์ชันเรียกเมื่อคลิก hex
  const handleHexClick = (row: number, col: number) => {
    const key = `(${row},${col})`;
    if (!canAct || locked || !(key in selectedHexes)) return;

    const colorClicked = selectedHexes[key];

    if (currentColor === "green") {
      if (colorClicked === "#68B671") {
        // ถ้าคลิกพื้นที่สีเขียว → เปิดป๊อบอัพ MinionsCard
        openMinionsCard();
        return;
      }
      if (colorClicked === "#F4D03F") {
        // ถ้าคลิกพื้นที่สีเหลือง → แสดงปุ่ม BUY
        showOrToggleBuyButton(key);
        return;
      }
    }

    if (currentColor === "red") {
      if (colorClicked === "#B6696B") {
        // ถ้าคลิกพื้นที่สีแดง → เปิดป๊อบอัพ MinionsCard
        openMinionsCard();
        return;
      }
      if (colorClicked === "#FFA07A") {
        // ถ้าคลิกพื้นที่สีแดงอ่อน → แสดงปุ่ม BUY
        showOrToggleBuyButton(key);
        return;
      }
    }
  };

  // ฟังก์ชันสำหรับแสดง/ซ่อนปุ่ม BUY เมื่อคลิก adjacency
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

  // ฟังก์ชันกดปุ่ม BUY จริง ๆ
  const handleBuy = () => {
    if (!pendingHex) return;

    // เช็คจำนวนพื้นที่ที่ซื้อเพิ่มเติม (ไม่รวมพื้นที่เริ่มต้น)
    const additionalHexes =
      currentColor === "green"
        ? greenHexes.filter(hex => !initialGreenHexes.includes(hex))
        : redHexes.filter(hex => !initialRedHexes.includes(hex));

    // ถ้าซื้อครบแล้ว => return เฉย ๆ
    if (additionalHexes.length >= maxSpawns) {
      return;
    }

    // ซื้อได้
    if (currentColor === "green") {
      setGreenHexes((prev) => [...prev, pendingHex]);
    } else {
      setRedHexes((prev) => [...prev, pendingHex]);
    }

    // หักเงิน
    deductMoney(hexPurchaseCost);

    // ล็อกเพื่อไม่ให้ซื้อซ้ำในเทิร์นเดียวกัน
    setLocked(true);

    // ปิดปุ่ม BUY
    setPendingHex(null);
    setBuyButtonPosition(null);
  };

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
      <svg
        width={COLS * HEX_WIDTH * 0.75 + HEX_RADIUS}
        height={ROWS * HEX_HEIGHT + HEX_HEIGHT / 2}
      >
        {Array.from({ length: ROWS }, (_, row) =>
          Array.from({ length: COLS }, (_, col) => {
            const x = (COLS - col - 1) * HEX_WIDTH * 0.75;
            const y = row * HEX_HEIGHT + (col % 2 === 1 ? HEX_HEIGHT / 2 : 0);
            const key = `(${row + 1},${COLS - col})`;

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
                  strokeWidth="2"
                  fill={selectedHexes[key] || "transparent"}
                  onClick={() => handleHexClick(row + 1, COLS - col)}
                  style={{ cursor: "pointer" }}
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
