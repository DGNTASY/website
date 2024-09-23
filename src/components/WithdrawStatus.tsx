'use client';

import { PublicKey } from '@solana/web3.js';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { u8, struct } from '@solana/buffer-layout';
import { publicKey, u64, bool } from '@solana/buffer-layout-utils';

const USER_ACCOUNT_LAYOUT = struct([
	publicKey('owner'),
	bool('is_eligible'),
	u64('payout_amount'),
	u8('bump'),
]);

type UserAccount = {
	owner: PublicKey;
	is_eligible: boolean;
	payout_amount: bigint;
	bump: number;
};

export default async function WithdrawStatus() {
	const { publicKey } = useWallet();
	const [withdrawableBalance, setWithdrawableBalance] = useState<
		string | null
	>(null);

	async function getWithdrawableBalance(): Promise<string | null> {
		const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
		if (!contractAddress) {
			return null;
		}

		// Add txn fetch
		if (!publicKey) {
			console.error('Wallet not connected');
			return null;
		}

		const PROGRAM_ID = new PublicKey(contractAddress!);
		const seedsPDA = [Buffer.from('user'), publicKey.toBuffer()];
		const [publicKeyPDA, bumpSeed] = PublicKey.findProgramAddressSync(
			seedsPDA,
			PROGRAM_ID,
		);

		const { connection } = useConnection();

		try {
			const accInfo = await connection.getAccountInfo(publicKeyPDA);

			if (!accInfo || !accInfo.data) {
				return null;
			}

			const desUserAccount = USER_ACCOUNT_LAYOUT.decode(
				accInfo.data,
			) as UserAccount;

			if (!desUserAccount.is_eligible) {
				return null;
			}

			// Add correct scaling of value
			return desUserAccount.payout_amount.toString();
		} catch (error) {
			console.error('Failed to fetch balance:', error);
			return null;
		}
	}

	useEffect(() => {
		// update it here
		async function updateWithdrawableBalance() {
			var balance = await getWithdrawableBalance();
			setWithdrawableBalance(balance);
		}
		updateWithdrawableBalance();
	}, []);

	return (
		<>
			{withdrawableBalance == null ? (
				<></>
			) : (
				<p>You have {withdrawableBalance} USDC to withdraw</p>
			)}
		</>
	);
}
