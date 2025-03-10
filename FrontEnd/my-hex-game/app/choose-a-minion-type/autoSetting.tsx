"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface AutoSettingProps {
  // ฟังก์ชันที่ Page.tsx ส่งมาเพื่อให้กดปุ่มแล้วสุ่มค่า + อัปเดต URL
  onAutoFill: () => void;
}

const AutoSetting: React.FC<AutoSettingProps> = ({ onAutoFill }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="absolute bottom-[20px] right-[280px] w-[180px] h-[70px] bg-contain bg-no-repeat"
      style={{
        // ไม่ Hover => AutoSettingHoverButton.png + opacity: 0.2
        // Hover => AutoSettingButton.png + opacity: 1
        backgroundImage: `url(${
          isHovered ? "/AutoSettingButton.png" : "/AutoSettingHoverButton.png"
        })`,
        opacity: isHovered ? 1 : 0.2,
        zIndex: 50,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // เรียกฟังก์ชัน onAutoFill() จาก Page.tsx
      onClick={onAutoFill}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  );
};

export default AutoSetting;
