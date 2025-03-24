"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import AutoSetting from "./autoSetting";

// ไอคอนสำหรับกลยุทธ์ (รวม Strategy 3)
const strategyIcons: Record<string, string> = {
  "Strategy 1": "/Strategy1Icon.png",
  "Strategy 2": "/Strategy2Icon.png",
  "Strategy 3": "/Strategy3Icon.png",
};

/**
 * ถ้า strategy string มีรูปแบบ "Strategy X||encoded" ให้คืนเฉพาะชื่อ "Strategy X"
 */
function parseStrategyName(fullStr: string): string {
  if (fullStr.includes("||")) {
    const [name] = fullStr.split("||");
    return name.trim();
  }
  return fullStr;
}

const autoDefense: Record<number, number[]> = {
  1: [50],
  2: [30, 70],
  3: [10, 50, 40],
  4: [5, 40, 50, 55],
  5: [0, 30, 40, 45, 35],
};

const autoNames: Record<number, string[]> = {
  1: ["Minion 1"],
  2: ["Minion 1", "Minion 2"],
  3: ["Minion 1", "Minion 2", "Minion 3"],
  4: ["Minion 1", "Minion 2", "Minion 3", "Minion 4"],
  5: ["Minion 1", "Minion 2", "Minion 3", "Minion 4", "Minion 5"],
};

const allStrategies = ["Strategy 1", "Strategy 2"];

