"use client";
import React from "react";

export default function Header() {
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

  const handleLinkClick = (link: string) => {
    console.log(link);
  };

  return (
    <div className="flex z-[40] h-20 text-black justify-between items-center gap-8 fixed top-0 right-0 w-full font-medium px-8 backdrop-blur-lg">
      <div>$~</div>
      <div className="hidden md:flex gap-8">
        {MENU_ITEMS.map((item) => (
          <p
            key={item.href}
            className="cursor-pointer"
            onClick={() => handleLinkClick(item.href)}
          >
            {item.text}
          </p>
        ))}
      </div>
      <div className="hidden md:flex">~$</div>
    </div>
  );
}
