"use client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const characters = [
  { normal: "/Model01.png", flipped: "/Model01F.png" },
  { normal: "/Model02.png", flipped: "/Model02F.png" },
  { normal: "/Model03.png", flipped: "/Model03F.png" },
  { normal: "/Model04.png", flipped: "/Model04F.png" },
  { normal: "/Model05.png", flipped: "/Model05F.png" }
];

export default function GameMenu() {
  const router = useRouter();
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [appearFromTop, setAppearFromTop] = useState(false);
  const [topCount, setTopCount] = useState(0); // นับจำนวนครั้งที่โผล่จากบนติดกัน

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false); // ซ่อนตัวเก่าออกจากจอ

      setTimeout(() => {
        setCurrentCharacter((prev) => (prev + 1) % characters.length);

        let newAppearFromTop = Math.random() < 0.5;

        // ถ้าโผล่จากบนติดกันเกิน 2 ครั้ง ให้ตัวต่อไปโผล่จากล่างเสมอ
        if (topCount >= 2 && newAppearFromTop) {
          newAppearFromTop = false;
          setTopCount(0);
        } else if (newAppearFromTop) {
          setTopCount(topCount + 1);
        } else {
          setTopCount(0);
        }

        setAppearFromTop(newAppearFromTop);
        setIsVisible(true); // แสดงตัวใหม่ทันทีหลังจากตัวเก่าหายไปแค่ 1 วินาที
      }, 1000); // รอแค่ 1 วินาทีก่อนเปลี่ยนตัวใหม่
    }, 26000); // ตั้งเวลาให้ทำซ้ำทุก 26 วินาที

    return () => clearInterval(interval);
  }, [topCount]);

  return (
    <div
      className="relative flex items-center justify-center min-h-screen w-full bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/backgroundMenu.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <h1 className="absolute top-5 left-10 text-[12rem] font-bold leading-none">KOMBAT</h1>

      <div className="absolute top-[35%] left-10 flex flex-col space-y-6">
        <button
          className="relative w-[300px] h-[80px] bg-[url('/button.png')] bg-no-repeat bg-contain bg-center hover:scale-105 transition-transform"
          onClick={() => router.push("/how-to-duel")}
        >
          <span className="absolute inset-0 flex items-center justify-center text-gray-900 text-3xl font-bold">
            Duel
          </span>
        </button>

        <button
          className="relative w-[300px] h-[80px] bg-[url('/button.png')] bg-no-repeat bg-contain bg-center hover:scale-105 transition-transform"
          onClick={() => router.push("/how-to-solitaire")}
        >
          <span className="absolute inset-0 flex items-center justify-center text-gray-900 text-3xl font-bold">
            Solitaire
          </span>
        </button>

        <button
          className="relative w-[300px] h-[80px] bg-[url('/button.png')] bg-no-repeat bg-contain bg-center hover:scale-105 transition-transform"
          onClick={() => router.push("/how-to-auto")}
        >
          <span className="absolute inset-0 flex items-center justify-center text-gray-900 text-3xl font-bold">
            Auto
          </span>
        </button>
      </div>

      {/* ตัวละครสุ่มโผล่ขึ้นมาจากขวาล่าง หรือโผล่ลงมาจากขวาบนแบบห้อยหัว */}
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentCharacter}
            className="absolute"
            style={{
              right: "-50px",
            }}
            initial={{ y: appearFromTop ? "-110vh" : "110vh" }} // ถ้าสุ่มได้ true จะเริ่มจากด้านบน
            animate={{ y: appearFromTop ? "-35vh" : "28vh" }} // ปรับให้โผล่จากบนแค่หัว
            exit={{ y: appearFromTop ? "-110vh" : "110vh" }} // ถ้าจากบนให้เลื่อนกลับขึ้นไป ถ้าจากล่างให้เลื่อนกลับลงไป
            transition={{ duration: 3.5, ease: "easeInOut" }} // เคลื่อนไหวช้าๆ
          >
            <img
              src={appearFromTop ? characters[currentCharacter].flipped : characters[currentCharacter].normal} // ตัวจากบนใช้ flipped, ตัวจากล่างใช้ normal
              alt="Animated Character"
              className={appearFromTop ? "w-[350px] h-auto" : "w-[450px] h-auto"} // ขยายตัวละครที่โผล่จากด้านบน
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
