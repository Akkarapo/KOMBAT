"use client"; 

import React, { useState } from "react";

const HEX_RADIUS = 40; 
const COLS = 8; 
const ROWS = 8; 
const HEX_WIDTH = 2 * HEX_RADIUS; 
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS; 
const X_OFFSET = HEX_WIDTH * 0.75; 
const Y_OFFSET = HEX_HEIGHT; 

interface HexGridProps {
  deductMoney: (amount: number) => void;
  greenCoin: number;
  canAct: boolean;
  locked: boolean;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
  currentColor: string;
}

const HexGrid: React.FC<HexGridProps> = ({ 
  deductMoney, 
  greenCoin, 
  canAct, 
  locked, 
  setLocked, 
  currentColor 
}) => {
  const [selectedHexes, setSelectedHexes] = useState<{ [key: string]: string }>({});

  const handleHexClick = (row: number, col: number) => {
    const key = `${row}-${col}`;

    if (locked || selectedHexes[key] || !canAct) return;

    if (greenCoin < 100) {
      alert("You don't have enough money to change the hexagon to green!");
      return;
    }

    const newSelectedHexes = { ...selectedHexes };
    newSelectedHexes[key] = currentColor === "green" ? "#68B671" : "#B6696B";
    setSelectedHexes(newSelectedHexes);

    deductMoney(100);
    setLocked(true);
  };

  const hexagons = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = (COLS - 1 - col) * X_OFFSET; 
      const y = row * Y_OFFSET + (col % 2 === 1 ? Y_OFFSET / 2 : 0);

      const key = `${row}-${col}`;
      let fillColor = "none"; 
      let strokeColor = "rgba(255, 255, 255, 0.5)"; 

      // **สลับสีแดง-เขียวจากโค้ดเดิม**
      if (
        (row === 0 && col >= 5 && col <= 7) ||  
        (row === 1 && col >= 6 && col <= 7)     
      ) {
        fillColor = "#B6696B";  // **เปลี่ยนเป็นสีแดงแทน**
      } else if (
        (row === 7 && col >= 0 && col <= 2) ||  
        (row === 6 && col >= 0 && col <= 1)     
      ) {
        fillColor = "#68B671"; // **เปลี่ยนเป็นสีเขียวแทน**
      }

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
          fill={fillColor}
          onClick={() => handleHexClick(row, col)}
          style={{ pointerEvents: "all", cursor: "pointer" }}
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
