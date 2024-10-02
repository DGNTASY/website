"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react"; // Wallet adapter to fetch publicKey and sendTransaction
import { PublicKey } from "@solana/web3.js";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

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
    <>
      <div className="min-h-screen flex flex-col gap-12 justify-center items-center bg-gradient-to-r from-fuchsia-500 to-cyan-500 relative overflow-hidden py-28 lg:py-8">
        <div className="w-10/12 h-32 bg-white/60 text-theme flex justify-between rounded-md">
          <div className="p-8">
            <p className="text-lg font-semibold">Total pot</p>
            <div>
              <p className="text-3xl font-bold">0.00 SOL</p>
            </div>
          </div>
          <div className="p-8">
            <p className="text-lg font-semibold">Total score</p>
            <div>
              <p className="text-3xl font-bold">0.00 PTS</p>
            </div>
          </div>
        </div>
        <div className="h-full w-11/12 grid grid-cols-1 lg:grid-cols-3 gap-16 place-items-center ">
          <div className="relative w-[350px] h-[450px] overflow-hidden rounded-lg shadow-lg hover:scale-110">
            <Image
              src="/bet.jpg"
              alt="Background Image"
              layout="fill"
              objectFit="cover"
              className="z-0 opacity-50 "
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

            <div className="relative w-full h-full flex flex-col justify-center items-center z-20 p-6 text-white">
              <div className="mb-4 text-lg font-bold">
                <p>Place your bet on the SolFootball</p>
              </div>
              <div className="flex justify-between">
                <button className="px-4 py-2 bg-[#43a3fe] text-theme font-semibold rounded-md">
                  Place Bet
                </button>
              </div>
            </div>
          </div>

          {/* card2 */}
          {/* <div className="relative w-[350px] h-[450px] overflow-hidden rounded-lg shadow-lg hover:scale-110">
        <Image
          src="/pot.jpg"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="z-0 opacity-50 "
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

        <div className="relative w-full h-full flex flex-col justify-center items-center z-20 p-6 text-white">
          <div className="mb-4 text-lg font-bold">
            <p>Your vault has total pot</p>
          </div>
          <div className="flex justify-between">
            <button className="px-4 py-2 bg-[#43a3fe] text-theme font-semibold rounded-md">
              Total pot
            </button>
          </div>
        </div>
      </div> */}

          {/* card3 */}
          <div className="relative w-[350px] h-[450px] overflow-hidden rounded-lg shadow-lg hover:scale-110">
            <Image
              src="/score.jpg"
              alt="Background Image"
              layout="fill"
              objectFit="cover"
              className="z-0 opacity-50  "
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

            <div className="relative w-full h-full flex flex-col justify-center items-center z-20 p-6 text-white">
              <div className="mb-4 text-lg font-bold">
                <p>View your score on SolFootball</p>
              </div>
              <div className="flex justify-between">
                <button className="px-4 py-2 bg-[#43a3fe] text-theme font-semibold rounded-md">
                  View Score
                </button>
              </div>
            </div>
          </div>
          {/* card4 */}
          <div className="relative w-[350px] h-[450px] overflow-hidden rounded-lg shadow-lg hover:scale-110">
            <Image
              src="/withdraw.avif"
              alt="Background Image"
              layout="fill"
              objectFit="cover"
              className="z-0 opacity-50 "
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

            <div className="relative w-full h-full flex flex-col justify-center items-center z-20 p-6 text-white">
              <div className="mb-4 text-lg font-bold">
                <p>Withdraw your points</p>
              </div>
              <div className="flex justify-between">
                <button className="px-4 py-2 bg-[#43a3fe] text-theme font-semibold rounded-md">
                  Withdraw
                </button>
              </div>
            </div>
          </div>
          {/* Card Content */}
          {/* Card Content */}

          {/* Main content
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
      )} */}
        </div>
      </div>
    </>
  );
};

export default Dapp;
