"use client";

import React from "react";

interface BuyButtonProps {
  onBuy: () => void;
  position: { x: number; y: number };
}

const BuyButton: React.FC<BuyButtonProps> = ({ onBuy, position }) => {
  return (
    <img
      src="/BuyHex.png"
      alt="Buy"
      onClick={onBuy}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)", // ทำให้ปุ่มอยู่ตรงกลาง
        width: "auto", // ป้องกันการบีบของปุ่ม
        height: "30px", // กำหนดความสูงที่เหมาะสม
        cursor: "pointer",
        objectFit: "contain", // ป้องกันการบีบของภาพ
      }}
    />
  );
};

export default BuyButton;
