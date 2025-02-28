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
      className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "transparent",
          padding: "16px",
          maxWidth: "1000px",
          width: "100%",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        {/* ✅ การ์ดมินเนี่ยนด้านซ้าย */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "10px",
              color: "black",
            }}
          >
            {minion.name}
          </h2>

          <div style={{ position: "relative", width: "190px", height: "250px" }}>
            <img src={image} alt={minion.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />

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

          {/* ✅ ปุ่ม BUY สีดำอยู่ติดด้านล่างการ์ด */}
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
              cursor: "pointer",
              marginTop: "10px",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* ✅ ช่องข้อมูลกลยุทธ์ด้านขวา (ขนาดเท่ากันทุกมินเนี่ยน) */}
        <div
          style={{
            width: "700px", // ✅ กำหนดขนาดให้เท่ากันทุกตัว
            height: "500px",
            display: "flex",
            flexDirection: "column",
            marginLeft: "24px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "normal", marginBottom: "10px", color: "black" }}>Strategy</h2>
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)", // ✅ สีเข้มขึ้นให้มองเห็นชัด
              padding: "16px",
              borderRadius: "12px",
              overflowY: "auto",
              height: "100%", // ✅ ทำให้เต็มขนาดที่กำหนด
              fontSize: "16px",
              whiteSpace: "pre-wrap",
              boxShadow: "inset 0px 0px 8px rgba(0, 0, 0, 0.3)",
              color: "white",
              scrollbarWidth: "thin",
              scrollbarColor: "gray transparent",
            }}
          >
            {strategyText}
          </div>
        </div>
      </motion.div>

      {/* ✅ CSS ปรับแต่ง Scrollbar */}
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: gray;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: darkgray;
        }
      `}</style>
    </motion.div>
  );
};

export default MinionStrategyInformation;
