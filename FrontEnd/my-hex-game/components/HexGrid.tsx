"use client";

import React, { useState, useEffect } from "react";
import BuyButton from "../components/BuyButton"; // ปุ่ม Buy สีดำ
import { GreenHexData } from "./dataGreen";     // interface GreenHexData { key: string; minions: ... }
import { RedHexData } from "./dataRed";         // interface RedHexData   { key: string; minions: ... }

const HEX_RADIUS = 40;
const COLS = 8;
const ROWS = 8;
const HEX_WIDTH = 2 * HEX_RADIUS;
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS;

interface PotentialHex {
  color: string;
  fadingOut: boolean;
}

interface HexGridProps {
  hexPurchaseCost: number;                       // ราคาซื้อพื้นที่
  deductMoney: (amount: number) => void;         // ฟังก์ชันหักเงิน
  greenCoin: number;                             // เงินของฝั่งเขียว
  redCoin: number;                               // เงินของฝั่งแดง
  canAct: boolean;                               // สถานะว่าทำ Action ได้หรือไม่
  locked: boolean;                               // ถ้า true จะไม่ให้ซื้อพื้นที่เพิ่ม
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
  currentColor: "green" | "red";                 // สีผู้เล่นปัจจุบัน

  // พื้นที่ของแต่ละฝั่ง (object array มี key, minions)
  greenHexes: GreenHexData[];
  redHexes: RedHexData[];

  // setter อัปเดตพื้นที่ของแต่ละฝั่ง
  setGreenHexes: React.Dispatch<React.SetStateAction<GreenHexData[]>>;
  setRedHexes: React.Dispatch<React.SetStateAction<RedHexData[]>>;

  maxSpawns: number;                             // จำนวนพื้นที่สูงสุดที่ซื้อเพิ่มได้

  // ✅ callback เรียกเมื่อคลิก Hex ที่เป็นสีของเรา
  onOwnedHexClick?: (hexKey: string) => void;
}

