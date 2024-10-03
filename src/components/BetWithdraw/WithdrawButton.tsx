"use client";

import { PublicKey } from "@solana/web3.js";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useState } from "react";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { solfotProgramInterface } from "../utils/constants";
import { SfFinal } from "../program/sf_final";
import { Button } from "../ui/button";

export default function WithdrawButton() {
  const [txnSignature, setTxnSignature] = useState("");
  const { sendTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  async function withdrawTransaction() {
    // ensure wallet is there
    if (!wallet) {
      console.error("Wallet not connected");
      return;
    }

    // Prepare contract public key
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.error("Failed to get contract address");
      return;
    }
    var caPublicKey: PublicKey;
    try {
      caPublicKey = new PublicKey(contractAddress!);
    } catch (erroor) {
      // Invalid public key
      console.error("Failed to parse publick key");
      return;
    }

    const contractAddressUSDC = process.env.NEXT_PUBLIC_USDC_ADDRESS;
    if (!contractAddressUSDC) {
      console.error("Failed to get USDC address");
      return;
    }
    var usdcPublicKey: PublicKey;
    try {
      usdcPublicKey = new PublicKey(contractAddressUSDC!);
    } catch (erroor) {
      // Invalid public key
      console.error("Failed to parse USDC publick key");
      return;
    }

    const provider = new AnchorProvider(connection, wallet);
    const program = new Program(
      solfotProgramInterface,
      provider
    ) as Program<SfFinal>;

    // prepare accounts
    const [escrowAccountPDA, _escrowAccountBump] =
      PublicKey.findProgramAddressSync([Buffer.from("escrow")], caPublicKey);

    const userTokenAcc = getAssociatedTokenAddressSync(
      usdcPublicKey,
      wallet.publicKey
    );

    const escrowTokenAcc = (
      await program.account.escrowAccount.fetch(escrowAccountPDA)
    ).usdcTokenAccount;

    try {
      const transaction = await program.methods
        .withdraw()
        .accounts({
          escrowTokenAccount: escrowTokenAcc,
          userTokenAccount: userTokenAcc,
        })
        .transaction();

      const signature = await sendTransaction(transaction, connection);
      setTxnSignature(signature);
    } catch (error) {
      setTxnSignature("");
      console.error("Transaction failed:", error);
    }
  }

  return (
    <>
      <Button
        color="primary"
        className="bg-[#43a3fe] text-theme font-semibold rounded-md hover:bg-[#43a3fe] "
        onClick={withdrawTransaction}
      >
        Withdraw
      </Button>

      {txnSignature != "" ? (
        <div>
          <p>Withdraw succesfull</p>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
