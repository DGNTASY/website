'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react"; // Wallet adapter to fetch publicKey and sendTransaction
import { PublicKey } from "@solana/web3.js";

const Dapp = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePlaceBet = async () => {
    if (!publicKey) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      console.log("Public Key:", publicKey.toBase58());
      // Call the backend API to place the bet
      const response = await fetch("/api/place-bet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicKey: publicKey.toString(),
          sendTransaction, // Ensure this is a valid transaction object or handler
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Bet placed successfully!");
        console.log("Bet placed successfully:", data.message);
      } else {
        setMessage(`Error: ${data.error}`);
        console.error("Error placing bet:", data.error);
      }
    } catch (err) {
      setMessage("Failed to place bet. Try again.");
      console.error("Error placing bet:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden">
      {/* Main content */}
      <div className="text-center mb-12 z-10 fade-in">
        <h1 className="text-5xl font-extrabold text-white mb-6 animate-fade-up">
          Welcome to the Challenge
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8 z-10 animate-fade-up">
        <Button onClick={handlePlaceBet} disabled={loading}>
          {loading ? "Placing Bet..." : "Place Bet"}
        </Button>
      </div>

      {message && (
        <p className="mt-6 text-lg font-semibold text-white">{message}</p>
      )}
    </div>
  );
};

export default Dapp;
