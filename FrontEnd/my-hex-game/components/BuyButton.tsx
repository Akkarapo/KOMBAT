"use client";

import React from "react";

interface BuyButtonProps {
  onBuy: () => void;
  position: { x: number; y: number };
}

const BuyButton: React.FC<BuyButtonProps> = ({ onBuy, position }) => {
  return (
    <img
      src="/BuyHex.png" // ไฟล์รูปปุ่ม
      alt="Buy"
      onClick={onBuy}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
        width: "auto",
        height: "30px",
        cursor: "pointer",
        objectFit: "contain",
      }}
    />
  );
};

export default BuyButton;
