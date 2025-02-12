"use client";
import { useRouter } from 'next/navigation';

export default function GameMenu() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-white"
         style={{ backgroundImage: "url('/background.png')" }}>
      <h1 className="text-5xl font-bold mb-8">Game Name</h1>
      
      <div className="flex flex-col space-y-4">
        <button 
          className="bg-white text-gray-900 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition"
          onClick={() => router.push('/?mode=duel')}
        >
          Duel
        </button>

        <button 
          className="bg-white text-gray-900 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition"
          onClick={() => router.push('/?mode=solitaire')}
        >
          Solitaire
        </button>

        <button 
          className="bg-white text-gray-900 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition"
          onClick={() => router.push('/?mode=auto')}
        >
          Auto
        </button>
      </div>
    </div>
  );
}
