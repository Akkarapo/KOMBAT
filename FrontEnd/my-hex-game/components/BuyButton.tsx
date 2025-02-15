"use client";

import React from "react";

interface BuyButtonProps {
  onBuy: () => void;
}

const BuyButton: React.FC<BuyButtonProps> = ({ onBuy }) => {
  return (
    <button
      onClick={onBuy}
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        padding: "10px",
        backgroundColor: "#B6696B",
        color: "white",
        borderRadius: "8px"
      }}
    >
      <span style={{ marginRight: "5px" }}>BUY</span>
    </button>
  );
};

export default BuyButton;
