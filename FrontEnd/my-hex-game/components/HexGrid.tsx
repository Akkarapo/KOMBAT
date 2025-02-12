"use client"; // เพิ่มบรรทัดนี้ที่หัวไฟล์

import React, { useState } from "react";

const HEX_RADIUS = 40; // ขนาดของหกเหลี่ยม
const COLS = 8; // จำนวนคอลัมน์
const ROWS = 8; // จำนวนแถว
const HEX_WIDTH = 2 * HEX_RADIUS; // ความกว้างของหกเหลี่ยม
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS; // ความสูงของหกเหลี่ยม
const X_OFFSET = HEX_WIDTH * 0.75; // ระยะห่างระหว่างหกเหลี่ยมในแนว X
const Y_OFFSET = HEX_HEIGHT; // ระยะห่างระหว่างหกเหลี่ยมในแนว Y

interface HexGridProps {
  deductMoney: (amount: number) => void;
  greenCoin: number;
  canAct: boolean;
  locked: boolean;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
  currentColor: string;  // ใช้เพื่อส่งข้อมูลสีที่ต้องการ
}

const HexGrid: React.FC<HexGridProps> = ({ deductMoney, greenCoin, canAct, locked, setLocked, currentColor }) => {
  const [selectedHexes, setSelectedHexes] = useState<{ [key: string]: string }>({});

  const handleHexClick = (row: number, col: number) => {
    const key = `${row}-${col}`;

    // ตรวจสอบว่าไม่ได้อยู่ในสถานะ locked หรือเคยคลิกหกเหลี่ยมนั้นแล้ว
    if (locked || selectedHexes[key] || !canAct) return;

    // ตรวจสอบว่ามีเงินเหลือพอที่จะหักเงิน 100 ไหม
    if (greenCoin < 100) {
      alert("You don't have enough money to change the hexagon to green!");
      return;
    }

    const newSelectedHexes = { ...selectedHexes };
    newSelectedHexes[key] = currentColor === "green" ? "#68B671" : "#B6696B";  // เปลี่ยนเป็นสีที่เลือก
    setSelectedHexes(newSelectedHexes);

    // หักเงิน 100 เมื่อคลิกเพื่อเปลี่ยนเป็นสีเขียว
    deductMoney(100); // ส่งการหักเงินไปยังฟังก์ชันที่จัดการเงิน
    setLocked(true); // ล็อกไม่ให้กดหกเหลี่ยมอื่น
  };

  const hexagons = [];

// สร้างหกเหลี่ยม
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = (COLS - 1 - col) * X_OFFSET;
      const y = row * Y_OFFSET + (col % 2 === 1 ? Y_OFFSET / 2 : 0);

      const key = `${row}-${col}`;
      let fillColor = "none"; // ค่าเริ่มต้นถ้าไม่ถูกเลือก
      let strokeColor = "rgba(255, 255, 255, 0.5)"; // ขอบหกเหลี่ยมสีขาวโปร่งแสง

      // สีเขียวที่ตำแหน่ง (0,5), (0,6), (0,7), (1,6), (1,7)
      if (
        (row === 0 && col >= 5 && col <= 7) ||  // (0,5), (0,6), (0,7)
        (row === 1 && col >= 6 && col <= 7)     // (1,6), (1,7)
      ) {
        fillColor = "#68B671"; // สีเขียว
      }
      // สีแดงที่ตำแหน่ง (7,0), (7,1), (6,0), (6,1), (7,2)
      else if (
        (row === 7 && col >= 0 && col <= 2) ||  // (7,0), (7,1), (7,2)
        (row === 6 && col >= 0 && col <= 1)     // (6,0), (6,1)
      ) {
        fillColor = "#B6696B"; // สีแดง
      }

      // หากหกเหลี่ยมนี้ถูกคลิกและมีสี
      if (selectedHexes[key]) {
        fillColor = selectedHexes[key];
      }

      hexagons.push(
        <polygon
          key={key}
          points={`  
            ${HEX_RADIUS * 0.5},0 
            ${HEX_RADIUS * 1.5},0 
            ${HEX_RADIUS * 2},${HEX_HEIGHT / 2} 
            ${HEX_RADIUS * 1.5},${HEX_HEIGHT} 
            ${HEX_RADIUS * 0.5},${HEX_HEIGHT} 
            0,${HEX_HEIGHT / 2}
          `} 
          transform={`translate(${x},${y})`}
          stroke={strokeColor}
          strokeWidth="2"
          fill={fillColor} // ใช้สีที่กำหนดในเงื่อนไข
          onClick={() => handleHexClick(row, col)} // เพิ่มฟังก์ชันการคลิก
          style={{ pointerEvents: "all", cursor: "pointer" }} // เพิ่ม CSS สำหรับการคลิก
        />
      );
    }
  }

  return (
    <svg
      width={COLS * X_OFFSET + HEX_RADIUS}
      height={ROWS * HEX_HEIGHT + HEX_HEIGHT / 2}
      viewBox={`0 0 ${COLS * X_OFFSET + HEX_RADIUS} ${ROWS * HEX_HEIGHT + HEX_HEIGHT / 2}`}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {hexagons}
    </svg>
  );
};

export default HexGrid;
