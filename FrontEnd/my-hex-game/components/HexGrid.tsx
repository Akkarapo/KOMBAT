"use client"; 

import React, { useState } from "react";

const HEX_RADIUS = 40; 
const COLS = 8; 
const ROWS = 8; 
const HEX_WIDTH = 2 * HEX_RADIUS; 
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS; 

interface HexGridProps {
  deductMoney: (amount: number) => void;
  greenCoin: number;
  canAct: boolean;
  locked: boolean;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
  currentColor: string;
  initialGreenHexes?: string[];
  initialRedHexes?: string[];
}

const HexGrid: React.FC<HexGridProps> = ({ 
  deductMoney, 
  greenCoin, 
  canAct, 
  locked, 
  setLocked, 
  currentColor, 
  initialGreenHexes = ["(1,1)", "(1,2)", "(2,1)", "(2,2)", "(1,3)"],
  initialRedHexes = ["(7,7)", "(7,8)", "(8,6)", "(8,7)", "(8,8)"]
}) => {
  const [selectedHexes, setSelectedHexes] = useState<Record<string, string>>(() => {
    const green: Record<string, string> = Object.create(null);
    initialGreenHexes.forEach(key => (green[key] = "#68B671"));
    const red: Record<string, string> = Object.create(null);
    initialRedHexes.forEach(key => (red[key] = "#B6696B"));
    const adjacentToGreen: Record<string, string> = Object.create(null);

    const getValidDirections = (row: number, col: number): [number, number][] => {
      const isEvenRow = row % 2 === 0;
      const isEvenCol = col % 2 === 0;

      if (isEvenRow && isEvenCol || (!isEvenRow && isEvenCol)) {
        return [[-1,0], [-1,1], [0,1], [1,0], [0,-1], [-1,-1]];
      } else {
        return [[-1,0], [0,1], [1,1], [1,0], [1,-1], [0,-1]];
      }
    };

    initialGreenHexes.forEach(hex => {
      const match = hex.match(/\((\d+),(\d+)\)/);
      if (match) {
        const row = parseInt(match[1], 10);
        const col = parseInt(match[2], 10);
        const directions = getValidDirections(row, col);

        directions.forEach(([dr, dc]) => {
          const adjRow = row + dr;
          const adjCol = col + dc;
          const adjKey = `(${adjRow},${adjCol})`;
          if (
            adjRow > 0 && adjRow <= ROWS && adjCol > 0 && adjCol <= COLS &&
            !(adjKey in green) && !(adjKey in red)
          ) {
            adjacentToGreen[adjKey] = "#F4D03F";
            console.log(`Yellow candidate from (${row},${col}): ${adjKey}`);
          }
        });
      }
    });

    console.log("Green Hexes:", Object.keys(green));
    return { ...green, ...red, ...adjacentToGreen };
  });

  const hexagons: React.ReactElement[] = [];
  for (let row = 1; row <= ROWS; row++) {
    for (let col = 1; col <= COLS; col++) {
      const x = (col - 1) * HEX_WIDTH * 0.75; 
      const y = (row - 1) * HEX_HEIGHT + (col % 2 === 1 ? HEX_HEIGHT / 2 : 0);
      const key = `(${row},${col})`;
      const fillColor = selectedHexes[key] || "none";
      const strokeColor = "rgba(255, 255, 255, 0.5)";

      hexagons.push(
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
            stroke={strokeColor}
            strokeWidth="2"
            fill={fillColor}
            style={{ pointerEvents: "all", cursor: "pointer" }}
          />
          <text x={HEX_RADIUS} y={HEX_HEIGHT / 2} textAnchor="middle" alignmentBaseline="middle" fill="black" fontSize="12">
            {key}
          </text>
        </g>
      );
    }
  }

  return (
    <svg
      width={(COLS * HEX_WIDTH * 0.75) + HEX_RADIUS}
      height={(ROWS * HEX_HEIGHT) + (HEX_HEIGHT / 2)}
      viewBox={`0 0 ${(COLS * HEX_WIDTH * 0.75) + HEX_RADIUS} ${(ROWS * HEX_HEIGHT) + (HEX_HEIGHT / 2)}`}
      style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
    >
      {hexagons}
    </svg>
  );
};

export default HexGrid;
