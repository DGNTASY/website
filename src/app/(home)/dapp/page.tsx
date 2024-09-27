import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

type Props = {};

const Dapp = (props: Props) => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-white/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-300/30 rounded-full blur-2xl opacity-30"></div>

      <div className="text-center mb-12 z-10 fade-in">
        <h1 className="text-5xl font-extrabold text-white mb-6 animate-fade-up">
          Welcome to the Challenge
        </h1>
        <p className="text-xl text-gray-200 max-w-xl mx-auto leading-relaxed">
          Join the challenge and test your skills. Withdraw anytime!
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 z-10 animate-fade-up">
        <Button className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 font-semibold shadow-2xl rounded-lg transition-transform transform hover:scale-105 active:scale-95 relative overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 hover:opacity-25 transition-opacity duration-300"></span>
          Join Challenge
        </Button>
        <Button className="bg-indigo-600 text-white hover:bg-indigo-500 px-8 py-4 font-semibold shadow-2xl rounded-lg transition-transform transform hover:scale-105 active:scale-95 relative overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-0 hover:opacity-25 transition-opacity duration-300"></span>
          Withdraw
        </Button>
      </div>
    </div>
  );
};

export default Dapp;
