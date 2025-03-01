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
  greenHexes: string[];
  redHexes: string[];
  setGreenHexes: React.Dispatch<React.SetStateAction<string[]>>;
  setRedHexes: React.Dispatch<React.SetStateAction<string[]>>;
}

const HexGrid: React.FC<HexGridProps> = ({
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
}) => {
  const [selectedHexes, setSelectedHexes] = useState<Record<string, string>>({});
  const [pendingHex, setPendingHex] = useState<string | null>(null);
  const [buyButtonPosition, setBuyButtonPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const greenMap: Record<string, string> = {};
    greenHexes.forEach((key) => (greenMap[key] = "#68B671"));

    const redMap: Record<string, string> = {};
    redHexes.forEach((key) => (redMap[key] = "#B6696B"));

    setSelectedHexes({
      ...greenMap,
      ...redMap,
      ...calculateAdjacentHexes({ ...greenMap, ...redMap }, currentColor),
    });
  }, [greenHexes, redHexes, currentColor]);

  const calculateAdjacentHexes = (currentHexes: Record<string, string>, currentColor: "green" | "red") => {
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

        const directions = col % 2 === 0
          ? [[-1, 0], [-1, 1], [0, 1], [1, 0], [0, -1], [-1, -1]]
          : [[-1, 0], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];

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
      }
    });
    return adjacentHexes;
  };

  const handleHexClick = (row: number, col: number) => {
    const key = `(${row},${col})`;
    if (!canAct || locked || !(key in selectedHexes)) return;

    const canBuyGreen = currentColor === "green" && selectedHexes[key] === "#F4D03F";
    const canBuyRed = currentColor === "red" && selectedHexes[key] === "#FFA07A";

    if (!canBuyGreen && !canBuyRed) return;

    setPendingHex(key);

    const xOffset = -20;
    const yOffset = 5;

    const x = (col * HEX_WIDTH * 0.75) + xOffset;
    const y = (row * HEX_HEIGHT) + (col % 2 === 1 ? HEX_HEIGHT / 2 : 0) + yOffset;

    setBuyButtonPosition({ x, y });
  };

  const handleBuy = () => {
    if (pendingHex) {
      if (currentColor === "green") {
        setGreenHexes((prev) => [...prev, pendingHex]);
      } else {
        setRedHexes((prev) => [...prev, pendingHex]);
      }

      deductMoney(100);
      setLocked(true);
      setPendingHex(null);
      setBuyButtonPosition(null);
    }
  };

  return (
    <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <svg width={(COLS * HEX_WIDTH * 0.75) + HEX_RADIUS} height={(ROWS * HEX_HEIGHT) + (HEX_HEIGHT / 2)}>
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
      {pendingHex && buyButtonPosition && <BuyButton onBuy={handleBuy} position={buyButtonPosition} />}
    </div>
  );
};

export default HexGrid;
