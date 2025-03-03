"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { strategyData } from "../choose-strategy/strategyData";

interface MinionStrategyInformationProps {
  minionId: number;
  onClose: () => void;
  hideBuyButton?: boolean;
}

const MinionStrategyInformation: React.FC<MinionStrategyInformationProps> = ({
  minionId,
  onClose,
  hideBuyButton = false,
}) => {
  const searchParams = useSearchParams();

  // ดึงข้อมูลมินเนี่ยน
  const defenseDataString = searchParams.get("defenseData") || "";
  const defenseDataArray = defenseDataString
    ? defenseDataString.split(",").map((entry) => {
        const [id, name, defense, strategy] = entry.split(":");
        return { id: Number(id), name: decodeURIComponent(name), defense: Number(defense), strategy };
      })
    : [];

  const minion = defenseDataArray.find((m) => m.id === minionId);
  if (!minion) return null;

  const hp = parseInt(searchParams.get("init_hp") || "0");
  const spawnCost = searchParams.get("spawn_cost") || "0";
  const image = `/CardMinion${minion.id}.png`;

  const strategyText =
    minion.strategy && strategyData[minion.strategy] ? strategyData[minion.strategy] : "No strategy assigned.";

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
          // ลบ padding เดิมออก
          padding: 0,
          maxWidth: "1000px",
          // เดิมเคย width: "100%" -> ถ้าอยากให้กว้างเต็ม, ยังได้
          // แต่หากกว้างเกินจนเห็นแถบขาว ให้ลดเป็น auto หรือปรับตามต้องการ
          width: "auto",
          alignItems: "center",
          // gap ถ้าต้องการระยะห่างนิดหน่อยระหว่างการ์ดกับกล่อง Strategy
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

            {/* แสดง spawnCost / defense / hp */}
            <div
              style={{
                position: "absolute",
                top: "8px",
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
                top: "38px",
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
                top: "68px",
                left: "60px",
                color: "#D3FFDC",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {hp}
            </div>
          </div>

          {/* ปุ่ม BUY ถ้าไม่ hideBuyButton */}
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
            // ลบ marginLeft ถ้ามี
            // marginLeft: 0,
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

      {/* CSS Scrollbar */}
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
