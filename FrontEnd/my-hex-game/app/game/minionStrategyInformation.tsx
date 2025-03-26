"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

// Import strategyData เพื่อให้มี default code สำหรับ Strategy 1, 2
import { strategyData } from "../choose-strategy/strategyData";

interface MinionStrategyInformationProps {
  minionId: number;
  onClose: () => void;
  hideBuyButton?: boolean;
}

/**
 * parseStrategyAndCode
 * - ถ้า strat มีรูปแบบ "Strategy X||encoded" จะคืน [ "Strategy X", decodeURIComponent(encoded) ]
 * - ถ้า strat เป็น "Strategy X" อย่างเดียว จะคืน [ "Strategy X", strategyData[strat] || "" ]
 */
function parseStrategyAndCode(strat: string): [string, string] {
  if (strat.includes("||")) {
    const [name, encoded] = strat.split("||");
    try {
      return [name.trim(), decodeURIComponent(encoded)];
    } catch (e) {
      // fallback หาก decode ไม่ได้
      return [name.trim(), encoded];
    }
  }
  return [strat, strategyData[strat] || ""];
}

const MinionStrategyInformation: React.FC<MinionStrategyInformationProps> = ({
  minionId,
  onClose,
  hideBuyButton = false,
}) => {
  const searchParams = useSearchParams();

  // ดึงข้อมูลมินเนี่ยนจาก defenseData ใน URL
  const defenseDataString = searchParams.get("defenseData") || "";
  const defenseDataArray = defenseDataString
    ? defenseDataString.split(",").map((entry) => {
        const [id, name, defense, strategy] = entry.split(":");
        return {
          id: Number(id),
          name: decodeURIComponent(name),
          defense: Number(defense),
          strategy,
        };
      })
    : [];

  const minion = defenseDataArray.find((m) => m.id === minionId);
  if (!minion) return null;

  const hp = parseInt(searchParams.get("init_hp") || "0", 10);
  const spawnCost = searchParams.get("spawn_cost") || "0";
  const image = `/CardMinion${minion.id}.png`;

  // ใช้ helper parseStrategyAndCode เพื่อแยกชื่อ strategy และ custom code (ถ้ามี)
  const [strategyName, customCode] = parseStrategyAndCode(minion.strategy);
  // ถ้าเป็น Strategy 3 ให้ใช้ customCode (ถ้ามี) แต่ถ้าไม่มีก็ให้ใช้ข้อความ "No strategy assigned."
  const strategyText =
    strategyName === "Strategy 3"
      ? customCode || "No strategy assigned."
      : strategyData[strategyName] || "No strategy assigned.";

  return (
    <motion.div
      className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-[999]"
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
          padding: 0,
          maxWidth: "1000px",
          width: "auto",
          alignItems: "center",
          gap: "10px",
        }}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        {/* การ์ดมินเนี่ยน */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
            <img
              src={image}
              alt={minion.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
            <div
              style={{
                position: "absolute",
                top: "6px",
                left: "60px",
                color: "#D3FFDC",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {spawnCost}
            </div>
            <div
              style={{
                position: "absolute",
                top: "34px",
                left: "60px",
                color: "#D3FFDC",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {minion.defense}
            </div>
            <div
              style={{
                position: "absolute",
                top: "60px",
                left: "60px",
                color: "#D3FFDC",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {hp}
            </div>
          </div>
          {!hideBuyButton && (
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
          )}
        </div>

        {/* กล่อง Strategy */}
        <div
          style={{
            width: "700px",
            height: "500px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "normal",
              marginBottom: "10px",
              color: "black",
            }}
          >
            Strategy
          </h2>
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "16px",
              borderRadius: "12px",
              overflowY: "auto",
              height: "100%",
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
