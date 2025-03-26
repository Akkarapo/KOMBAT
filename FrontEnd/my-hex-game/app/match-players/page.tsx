"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { io } from "socket.io-client";

export default function MatchPlayers() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const room = searchParams.get("room") || `match-room-${Math.random().toString(36).substr(2, 9)}`;

  const [player2Joined, setPlayer2Joined] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [player1Confirmed, setPlayer1Confirmed] = useState(false);
  const [player2Confirmed, setPlayer2Confirmed] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:3001", { transports: ['websocket'], withCredentials: true });

    socket.emit("join-room", room);

    socket.on("update-players", (players) => {
      if (players.includes("player2")) setPlayer2Joined(true);
    });

    socket.on("player-confirmed", (player) => {
      if (player === "player1") setPlayer1Confirmed(true);
      if (player === "player2") setPlayer2Confirmed(true);
    });

    setInviteLink(`${window.location.origin}/match-players?room=${room}`);

    return () => socket.disconnect();
  }, [room]);

  const handleInvite = async () => {
    await navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied to clipboard!");
  };

  const handleConfirm = () => {
    const socket = io("http://localhost:3000", { transports: ['websocket'], withCredentials: true });
    socket.emit("confirm", player2Joined ? "player2" : "player1");
    socket.disconnect();
  };

  const handleBack = () => {
    window.location.href = "/pageMenu"; // แก้ไขเป็นการ redirect ด้วย window.location
  };

  useEffect(() => {
    if (player1Confirmed && player2Confirmed) {
      router.push("/game");
    }
  }, [player1Confirmed, player2Confirmed, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-cover bg-center p-6 relative" style={{ backgroundImage: "url('/backgroundHowTo.png')" }}>
      <button 
        className="absolute top-8 left-8 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        onClick={handleBack}
      >
        Back to Menu
      </button>
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
          {player2Joined ? (
            <div>
              <Image src="/Player2.png" alt="Player 2" width={250} height={250} className="rounded-lg object-contain" />
              <div className="mt-2 text-2xl font-bold text-green-500">Player 2 Join</div>
            </div>
          ) : (
            <div className="text-xl font-semibold text-gray-400">Waiting for Player 2...</div>
          )}
        </div>
      </div>
      <button 
        className="absolute bottom-8 right-20 hover:scale-105 transition p-2"
        style={{ marginRight: '32px', marginBottom: '16px' }}
        onClick={handleConfirm}
        disabled={!player2Joined}
      >
        <Image src="/ConfirmButton.png" alt="Confirm Button" width={180} height={70} className="object-contain" />
      </button>
    </div>
  );
}
