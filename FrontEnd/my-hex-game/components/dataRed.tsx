export interface RedHexData {
    key: string;
    minions: {
      minionId: number;
      name: string;
    }[];
  }
  
  // พื้นที่เริ่มต้นของฝั่งสีแดง (เปลี่ยนเป็น RedHexData[])
  export const initialRedHexes: RedHexData[] = [
    { key: "(7,7)", minions: [] },
    { key: "(7,8)", minions: [] },
    { key: "(8,6)", minions: [] },
    { key: "(8,7)", minions: [] },
    { key: "(8,8)", minions: [] },
  ];
  