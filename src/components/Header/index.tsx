"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Header() {
  const pathname = usePathname(); 
  const MENU_ITEMS = [
    {
      text: "About",
      href: "/about",
    },
    {
      text: "Pricing",
      href: "/pricing",
    },
    {
      text: "Leaderboards",
      href: "/leaderboards",
    },
    {
      text: "dApp",
      href: "/dashboard",
    },
  ];


  return (
    <div className="flex z-[40] py-4 text-white bg-[#37003c] justify-between items-center gap-8 fixed top-0 right-0 w-full font-medium px-8 backdrop-blur-lg">
      <div className="flex justify-center items-center">
        <Image src={"/solfootball.svg"} alt="logo" width={40} height={40} />
        <p>SolFootball</p>
      </div>
      <div className="hidden md:flex gap-8">
        {MENU_ITEMS.map((item) => (
          <Link key={item.text} href={item.href}>
            <p
              className={`${
                pathname === item.href ? "underline underline-offset-8 decoration-button decoration-2" : ""
              }`}
            >
              {item.text}
            </p>
          </Link>
        ))}
      </div>
      <div className=" px-4 py-2 bg-[#1fcdff] text-theme font-semibold rounded-lg">Connect Wallet</div>
    </div>
  );
}
