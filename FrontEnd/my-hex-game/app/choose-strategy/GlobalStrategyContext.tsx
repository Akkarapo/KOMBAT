"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalStrategyContextType {
  globalStrategy3: string;
  setGlobalStrategy3: (code: string) => void;
}

const GlobalStrategyContext = createContext<GlobalStrategyContextType | undefined>(undefined);

export function GlobalStrategyProvider({ children }: { children: ReactNode }) {
  // state นี้จะถือโค้ด Strategy 3 แบบ Global
  const [globalStrategy3, setGlobalStrategy3] = useState("");

  return (
    <GlobalStrategyContext.Provider value={{ globalStrategy3, setGlobalStrategy3 }}>
      {children}
    </GlobalStrategyContext.Provider>
  );
}

export function useGlobalStrategy3() {
  const context = useContext(GlobalStrategyContext);
  if (!context) {
    throw new Error("useGlobalStrategy3 must be used within a GlobalStrategyProvider");
  }
  return context;
}
