import { placeBet } from "@/scripts/bet";
import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();  // Parse the request body
    const { publicKey, sendTransaction } = body;
    console.log("Public Key Api:", publicKey)
    console.log("ST:", sendTransaction)

    if (!publicKey) {
      return NextResponse.json({ error: "Missing publicKey or sendTransaction" });
    }

    // Convert publicKey string to PublicKey object
    const userPublicKey = new PublicKey(publicKey);

    // Call the placeBet function with the parsed publicKey and sendTransaction
    await placeBet(userPublicKey, sendTransaction);

    return NextResponse.json({ message: "Bet placed successfully" });
  } catch (error) {
    console.error("Error placing bet:", error);
    return NextResponse.json({ error: "Failed to place bet" });
  }
}
