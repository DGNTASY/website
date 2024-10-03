"use client";

import Link from "next/link";
import { useContext, useMemo, useState } from "react";
import { UserStatusContext } from "@/app/providers";
import Image from "next/image";
import LogoUSDC from "/public/icons/usdc.svg";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { solfotProgramInterface } from "../utils/constants";
import { SfFinal } from "../program/sf_final";

export default function BetInfo() {
  const { userStatus } = useContext(UserStatusContext);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [betAmount, setBetAmount] = useState<string | null>(null);

  useMemo(async () => {
    if (!wallet) {
      return;
    }

    var balance = await getBetAmount();
    setBetAmount(balance);
  }, [wallet]);

  async function getBetAmount(): Promise<string | null> {
    if (!wallet) {
      console.error("No wallet connected");
      return null;
    }

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

    const [escrowAccountPDA, _bumpSeedEscrow] =
      PublicKey.findProgramAddressSync([Buffer.from("escrow")], PROGRAM_ID);

    try {
      const escrowAcccountInfo = await program.account.escrowAccount.fetch(
        escrowAccountPDA
      );

      let decimals = escrowAcccountInfo.decimals;
      let minBetAmount = escrowAcccountInfo.minBetAmount;

      let userPayoutBalance = minBetAmount / 10 ** decimals;

      return userPayoutBalance.toString();
    } catch (error) {
      console.error("Failed to fetch user balance:", error);
      return null;
    }
  }

  function isMobile(userAgent: string): boolean {
    return /android/i.test(userAgent) || /iPhone|iPad|iPod/i.test(userAgent);
  }

  // No bet
  if (!userStatus?.has_betted) {
    return (
      <div className="flex items-center justify-center flex-col gap-2 text-xl font-semibold text-center max-w-72">
        <p>Bet amount is</p>
        <p className="flex justify-center items-center gap-2 text-3xl">
          {betAmount == null ? 0 : betAmount}
          <span className="inline-block">
            <Image src={LogoUSDC} alt="USDC Coin logo" className="max-w-6 " />
          </span>
        </p>
      </div>
    );
  }

  // Bet
  return (
    <>
      <div className="flex items-center justify-center gap-3 flex-col font-semibold text-xl">
        <p>You have already betted!</p>
        <p>
          After the game week took place, press the Update or Send Score button,{" "}
          {/* {isMobile(navigator.userAgent) ? ( */}
          <p>hit Prove</p>
          {/* ) : ( */}
          <>
            scan the QR code with the{" "}
            <Link
              href={"https://reclaimprotocol.org/"}
              className="text-secondary"
            >
              Reclaim app
            </Link>
          </>
          {/* )}{" "} */}
          and send us your score!
        </p>

        <p>Once you win hit the withdraw button and collect your rewards!</p>
      </div>
    </>
  );

  // var formattedDate = 'unavailable';
  // if (currentBlockDate != null) {
  // 	const day = `${currentBlockDate.getDay() < 10 ? `0${currentBlockDate.getDay()}` : currentBlockDate.getDay()}`;
  // 	const month = `${currentBlockDate.getMonth() < 10 ? `0${currentBlockDate.getMonth()}` : currentBlockDate.getMonth()}`;
  // 	const hour = `${currentBlockDate.getHours() < 10 ? `0${currentBlockDate.getHours()}` : currentBlockDate.getHours()}`;
  // 	const minute = `${currentBlockDate.getMinutes() < 10 ? `0${currentBlockDate.getMinutes()}` : currentBlockDate.getMinutes()}`;
  // 	formattedDate = `${day}.${month}, ${hour}:${minute}`;
  // }

  // var gameweekInfo = <span>has an error</span>;
  // if (gameweekStatus == GameWeekStatus.BEFORE) {
  // 	gameweekInfo = <span>is yet to start, place your bet!</span>;
  // } else if (gameweekStatus == GameWeekStatus.DURING) {
  // 	gameweekInfo = (
  // 		<span>started, bets have been placed, waiting for results</span>
  // 	);
  // } else {
  // 	// if (yet to change) {
  // 	//     // const hours = 10;
  // 	//     // const minutes = 10
  // 	//     // gameweekInfo = (
  // 	//     //     <span>
  // 	//     //         is done! Submit your score, you still have {hours} hours, and {minutes} minutes
  // 	//     //     </span>
  // 	//     // )
  // 	// } else {
  // 	//     // this one
  // 	// }

  // 	gameweekInfo = (
  // 		<span>
  // 			is done! Claim your rewards if you are one of the winners, if
  // 			not be ready for next week! Bets open shortly
  // 		</span>
  // 	);
  // }

  // return (
  // 	<>
  // 		<div className="flex items-center justify-center flex-col gap-3">
  // 			<p>The current time is {formattedDate}</p>
  // 			<p>The Gameweek {gameweekInfo}</p>
  // 		</div>
  // 	</>
  // );
}
