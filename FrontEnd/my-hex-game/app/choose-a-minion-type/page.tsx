"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

const ChooseMinionType: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const count = parseInt(searchParams.get('count') || '0', 10);
  const [selected, setSelected] = useState<number | null>(0);
  const [minionData, setMinionData] = useState<{ name: string; defense: string }[]>(
    Array.from({ length: count }, () => ({ name: '', defense: '' }))
  );

  const handleSelect = (index: number) => {
    setSelected(index);
  };

  const handleBack = () => {
    router.push('/choose-minions');
  };

  const handleConfirm = () => {
    router.push('/game');
  };

  const handleNameChange = (index: number, value: string) => {
    setMinionData((prev) => prev.map((item, i) => (i === index ? { ...item, name: value } : item)));
  };

  const handleDefenseChange = (index: number, value: string) => {
    setMinionData((prev) => prev.map((item, i) => (i === index ? { ...item, defense: value } : item)));
  };

  return (
    <div className="relative h-screen w-screen bg-cover bg-center bg-no-repeat bg-[length:110%] flex items-center justify-end pr-28" style={{ backgroundImage: "url('/backgroundHowTo.png')" }}>
      <h1 className="text-white text-6xl font-bold absolute top-16 left-16">Choose a minion type</h1>
      <div className="flex justify-center items-center gap-[-15px] mb-[120px] ml-[780px]">
        {Array.from({ length: count }, (_, i) => (
          <motion.div key={i} className="flex flex-col items-center">
            <motion.img
              src={selected === i ? `/Minion${i + 1}ButtonChoose.png` : `/Minion${i + 1}Button.png`}
              alt={`Minion ${i + 1}`}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={() => handleSelect(i)}
              className="cursor-pointer object-contain w-32 h-52 mx-1"
            />
          </motion.div>
        ))}
      </div>
      {selected !== null && (
        <motion.div className="absolute left-[100px] bottom-[-30px] flex flex-col items-start">
          <motion.img
            src={`/Model0${selected + 1}.png`}
            alt={`Model ${selected + 1}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.5, rotateY: 180 }}
            transition={{ duration: 0.5 }}
            className={`object-contain ${selected === 0 ? 'w-[400px] h-[400px]' 
              : selected === 1 ? 'w-[500px] h-[500px]' 
              : selected === 2 ? 'w-[550px] h-[550px]' 
              : selected === 3 ? 'w-[550px] h-[550px]' 
              : selected === 4 ? 'w-[550px] h-[550px]' : ''}`}
          />
        </motion.div>
      )}
      {selected !== null && (
        <motion.div className="absolute left-[800px] bottom-[180px] flex flex-col items-start">
          <motion.img src="/FieldsNamesProtection.png" alt="Minion Fields" className="w-[400px]" />
          <div className="absolute top-[60px] left-[50px] w-[300px]">
            <input
              type="text"
              value={minionData[selected].name}
              onChange={(e) => handleNameChange(selected, e.target.value)}
              className="bg-transparent p-2 rounded w-full text-white border border-gray-500 placeholder-white"
              placeholder="Set name the minion"
              style={{ position: 'absolute', top: '-45px', left: '20px', width: '310px' }}
            />
            <input
              type="number"
              value={minionData[selected].defense}
              onChange={(e) => handleDefenseChange(selected, e.target.value)}
              className="bg-transparent p-2 rounded w-full text-black border border-gray-500 placeholder-gray-500 mt-2"
              placeholder="Set this minion's defense."
              style={{ position: 'absolute', top: '20px', left: '20px', width: '310px' }}
            />
          </div>
        </motion.div>
      )}
      <motion.button
        onClick={handleBack}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, type: 'spring', stiffness: 200 }}
        className="absolute bottom-8 left-20 w-[180px] h-[70px] bg-contain bg-no-repeat"
        style={{ backgroundImage: "url('/BackButton.png')", marginBottom: '16px', zIndex: 50 }}
      />
      <motion.button
        onClick={handleConfirm}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, type: 'spring', stiffness: 200 }}
        className="absolute bottom-8 right-20 w-[180px] h-[70px] bg-contain bg-no-repeat"
        style={{ backgroundImage: "url('/ConfirmButton.png')", marginBottom: '16px', zIndex: 50 }}
      />
    </div>
  );
};

export default ChooseMinionType;
