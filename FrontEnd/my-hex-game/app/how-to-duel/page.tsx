"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0, y: 100 }} // เริ่มต้นที่มองไม่เห็นและเลื่อนลง 100px
        animate={{ opacity: 1, y: 0 }} // แสดงผลพร้อมเลื่อนขึ้น
        transition={{ duration: 1.2, ease: "easeOut" }} // ตั้งค่าความเร็วและลักษณะแอนิเมชัน
        className="absolute top-[10%] w-full max-w-none flex justify-center"
      >
        {/* แถบพื้นหลังข้อความ (เลื่อนขึ้น) */}
        <motion.img
          src="/textHowToDuel.png"
          alt="How to Duel Background"
          className="w-full object-cover"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* ข้อความบนแถบพื้นหลัง */}
        <motion.div
          initial={{ opacity: 0, y: 100 }} // เริ่มจากด้านล่าง
          animate={{ opacity: 1, y: 0 }} // เลื่อนขึ้น
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }} // ดีเลย์เล็กน้อย
          className="absolute inset-0 flex flex-col justify-center text-left ml-auto"
          style={{
            maxWidth: "80%",
            marginLeft: "500px",
            marginTop: "90px",
            paddingTop: "20px",
          }}
        >
          {/* หัวข้อ */}
          <div className="flex justify-between items-center w-full" style={{ marginTop: "50px" }}>
            <div className="flex items-center space-x-4">
              <motion.img
                src="/info.png"
                alt="Info"
                style={{ width: "35px", height: "35px", marginTop: "20px" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.h1
                className="text-3xl font-bold"
                style={{ marginTop: "20px" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Duel
              </motion.h1>
            </div>

            {/* ปุ่มปิด */}
            <motion.button
              className="hover:opacity-80"
              onClick={() => router.push("/choose-minions")}
              style={{ marginRight: "30px" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <img src="/cross.png" alt="Close" style={{ width: "20px", height: "20px" }} />
            </motion.button>
          </div>

          {/* เนื้อหาคำอธิบาย */}
          <motion.h2
            className="text-lg font-semibold"
            style={{ marginTop: "20px" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            How to play
          </motion.h2>

          <motion.ul
            className="list-disc list-inside text-sm text-white space-y-2 leading-relaxed"
            style={{ marginTop: "10px" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <li>It must be agreed upon in advance how many types of minions can be placed during the game.</li>
            <li>The game supports 1 to 5 minion types.</li>
            <li>Give each minion a name.</li>
            <li>Players should agree on defense values and strategies for each minion type during setup.</li>
            <li>Once the game has started, the minion's strategy and defense cannot be changed.</li>
          </motion.ul>
        </motion.div>
      </motion.div>

      {/* ✅ ปุ่ม Back */}
      <motion.button
        onClick={() => router.push("/pageMenu")}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute bottom-[20px] left-20 w-[180px] h-[70px] bg-contain bg-no-repeat"
        style={{ backgroundImage: "url('/BackButton.png')", zIndex: 50 }}
      />
    </div>
  );
}
