"use client";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [appearFromTop, setAppearFromTop] = useState(false);
  const [topCount, setTopCount] = useState(0);

  // ✅ รีเซ็ตค่า hexConfig ถ้าอยู่ที่หน้า /pageMenu
  useEffect(() => {
    if (pathname === "/pageMenu") {
      localStorage.removeItem("hexConfig");
    }
  }, [pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentCharacter((prev) => (prev + 1) % characters.length);
        let newAppearFromTop = Math.random() < 0.5;
        if (topCount >= 2 && newAppearFromTop) {
          newAppearFromTop = false;
          setTopCount(0);
        } else if (newAppearFromTop) {
          setTopCount(topCount + 1);
        } else {
          setTopCount(0);
        }
        setAppearFromTop(newAppearFromTop);
        setIsVisible(true);
      }, 1000);
    }, 26000);
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
      <img src="/Logo.png" alt="KOMBAT Logo" className="absolute top-8 left-10 w-[1000px] h-auto" />

      <div className="absolute top-[35%] left-10 flex flex-col space-y-6">
        <button
          className="relative w-[300px] h-[80px] bg-[url('/button.png')] bg-no-repeat bg-contain bg-center hover:scale-105 transition-transform"
          onClick={() => router.push("/how-to-duel")}
        >
          <span className="absolute inset-0 flex items-center justify-center text-gray-900 text-3xl font-bold">Duel</span>
        </button>
        <button
          className="relative w-[300px] h-[80px] bg-[url('/button.png')] bg-no-repeat bg-contain bg-center hover:scale-105 transition-transform"
          onClick={() => router.push("/how-to-solitaire")}
        >
          <span className="absolute inset-0 flex items-center justify-center text-gray-900 text-3xl font-bold">Solitaire</span>
        </button>
        <button
          className="relative w-[300px] h-[80px] bg-[url('/button.png')] bg-no-repeat bg-contain bg-center hover:scale-105 transition-transform"
          onClick={() => router.push("/how-to-auto")}
        >
          <span className="absolute inset-0 flex items-center justify-center text-gray-900 text-3xl font-bold">Auto</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentCharacter}
            className="absolute"
            style={{ right: "-50px" }}
            initial={{ y: appearFromTop ? "-110vh" : "110vh" }}
            animate={{ y: appearFromTop ? "-35vh" : "28vh" }}
            exit={{ y: appearFromTop ? "-110vh" : "110vh" }}
            transition={{ duration: 3.5, ease: "easeInOut" }}
          >
            <img
              src={appearFromTop ? characters[currentCharacter].flipped : characters[currentCharacter].normal}
              alt="Animated Character"
              className={appearFromTop ? "w-[350px] h-auto" : "w-[450px] h-auto"}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
