'use client';

import { GameWeekStatus } from './GameWeekStatus';
import { PublicKey } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { u8, struct } from '@solana/buffer-layout';
import { publicKey, u64, u128 } from '@solana/buffer-layout-utils';

const VAULT_ACCOUNT_LAYOUT = struct([
	publicKey('authority'),
	publicKey('usdc_mint'),
	u64('total_pot_for_winners'),
	u64('bet_amount'),
	u128('usdc_balance'),
	u8('bump'),
]);

type VaultAccount = {
	authority: PublicKey;
	usdc_mint: PublicKey;
	total_pot_for_winners: bigint;
	bet_amount: bigint;
	usdc_balance: bigint;
	bump: number;
};

export default function BetVaultBalance({
	gameweekStatus,
}: {
	gameweekStatus: GameWeekStatus;
}) {
	const [vaultBalance, setVaultBalance] = useState<string | null>(null);

	async function getVaultBalance(): Promise<string | null> {
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
		if (!PROGRAM_ID) {
			console.error('Error making public key');
			return null;
		}

		const seedsPDA = [Buffer.from('escrow')];
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

			const desVaultAccount = VAULT_ACCOUNT_LAYOUT.decode(
				accInfo.data,
			) as VaultAccount;

			// Add correct scaling of value
			return desVaultAccount.total_pot_for_winners.toString();
		} catch (error) {
			console.error('Failed to fetch balance:', error);
			return null;
		}
	}

	useEffect(() => {
		// update it here
		async function updateWithdrawableBalance() {
			var balance = await getVaultBalance();
			setVaultBalance(balance);
		}
		updateWithdrawableBalance();
	}, []);

	return (
		<>
			{vaultBalance == null ? (
				<></>
			) : (
				<div>
					<p>The vault has a total pot of {vaultBalance} USDDC!</p>
					<p>Bet for a chance to win it!</p>
				</div>
			)}
		</>
	);
}
