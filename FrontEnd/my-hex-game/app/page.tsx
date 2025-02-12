import React from "react";
import HexGrid from "../components/HexGrid";

const Page = () => {
  return (
    <div>
      <div className="player-ui player-top">Player 2</div>
      <HexGrid />
      <div className="player-ui player-bottom">Player 1</div>
    </div>
  );
};

export default Page;
