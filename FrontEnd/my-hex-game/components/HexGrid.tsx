"use client";

import React, { useState, useEffect } from "react";
import BuyButton from "../components/BuyButton"; // หากไฟล์ BuyButton อยู่คนละ path ให้แก้ตามจริง

const HEX_RADIUS = 40;
const COLS = 8;
const ROWS = 8;
const HEX_WIDTH = 2 * HEX_RADIUS;
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS;

interface HexGridProps {
  /** จำนวนเงินที่ต้องใช้ในการซื้อพื้นที่ (ดึงมาจริง ๆ จาก config) */
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
  openMinionsCard: () => void; // เรียกป๊อบอัพ MinionsCard
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
}) => {
  // เก็บสีของแต่ละ Hex
  const [selectedHexes, setSelectedHexes] = useState<Record<string, string>>({});

  // เก็บข้อมูล Hex ที่กำลังจะแสดงปุ่ม BUY
  const [pendingHex, setPendingHex] = useState<string | null>(null);
  const [buyButtonPosition, setBuyButtonPosition] = useState<{ x: number; y: number } | null>(null);

  // สร้าง map ของพื้นที่ + adjacency
  useEffect(() => {
    const greenMap: Record<string, string> = {};
    greenHexes.forEach((key) => (greenMap[key] = "#68B671")); // พื้นที่สีเขียว

    const redMap: Record<string, string> = {};
    redHexes.forEach((key) => (redMap[key] = "#B6696B")); // พื้นที่สีแดง

    // รวมพื้นที่ทั้งหมด + adjacency
    setSelectedHexes({
      ...greenMap,
      ...redMap,
      ...calculateAdjacentHexes({ ...greenMap, ...redMap }, currentColor),
    });
  }, [greenHexes, redHexes, currentColor]);

  // คำนวณ adjacency (สีเหลือง #F4D03F สำหรับเขียว, สีแดงอ่อน #FFA07A สำหรับแดง)
  const calculateAdjacentHexes = (
    currentHexes: Record<string, string>,
    currentColor: "green" | "red"
  ) => {
    const adjacentHexes: Record<string, string> = {};

    Object.keys(currentHexes).forEach((hex) => {
      const color = currentHexes[hex];
      // ต้องเป็นพื้นที่สีเขียว (#68B671) หรือสีแดง (#B6696B) ก่อน
      if (color !== "#68B671" && color !== "#B6696B") return;

      const match = hex.match(/\((\d+),(\d+)\)/);
      if (!match) return;

      const row = parseInt(match[1], 10);
      const col = parseInt(match[2], 10);
      const isGreen = color === "#68B671";

      // ถ้าเป็นตาของ green → คำนวณ adjacency ให้พื้นที่เขียว
      // ถ้าเป็นตาของ red → คำนวณ adjacency ให้พื้นที่แดง
      if ((currentColor === "green" && isGreen) || (currentColor === "red" && !isGreen)) {
        const adjacentColor = isGreen ? "#F4D03F" : "#FFA07A";

        // การเดินรอบ hex ต่างกันเล็กน้อยขึ้นอยู่กับ col เป็นคู่หรือคี่
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

          // อยู่ในขอบเขต และยังไม่มีสี (ไม่ได้เป็นของอีกฝั่ง)
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

  // ★★ เคลียร์ปุ่ม Buy เมื่อ currentColor เปลี่ยน ★★
  useEffect(() => {
    setPendingHex(null);
    setBuyButtonPosition(null);
  }, [currentColor]);

  // ฟังก์ชันเรียกเมื่อคลิก hex
  const handleHexClick = (row: number, col: number) => {
    const key = `(${row},${col})`;
    // ถ้าเทิร์นยังไม่พร้อม หรือ hex ไม่มีสี → return
    if (!canAct || locked || !(key in selectedHexes)) return;

    const colorClicked = selectedHexes[key];

    // ฝั่งเขียว
    if (currentColor === "green") {
      // ถ้าคลิกพื้นที่สีเขียว (#68B671) → เปิดป๊อบอัพ MinionsCard
      if (colorClicked === "#68B671") {
        openMinionsCard();
        return;
      }
      // ถ้าคลิกสีเหลือง (#F4D03F) → แสดงปุ่ม BUY
      if (colorClicked === "#F4D03F") {
        showOrToggleBuyButton(key);
        return;
      }
    }

    // ฝั่งแดง
    if (currentColor === "red") {
      // ถ้าคลิกพื้นที่สีแดง (#B6696B) → เปิดป๊อบอัพ
      if (colorClicked === "#B6696B") {
        openMinionsCard();
        return;
      }
      // ถ้าคลิกสีแดงอ่อน (#FFA07A) → แสดงปุ่ม BUY
      if (colorClicked === "#FFA07A") {
        showOrToggleBuyButton(key);
        return;
      }
    }
  };

  // ฟังก์ชันสำหรับแสดง/ซ่อนปุ่ม BUY เมื่อคลิก adjacency
  const showOrToggleBuyButton = (hexKey: string) => {
    // ถ้าคลิกซ้ำตำแหน่งที่ปุ่ม BUY แสดงอยู่ → ปิดปุ่ม BUY
    if (pendingHex === hexKey) {
      setPendingHex(null);
      setBuyButtonPosition(null);
      return;
    }

    // มิฉะนั้น แสดงปุ่ม BUY ในตำแหน่งใหม่
    setPendingHex(hexKey);

    // แปลง (row, col) จาก key "(3,5)" → row=3 col=5
    const match = hexKey.match(/\((\d+),(\d+)\)/);
    if (!match) return;
    const row = parseInt(match[1], 10);
    const col = parseInt(match[2], 10);

    const xOffset = -20;
    const yOffset = 5;

    // คำนวณตำแหน่งปุ่ม
    const x = col * HEX_WIDTH * 0.75 + xOffset;
    const y = row * HEX_HEIGHT + (col % 2 === 1 ? HEX_HEIGHT / 2 : 0) + yOffset;

    setBuyButtonPosition({ x, y });
  };

  // ฟังก์ชันกดปุ่ม BUY จริง ๆ
  const handleBuy = () => {
    if (!pendingHex) return;

    // เพิ่ม hex นี้ลงในพื้นที่ของผู้เล่น
    if (currentColor === "green") {
      setGreenHexes((prev) => [...prev, pendingHex]);
    } else {
      setRedHexes((prev) => [...prev, pendingHex]);
    }

    // หัก coin ตามค่าที่ส่งมาจริง ๆ
    deductMoney(hexPurchaseCost);

    // ล็อกไม่ให้เทิร์นเดียวกันซื้อซ้ำ
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
            // วาด Hex จากขวาไปซ้าย (ตามโค้ดดั้งเดิม)
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

      {/* ถ้ามี pendingHex → แสดงปุ่ม BUY */}
      {pendingHex && buyButtonPosition && (
        <BuyButton onBuy={handleBuy} position={buyButtonPosition} />
      )}
    </div>
  );
};

export default HexGrid;
