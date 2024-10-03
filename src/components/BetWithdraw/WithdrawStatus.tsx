"use client";

import Image from "next/image";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useMemo, useState } from "react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import LogoUSDC from "/public/icons/usdc.svg";
import { solfotProgramInterface } from "../utils/constants";
import { SfFinal } from "../program/sf_final";

export default function WithdrawStatus() {
  const [withdrawableBalance, setWithdrawableBalance] = useState<string | null>(
    null
  );
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useMemo(async () => {
    if (!wallet) {
      return;
    }

    var balance = await getWithdrawableBalance();
    setWithdrawableBalance(balance);
  }, [wallet]);

  async function getWithdrawableBalance(): Promise<string | null> {
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

    const [userAccountPDA, _bumpSeedUser] = PublicKey.findProgramAddressSync(
      [Buffer.from("user"), wallet!.publicKey.toBuffer()],
      PROGRAM_ID
    );
    const [escrowAccountPDA, _bumpSeedEscrow] =
      PublicKey.findProgramAddressSync([Buffer.from("escrow")], PROGRAM_ID);

    try {
      const userAcccountInfo = await program.account.userAccount.fetch(
        userAccountPDA
      );
      const escrowAcccountInfo = await program.account.escrowAccount.fetch(
        escrowAccountPDA
      );

      let balance = userAcccountInfo.payoutAmount.toNumber();
      let decimals = escrowAcccountInfo.decimals;

      let userPayoutBalance = balance / 10 ** decimals;

      return userPayoutBalance.toString();
    } catch (error) {
      console.error("Failed to fetch user balance:", error);
      return null;
    }
  }

  return (
    <>
      <div className="text-xl font-semibold text-center flex flex-col items-center justify-center gap-3">
        <div className="flex">
          <p>You have &nbsp;</p>
          <p className="flex gap-2 justify-center items-center">
            {withdrawableBalance == null ? 0 : withdrawableBalance}
            <span className="">
              <Image src={LogoUSDC} alt="USDC Coin logo" className="max-w-6 " />
            </span>
          </p>
        </div>
        <p>to withdraw</p>
      </div>
    </>
  );
}
