"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

// ฟังก์ชันไล่สีพื้นหลัง (เหมือนตัวอย่างก่อนหน้า)
function interpolateColor(start: string, end: string, fraction: number) {
  const parseHex = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const [r1, g1, b1] = parseHex(start);
  const [r2, g2, b2] = parseHex(end);

  const r = Math.round(r1 + (r2 - r1) * fraction);
  const g = Math.round(g1 + (g2 - g1) * fraction);
  const b = Math.round(b1 + (b2 - b1) * fraction);

  return `rgb(${r}, ${g}, ${b})`;
}

const LoadingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ตั้งค่า countdown 5 วินาที
  const [countdown, setCountdown] = useState(5);

  // ใช้ step เพื่อควบคุมการเฟดรูปทีละตัว
  const [step, setStep] = useState(0);

  // สีต้นทาง / สีปลายทาง
  const startColor = "#44499A";
  const endColor = "#466D50";

  // รูปตัวละคร Model01White - Model05White
  const models = [
    "/Model01White.png",
    "/Model02White.png",
    "/Model03White.png",
    "/Model04White.png",
    "/Model05White.png",
  ];

  // นับถอยหลังและเพิ่ม step ทุก 1 วินาที
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
      setStep((prev) => Math.min(prev + 1, models.length));
    }, 1000);

    return () => clearInterval(timer);
  }, [models.length]);

  // เมื่อ countdown <= 0 → ไปหน้า /game
  useEffect(() => {
    if (countdown <= 0) {
      router.push(`/game?${searchParams.toString()}`);
    }
  }, [countdown, router, searchParams]);

  // fraction สำหรับไล่สีพื้นหลัง
  const fraction = Math.min(1, Math.max(0, (5 - countdown) / 5));
  const currentBgColor = interpolateColor(startColor, endColor, fraction);

  // ปุ่ม Back กลับไป /configurationPage
  const handleBack = () => {
    router.push(`/configurationPage?${searchParams.toString()}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        backgroundColor: currentBgColor,
        transition: "background-color 0.5s linear",
        position: "relative",
      }}
    >
      {/* โซนแสดงตัวละคร (flex: 1) → จัดให้อยู่กึ่งกลาง */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* แถวรูปตัวละคร */}
        <div style={{ display: "flex", gap: "20px" }}>
          {models.map((src, index) => (
            <motion.img
              key={index}
              src={src}
              alt={`Model0${index + 1}White`}
              style={{
                height: "150px", // กำหนดความสูง
                width: "auto",   // คงอัตราส่วนรูป ไม่บีบ/ยืด
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: step > index ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            />
          ))}
        </div>
      </div>

      {/* โซนข้อความ Loading ช่วงล่าง */}
      <div style={{ textAlign: "center", marginBottom: "80px" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "10px", color: "#fff" }}>
          Loading
        </h1>
        <p style={{ fontSize: "24px", color: "#fff" }}>
          Redirecting to game in {countdown} seconds
        </p>
      </div>

      {/* ปุ่ม Back มุมซ้ายล่าง */}
      <button
        onClick={handleBack}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Back
      </button>
    </div>
  );
};

export default LoadingPage;
