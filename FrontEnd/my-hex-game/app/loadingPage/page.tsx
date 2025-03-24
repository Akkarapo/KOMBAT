"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ฟังก์ชันไล่สี (คงเดิม)
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

// ประกาศ 3 Phase: 1(5s), 2(3s), 3(2s)
type Phase = 1 | 2 | 3;
type MinionState = 0 | 1 | 2; // 0=ซ่อน, 1=ขาว, 2=สี

const LoadingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // -----------------------------
  // State: phase, countdown, fadeCountdown
  // -----------------------------
  const [phase, setPhase] = useState<Phase>(1);
  const [countdown, setCountdown] = useState(5);   // Phase 1,2
  const [fadeCountdown, setFadeCountdown] = useState(2); // Phase 3

  // ★ เพิ่ม state สำหรับ “เวลา” ใน Phase 1 เพื่อไล่สีสมูท
  const [timePassed, setTimePassed] = useState(0); // มิลลิวินาทีที่ผ่านไปใน Phase 1

  // -----------------------------
  // มินเนี่ยน
  // -----------------------------
  const whiteModels = [
    "/Model01White.png",
    "/Model02White.png",
    "/Model03White.png",
    "/Model04White.png",
    "/Model05White.png",
  ];
  const colorModels = [
    "/Model01.png",
    "/Model02.png",
    "/Model03.png",
    "/Model04.png",
    "/Model05.png",
  ];
  const [minionStates, setMinionStates] = useState<MinionState[]>([0, 0, 0, 0, 0]);

  // เปิดตัวมินเนี่ยนทีละตัว
  const revealMinion = (index: number) => {
    setMinionStates((prev) => {
      const newArr = [...prev];
      newArr[index] = 1; // ขาว
      return newArr;
    });
    setTimeout(() => {
      setMinionStates((prev) => {
        const newArr = [...prev];
        newArr[index] = 2; // สี
        return newArr;
      });
    }, 500);
  };

  // -----------------------------
  // Phase 1: 5 วินาที
  // -----------------------------
  useEffect(() => {
    if (phase === 1) {
      // นับถอยหลัง 1 วินาที (เพื่อเปิดตัวมินเนี่ยนทีละตัว)
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // ★ อัปเดต timePassed ทุก 20ms => fraction ลื่นขึ้น
      const startTime = Date.now();
      const smoothInterval = setInterval(() => {
        const diff = Date.now() - startTime;
        setTimePassed(diff); // มิลลิวินาทีที่ผ่านไป
      }, 20);

      return () => {
        clearInterval(timer);
        clearInterval(smoothInterval);
      };
    }
  }, [phase]);

  // เปิดตัวมินเนี่ยนตาม countdown
  useEffect(() => {
    if (phase === 1) {
      switch (countdown) {
        case 4: revealMinion(0); break;
        case 3: revealMinion(1); break;
        case 2: revealMinion(2); break;
        case 1: revealMinion(3); break;
        case 0: revealMinion(4); break;
        default: break;
      }
    }
  }, [phase, countdown]);

  // หมด Phase 1 => Phase 2
  useEffect(() => {
    if (phase === 1 && countdown <= 0) {
      setPhase(2);
      setCountdown(3);
    }
  }, [phase, countdown]);

  // -----------------------------
  // Phase 2: 3 วินาที
  // -----------------------------
  useEffect(() => {
    if (phase === 2) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase]);

  // หมด Phase 2 => Phase 3
  useEffect(() => {
    if (phase === 2 && countdown <= 0) {
      setPhase(3);
      setFadeCountdown(2);
    }
  }, [phase, countdown]);

  // -----------------------------
  // Phase 3: crossfade -> bg.png + fade out เนื้อหา
  // -----------------------------
  useEffect(() => {
    if (phase === 3) {
      const timer = setInterval(() => {
        setFadeCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase]);

  // หมด fadeCountdown => /game
  useEffect(() => {
    if (phase === 3 && fadeCountdown <= 0) {
      router.push(`/game?${searchParams.toString()}`);
    }
  }, [phase, fadeCountdown, router, searchParams]);

  // -----------------------------
  // ไล่สีพื้นหลัง Phase 1: อิง timePassed
  // -----------------------------
  const startColor = "#A482E1";
  const endColor = "#C0CDA1";
  let fraction = 1;

  if (phase === 1) {
    // ใน 5 วินาที => fraction = timePassed / 5000
    const maxDuration = 5000; // 5 วินาที = 5000 ms
    const smoothFrac = Math.min(1, timePassed / maxDuration);
    fraction = smoothFrac;
  } else if (phase === 2) {
    fraction = 1;
  } else {
    fraction = 1; // phase=3 => 1
  }

  const colorBg = interpolateColor(startColor, endColor, fraction);

  // -----------------------------
  // ข้อความ
  // -----------------------------
  const titleText = phase === 1 ? "Loading" : "Game Start";
  const subtitleText =
    phase === 1
      ? `Redirecting to game in ${Math.max(countdown, 0)} seconds`
      : "Winning isn’t everything, but wanting to win is";

  // ตำแหน่งมินเนี่ยน
  const positions = [0, 120, 240, 360, 480];

  // ปุ่ม Back (ใช้รูป BackButton.png) จะแสดงเฉพาะเมื่อ phase === 1 เท่านั้น
  const handleBack = () => {
    router.push(`/configurationPage?${searchParams.toString()}`);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      {/* พื้นหลังสี (Phase 1/2) */}
      <AnimatePresence>
        {(phase === 1 || phase === 2) && (
          <motion.div
            key="colorBg"
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: colorBg,
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} // crossfade out
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      {/* พื้นหลังรูป (Phase 3) */}
      <AnimatePresence>
        {phase === 3 && (
          <motion.div
            key="bgImage"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/background.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      {/* เนื้อหา (มินเนี่ยน + ข้อความ) => fade out เมื่อ Phase=3 */}
      <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 1 }}>
        <AnimatePresence>
          {phase < 3 && (
            <motion.div
              key="minionsAndText"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} // fade out
              transition={{ duration: 1 }}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              {/* Container มินเนี่ยน */}
              <div
                style={{
                  marginTop: "250px",
                  position: "relative",
                  width: "600px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  height: "200px",
                }}
              >
                {minionStates.map((state, i) => {
                  if (state === 0) return null;
                  const src = state === 1 ? whiteModels[i] : colorModels[i];
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
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  );
                })}
              </div>

              {/* ข้อความ */}
              <div
                style={{
                  marginTop: "150px",
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>{titleText}</h1>
                <p style={{ fontSize: "24px" }}>{subtitleText}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ปุ่ม Back (แสดงเฉพาะเมื่อ phase === 1) */}
        {phase === 1 && (
          <motion.button
            onClick={handleBack}
            className="absolute bottom-[20px] left-[50px] w-[180px] h-[70px] bg-contain bg-no-repeat"
            style={{ backgroundImage: "url('/BackButton.png')", zIndex: 2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    </div>
  );
};

export default LoadingPage;
