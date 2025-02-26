"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface MinionData {
  minionId: number;
  name: string;
  defense: string;
  strategy: string;
}

interface UserStrategyContextType {
  minions: MinionData[];
  lastSelectedMinionId: number | null;
  setMinionData: (minionId: number, name: string, defense: string) => void;
  setStrategy: (minionId: number, strategy: string) => void;
  getMinionData: (minionId: number) => MinionData;
  setLastSelectedMinion: (minionId: number) => void;
  resetAllData: () => void;
}

const UserStrategyContext = createContext<UserStrategyContextType | undefined>(undefined);

export const UserStrategyProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minions, setMinions] = useState<MinionData[]>([]);
  const [lastSelectedMinionId, setLastSelectedMinionId] = useState<number | null>(null);

  // ✅ โหลดข้อมูลจาก URL เมื่อคอมโพเนนต์ถูกโหลด
  useEffect(() => {
    const defenseData = searchParams.get("defenseData");
    if (defenseData) {
      const parsedMinions = defenseData.split(",").map((data) => {
        const [id, name, defense] = data.split(":");
        return {
          minionId: Number(id),
          name: decodeURIComponent(name), // ถอดรหัสชื่อที่ถูก encode
          defense,
          strategy: "",
        };
      });

      setMinions(parsedMinions);
    }
  }, []);

  // ✅ ฟังก์ชันอัปเดต URL ให้เก็บค่าป้องกันของทุก Minion
  const updateURL = () => {
    const params = new URLSearchParams(window.location.search);

    // ✅ แปลงข้อมูลทุก Minion เป็น `minionId:ชื่อ:ค่าป้องกัน` แล้วรวมเป็น string
    const defenseData = minions
      .map((m) => `${m.minionId}:${encodeURIComponent(m.name)}:${m.defense}`)
      .join(",");

    params.set("defenseData", defenseData);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // ✅ ฟังก์ชันตั้งค่าข้อมูลของ Minion และอัปเดต URL
  const setMinionData = (minionId: number, name: string, defense: string) => {
    setMinions((prev) => {
      const existingMinion = prev.find((m) => m.minionId === minionId);
      const updatedMinions = existingMinion
        ? prev.map((m) => (m.minionId === minionId ? { ...m, name, defense } : m))
        : [...prev, { minionId, name, defense, strategy: "" }];

      return updatedMinions;
    });

    setTimeout(updateURL, 0); // ✅ อัปเดต URL หลังจากอัปเดตสถานะ
  };

  // ✅ ฟังก์ชันตั้งค่า Strategy
  const setStrategy = (minionId: number, strategy: string) => {
    setMinions((prev) => {
      const existingMinion = prev.find((m) => m.minionId === minionId);
      return existingMinion
        ? prev.map((m) => (m.minionId === minionId ? { ...m, strategy } : m))
        : [...prev, { minionId, name: "", defense: "", strategy }];
    });
    setLastSelectedMinionId(minionId);
  };

  // ✅ ฟังก์ชันดึงข้อมูล Minion
  const getMinionData = (minionId: number): MinionData => {
    const foundMinion = minions.find((m) => m.minionId === minionId);
    return (
      foundMinion || { minionId, name: "", defense: "", strategy: "" }
    );
  };

  // ✅ ฟังก์ชันตั้งค่า Minion ที่เลือกล่าสุด
  const setLastSelectedMinion = (minionId: number) => {
    if (minions.some((m) => m.minionId === minionId)) {
      setLastSelectedMinionId(minionId);
    }
  };

  // ✅ รีเซ็ตข้อมูลทั้งหมด
  const resetAllData = () => {
    setMinions([]);
    setLastSelectedMinionId(null);
    router.replace(window.location.pathname, { scroll: false }); // รีเซ็ต URL
  };

  return (
    <UserStrategyContext.Provider
      value={{
        minions,
        lastSelectedMinionId,
        setMinionData,
        setStrategy,
        getMinionData,
        setLastSelectedMinion,
        resetAllData,
      }}
    >
      {children}
    </UserStrategyContext.Provider>
  );
};

export const useUserStrategy = () => {
  const context = useContext(UserStrategyContext);
  if (!context) {
    throw new Error("useUserStrategy must be used within a UserStrategyProvider");
  }
  return context;
};