const HexGrid: React.FC<HexGridProps> = ({
  hexPurchaseCost,
  deductMoney,
  greenCoin,
  redCoin,
  canAct,
  locked,
  setLocked,
  currentColor,
  greenHexes,
  redHexes,
  setGreenHexes,
  setRedHexes,
  maxSpawns,
  onOwnedHexClick,
}) => {
  // Map: hexKey => สี (เขียว/แดง)
  const [ownedHexes, setOwnedHexes] = useState<Record<string, string>>({});
  // Potential hexes (สีเหลือง/ส้ม) ที่สามารถซื้อได้
  const [potentialHexes, setPotentialHexes] = useState<Record<string, PotentialHex>>({});

  // สำหรับปุ่ม BUY สีดำ (ซื้อพื้นที่)
  const [pendingHex, setPendingHex] = useState<string | null>(null);
  const [buyButtonPosition, setBuyButtonPosition] = useState<{ x: number; y: number } | null>(null);

  // ------------------------------
  // 1) อัปเดต ownedHexes เมื่อ greenHexes / redHexes เปลี่ยน
  // ------------------------------
  useEffect(() => {
    const greenMap: Record<string, string> = {};
    greenHexes.forEach((hexData) => {
      greenMap[hexData.key] = "#68B671"; // สีช่องของ green
    });

    const redMap: Record<string, string> = {};
    redHexes.forEach((hexData) => {
      redMap[hexData.key] = "#B6696B";   // สีช่องของ red
    });

    setOwnedHexes({ ...greenMap, ...redMap });
  }, [greenHexes, redHexes]);

  // ------------------------------
  // 2) จัดการ potentialHexes (สีเหลือง/ส้ม) ตาม currentColor, locked, ฯลฯ
  // ------------------------------
  useEffect(() => {
    // ฟังก์ชัน fadeOut potentialHex ทั้งหมด
    const fadeOutAll = () => {
      setPotentialHexes((prev) => {
        const updated: Record<string, PotentialHex> = {};
        for (const k in prev) {
          updated[k] = { ...prev[k], fadingOut: true };
        }
        return updated;
      });
      setTimeout(() => {
        setPotentialHexes({});
      }, 500);
    };

    // เช็คจำนวนพื้นที่ที่ซื้อเพิ่มเติมไปแล้ว
    const greenAdditional = greenHexes.filter((h) => !isInInitialGreen(h.key));
    const redAdditional = redHexes.filter((h) => !isInInitialRed(h.key));
    const canStillBuy =
      currentColor === "green"
        ? greenAdditional.length < maxSpawns
        : redAdditional.length < maxSpawns;

    if (!locked && canStillBuy) {
      // ยังซื้อได้ + ไม่ล็อก => แสดง potential
      setPotentialHexes({});
      const adj = calculateAdjacentHexes(ownedHexes, currentColor);
      const keys = Object.keys(adj);
      const timeouts: NodeJS.Timeout[] = [];

      keys.forEach((k, index) => {
        const t = setTimeout(() => {
          setPotentialHexes((prev) => ({
            ...prev,
            [k]: { color: adj[k], fadingOut: false },
          }));
        }, index * 200);
        timeouts.push(t);
      });

      return () => {
        timeouts.forEach((tt) => clearTimeout(tt));
      };
    } else {
      // ถ้าล็อก หรือซื้อครบแล้ว => fade out potential
      fadeOutAll();
    }
  }, [ownedHexes, currentColor, locked, greenHexes, redHexes, maxSpawns]);

  // ------------------------------
  // 3) เมื่อเปลี่ยน currentColor => เคลียร์ปุ่ม BUY
  // ------------------------------
  useEffect(() => {
    setPendingHex(null);
    setBuyButtonPosition(null);
  }, [currentColor]);

  // ------------------------------
  // ฟังก์ชันคำนวณ adjacency (หาว่า hex ไหนบ้างเป็น potential)
  // ------------------------------
  const calculateAdjacentHexes = (
    currentHexMap: Record<string, string>,
    turnColor: "green" | "red"
  ) => {
    const adjacent: Record<string, string> = {};
    for (const hexKey in currentHexMap) {
      const color = currentHexMap[hexKey];
      if (color !== "#68B671" && color !== "#B6696B") continue;

      // ดึง row, col จากรูปแบบ "(row,col)"
      const match = hexKey.match(/\((\d+),(\d+)\)/);
      if (!match) continue;
      const row = parseInt(match[1], 10);
      const col = parseInt(match[2], 10);

      const isGreen = color === "#68B671";
      // ถ้าเทิร์นเขียว -> ตรวจเฉพาะช่องเขียว
      // ถ้าเทิร์นแดง -> ตรวจเฉพาะช่องแดง
      if ((turnColor === "green" && isGreen) || (turnColor === "red" && !isGreen)) {
        const adjacentColor = isGreen ? "#F4D03F" : "#FFA07A";
        // col%2 แยก even/odd
        const directions =
          col % 2 === 0
            ? [
                [-1, 0],
                [-1, 1],
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, -1],
              ]
            : [
                [-1, 0],
                [0, 1],
                [1, 1],
                [1, 0],
                [1, -1],
                [0, -1],
              ];
        directions.forEach(([dr, dc]) => {
          const r2 = row + dr;
          const c2 = col + dc;
          const newKey = `(${r2},${c2})`;
          if (
            r2 > 0 &&
            r2 <= ROWS &&
            c2 > 0 &&
            c2 <= COLS &&
            !(newKey in currentHexMap)
          ) {
            adjacent[newKey] = adjacentColor;
          }
        });
      }
    }
    return adjacent;
  };

  // ------------------------------
  // ฟังก์ชันเช็คว่า key อยู่ใน initialGreen / initialRed
  // ------------------------------
  const isInInitialGreen = (key: string): boolean => {
    const initKeys = ["(1,1)", "(1,2)", "(2,1)", "(2,2)", "(1,3)"];
    return initKeys.includes(key);
  };
  const isInInitialRed = (key: string): boolean => {
    const initKeys = ["(7,7)", "(7,8)", "(8,6)", "(8,7)", "(8,8)"];
    return initKeys.includes(key);
  };

  // ------------------------------
  // 4) เมื่อคลิกพื้นที่
  // ------------------------------
  const handleHexClick = (row: number, col: number) => {
    if (!canAct || locked) return;
    const key = `(${row},${col})`;

    // รวม owned + potential
    const merged: Record<string, string> = { ...ownedHexes };
    for (const k in potentialHexes) {
      merged[k] = potentialHexes[k].color;
    }
    if (!(key in merged)) return; // ถ้าไม่อยู่ใน owned/potential -> ไม่ทำอะไร

    const colorClicked = merged[key];
    if (currentColor === "green") {
      // ถ้าคลิก hex สีเขียว => เปิด popup เลือกมินเนี่ยน (ผ่าน callback)
      if (colorClicked === "#68B671") {
        onOwnedHexClick?.(key);
        return;
      }
      // ถ้าคลิก hex สีเหลือง => ซื้อพื้นที่
      if (colorClicked === "#F4D03F") {
        showOrToggleBuyButton(key);
        return;
      }
    }
    if (currentColor === "red") {
      // ถ้าคลิก hex สีแดง => เปิด popup เลือกมินเนี่ยน
      if (colorClicked === "#B6696B") {
        onOwnedHexClick?.(key);
        return;
      }
      // ถ้าคลิก hex สีส้ม => ซื้อพื้นที่
      if (colorClicked === "#FFA07A") {
        showOrToggleBuyButton(key);
        return;
      }
    }
  };

  // ------------------------------
  // 5) แสดง/ซ่อนปุ่ม BUY (สำหรับซื้อพื้นที่)
  // ------------------------------
  const showOrToggleBuyButton = (hexKey: string) => {
    if (pendingHex === hexKey) {
      setPendingHex(null);
      setBuyButtonPosition(null);
      return;
    }
    setPendingHex(hexKey);

    // คำนวณตำแหน่งปุ่ม BUY
    const match = hexKey.match(/\((\d+),(\d+)\)/);
    if (!match) return;
    const row = parseInt(match[1], 10);
    const col = parseInt(match[2], 10);

    const xOffset = -20;
    const yOffset = 5;
    const x = col * HEX_WIDTH * 0.75 + xOffset;
    const y = row * HEX_HEIGHT + (col % 2 === 1 ? HEX_HEIGHT / 2 : 0) + yOffset;
    setBuyButtonPosition({ x, y });
  };

  // ------------------------------
  // 6) เมื่อกด BUY (ซื้อพื้นที่)
  // ------------------------------
  const handleBuy = () => {
    if (!pendingHex) return;

    // เช็คจำนวนพื้นที่ที่ซื้อไปแล้ว
    const greenAdditional = greenHexes.filter((h) => !isInInitialGreen(h.key));
    const redAdditional = redHexes.filter((h) => !isInInitialRed(h.key));
    if (currentColor === "green") {
      if (greenAdditional.length >= maxSpawns) return;
      setGreenHexes((prev) => [...prev, { key: pendingHex, minions: [] }]);
    } else {
      if (redAdditional.length >= maxSpawns) return;
      setRedHexes((prev) => [...prev, { key: pendingHex, minions: [] }]);
    }
    deductMoney(hexPurchaseCost);

    setLocked(true); // ซื้อเสร็จ -> ล็อก

    // ปิดปุ่ม BUY
    setPendingHex(null);
    setBuyButtonPosition(null);
  };

  // ------------------------------
  // 7) รวม owned + potential เพื่อ render
  // ------------------------------
  const mergedHexes: Record<string, { color: string; fadingOut?: boolean }> = {};
  for (const k in ownedHexes) {
    mergedHexes[k] = { color: ownedHexes[k] };
  }
  for (const k in potentialHexes) {
    mergedHexes[k] = {
      color: potentialHexes[k].color,
      fadingOut: potentialHexes[k].fadingOut,
    };
  }

  // ------------------------------
  // renderMinionsAt: แสดงมินเนี่ยนในแต่ละช่อง
  // ------------------------------
  function renderMinionsAt(hexKey: string) {
    let found = greenHexes.find((h) => h.key === hexKey);
    let color = "green";
    if (!found) {
      found = redHexes.find((h) => h.key === hexKey);
      color = "red";
    }
    if (!found) return null;

    // ถ้ามีมินเนี่ยนหลายตัว -> วางซ้อนกัน
    return found.minions.map((m, idx) => {
      const offsetX = 10 + idx * 25;
      const offsetY = 10;
      // สมมติชื่อไฟล์ Model01GREEN.png หรือ Model02RED.png
      const modelStr = m.minionId.toString().padStart(2, "0");
      const imageSrc = `/Model${modelStr}${color.toUpperCase()}.png`;

      return (
        <image
          key={`${m.minionId}-${idx}`}
          href={imageSrc}
          x={offsetX}
          y={offsetY}
          width={40}
          height={40}
        />
      );
    });
  }

  // ------------------------------
  // return ส่วน render หลัก
  // ------------------------------
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {/* CSS สำหรับ fadeIn / fadeOut */}
      <style jsx>{`
        @keyframes fadeInFill {
          0% {
            fill-opacity: 0;
          }
          100% {
            fill-opacity: 1;
          }
        }
        @keyframes fadeOutFill {
          0% {
            fill-opacity: 1;
          }
          100% {
            fill-opacity: 0;
          }
        }
        .fadeIn {
          animation: fadeInFill 0.5s ease forwards;
        }
        .fadeOut {
          animation: fadeOutFill 0.5s ease forwards;
        }
      `}</style>

      <svg
        width={COLS * HEX_WIDTH * 0.75 + HEX_RADIUS}
        height={ROWS * HEX_HEIGHT + HEX_HEIGHT / 2}
      >
        {Array.from({ length: ROWS }, (_, row) =>
          Array.from({ length: COLS }, (_, col) => {
            const x = (COLS - col - 1) * HEX_WIDTH * 0.75;
            const y = row * HEX_HEIGHT + (col % 2 === 1 ? HEX_HEIGHT / 2 : 0);
            const key = `(${row + 1},${COLS - col})`;

            const data = mergedHexes[key];
            const fillColor = data ? data.color : "transparent";

            let className = "";
            if (fillColor === "#F4D03F" || fillColor === "#FFA07A") {
              className = data?.fadingOut ? "fadeOut" : "fadeIn";
            }

            return (
              <g key={key} transform={`translate(${x},${y})`}>
                {/* รูปหกเหลี่ยม */}
                <polygon
                  points={`
                    ${HEX_RADIUS * 0.5},0 
                    ${HEX_RADIUS * 1.5},0 
                    ${HEX_RADIUS * 2},${HEX_HEIGHT / 2} 
                    ${HEX_RADIUS * 1.5},${HEX_HEIGHT} 
                    ${HEX_RADIUS * 0.5},${HEX_HEIGHT} 
                    0,${HEX_HEIGHT / 2}
                  `}
                  stroke="white"
                  strokeWidth={2}
                  style={{
                    fill: fillColor,
                    fillOpacity: fillColor !== "transparent" ? 1 : 0,
                    strokeOpacity: 1,
                    cursor: "pointer",
                  }}
                  className={className}
                  onClick={() => handleHexClick(row + 1, COLS - col)}
                />
                {/* แสดงมินเนี่ยนในช่อง */}
                {renderMinionsAt(key)}
              </g>
            );
          })
        )}
      </svg>

      {/* ปุ่ม BUY (ซื้อพื้นที่) */}
      {pendingHex && buyButtonPosition && (
        <BuyButton onBuy={handleBuy} position={buyButtonPosition} />
      )}
    </div>
  );
};

export default HexGrid;
