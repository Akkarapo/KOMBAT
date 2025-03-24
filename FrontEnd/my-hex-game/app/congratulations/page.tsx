"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function CongratulationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // อ่านค่า winner จาก query ?winner=green หรือ ?winner=red
  const winner = searchParams.get("winner");

  // ตั้งค่าข้อความและรูปตาม winner
  let winnerMessage = "The game is a tie";
  let winnerImage = "";
  if (winner === "green") {
    winnerMessage = "The winner is player 1";
    winnerImage = "/Model01GREENhorizontalFlipCrop.png";
  } else if (winner === "red") {
    winnerMessage = "The winner is player 2";
    winnerImage = "/Model01REDhorizontalFlipCrop.png";
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/backgroundMenu.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      {/*
        (1) รูปมินเนี่ยน
          - ติดซ้ายจอ (left: "0px")
          - สามารถปรับ top, left, width, height ตามต้องการ (px)
          - zIndex สูง (999) เพื่อให้อยู่เหนือแทบสีเทา
      */}
      {winnerImage && (
        <motion.img
          src={winnerImage}
          alt="Minion"
          style={{
            position: "absolute",
            top: "29px",
            left: "0px",
            width: "500px",
            height: "auto",
            zIndex: 999,
          }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        />
      )}

      {/*
        (2) ข้อความ "Congratulations" และ "The winner is player X"
            อยู่กึ่งกลางจอ (แนวตั้งและแนวนอน)
      */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "100%",
          zIndex: 1, // อยู่ใต้รูปมินเนี่ยน (ซึ่ง zIndex: 999)
        }}
      >
        {/* ข้อความ Congratulations */}
        <h1
          style={{
            color: "#FFFFFF",
            fontSize: "64px",
            fontWeight: "bold",
            margin: 0,
            padding: 0,
          }}
        >
          Congratulations
        </h1>

        {/*
          (3) แทบสีเทาโปร่งใสเต็มความกว้าง (width: 100vw)
              marginLeft: "calc(50% - 50vw)" เพื่อเลื่อนให้ตรงกึ่งกลาง
              ใช้ display: flex + alignItems/justifyContent เพื่อให้อยู่กึ่งกลางแนวตั้ง-แนวนอน
        */}
        <div
          style={{
            position: "relative",
            margin: "20px 0 0 0",
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            height: "180px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* ★★ ปรับ fontSize ใหญ่ขึ้น เช่น 48px ★★ */}
          <h2
            style={{
              color: "#FFFFFF",
              fontSize: "48px",
              fontWeight: "bold",
              margin: 0,
              padding: 0,
            }}
          >
            {winnerMessage}
          </h2>
        </div>
      </div>

      {/*
        (4) ปุ่ม Menu / Play again
            - อยู่ขวาล่าง (bottom: 50px, right: 50px)
      */}
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          right: "50px",
          display: "flex",
          gap: "20px",
        }}
      >
        {/* ปุ่ม Menu */}
        <motion.button
          onClick={() => router.push("/pageMenu")}
          style={{
            width: "180px",
            height: "70px",
            background: "url('/MenuButton.png') no-repeat center/contain",
            border: "none",
            cursor: "pointer",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />

        {/* ปุ่ม Play again */}
        <motion.button
          onClick={() => router.push("/choose-a-minion-type")}
          style={{
            width: "180px",
            height: "70px",
            background: "url('/PlayAgainButton.png') no-repeat center/contain",
            border: "none",
            cursor: "pointer",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
      </div>
    </div>
  );
}
