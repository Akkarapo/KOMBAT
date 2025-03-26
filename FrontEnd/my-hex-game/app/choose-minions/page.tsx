"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const ChooseMinionsPage: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (num: number) => {
    setSelected(num === selected ? null : num);
  };

  const handleBack = () => {
    router.push('/how-to-solitaire');
  };

  const handleHome = () => {
    router.push('/pageMenu');
  };

  const handleConfirm = () => {
    if (selected !== null) {
      router.push(`/choose-a-minion-type?count=${selected}`);
    }
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center bg-no-repeat bg-[length:110%]"
      style={{ backgroundImage: "url('/backgroundHowTo.png')" }}
    >
      <h1 className="text-white text-7xl font-bold absolute top-16 left-16">Minion</h1>
      <p className="text-white text-3xl absolute top-36 left-16">
        Minion types that can be placed during the game
      </p>

      <div className="flex justify-center items-center h-full space-x-12">
        {[1, 2, 3, 4, 5].map((num, index) => (
          <motion.div
            key={num}
            onClick={() => handleSelect(num)}
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              y: 0,
              scale:
                selected === num
                  ? 1.2
                  : selected !== null && selected !== num
                  ? 0.8
                  : 1.0,
            }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={selected === num ? {} : { scale: 1.1 }}
            className={`w-52 h-72 flex items-center justify-center rounded-3xl cursor-pointer transition-all ${
              selected === num
                ? 'border-4 border-white bg-opacity-60 bg-white'
                : selected !== null && selected !== num
                ? 'opacity-50 bg-opacity-60 bg-white'
                : 'bg-opacity-60 bg-white'
            }`}
          >
            <span className="text-9xl font-bold text-gray-800">{num}</span>
          </motion.div>
        ))}
      </div>

      {/* ปุ่ม Back */}
      <motion.button
        onClick={handleBack}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-8 left-20 w-[180px] h-[70px] bg-contain bg-no-repeat"
        style={{
          backgroundImage: "url('/BackButton.png')",
          marginBottom: '16px',
          zIndex: 50,
        }}
      />

      {/* ปุ่ม Home (อยู่ถัดจาก Back) */}
      <motion.button
      onClick={handleHome}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-[55px] left-[270px] w-[180px] h-[45px] bg-contain bg-no-repeat"
      style={{
        backgroundImage: "url('/HomeButton.png')",
        marginBottom: '16px',
        zIndex: 50,
      }}
    />

      {/* ✅ ปุ่ม Confirm */}
      {selected !== null && (
        <motion.button
          onClick={handleConfirm}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-8 right-20 w-[180px] h-[70px] bg-contain bg-no-repeat"
          style={{
            backgroundImage: "url('/ConfirmButton.png')",
            marginBottom: '16px',
            zIndex: 50,
          }}
        />
      )}
    </div>
  );
};

export default ChooseMinionsPage;
