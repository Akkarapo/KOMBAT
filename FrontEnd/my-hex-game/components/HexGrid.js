'use client';
import React from "react";

const HexGrid = () => {
  const gridSizeX = 8; // ✅ คงไว้ที่ 8 คอลัมน์
  const gridSizeY = 8; // ✅ คงไว้ที่ 8 แถว
  const hexSize = 55; // ✅ ขนาดช่องให้พอดีกับพื้นที่
  const hexWidth = Math.sqrt(3) * hexSize;
  const hexHeight = 2 * hexSize;
  const hexSpacingX = hexWidth;
  const hexSpacingY = hexHeight * 0.75;

  const hexagons = [];
  for (let row = 0; row < gridSizeY; row++) {
    for (let col = 0; col < gridSizeX; col++) {
      const x = col * hexSpacingX + (row % 2 === 1 ? hexSpacingX / 2 : 0);
      const y = row * hexSpacingY + hexSize * 0.5; // ✅ เลื่อนลงมาเล็กน้อยเพื่อให้แถวบนไม่ขาด

      const points = [
        `0,-${hexSize}`,
        `${hexWidth / 2},-${hexSize / 2}`,
        `${hexWidth / 2},${hexSize / 2}`,
        `0,${hexSize}`,
        `-${hexWidth / 2},${hexSize / 2}`,
        `-${hexWidth / 2},-${hexSize / 2}`
      ].join(" ");

      hexagons.push(
        <polygon
          key={`${row}-${col}`}
          points={points}
          transform={`translate(${x},${y})`}
          stroke="white"
          strokeWidth="2"
          fill="transparent"
        />
      );
    }
  }

  return (
    <div className="hex-container">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 -${hexSize * 0.5} ${gridSizeX * hexSpacingX + hexSpacingX / 2} ${gridSizeY * hexSpacingY + hexSize * 1.5}`}
        style={{ transform: "translateX(2%)" }} // ✅ ขยับให้พอดี
      >
        {hexagons}
      </svg>
    </div>
  );
};

export default HexGrid;
