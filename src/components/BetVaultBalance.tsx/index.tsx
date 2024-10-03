"use client";

import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useMemo, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import Image from "next/image";
import LogoUSDC from "/public/icons/usdc.svg";
import { SfFinal } from "../program/sf_final";
import { solfotProgramInterface } from "../utils/constants";

export default function BetVaultBalance() {
  const [vaultBalance, setVaultBalance] = useState<string | null>(null);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useMemo(async () => {
    if (!wallet) {
      return;
    }

    var balance = await getVaultBalance();
    setVaultBalance(balance);
  }, [wallet]);

  async function getVaultBalance(): Promise<string | null> {
    const provider = new AnchorProvider(connection, wallet!);
    const program = new Program(
      solfotProgramInterface,
      provider
    ) as Program<SfFinal>;

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
      return null;
    }

    const PROGRAM_ID = new PublicKey(contractAddress!);
    if (!PROGRAM_ID) {
      console.error("Error making public key");
      return null;
    }

    const [escrowPDA, _bumpSeed] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow")],
      PROGRAM_ID
    );

    try {
      const escrowAccountInfo = await program.account.escrowAccount.fetch(
        escrowPDA
      );

      let pot = escrowAccountInfo.pot.toNumber();
      let decimals = escrowAccountInfo.decimals;
      let usdcVaultBalance = pot / 10 ** decimals;

      return usdcVaultBalance.toString();
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      return null;
    }
  }

  return (
    <>
      <div className="flex items-center justify-center flex-col gap-2 text-xl font-semibold text-center max-w-72">
        <p>Total pot</p>
        <p className="flex justify-center items-center gap-2">
          {vaultBalance == null ? 0 : vaultBalance}
          <span className="inline-block">
            <Image src={LogoUSDC} alt="USDC Coin logo" className="max-w-6 " />
          </span>
        </p>

        {/* <p>Bet for a chance to win it!</p> */}
      </div>
    </>
  );
}
