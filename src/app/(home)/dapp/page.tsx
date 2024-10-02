'use client';
import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react"; // Wallet adapter to fetch publicKey and sendTransaction
import BetButton from "@/components/BetButton";

const Dapp = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);


  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden">
      {/* Main content */}
      <div className="text-center mb-12 z-10 fade-in">
        <h1 className="text-5xl font-extrabold text-white mb-6 animate-fade-up">
          Welcome to the Challenge
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8 z-10 animate-fade-up">
        <BetButton disabled={loading} />
      </div>

      {message && (
        <p className="mt-6 text-lg font-semibold text-white">{message}</p>
      )}
    </div>
  );
};

export default Dapp;
