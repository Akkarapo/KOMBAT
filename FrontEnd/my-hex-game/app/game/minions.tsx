"use client";
import React from "react";

export interface PurchasedMinion {
  minionId: number;
  name?: string;
}

interface MinionsProps {
  playerColor: "red" | "green";
  minions: PurchasedMinion[];
  onMinionClick?: (minion: PurchasedMinion) => void;
}

const Minions: React.FC<MinionsProps> = ({ playerColor, minions, onMinionClick }) => {
  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {minions.map((minion, index) => {
        // ใช้ minion.minionId แทน minion.id
        const modelStr = minion.minionId.toString().padStart(2, "0");
        const imageSrc = `/Model${modelStr}${playerColor.toUpperCase()}.png`;

        return (
          <div
            key={index}
            style={{ width: "180px", height: "240px", position: "relative" }}
            onClick={() => onMinionClick?.(minion)}
          >
            <img
              src={imageSrc}
              alt={minion.name || `Minion Model ${minion.minionId}`}
              style={{
                width: "150%",
                height: "150%",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Minions;
