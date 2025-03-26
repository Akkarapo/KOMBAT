export interface GreenHexData {
    key: string; // พิกัด Hex เช่น "(1,1)"
    minions: {
      minionId: number;
      name: string;
    }[];
  }
  
  // พื้นที่เริ่มต้นของฝั่งสีเขียว (เปลี่ยนจาก string[] เป็น GreenHexData[])
  export const initialGreenHexes: GreenHexData[] = [
    { key: "(1,1)", minions: [] },
    { key: "(1,2)", minions: [] },
    { key: "(2,1)", minions: [] },
    { key: "(2,2)", minions: [] },
    { key: "(1,3)", minions: [] },
  ];
  