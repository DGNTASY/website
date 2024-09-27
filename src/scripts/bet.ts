import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair, Connection } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
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
  console.log(user.publicKey);
  const wallet = new Wallet(owner);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  const program = new Program(idlJson as any, provider);

  return { program, provider, owner, user };
};

const placeBet = async () => {
  try {
    const { program, provider, owner, user } = await initWeb3();
    const betAmount = new BN(1000000);
    const usdcMint = new PublicKey("HCSiP6rpyafC4sYNwosetDNvFQuKJ662EJvizuEpXMbn");

    // Fetch the PDAs
    const [escrowAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow")],
      program.programId
    );
    const [userAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), user.publicKey.toBuffer()],
      program.programId
    );

    // Fetch user and escrow token accounts
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user, // Payer
      usdcMint, // Token Mint (USDC)
      user.publicKey, // Owner of the token account
      true
    );
    console.log("userTokenAccount:", userTokenAccount.address.toBase58());

    const escrowTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      owner, // Payer
      usdcMint, // Token Mint (USDC)
      escrowAccount, // Owner of the escrow token account (PDA)
      true
    );
    console.log("escrowTokenAccount:", escrowTokenAccount.address.toBase58());

    // Place the bet by calling the bet method on the program
    const tx = await program.methods
      .bet()
      .accounts({
        user: user.publicKey,
        userTokenAccount: userTokenAccount.address,
        escrowTokenAccount: escrowTokenAccount.address,
      })
      .signers([user])
      .rpc();
    
    console.log("Transaction:", tx);

    console.log("Bet placed successfully.");
  } catch (err) {
    console.error("Error placing bet:", err);
  }
};

placeBet();
