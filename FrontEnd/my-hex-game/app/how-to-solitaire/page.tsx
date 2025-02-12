"use client";
import { useRouter } from "next/navigation";

export default function HowToSolitairePage() {
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
      {/* How to Play Container */}
      <div className="absolute top-[10%] w-full max-w-none flex justify-center">
        {/* Background Image (DO NOT MOVE) */}
        <img
          src="/textHowToDuel.png"
          alt="How to Play Background"
          className="w-full object-cover"
        />

        {/* Text Content */}
        <div
          className="absolute inset-0 flex flex-col justify-center text-left ml-auto"
          style={{
            maxWidth: "80%",
            marginLeft: "500px", // Fixed right alignment
            marginTop: "60px", // Fixed downward alignment
            paddingTop: "20px", // Balanced top padding
          }}
        >
          {/* Title Section */}
          <div
            className="flex justify-between items-center w-full"
            style={{ marginTop: "50px" }} // Slight downward shift for Duel and info
          >
            <div className="flex items-center space-x-4">
              <img
                src="/info.png"
                alt="Info"
                style={{ width: "35px", height: "35px", marginTop: "20px" }} // Move Info down
              />
              <h1
                className="text-3xl font-bold"
                style={{ marginTop: "20px" }} // Move Duel down
              >
                Solitaire
              </h1>
            </div>
            {/* Close Button */}
            <button
              className="hover:opacity-80"
              onClick={() => router.push("/game")}
              style={{ marginRight: "30px" }} // Move Close button to the right
            >
              <img
                src="/cross.png"
                alt="Close"
                style={{ width: "20px", height: "20px" }} // Set Close button size
              />
            </button>
          </div>

          {/* How to Play Content */}
          <h2 className="text-lg font-semibold" style={{ marginTop: "20px" }}>
            How to play
          </h2>
          <ul
            className="list-disc list-inside text-sm text-white space-y-2 leading-relaxed"
            style={{ marginTop: "10px" }} // Move content slightly up
          >
            <li>
              It must be agreed upon in advance how many types of minions can be
              placed during the game. The game supports 1 to 5 minion types.
            </li>
            <li>Give each minion a name.</li>
            <li>
              Players should agree on defense values ​​and strategies for each
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
