"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { strategyData } from "../choose-strategy/strategyData";

interface MinionStrategyInformationProps {
  minionId: number;
  onClose: () => void;
}

const MinionStrategyInformation: React.FC<MinionStrategyInformationProps> = ({ minionId, onClose }) => {
  const searchParams = useSearchParams();

  // ✅ ดึง `defenseData` จาก URL
  const defenseDataString = searchParams.get("defenseData") || "";
  const defenseDataArray = defenseDataString
    ? defenseDataString.split(",").map((entry) => {
        const [id, name, defense, strategy] = entry.split(":");
        return { id: Number(id), name: decodeURIComponent(name), defense: Number(defense), strategy };
      })
    : [];

  // ✅ ค้นหา Minion ตาม ID
  const minion = defenseDataArray.find((m) => m.id === minionId);
  if (!minion) return null;

  // ✅ ดึงค่าเพิ่มเติมจาก URL
  const hp = parseInt(searchParams.get("init_hp") || "0");
  const spawnCost = searchParams.get("spawn_cost") || "0";
  const image = `/CardMinion${minion.id}.png`;

  // ✅ ใช้ข้อมูลกลยุทธ์จาก strategyData
  const strategyText = minion.strategy && strategyData[minion.strategy] ? strategyData[minion.strategy] : "No strategy assigned.";

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: "0px",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div
        style={{
          display: "flex",
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "700px",
          width: "100%"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ✅ แสดงการ์ดมินเนี่ยนด้านซ้าย */}
        <div style={{ position: "relative", width: "190px", height: "250px", flexShrink: 0 }}>
          <img src={image} alt={minion.name} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "8px" }} />

          {/* ✅ แสดงค่าต่างๆ บนการ์ด */}
          <div style={{ position: "absolute", top: "8px", left: "60px", color: "#D3FFDC", fontSize: "18px", fontWeight: "bold" }}>
            {spawnCost}
          </div>
          <div style={{ position: "absolute", top: "38px", left: "60px", color: "#D3FFDC", fontSize: "18px", fontWeight: "bold" }}>
            {minion.defense}
          </div>
          <div style={{ position: "absolute", top: "68px", left: "60px", color: "#D3FFDC", fontSize: "18px", fontWeight: "bold" }}>
            {hp}
          </div>
        </div>

        {/* ✅ แสดงข้อมูลกลยุทธ์ */}
        <div style={{ flexGrow: 1, marginLeft: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>{minion.name}</h2>
          <pre
            style={{
              backgroundColor: "#F3F4F6",
              padding: "16px",
              borderRadius: "8px",
              overflowY: "auto",
              maxHeight: "200px",
              fontSize: "14px",
              whiteSpace: "pre-wrap"
            }}
          >
            {strategyText}
          </pre>
        </div>
      </div>

      {/* ✅ ปุ่ม Buy สีดำ */}
      <div style={{ position: "absolute", bottom: "40px" }}>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Buying minion: ${minion.name}`);
          }}
          style={{
            display: "block",
            width: "120px",
            height: "50px",
            background: `url('/BlackBuy.png') no-repeat center/contain`,
            border: "none",
            cursor: "pointer"
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.div>
  );
};

export default MinionStrategyInformation;
