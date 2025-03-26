"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// 1) ประกาศค่า configuration อัตโนมัติที่ต้องการ
const AUTO_CONFIG_VALUES = {
  spawn_cost: "150",
  hex_purchase_cost: "1500",
  init_budget: "15000",
  init_hp: "120",
  turn_budget: "200",
  max_budget: "40000",
  interest_pct: "4",
  max_turns: "40",
  max_spawns: "30",
};

// 2) ประกาศชนิดของ props ที่จะรับเข้ามา
interface AutoConfigButtonProps {
  onSetConfig: (newConfig: typeof AUTO_CONFIG_VALUES) => void; 
  onClearMissingFields: () => void;
}

// 3) สร้างคอมโพเนนต์ปุ่ม AutoConfigButton
const AutoConfigButton: React.FC<AutoConfigButtonProps> = ({
  onSetConfig,
  onClearMissingFields,
}) => {
  // สถานะ hover สำหรับเปลี่ยนภาพและความโปร่งใส (opacity)
  const [isHovered, setIsHovered] = useState(false);

  // ฟังก์ชันเรียกเมื่อกดปุ่ม → เซต config อัตโนมัติ + ล้าง missingFields
  const handleClick = () => {
    onSetConfig(AUTO_CONFIG_VALUES);
    onClearMissingFields();
  };

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute bottom-[20px] right-[280px] w-[180px] h-[70px] bg-contain bg-no-repeat"
      style={{
        backgroundImage: `url(${
          isHovered ? "/AutoConfigButton.png" : "/AutoConfigHoverButton.png"
        })`,
        opacity: isHovered ? 1 : 0.2,
        zIndex: 50,
      }}
    />
  );
};

export default AutoConfigButton;
