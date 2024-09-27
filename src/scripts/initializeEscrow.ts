import * as anchor from "@coral-xyz/anchor";
import {
  PublicKey,
  Keypair,
  Connection,
  SystemProgram,
} from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { AnchorProvider, Program, Wallet, BN } from "@coral-xyz/anchor";
import * as idlJson from "./../idl/solana_fpl.json";
import { getKeypairFromFile } from "@solana-developers/helpers";

const initWeb3 = async (): Promise<{
  program: Program;
  provider: AnchorProvider;
  owner: Keypair;
  user: Keypair;
}> => {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const owner = await getKeypairFromFile("/home/ritikbhatt020/multi-token-escrow/keys/admin-CAT5qnvWfU9LQyprcLrXDMMifR6tL95nCrsNk8Mx12C7.json");
  const user = await getKeypairFromFile("/home/ritikbhatt020/solana_fpl/tests/userKeypair.json");
  const wallet = new Wallet(owner);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  const program = new Program(idlJson as any, provider);

  return { program, provider, owner, user };
};

const initializeEscrow = async () => {
  try {
    const { program, provider, owner, user } = await initWeb3();
    const totalPotForWinners = new BN(10000000);
    const betAmount = new BN(1000000);
    const usdcMint = new PublicKey("FYweYhWDmaD2Hkh5EUPrRwuymSzMyCtesKQjK6J8FyFc");
    const [escrowAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow")],
      program.programId
    );
    const [userAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), user.publicKey.toBuffer()],
      program.programId
    );
    console.log("Escrow Account PDA:", escrowAccount.toBase58());
    console.log("User Account PDA:", userAccount.toBase58());
    const escrowTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      owner,
      usdcMint,
      escrowAccount,
      true
    );
    console.log("Escrow Token Account:", escrowTokenAccount.address.toBase58());
    const tx = await program.methods.initializeEscrow(usdcMint, totalPotForWinners, betAmount)
      .accounts({
        owner: owner.publicKey,
      })
      .signers([owner])
      .rpc();
    console.log("Transaction:", tx);
  } catch (err) {
    console.error("Error initializing escrow:", err);
  }
};

initializeEscrow();
