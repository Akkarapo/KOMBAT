import React from "react";

interface CoinProps {
  playerColor: string;
  initialAmount: number;
  onAmountChange: (amount: number) => void;
}

const Coin: React.FC<CoinProps> = ({ playerColor, initialAmount, onAmountChange }) => {
  return (
    <div
      style={{
        position: "absolute",
        // กำหนดตำแหน่งของแถบ
        top: playerColor === "green" ? "auto" : "10px", // Player 2 (Red) - Top Left
        bottom: playerColor === "red" ? "auto" : "10px", // Player 1 (Green) - Bottom Right
        left: playerColor === "red" ? "10px" : "auto", // Player 2 (Red) - Top Left
        right: playerColor === "green" ? "10px" : "auto", // Player 1 (Green) - Bottom Right

        // การปรับขนาดและการจัดรูปแบบ
        background: playerColor === "green" ? "#68B671" : "#B6696B",
        color: "white",
        padding: "5px 10px", // ลดขนาด padding
        fontSize: "14px", // ลดขนาดฟอนต์
        borderRadius: "5px",
        fontWeight: "bold",
        minWidth: "100px", // กำหนดความกว้างขั้นต่ำ
        width: "auto", // ทำให้ความกว้างเป็นอัตโนมัติ
        textAlign: "center", // จัดข้อความให้อยู่กลาง
        display: "inline-block", // ทำให้แถบไม่ยืดไปด้านข้าง
      }}
    >
      {playerColor === "green" ? "Player 1 (Green)" : "Player 2 (Red)"} - $
      {initialAmount}
    </div>
  );
};

export default Coin;
