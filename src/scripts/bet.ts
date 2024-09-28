import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Connection } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import * as idlJson from "./../idl/solana_fpl.json";
import { getKeypairFromFile } from "@solana-developers/helpers";
import { Wallet } from "@coral-xyz/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const initWeb3 = async (publicKey: PublicKey, sendTransaction: any): Promise<{
  program: Program;
  provider: AnchorProvider;
}> => {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  // const owner = await getKeypairFromFile("/home/ritikbhatt020/multi-token-escrow/keys/admin-CAT5qnvWfU9LQyprcLrXDMMifR6tL95nCrsNk8Mx12C7.json");

  const wallet = useAnchorWallet(); 
  if (!wallet) {
    throw new Error("Wallet not connected");
  }
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  const program = new Program(idlJson as any, provider);

  return { program, provider };
};

export const placeBet = async (publicKey: PublicKey, sendTransaction: any) => {
  try {
    const { program, provider } = await initWeb3(publicKey, sendTransaction);
    console.log("sendTransaction:", sendTransaction);
    const betAmount = new BN(1000000);
    const usdcMint = new PublicKey("HCSiP6rpyafC4sYNwosetDNvFQuKJ662EJvizuEpXMbn");
    const owner = await getKeypairFromFile("/home/ritikbhatt020/multi-token-escrow/keys/admin-CAT5qnvWfU9LQyprcLrXDMMifR6tL95nCrsNk8Mx12C7.json");
    console.log("owner:", owner);
    // Fetch the PDAs
    const [escrowAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow")],
      program.programId
    );
    console.log("escrowAccount", escrowAccount)
    // Fetch user token account (payer as provider.wallet.payer)
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      owner, // Use the provider's payer (Signer's Keypair)
      usdcMint, // Token Mint (USDC)
      publicKey, // Owner of the token account
      true
    );
    console.log("userTokenAccount:", userTokenAccount.address.toBase58());

    // Fetch escrow token account (payer as provider.wallet.payer)
    const escrowTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      owner, // Use the provider's payer (Signer's Keypair)
      usdcMint, // Token Mint (USDC)
      escrowAccount, // Owner of the escrow token account (PDA)
      true
    );
    console.log("escrowTokenAccount:", escrowTokenAccount.address.toBase58());

    // Place the bet by calling the bet method on the program
    const tx = await program.methods
      .bet()
      .accounts({
        user: publicKey,
        userTokenAccount: userTokenAccount.address,
        escrowTokenAccount: escrowTokenAccount.address,
      })
      .rpc();
    
    console.log("Transaction:", tx);
    console.log("Bet placed successfully.");
  } catch (err) {
    console.error("Error placing bet:", err);
  }
};
