import { Keypair } from '@solana/web3.js';

export const dummyWallet = {
	publicKey: Keypair.generate().publicKey, // Just a dummy public key
	signTransaction: async (tx: any) => tx, // No-op for signing
	signAllTransactions: async (txs: any) => txs, // No-op for signing multiple
};
