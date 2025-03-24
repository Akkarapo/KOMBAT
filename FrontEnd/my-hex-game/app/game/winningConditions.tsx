"use client";

/**
 * อินเทอร์เฟซสำหรับข้อมูลที่ใช้ตัดสินผู้ชนะ
 */
export interface WinningData {
  greenMinions: number;  // จำนวนมินเนี่ยนฝั่งสีเขียวที่ยังเหลือในสนาม
  redMinions: number;    // จำนวนมินเนี่ยนฝั่งสีแดงที่ยังเหลือในสนาม
  greenBudget: number;   // งบ (budget) ฝั่งสีเขียวที่เหลือ
  redBudget: number;     // งบ (budget) ฝั่งสีแดงที่เหลือ
  initHp: number;        // ค่า HP เริ่มต้นของมินเนี่ยนแต่ละตัว
}

/**
 * ฟังก์ชันคำนวณผู้ชนะตามเงื่อนไขที่กำหนด:
 *  1. ถ้าฝั่งใดไม่มีมินเนี่ยน (แต่ฝั่งตรงข้ามยังมี) => ฝั่งตรงข้ามชนะ
 *  2. ถ้ามินเนี่ยนทั้งสองฝั่งยังมี => ฝั่งไหนมีมินเนี่ยนมากกว่าชนะ
 *  3. ถ้าจำนวนมินเนี่ยนเท่ากัน => ดูผลรวม HP (จำนวนมินเนี่ยน * initHp)
 *  4. ถ้ายังเท่ากัน => ดู budget ใครมากกว่า
 *  5. ถ้ายังเท่ากัน => เสมอ
 */
export function calculateWinner(data: WinningData): "green" | "red" | "tie" {
  const {
    greenMinions,
    redMinions,
    greenBudget,
    redBudget,
    initHp
  } = data;

  // 1) ถ้าฝั่งใดมินเนี่ยน = 0 แต่ฝั่งอื่น > 0 => ฝั่งอื่นชนะ
  if (greenMinions === 0 && redMinions > 0) {
    return "red";
  }
  if (redMinions === 0 && greenMinions > 0) {
    return "green";
  }
  // ถ้าทั้งสองฝั่ง 0 ตัว => เสมอ
  if (greenMinions === 0 && redMinions === 0) {
    return "tie";
  }

  // 2) ฝั่งไหนมินเนี่ยนเยอะกว่าชนะ
  if (greenMinions > redMinions) {
    return "green";
  }
  if (redMinions > greenMinions) {
    return "red";
  }

  // 3) ถ้าจำนวนมินเนี่ยนเท่ากัน => เทียบผลรวม HP
  const greenTotalHp = greenMinions * initHp;
  const redTotalHp = redMinions * initHp;
  if (greenTotalHp > redTotalHp) {
    return "green";
  }
  if (redTotalHp > greenTotalHp) {
    return "red";
  }

  // 4) ถ้ายังเท่ากัน => ดู budget
  if (greenBudget > redBudget) {
    return "green";
  }
  if (redBudget > greenBudget) {
    return "red";
  }

  // 5) ถ้ายังเท่ากัน => เสมอ
  return "tie";
}
