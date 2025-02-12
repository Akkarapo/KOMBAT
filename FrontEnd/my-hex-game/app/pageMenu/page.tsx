"use client";
import { useRouter } from "next/navigation";

export default function GameMenu() {
  const router = useRouter();

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-cover bg-center text-white"
         style={{ backgroundImage: "url('/backgroundMenu.png')", backgroundSize: "cover", backgroundPosition: "center", width: "100vw", height: "100vh" }}>
      <h1 className="absolute top-5 left-10 text-[12rem] font-bold leading-none">Game Name</h1>
      
      <div className="absolute top-[35%] left-10 flex flex-col space-y-6">
        <button 
          className="relative w-[300px] h-[80px] bg-[url('/button.png')] bg-no-repeat bg-contain bg-center hover:scale-105 transition-transform"
          onClick={() => router.push("/how-to-duel")}
        >
          <span className="absolute inset-0 flex items-center justify-center text-gray-900 text-3xl font-bold">
            Duel
          </span>
        </button>

        <button 
          className="relative w-[300px] h-[80px] bg-[url('/button.png')] bg-no-repeat bg-contain bg-center hover:scale-105 transition-transform"
          onClick={() => router.push("/how-to-solitaire")}
        >
          <span className="absolute inset-0 flex items-center justify-center text-gray-900 text-3xl font-bold">
            Solitaire
          </span>
        </button>

        <button 
          className="relative w-[300px] h-[80px] bg-[url('/button.png')] bg-no-repeat bg-contain bg-center hover:scale-105 transition-transform"
          onClick={() => router.push("/how-to-auto")}
        >
          <span className="absolute inset-0 flex items-center justify-center text-gray-900 text-3xl font-bold">
            Auto
          </span>
        </button>
      </div>
    </div>
  );
}
