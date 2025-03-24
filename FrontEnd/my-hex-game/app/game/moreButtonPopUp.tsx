"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const MoreButtonPopUp: React.FC = () => {
  const router = useRouter();

  // เปิด/ปิดป๊อปอัพหลัก (More/Close)
  const [isOpen, setIsOpen] = useState(false);
  // เปิด/ปิดสไลด์ Tutorial
  const [showTutorial, setShowTutorial] = useState(false);
  // index ของสไลด์ Tutorial
  const [tutorialIndex, setTutorialIndex] = useState(0);

  // รูป Tutorial 4 รูป
  const tutorialSlides = [
    "/Tutorial1.png",
    "/Tutorial2.png",
    "/Tutorial3.png",
    "/Tutorial4.png",
  ];

  // สลับปุ่ม More/Close
  const togglePopup = () => {
    setIsOpen((prev) => !prev);
    // ถ้าปิดป๊อปอัพหลัก → ปิด tutorial
    if (isOpen) {
      setShowTutorial(false);
      setTutorialIndex(0);
    }
  };

  // เมื่อกดปุ่ม Tutorial
  const handleTutorial = () => {
    setShowTutorial((prev) => !prev);
    setTutorialIndex(0);
  };

  // เมื่อกดปุ่ม Reset The Game
  const handleResetGame = () => {
    setIsOpen(false);
    setShowTutorial(false);
    router.push("/choose-a-minion-type");
  };

  // เมื่อกดปุ่ม Menu
  const handleMenu = () => {
    setIsOpen(false);
    setShowTutorial(false);
    router.push("/pageMenu");
  };

  // คลิกนอกป๊อปอัพหลัก → ปิด
  const handleOverlayClickMain = () => {
    setIsOpen(false);
    setShowTutorial(false);
    setTutorialIndex(0);
  };

  // **ลดขนาดปุ่มอื่นเมื่อ tutorial เปิด** (ย้ำปุ่ม Tutorial)
  const otherButtonsScale = showTutorial ? 0.7 : 1.0;

  // ---------- Tutorial ----------

  // ปุ่มเลื่อนไปสไลด์หน้า
  const handleNextSlide = () => {
    setTutorialIndex((prev) => (prev + 1) % tutorialSlides.length);
  };

  // ปุ่มเลื่อนไปสไลด์ก่อนหน้า
  const handlePrevSlide = () => {
    setTutorialIndex((prev) =>
      prev === 0 ? tutorialSlides.length - 1 : prev - 1
    );
  };

  // ปิด tutorial
  const closeTutorial = () => {
    setShowTutorial(false);
    setTutorialIndex(0);
  };

  return (
    <>
      {/* ปุ่ม More/Close มุมล่างซ้าย */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 50,
        }}
      >
        <motion.button
          onClick={togglePopup}
          style={{
            width: "180px",
            height: "60px",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
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
            {/* Overlay ป๊อปอัพหลัก (30% opacity) */}
            <motion.div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.3)",
                zIndex: 40,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleOverlayClickMain}
            />

            {/* Popup ปุ่มต่าง ๆ */}
            <motion.div
              style={{
                position: "fixed",
                zIndex: 50,
                display: "flex",
                flexDirection: "column",
                bottom: "100px",
                left: "20px",
                opacity: 0,
                y: 20,
              }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* ปุ่ม Tutorial */}
              <motion.button
                onClick={handleTutorial}
                style={{
                  width: "180px",
                  height: "70px",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundImage: "url('/TutorialButton.png')",
                  marginBottom: "-10px",
                  transform: showTutorial ? "scale(1.05)" : "scale(1.0)",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              />

              {/* ปุ่ม Reset The Game */}
              <motion.button
                onClick={handleResetGame}
                style={{
                  width: "180px",
                  height: "70px",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundImage: "url('/ResetTheGameButton.png')",
                  marginBottom: "-10px",
                  transform: `scale(${otherButtonsScale})`,
                  transformOrigin: "left center",
                }}
                whileHover={{ scale: otherButtonsScale * 1.1 }}
                whileTap={{ scale: otherButtonsScale * 0.9 }}
                transition={{ duration: 0.2 }}
              />

              {/* ปุ่ม Menu */}
              <motion.button
                onClick={handleMenu}
                style={{
                  width: "180px",
                  height: "70px",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundImage: "url('/MenuButtonSize36.png')",
                  marginBottom: "-10px",
                  transform: `scale(${otherButtonsScale})`,
                  transformOrigin: "left center",
                }}
                whileHover={{ scale: otherButtonsScale * 1.1 }}
                whileTap={{ scale: otherButtonsScale * 0.9 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---------- Tutorial Overlay (80% opacity, รูปกลางจอ) ---------- */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.8)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            // คลิกตรงไหนก็ได้ (นอกปุ่ม ←, →, Close) => ปิด tutorial
            onClick={closeTutorial}
          >
            {/* Container รูป Tutorial อยู่กลางจอ */}
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* ปุ่ม Close มุมขวาบน */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation(); // ไม่ให้ปิด overlay
                  closeTutorial();
                }}
                style={{
                  position: "absolute",
                  top: "30px",
                  right: "30px",
                  width: "40px",
                  height: "40px",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundImage: "url('/CloseButton.png')",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              />

              {/* รูป Tutorial (ขนาด 600px กว้าง, auto สูง) */}
              <motion.img
                key={tutorialIndex}
                src={tutorialSlides[tutorialIndex]}
                alt={`Tutorial Slide ${tutorialIndex + 1}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{
                  width: "600px",
                  height: "auto",
                  objectFit: "contain",
                }}
              />

              {/* ปุ่มเปลี่ยนสไลด์อยู่ด้านล่างรูป (fix px) */}
              <div
                style={{
                  position: "absolute",
                  top: "700px", // อยู่ใต้รูป (600px + 100px ระยะห่าง)
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "row",
                  gap: "20px",
                }}
              >
                {/* ปุ่ม Prev */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation(); // ไม่ให้ปิด overlay
                    setTutorialIndex((prev) =>
                      prev === 0 ? tutorialSlides.length - 1 : prev - 1
                    );
                  }}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "rgba(255,255,255,0.6)",
                    borderRadius: "50%",
                    fontSize: "44px",
                    fontWeight: "bold",
                    color: "#000",
                    border: "none",
                    cursor: "pointer",
                    // ---- ขยับลูกศร ← ตามต้องการ (px) ----
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingLeft: "6px",
                    paddingBottom: "10px",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ←
                </motion.button>

                {/* ปุ่ม Next */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation(); // ไม่ให้ปิด overlay
                    setTutorialIndex((prev) => (prev + 1) % tutorialSlides.length);
                  }}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "rgba(255,255,255,0.6)",
                    borderRadius: "50%",
                    fontSize: "44px",
                    fontWeight: "bold",
                    color: "#000",
                    border: "none",
                    cursor: "pointer",
                    // ---- ขยับลูกศร → ตามต้องการ (px) ----
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: "6px",
                    paddingBottom: "10px",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  →
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MoreButtonPopUp;
