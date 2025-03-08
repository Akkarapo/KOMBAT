"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const LoadingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // สร้าง state สำหรับ countdown (5 วินาที)
  const [countdown, setCountdown] = useState<number>(5);

  // เมื่อเข้าหน้านี้ ให้เริ่มจับเวลา
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ถ้า countdown เหลือ 0 → ไปหน้า /game
  useEffect(() => {
    if (countdown <= 0) {
      // รวม query เดิมไปกับ /game
      router.push(`/game?${searchParams.toString()}`);
    }
  }, [countdown, router, searchParams]);

  // ปุ่มย้อนกลับไปหน้า /configurationPage
  // โดยส่ง query เดิมกลับไปด้วย หรืออ่านจาก localStorage ก็ได้
  const handleBack = () => {
    router.push(`/configurationPage?${searchParams.toString()}`);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#fafafa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        Loading...
      </h1>
      <p style={{ fontSize: "24px" }}>
        Redirecting to game in {countdown} seconds
      </p>

      {/* ปุ่มย้อนกลับซ้ายล่าง */}
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
