"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStrategy } from "../choose-strategy/userStrategyData";

const strategyIcons: Record<string, string> = {
  "Strategy 1": "/Strategy1Icon.png",
  "Strategy 2": "/Strategy2Icon.png",
  "Strategy 3": "/Strategy3Icon.png",
};

const ChooseMinionType: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const countFromURL = parseInt(searchParams.get("count") || localStorage.getItem("minionCount") || "1", 10);
  
  const { minions, setMinionData, getMinionData, lastSelectedMinionId, setLastSelectedMinion } = useUserStrategy();

  const [count, setCount] = useState(countFromURL);
  const [selected, setSelected] = useState<number | null>(lastSelectedMinionId ? lastSelectedMinionId - 1 : 0);
  const [minionData, setMinionDataState] = useState<{ name: string; defense: string; strategy: string }[]>(Array.from({ length: count }, () => ({ name: "", defense: "", strategy: "" })));

  useEffect(() => {
    localStorage.setItem("minionCount", count.toString()); // ✅ บันทึกค่า count
  }, [count]);

  useEffect(() => {
    setMinionDataState(
      Array.from({ length: count }, (_, i) => {
        const savedMinion = getMinionData(i + 1);
        return savedMinion
          ? { name: savedMinion.name, defense: savedMinion.defense, strategy: savedMinion.strategy }
          : { name: "", defense: "", strategy: "" };
      })
    );

    if (lastSelectedMinionId !== null && selected === null) {
      setSelected(lastSelectedMinionId - 1);
    }
  }, [count, minions, lastSelectedMinionId]);

  const handleSelect = (index: number) => {
    setSelected(index);
    setLastSelectedMinion(index + 1);
  };

  const handleConfirm = () => {
    localStorage.setItem("minionCount", count.toString()); // ✅ บันทึกค่าก่อนเปลี่ยนหน้า
    router.push(`/configurationPage?count=${count}`); // ✅ ส่งค่า count ไปด้วย
  };

  const handleGoToMenu = () => {
    router.push("/choose-minions");
  };

  const handleChooseStrategy = () => {
    if (selected !== null) {
      if (!getMinionData(selected + 1)) {
        setMinionData(selected + 1, "", "");
      }
      setLastSelectedMinion(selected + 1);
      router.push(`/choose-strategy?minionId=${selected + 1}&count=${count}`);
    }
  };

  const handleNameChange = (index: number, value: string) => {
    setMinionDataState((prev) =>
      prev.map((item, i) => (i === index ? { ...item, name: value } : item))
    );
    setMinionData(index + 1, value, minionData[index].defense);
  };

  const handleDefenseChange = (index: number, value: string) => {
    setMinionDataState((prev) =>
      prev.map((item, i) => (i === index ? { ...item, defense: value } : item))
    );
    setMinionData(index + 1, minionData[index].name, value);
  };

  return (
    <div className="relative h-screen w-screen bg-cover bg-center bg-no-repeat flex items-center justify-end pr-28"
      style={{ backgroundImage: "url('/backgroundHowTo.png')" }}
    >
      <h1 className="text-white text-6xl font-bold absolute top-16 left-16">Setting minion</h1>

      <div className="absolute bottom-[260px] left-[780px] flex items-center"
        style={{ gap: count === 5 ? "10px" : "20px" }}
      >
        {Array.from({ length: count }, (_, i) => (
          <motion.div key={i} className="flex flex-col items-center">
            <motion.img
              src={selected === i ? `/Minion${i + 1}ButtonChoose.png` : `/Minion${i + 1}Button.png`}
              alt={`Minion ${i + 1}`}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={() => handleSelect(i)}
              className="cursor-pointer object-contain w-32 h-52"
            />
          </motion.div>
        ))}
      </div>

      {selected !== null && (
        <motion.div 
          key={selected}
          className="absolute left-[100px] bottom-[100px] flex flex-col items-start"
          initial={{ x: -500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.img
            src={`/Model0${selected + 1}.png`}
            alt={`Model ${selected + 1}`}
            animate={{ rotateY: 180 }}
            className="object-contain w-[400px] h-[400px]"
          />
        </motion.div>
      )}

      {selected !== null && (
        <motion.div className="absolute left-[800px] bottom-[120px] flex flex-col items-start">
          <motion.img src="/FieldsNamesProtection.png" alt="Minion Fields" className="w-[500px]" />
          <div className="absolute top-[60px] left-[50px] w-[300px]">
            <input
              type="text"
              value={minionData[selected]?.name || ""}
              onChange={(e) => handleNameChange(selected, e.target.value)}
              className="bg-transparent p-2 rounded w-full text-white border border-gray-500 placeholder-white"
              placeholder="Set name the minion"
              style={{ position: "absolute", top: "-52px", left: "20px", width: "415px" }}
            />
            <input
              type="number"
              value={minionData[selected]?.defense || ""}
              onChange={(e) => handleDefenseChange(selected, e.target.value)}
              className="bg-transparent p-2 rounded w-full text-black border border-gray-500 placeholder-gray-500 mt-2"
              placeholder="Set this minion's defense."
              style={{ position: "absolute", top: "2px", left: "20px", width: "415px" }}
            />
          </div>
          <motion.button
            onClick={handleChooseStrategy}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
            className="absolute top-[0px] left-[520px] w-[120px] h-[120px] bg-contain bg-no-repeat"
            style={{
              backgroundImage: `url('${
                minionData[selected]?.strategy ? strategyIcons[minionData[selected]?.strategy] : "/ChooseAstrategy.png"
              }')`,
              zIndex: 50,
            }}
          />
        </motion.div>
      )}

      <motion.button onClick={handleGoToMenu} className="absolute bottom-[20px] left-20 w-[180px] h-[70px] bg-contain bg-no-repeat" style={{ backgroundImage: "url('/BackButton.png')", zIndex: 50 }} />
      <motion.button onClick={handleConfirm} className="absolute bottom-[20px] right-20 w-[180px] h-[70px] bg-contain bg-no-repeat" style={{ backgroundImage: "url('/ConfirmButton.png')", zIndex: 50 }} />
    </div>
  );
};

export default ChooseMinionType;
