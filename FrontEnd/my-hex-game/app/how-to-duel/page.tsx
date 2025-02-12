"use client";
import { useRouter } from "next/navigation";

export default function HowToDuelPage() {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full text-white p-6"
      style={{
        backgroundImage: "url('/backgroundHowTo.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* กล่องข้อมูล How to Play */}
      <div className="absolute top-[10%] w-full max-w-none flex justify-center">
        {/* แถบพื้นหลังข้อความ (ห้ามขยับ) */}
        <img
          src="/textHowToDuel.png"
          alt="How to Duel Background"
          className="w-full object-cover"
        />

        {/* ข้อความบนแถบพื้นหลัง */}
        <div
          className="absolute inset-0 flex flex-col justify-center text-left ml-auto"
          style={{ 
            maxWidth: "80%", 
            marginLeft: "500px", /* ขยับไปทางขวา (คงที่) */
            marginTop: "90px",  /* ขยับข้อความทั้งหมดลง (คงที่) */
            paddingTop: "20px"   /* ปรับระยะห่างด้านบนให้สมดุล */
          }}
        >
          {/* หัวข้อ */}
          <div 
            className="flex justify-between items-center w-full"
            style={{ marginTop: "50px" }} /* เลื่อน Duel และ info ลงมาอีกนิด */
          >
            <div className="flex items-center space-x-4">
              <img 
                src="/info.png" 
                alt="Info" 
                style={{ width: "35px", height: "35px", marginTop: "20px" }} /* เลื่อน Info ลง */
              />
              <h1 
                className="text-3xl font-bold" 
                style={{ marginTop: "20px" }} /* เลื่อน Duel ลง */
              >
                Duel
              </h1>
            </div>
            {/* ❌  */}
            <button
              className="hover:opacity-80"
              onClick={() => router.push("/game")}
              style={{ marginRight: "30px" }} /* ขยับปุ่มไปทางขวา */
            >
              <img 
                src="/cross.png" 
                alt="Close" 
                style={{ width: "20px", height: "20px" }} /* ตั้งขนาดปุ่ม */
              />
            </button>
          </div>

          {/* เนื้อหาคำอธิบาย */}
          <h2 className="text-lg font-semibold" style={{ marginTop: "20px" }}>How to play</h2> 
          <ul 
            className="list-disc list-inside text-sm text-white space-y-2 leading-relaxed" 
            style={{ marginTop: "10px" }} /* ขยับเนื้อหา */
          >
            <li>
              It must be agreed upon in advance how many types of minions can be
              placed during the game.
            </li>
            <li>The game supports 1 to 5 minion types.</li>
            <li>Give each minion a name.</li>
            <li>
              Players should agree on defense values and strategies for each
              minion type during setup.
            </li>
            <li>
              Once the game has started, the minion's strategy and defense
              cannot be changed.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
