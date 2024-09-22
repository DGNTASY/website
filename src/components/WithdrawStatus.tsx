'use client';

import { PublicKey } from '@solana/web3.js';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

export default async function WithdrawStatus() {
	const { publicKey, signTransaction } = useWallet();

	async function getWithdrawableBalance(): Promise<bigint | null> {
		const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
		if (!contractAddress) {
			return null;
		}

		return null;

		// Add txn fetch

		// const PROGRAM_ID = new PublicKey(contractAddress);
		// const seedsPDA = [Buffer.from('')];
		// const [pdaPublicKey, bumpSeed] = PublicKey.findProgramAddressSync(
		// 	seedsPDA,
		// 	PROGRAM_ID,
		// );

		// const { connection } = useConnection();
		// // lusterApiUrl('mainnet-beta')

		// if (!publicKey) {
		// 	console.error('Wallet not connected');
		// 	return null;
		// }

		// try {
		// 	const accountInfo = await connection.getAccountInfo(pdaPublicKey);

		// 	if (!accountInfo || !accountInfo.data) {
		// 		return null;
		// 	}

		// 	const data = accountInfo.data;
		// 	const dataView = new DataView(data.buffer);

		// 	const authorityPublicKey = new PublicKey(data.slice(0, 32));

		// 	const balance = dataView.getBigUint64(32, true);

		// 	console.log('Authority Public Key:', authorityPublicKey.toBase58());
		// 	console.log('Balance:', balance.toString());

		// 	return balance;
		// } catch (error) {
		// 	console.error('Failed to fetch balance:', error);
		// 	return null;
		// }
	}

	// useState(() => {
	// 	// update it here
	// }, []);

	// const balance = await getWithdrawableBalance();
	// do your formatting
	const balanceString = '';

	return (
		<>
			{balanceString == '' ? (
				<></>
			) : (
				<p>You have {balanceString} USDC to withdraw</p>
			)}
		</>
	);
}
