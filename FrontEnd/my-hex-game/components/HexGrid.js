import React from "react";

const HEX_RADIUS = 40; // ขนาดของหกเหลี่ยม
const COLS = 8; // จำนวนคอลัมน์
const ROWS = 8; // จำนวนแถว
const HEX_WIDTH = 2 * HEX_RADIUS; // ความกว้างของหกเหลี่ยม
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS; // ความสูงของหกเหลี่ยม
const X_OFFSET = HEX_WIDTH * 0.75; // ระยะห่างระหว่างหกเหลี่ยมในแนว X
const Y_OFFSET = HEX_HEIGHT; // ระยะห่างระหว่างหกเหลี่ยมในแนว Y

const HexGrid = () => {
  const hexagons = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      // **Flip Horizontal โดยการคำนวณตำแหน่ง X จากขวาไปซ้าย**
      const x = (COLS - 1 - col) * X_OFFSET;
      const y = row * Y_OFFSET + (col % 2 === 1 ? Y_OFFSET / 2 : 0);

      hexagons.push(
        <polygon
          key={`${row}-${col}`}
          points={`  
            ${HEX_RADIUS * 0.5},0 
            ${HEX_RADIUS * 1.5},0 
            ${HEX_RADIUS * 2},${HEX_HEIGHT / 2} 
            ${HEX_RADIUS * 1.5},${HEX_HEIGHT} 
            ${HEX_RADIUS * 0.5},${HEX_HEIGHT} 
            0,${HEX_HEIGHT / 2}
          `}
          transform={`translate(${x},${y})`}
          stroke="white"
          strokeWidth="2"
          fill="none"
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
