"use client"; // เพิ่มบรรทัดนี้ที่หัวไฟล์

import React, { useState } from "react";
import HexGrid from "../components/HexGrid";
import Coin from "../components/coin";
import Turn from "../components/Turn";  // นำเข้า Turn.tsx

const Page = () => {
  const [greenCoin, setGreenCoin] = useState<number>(2000);  // จำนวนเงินของผู้เล่นสีเขียว
  const [redCoin, setRedCoin] = useState<number>(2000);  // จำนวนเงินของผู้เล่นสีแดง
  const [remainingTurns, setRemainingTurns] = useState<number>(100);  // จำนวนแอคชันที่เหลือ
  const [canAct, setCanAct] = useState<boolean>(true);  // ตรวจสอบว่าแอคชันยังสามารถทำได้หรือไม่
  const [locked, setLocked] = useState<boolean>(false);  // ใช้ล็อกหกเหลี่ยม
  const [currentColor, setCurrentColor] = useState<string>("green");  // ใช้ในการสลับระหว่างสีเขียวและแดง

  // ฟังก์ชันการหักเงิน
  const deductGreenCoin = (amount: number): void => {  // หักเงินจากผู้เล่นสีเขียว
    setGreenCoin(prev => Math.max(0, prev - amount)); // หักเงินสีเขียว
  };

  const deductRedCoin = (amount: number): void => {  // หักเงินจากผู้เล่นสีแดง
    setRedCoin(prev => Math.max(0, prev - amount)); // หักเงินสีแดง
  };

  // ฟังก์ชันสำหรับการทำแอคชัน
  const handleAction = () => {
    if (remainingTurns > 0 && canAct) {
      // หักแอคชันหนึ่งครั้ง
      setRemainingTurns(prev => prev - 1);
      setCanAct(false);  // ปิดการทำแอคชันในรอบนี้
      setLocked(false);  // เปิดให้กดหกเหลี่ยมได้อีกครั้ง
    }
  };

  // ฟังก์ชันสำหรับการสลับสีหกเหลี่ยม
  const toggleHexColor = () => {
    setCurrentColor(currentColor === "green" ? "red" : "green");
  };

  return (
    <div>
      {/* Player 2 - Top Left (Red) */}
      <Coin playerColor="red" initialAmount={redCoin} onAmountChange={deductRedCoin} />
      
      {/* HexGrid */}
      <HexGrid
        deductMoney={deductGreenCoin}
        greenCoin={greenCoin}
        canAct={canAct}  // ส่งค่า canAct ไปที่ HexGrid
        locked={locked}  // ส่งค่า locked ไปที่ HexGrid
        setLocked={setLocked} // ส่ง setLocked ไปที่ HexGrid
        currentColor={currentColor} // ส่งสถานะสีที่กำลังจะถูกเลือก
      />

      {/* Player 1 - Bottom Right (Green) */}
      <Coin playerColor="green" initialAmount={greenCoin} onAmountChange={deductGreenCoin} />

      {/* Turn Button */}
      <Turn
        remainingTurns={remainingTurns}
        onAction={handleAction}
        disabled={remainingTurns <= 0 || !canAct} // Disable button when no turns left or can't act
        toggleColor={toggleHexColor} // เพิ่มฟังก์ชัน toggleColor
      />
    </div>
  );
};

export default Page;
