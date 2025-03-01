"use client";

import React, { useState, useEffect } from "react";
import BuyButton from "../components/BuyButton";

const HEX_RADIUS = 40;
const COLS = 8;
const ROWS = 8;
const HEX_WIDTH = 2 * HEX_RADIUS;
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS;

interface HexGridProps {
  deductMoney: (amount: number) => void;
  greenCoin: number;
  redCoin: number;
  canAct: boolean;
  locked: boolean;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
  currentColor: "green" | "red";
  initialGreenHexes?: string[];
  initialRedHexes?: string[];
}

const HexGrid: React.FC<HexGridProps> = ({
  deductMoney,
  greenCoin,
  redCoin,
  canAct,
  locked,
  setLocked,
  currentColor,
  initialGreenHexes = ["(1,1)", "(1,2)", "(2,1)", "(2,2)", "(1,3)"],
  initialRedHexes = ["(7,7)", "(7,8)", "(8,6)", "(8,7)", "(8,8)"]
}) => {
  const [selectedHexes, setSelectedHexes] = useState<Record<string, string>>({});
  const [pendingHex, setPendingHex] = useState<string | null>(null);

  const calculateAdjacentHexes = (currentHexes: Record<string, string>) => {
    const adjacentHexes: Record<string, string> = Object.create(null);
    Object.keys(currentHexes).forEach(hex => {
      const color = currentHexes[hex];
      if (color !== "#68B671" && color !== "#B6696B") return;

      const match = hex.match(/\((\d+),(\d+)\)/);
      if (!match) return;

      const row = parseInt(match[1], 10);
      const col = parseInt(match[2], 10);
      const isGreen = color === "#68B671";
      const adjacentColor = isGreen ? "#F4D03F" : "#FFA07A";

      const directions = col % 2 === 0
        ? [[-1, 0], [-1, 1], [0, 1], [1, 0], [0, -1], [-1, -1]] // แถวคู่
        : [[-1, 0], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]; // แถวคี่

      directions.forEach(([dr, dc]) => {
        const adjRow = row + dr;
        const adjCol = col + dc;
        const adjKey = `(${adjRow},${adjCol})`;

        if (
          adjRow > 0 && adjRow <= ROWS &&
          adjCol > 0 && adjCol <= COLS &&
          !(adjKey in currentHexes)
        ) {
          adjacentHexes[adjKey] = adjacentColor;
        }
      });
    });
    return adjacentHexes;
  };

  useEffect(() => {
    const initialGreen: Record<string, string> = Object.create(null);
    initialGreenHexes.forEach(key => (initialGreen[key] = "#68B671"));

    const initialRed: Record<string, string> = Object.create(null);
    initialRedHexes.forEach(key => (initialRed[key] = "#B6696B"));

    setSelectedHexes({
      ...initialGreen,
      ...initialRed,
      ...calculateAdjacentHexes({ ...initialGreen, ...initialRed })
    });
  }, []);

  const handleHexClick = (row: number, col: number) => {
    const key = `(${row},${col})`;
    if (!canAct || locked || !(key in selectedHexes)) return;

    const canBuyGreen = currentColor === "green" && selectedHexes[key] === "#F4D03F";
    const canBuyRed = currentColor === "red" && selectedHexes[key] === "#FFA07A";

    if (!canBuyGreen && !canBuyRed) return;

    setPendingHex(key);
  };

  const handleBuy = () => {
    if (pendingHex) {
      setSelectedHexes(prev => {
        const newColor = currentColor === "green" ? "#68B671" : "#B6696B";
        const updated = { ...prev, [pendingHex]: newColor };
        return { ...updated, ...calculateAdjacentHexes(updated) };
      });
      deductMoney(100);
      setLocked(true);
      setPendingHex(null);
    }
  };

  return (
    <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <svg width={(COLS * HEX_WIDTH * 0.75) + HEX_RADIUS} height={(ROWS * HEX_HEIGHT) + (HEX_HEIGHT / 2)}>
        {Array.from({ length: ROWS }, (_, row) => (
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
                <text x={HEX_RADIUS} y={HEX_HEIGHT / 2} textAnchor="middle" fill="white" fontSize="12" opacity="0.5">{key}</text>
              </g>
            );
          })
        ))}
      </svg>
      {pendingHex && <BuyButton onBuy={handleBuy} />}
    </div>
  );
};

export default HexGrid;