const ChooseMinionType: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ดึงค่า count จาก URL หรือ localStorage
  const [count, setCount] = useState<number>(() => {
    const fromQuery = searchParams.get("count");
    if (fromQuery) return parseInt(fromQuery, 10);
    const fromStorage = localStorage.getItem("minionCount");
    if (fromStorage) return parseInt(fromStorage, 10);
    return 1;
  });

  // state เก็บข้อมูล minionData: name, defense, strategy
  const [minionData, setMinionData] = useState<
    { name: string; defense: string; strategy: string }[]
  >(
    Array.from({ length: count }, () => ({
      name: "",
      defense: "",
      strategy: "",
    }))
  );

  // state เก็บ index ของมินเนี่ยนที่เลือก
  const [selected, setSelected] = useState<number>(0);

  // เมื่อ count เปลี่ยน ให้บันทึกลง localStorage
  useEffect(() => {
    localStorage.setItem("minionCount", count.toString());
  }, [count]);

  // useEffect สำหรับ sync state กับ URL defenseData
  useEffect(() => {
    const fromQuery = searchParams.get("defenseData");
    if (fromQuery) {
      const parts = fromQuery.split(",");
      const newData: { name: string; defense: string; strategy: string }[] = [];
      for (let i = 0; i < parts.length; i++) {
        const [idxStr, nameEncoded, defense, strategy] = parts[i].split(":");
        newData.push({
          name: decodeURIComponent(nameEncoded),
          defense,
          strategy, // อาจเป็น "Strategy 1" หรือ "Strategy 3||encoded" เป็นต้น
        });
      }
      setMinionData(newData);
    }
  }, [searchParams]);

  // ฟังก์ชันเลือกมินเนี่ยน
  const handleSelect = (index: number) => {
    setSelected(index);
  };

  // ฟังก์ชันแก้ไขชื่อมินเนี่ยน
  const handleNameChange = (index: number, value: string) => {
    setMinionData((prev) =>
      prev.map((m, i) => (i === index ? { ...m, name: value } : m))
    );
  };

  // ฟังก์ชันแก้ไข defense
  const handleDefenseChange = (index: number, value: string) => {
    setMinionData((prev) =>
      prev.map((m, i) => (i === index ? { ...m, defense: value } : m))
    );
  };

  // ฟังก์ชัน AutoSetting
  const handleAutoFill = () => {
    if (!autoDefense[count] || !autoNames[count]) return;
    const newData = [...minionData];
    autoDefense[count].forEach((def, i) => {
      const name = autoNames[count][i];
      const randomStrategy =
        allStrategies[Math.floor(Math.random() * allStrategies.length)];
      newData[i] = {
        name,
        defense: def.toString(),
        strategy: randomStrategy,
      };
    });
    setMinionData(newData);

    // อัปเดต query string ใน URL
    const defenseData = newData
      .map(
        (m, i) =>
          `${i + 1}:${encodeURIComponent(m.name)}:${m.defense}:${m.strategy}`
      )
      .join(",");
    const params = new URLSearchParams();
    params.set("count", count.toString());
    params.set("defenseData", defenseData);
    router.replace(`?${params.toString()}`);
  };

  // ฟังก์ชัน Confirm: ตรวจสอบข้อมูล แล้วส่งไปหน้า configurationPage
  const handleConfirm = () => {
    const incompleteIndex = minionData.findIndex(
      (m) => !m.name.trim() || !m.defense.trim() || !m.strategy.trim()
    );
    if (incompleteIndex !== -1) {
      setSelected(incompleteIndex);
      return;
    }
    const defenseData = minionData
      .map(
        (m, i) =>
          `${i + 1}:${encodeURIComponent(m.name)}:${m.defense}:${m.strategy}`
      )
      .join(",");
    router.push(`/configurationPage?count=${count}&defenseData=${defenseData}`);
  };

  // ปุ่ม Back
  const handleGoToMenu = () => {
    router.push("/choose-minions");
  };

  // ปุ่ม Home
  const handleHome = () => {
    router.push("/pageMenu");
  };

  // ปุ่ม Choose Strategy: ส่งข้อมูลปัจจุบัน (defenseData, count, minionId) ไปหน้า choose-strategy
  const handleChooseStrategy = () => {
    const minionIndex = selected + 1;
    const defenseData = minionData
      .map(
        (m, i) =>
          `${i + 1}:${encodeURIComponent(m.name)}:${m.defense}:${m.strategy}`
      )
      .join(",");
    router.push(
      `/choose-strategy?count=${count}&minionId=${minionIndex}&defenseData=${defenseData}`
    );
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center bg-no-repeat flex items-center justify-end pr-28"
      style={{ backgroundImage: "url('/backgroundHowTo.png')" }}
    >
      <h1 className="text-white text-6xl font-bold absolute top-16 left-16">
        Setting minion
      </h1>

      {/* ปุ่มมินเนี่ยน */}
      <div
        className="absolute bottom-[260px] left-[780px] flex items-center"
        style={{ gap: count === 5 ? "10px" : "20px" }}
      >
        {Array.from({ length: count }, (_, i) => (
          <motion.div key={i} className="flex flex-col items-center">
            <motion.img
              src={
                selected === i
                  ? `/Minion${i + 1}ButtonChoose.png`
                  : `/Minion${i + 1}Button.png`
              }
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

      {/* ภาพ Model ของมินเนี่ยนที่เลือก */}
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
            className="object-contain w-[500px] h-[500px]"
          />
        </motion.div>
      )}

      {/* ช่องกรอกข้อมูล Name / Defense / Strategy */}
      {selected !== null && (
        <motion.div className="absolute left-[800px] bottom-[120px] flex flex-col items-start">
          <motion.img
            src="/FieldsNamesProtection.png"
            alt="Minion Fields"
            className="w-[500px]"
          />
          <div className="absolute top-[60px] left-[50px] w-[300px]">
            <input
              type="text"
              value={minionData[selected]?.name || ""}
              onChange={(e) => handleNameChange(selected, e.target.value)}
              className="bg-transparent p-2 rounded w-full text-white border border-gray-500 placeholder-white"
              placeholder="Set name the minion"
              style={{
                position: "absolute",
                top: "-52px",
                left: "20px",
                width: "415px",
              }}
            />
            <input
              type="number"
              value={minionData[selected]?.defense || ""}
              onChange={(e) => handleDefenseChange(selected, e.target.value)}
              className="bg-transparent p-2 rounded w-full text-black border border-gray-500 placeholder-gray-500 mt-2"
              placeholder="Set this minion's defense."
              style={{
                position: "absolute",
                top: "2px",
                left: "20px",
                width: "415px",
              }}
            />
          </div>

          {/* ปุ่ม Choose Strategy */}
          <motion.button
            onClick={handleChooseStrategy}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
            className="absolute top-[0px] left-[520px] w-[120px] h-[120px] bg-contain bg-no-repeat"
            style={{
              backgroundImage: `url("${
                strategyIcons[parseStrategyName(minionData[selected]?.strategy)] ||
                "/ChooseAstrategy.png"
              }")`,
              zIndex: 50,
            }}
          />
        </motion.div>
      )}

      {/* ปุ่ม Back */}
      <motion.button
        onClick={handleGoToMenu}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute bottom-[20px] left-20 w-[180px] h-[70px] bg-contain bg-no-repeat"
        style={{ backgroundImage: "url('/BackButton.png')", zIndex: 50 }}
      />

      {/* ปุ่ม Home */}
      <motion.button
        onClick={handleHome}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute bottom-[45px] left-[270px] w-[180px] h-[45px] bg-contain bg-no-repeat"
        style={{ backgroundImage: "url('/HomeButton.png')", zIndex: 50 }}
      />

      {/* ปุ่ม AutoSetting */}
      <AutoSetting onAutoFill={handleAutoFill} />

      {/* ปุ่ม Confirm */}
      <motion.button
        onClick={handleConfirm}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute bottom-[20px] right-20 w-[180px] h-[70px] bg-contain bg-no-repeat"
        style={{ backgroundImage: "url('/ConfirmButton.png')", zIndex: 50 }}
      />
    </div>
  );
};

export default ChooseMinionType;
