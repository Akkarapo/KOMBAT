"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

// หากไม่ต้องการไล่สีพื้นหลัง ให้ลบฟังก์ชันนี้ + โค้ด fraction/currentBgColor ออก
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

type Phase = 1 | 2;
// สถานะมินเนี่ยน: 0=ซ่อน, 1=สีขาว, 2=สี
type MinionState = 0 | 1 | 2;

const LoadingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ประกาศ Phase (1=5วิ, 2=3วิ)
  const [phase, setPhase] = useState<Phase>(1);
  // countdown ของ Phase ปัจจุบัน
  const [countdown, setCountdown] = useState(5);

  // ไฟล์รูปสีขาว
  const whiteModels = [
    "/Model01White.png",
    "/Model02White.png",
    "/Model03White.png",
    "/Model04White.png",
    "/Model05White.png",
  ];
  // ไฟล์รูปสี
  const colorModels = [
    "/Model01.png",
    "/Model02.png",
    "/Model03.png",
    "/Model04.png",
    "/Model05.png",
  ];

  // สถานะของมินเนี่ยนทั้ง 5 ตัว (0=ซ่อน, 1=สีขาว, 2=สี)
  const [minionStates, setMinionStates] = useState<MinionState[]>([0, 0, 0, 0, 0]);

  // ฟังก์ชันเปิดตัวมินเนี่ยน (index)
  const revealMinion = (index: number) => {
    // 1) เป็นสีขาว (state=1) → fade in 0.5 วิ
    setMinionStates((prev) => {
      const newArr = [...prev];
      newArr[index] = 1;
      return newArr;
    });
    // 2) หลัง 0.5 วิ → เปลี่ยนเป็นสี (2)
    setTimeout(() => {
      setMinionStates((prev) => {
        const newArr = [...prev];
        newArr[index] = 2;
        return newArr;
      });
    }, 500);
  };

  // ------------------------------
  // Phase 1: 5 วินาที
  // ------------------------------
  useEffect(() => {
    if (phase === 1) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase]);

  // ทุกครั้งที่ countdown เปลี่ยน => เปิดตัวมินเนี่ยน
  useEffect(() => {
    if (phase === 1) {
      switch (countdown) {
        case 4:
          revealMinion(0);
          break;
        case 3:
          revealMinion(1);
          break;
        case 2:
          revealMinion(2);
          break;
        case 1:
          revealMinion(3);
          break;
        case 0:
          revealMinion(4);
          // ยังอยู่ใน Phase 1, เดี๋ยวค่อยสลับไป Phase 2 ด้านล่าง
          break;
        default:
          break;
      }
    }
  }, [phase, countdown]);

  // เมื่อ Phase 1 นับถอยหลังหมด → ไป Phase 2
  useEffect(() => {
    if (phase === 1 && countdown <= 0) {
      setPhase(2);
      setCountdown(3);
    }
  }, [phase, countdown]);

  // ------------------------------
  // Phase 2: 3 วินาที
  // ------------------------------
  useEffect(() => {
    if (phase === 2) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase]);

  // ครบ 3 วิใน Phase 2 => ไปหน้า /game
  useEffect(() => {
    if (phase === 2 && countdown <= 0) {
      router.push(`/game?${searchParams.toString()}`);
    }
  }, [phase, countdown, router, searchParams]);

  // ------------------------------
  // ไล่สีพื้นหลัง (เฉพาะ 5 วิแรก)
  // ------------------------------
  const startColor = "#44499A";
  const endColor = "#466D50";
  const fraction = phase === 1 ? Math.min(1, Math.max(0, (5 - countdown) / 5)) : 1;
  const currentBgColor = interpolateColor(startColor, endColor, fraction);

  // ------------------------------
  // ข้อความ
  // ------------------------------
  const titleText = phase === 1 ? "Loading" : "Game Start";
  const subtitleText =
    phase === 1
      ? `Redirecting to game in ${Math.max(countdown, 0)} seconds`
      : "Winning isn’t everything, but wanting to win is";

  // ------------------------------
  // ตำแหน่ง x ของแต่ละตัว (absolute)
  // ------------------------------
  // ปรับตามต้องการ เช่น ให้ตัวแรก left=0, ตัวสอง left=120, ...
  const positions = [0, 120, 240, 360, 480];

  // ปุ่ม Back
  const handleBack = () => {
    router.push(`/configurationPage?${searchParams.toString()}`);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: currentBgColor,
        transition: "background-color 0.5s linear",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Container หลักสำหรับตัวละคร (position: relative) */}
      <div
        style={{
          flex: 1,
          position: "relative",
          marginTop: "250px", // ขยับลงล่าง
          // กำหนดความกว้าง container = 600px แล้ว margin auto เพื่อให้อยู่กลางหน้าจอ
          width: "600px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* วาดมินเนี่ยนแต่ละตัวด้วย absolute */}
        {minionStates.map((state, i) => {
          let src = "";
          if (state === 1) {
            src = whiteModels[i]; // สีขาว
          } else if (state === 2) {
            src = colorModels[i]; // สี
          }
          const isVisible = state !== 0; // ถ้า 0 => ยังไม่โชว์

          return (
            <motion.img
              key={i}
              src={src}
              alt={`Minion ${i}`}
              style={{
                position: "absolute",
                left: `${positions[i]}px`,
                top: "0px",
                height: "150px",
                width: "auto",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
      </div>

      {/* ข้อความด้านล่าง */}
      <div style={{ textAlign: "center", marginBottom: "80px" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "10px", color: "#fff" }}>
          {titleText}
        </h1>
        <p style={{ fontSize: "24px", color: "#fff" }}>{subtitleText}</p>
      </div>

      {/* ปุ่ม Back (มุมซ้ายล่าง) */}
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
