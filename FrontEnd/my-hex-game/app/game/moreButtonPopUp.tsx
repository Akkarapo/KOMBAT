"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const MoreButtonPopUp: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Toggle More/Close
  const togglePopup = () => {
    setIsOpen((prev) => !prev);
  };

  // ปุ่มต่าง ๆ
  const handleTutorial = () => {
    setIsOpen(false);
    router.push("/tutorial");
  };
  const handleResetGame = () => {
    setIsOpen(false);
    router.push("/choose-a-minion-type");
  };
  const handleMenu = () => {
    setIsOpen(false);
    router.push("/pageMenu");
  };

  // ปิด popup เมื่อคลิกพื้นที่นอก
  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* ปุ่ม More/Close ที่มุมล่างซ้าย */}
      <div className="fixed bottom-[20px] left-[20px] z-50">
        <motion.button
          onClick={togglePopup}
          className="w-[180px] h-[60px] bg-contain bg-no-repeat"
          style={{
            backgroundImage: isOpen
              ? "url('/CloseButton.png')"
              : "url('/MoreButton.png')",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay (ฉากหลัง) คลิกเพื่อปิด Popup */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleOverlayClick}
            />

            {/* Popup ปุ่มต่าง ๆ */}
            <motion.div
              className="fixed z-50 flex flex-col"
              style={{ bottom: "100px", left: "20px" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* ปุ่ม Tutorial */}
              <motion.button
                onClick={handleTutorial}
                className="w-[180px] h-[70px] bg-contain bg-no-repeat"
                style={{
                  backgroundImage: "url('/TutorialButton.png')",
                  marginBottom: "-10px", // ← ปรับ px ได้ตามต้องการ
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              />

              {/* ปุ่ม Reset The Game */}
              <motion.button
                onClick={handleResetGame}
                className="w-[180px] h-[70px] bg-contain bg-no-repeat"
                style={{
                  backgroundImage: "url('/ResetTheGameButton.png')",
                  marginBottom: "-10px", // ← ปรับ px ได้ตามต้องการ
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              />

              {/* ปุ่ม Menu */}
              <motion.button
                onClick={handleMenu}
                className="w-[180px] h-[70px] bg-contain bg-no-repeat"
                style={{
                  backgroundImage: "url('/MenuButtonSize36.png')",
                  // ถ้าไม่อยากให้ปุ่มสุดท้ายมี marginBottom
                  // สามารถกำหนด 0px หรือไม่ใส่เลยก็ได้
                  marginBottom: "-10px",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MoreButtonPopUp;
