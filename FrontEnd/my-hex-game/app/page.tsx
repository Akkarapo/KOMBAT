'use client';
import HexGrid from "@/components/HexGrid";

export default function Home() {
  return (
    <div className="hex-container">
      {/* Player UI */}
      <div className="player-ui player-top">Player 2</div>
      <HexGrid />
      <div className="player-ui player-bottom">Player 1</div>
    </div>
  );
}
