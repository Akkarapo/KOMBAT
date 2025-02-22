// userStrategyData.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface MinionData {
  minionId: number;
  name: string;
  defense: string;
  strategy: string;
}

interface UserStrategyContextType {
  minions: MinionData[];
  setMinionData: (minionId: number, name: string, defense: string) => void;
  setStrategy: (minionId: number, strategy: string) => void;
  getMinionData: (minionId: number) => MinionData | undefined;
  resetMinions: () => void; // ✅ ฟังก์ชันรีเซ็ตข้อมูล
}

const UserStrategyContext = createContext<UserStrategyContextType | undefined>(undefined);

export const UserStrategyProvider = ({ children }: { children: ReactNode }) => {
  const [minions, setMinions] = useState<MinionData[]>([]);

  const setMinionData = (minionId: number, name: string, defense: string) => {
    setMinions((prev) =>
      prev.some((m) => m.minionId === minionId)
        ? prev.map((m) => (m.minionId === minionId ? { ...m, name, defense } : m))
        : [...prev, { minionId, name, defense, strategy: "" }]
    );
  };

  const setStrategy = (minionId: number, strategy: string) => {
    setMinions((prev) => prev.map((m) => (m.minionId === minionId ? { ...m, strategy } : m)));
  };

  const getMinionData = (minionId: number) => {
    return minions.find((m) => m.minionId === minionId);
  };

  // ✅ ฟังก์ชันรีเซ็ตข้อมูลทั้งหมด
  const resetMinions = () => {
    setMinions([]);
  };

  return (
    <UserStrategyContext.Provider value={{ minions, setMinionData, setStrategy, getMinionData, resetMinions }}>
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
