import React from "react";

interface TurnProps {
  remainingTurns: number;
  onAction: () => void;
  disabled: boolean;
  toggleColor: () => void; // เพิ่ม toggleColor
}

const Turn: React.FC<TurnProps> = ({ remainingTurns, onAction, disabled, toggleColor }) => {
  return (
    <div style={{ position: "absolute", right: "50px", bottom: "50px" }}>
      <button
        onClick={() => {
          onAction(); // เมื่อกดปุ่มจะทำให้แอคชันลดลง
          toggleColor(); // และจะเปลี่ยนสีหกเหลี่ยม
        }}
        disabled={disabled}  // ปิดการใช้งานปุ่มเมื่อไม่สามารถทำแอคชันได้
        style={{
          padding: "20px",
          borderRadius: "50%",
          fontSize: "18px",
          backgroundColor: "#4CAF50",
          color: "white",
          cursor: "pointer",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <span role="img" aria-label="hourglass">⏳</span> {/* นาฬิกาทราย */}
      </button>
      <div style={{ marginTop: "10px" }}>
        Remaining Turns: {remainingTurns}
      </div>
    </div>
  );
};

export default Turn;
