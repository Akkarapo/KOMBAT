"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

export default function MatchPlayers() {
  const router = useRouter();
  const [player2Joined, setPlayer2Joined] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3001"); // แก้ URL ให้ตรงกับเซิร์ฟเวอร์จริง

    socket.on("player2-joined", () => {
      setPlayer2Joined(true);
    });

    setInviteLink(window.location.href);

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleInvite = async () => {
    await navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied to clipboard!");
  };

  const handleConfirm = () => {
    router.push("/match-players");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-cover bg-center p-6 relative" style={{ backgroundImage: "url('/backgroundHowTo.png')" }}>
      <div className="flex flex-col items-center justify-start mt-[-50px]">
        <h1 className="text-6xl font-bold mb-8 text-center text-[#262C38]">Match players</h1>
        <button onClick={handleInvite} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Copy Invite Link</button>
        <div className="flex gap-12 mt-[-30px]">
          <div>
            <Image src="/Player1.png" alt="Player 1" width={250} height={250} className="rounded-lg object-contain" />
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-5xl font-bold mb-4 text-[#262C38]">VS</div>
            <Image src="/Switch.png" alt="Switch Icon" width={50} height={50} className="mb-4 object-contain" />
          </div>
          <div>
            <Image src="/Player2.png" alt="Player 2" width={250} height={250} className="rounded-lg object-contain" />
            {player2Joined && <div className="mt-2 text-2xl font-bold text-green-500">Player 2 Join</div>}
          </div>
        </div>
      </div>
      <button 
        className="absolute bottom-8 right-20 hover:scale-105 transition p-2"
        style={{ marginRight: '32px', marginBottom: '16px' }}
        onClick={handleConfirm}
      >
        <Image src="/ConfirmButton.png" alt="Confirm Button" width={180} height={70} className="object-contain" />
      </button>
    </div>
  );
}
