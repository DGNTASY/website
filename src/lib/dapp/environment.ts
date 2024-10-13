import { AnchorProvider, Idl, Program } from '@coral-xyz/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';

export const publicInitAnchor = <T extends Idl>(
	connection: Connection,
	wallet: AnchorWallet,
	programInterface: any,
): {
	provider: AnchorProvider;
	program: Program<T>;
} => {
	const provider = new AnchorProvider(connection, wallet, {
		preflightCommitment: 'processed',
	});
	const program = new Program<T>(programInterface, provider) as Program<T>;
	return { provider, program };
};
