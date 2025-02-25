"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HexData from "./HexData";
import Image from "next/image";
import imageMapping from "./imageMapping";
import { motion } from "framer-motion";

const backgroundImage = "/backgroundConfiguration.png";

const ConfigurationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const count = searchParams.get("count") || localStorage.getItem("minionCount") || "1"; // ✅ โหลดค่า count

  const initialConfig: { [key in keyof typeof HexData]: string } = Object.keys(HexData).reduce(
    (acc, key) => ({ ...acc, [key]: "" }),
    {} as { [key in keyof typeof HexData]: string }
  );

  const [config, setConfig] = useState(initialConfig);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    const savedConfig = localStorage.getItem("hexConfig");
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []); // ✅ โหลดค่า config ครั้งเดียว

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
    setMissingFields((prev) => prev.filter((field) => field !== name));
  };

  const handleConfirm = () => {
    const emptyFields = Object.keys(config).filter((key) => config[key as keyof typeof config] === "");

    if (emptyFields.length > 0) {
      setMissingFields(emptyFields);
      return;
    }

    localStorage.setItem("hexConfig", JSON.stringify(config));

    // ✅ ส่งค่าทั้ง config และ count ไปที่ /game
    const queryParams = new URLSearchParams({ count, ...config }).toString();
    router.push(`/game?${queryParams}`);
  };

  const handleBack = () => {
    localStorage.setItem("hexConfig", JSON.stringify(config)); // ✅ บันทึก config ก่อนออกจากหน้า
    const savedCount = localStorage.getItem("minionCount") || "1";
    router.push(`/choose-a-minion-type?count=${savedCount}`);
  };

  const keys = Object.keys(HexData);
  const leftFields = keys.slice(0, 5);
  const rightFields = keys.slice(5);

  return (
    <div
      className="relative min-h-screen w-screen flex flex-col items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        paddingTop: "10px",
      }}
    >
      <motion.h1
        className="font-bold mb-8 self-start pl-12"
        style={{ fontSize: "50px", marginTop: "10px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Configuration
      </motion.h1>

      <div className="grid grid-cols-2 w-full" style={{ maxWidth: "1400px", padding: "20px", marginTop: "-40px", marginLeft: "0px", gap: "10px" }}>
        {[leftFields, rightFields].map((fields, colIndex) => (
          <div key={colIndex} className="flex flex-col items-center" style={{ gap: "10px" }}>
            {fields.map((key, index) => (
              <motion.div
                key={key}
                className="relative w-full h-auto flex items-start"
                style={{ minHeight: "97px", maxWidth: "650px" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (colIndex * 5 + index) * 0.1 }}
              >
                <Image
                  src={imageMapping[key] ? imageMapping[key] : "/default.png"}
                  alt={key}
                  width={500}
                  height={140}
                  className="absolute inset-0 w-full h-full opacity-100 object-cover"
                />
                <input
                  type="number"
                  name={key}
                  value={config[key as keyof typeof config]}
                  onChange={handleChange}
                  placeholder={HexData[key as keyof typeof HexData]}
                  className={`border-none outline-none bg-transparent text-black text-left ${
                    missingFields.includes(key) ? "placeholder-red-600" : "placeholder-gray-600"
                  }`}
                  style={{
                    padding: "20px",
                    fontSize: "24px",
                    width: "100%",
                    position: "relative",
                    left: "0px",
                    top: "15px",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                  }}
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      <motion.button onClick={handleBack} className="absolute bottom-[20px] left-20 w-[180px] h-[70px] bg-contain bg-no-repeat" style={{ backgroundImage: "url('/BackButton.png')", zIndex: 50 }} />
      <motion.button onClick={handleConfirm} className="absolute bottom-[20px] right-20 w-[180px] h-[70px] bg-contain bg-no-repeat" style={{ backgroundImage: "url('/ConfirmButton.png')", zIndex: 50 }} />
    </div>
  );
};

export default ConfigurationPage;
