import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";

import type { SolanaFpl } from "@/idl/solana_fpl";
import IDL from "@/idl/solana_fpl.json";
import { Wallet } from "@coral-xyz/anchor/dist/cjs/provider";

export const getProgram = (connection: Connection, wallet: Wallet) => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  const program = new Program<SolanaFpl>(IDL as SolanaFpl, provider);
  return program;
};
