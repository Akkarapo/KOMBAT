"use client";

import React from "react";

interface BuyButtonProps {
  onBuy: () => void;
  position: { x: number; y: number };
}

const BuyButton: React.FC<BuyButtonProps> = ({ onBuy, position }) => {
  return (
    <button
      onClick={onBuy}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
        padding: "10px",
        backgroundColor: "#B6696B",
        color: "white",
        borderRadius: "8px",
        zIndex: 10,
      }}
    >
      BUY
    </button>
  );
};

export default BuyButton;
