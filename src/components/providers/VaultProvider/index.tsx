'use client';

import { useState, createContext, useEffect, useMemo } from 'react';
import BN from 'bn.js';
import { SfFinal } from '@/idl/mainnet-beta/sf_final';
import { publicInitAnchor } from '@/lib/dapp/environment';
import { useConnection } from '@solana/wallet-adapter-react';
import { dummyWallet } from '@/utils/wallet';
import {
	findEscrowPdaProgramId,
	getProgramId,
	solfotProgramInterface,
} from '@/utils/program';

export const VaultContext = createContext({
	vaultBalance: null as BN | null,
	updateVaultBalance: async () => {},
	vaultBet: null as BN | null,
	updateVaultBet: async () => {},
});

export default function VaultProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { connection } = useConnection();

	const [vaultBalance, setVaultBalance] = useState<BN | null>(null);
	const updateVaultBalance = async () => {
		console.log('Updating vault balance...');
		const us = await getVaultBalance();
		console.log(`tos: ${us}`);
		setVaultBalance(us);
	};

	async function getVaultBalance(): Promise<BN | null> {
		const { program } = publicInitAnchor<SfFinal>(
			connection,
			dummyWallet, // as we do only fetches
			solfotProgramInterface,
		);

		const programId = getProgramId();
		if (!programId) {
			console.error('failed loading program id');
			return null;
		}

		const [escrowPDA, _bumpSeed] = findEscrowPdaProgramId(programId);

		try {
			const escrowAccountInfo =
				await program.account.escrowAccount.fetch(escrowPDA);

			console.log(escrowAccountInfo);

			let pot = escrowAccountInfo.pot as BN;
			let decimals = escrowAccountInfo.decimals;

			return pot.div(new BN(10 ** decimals));
		} catch (error) {
			console.error('Failed to fetch balance:', error);
			return null;
		}
	}

	const [vaultBet, setVaultBet] = useState<BN | null>(null);
	const updateVaultBet = async () => {
		console.log('Updating vault bet...');
		const us = await getBetAmount();
		console.log(`tos: ${us}`);
		setVaultBet(us);
	};

	async function getBetAmount(): Promise<BN | null> {
		const { program } = publicInitAnchor<SfFinal>(
			connection,
			dummyWallet, // as we do only fetches
			solfotProgramInterface,
		);

		const programId = getProgramId();
		if (!programId) {
			console.error('Invalid program Id');
			return null;
		}

		const [escrowAccountPDA, _bumpSeedEscrow] =
			findEscrowPdaProgramId(programId);

		try {
			const escrowAcccountInfo =
				await program.account.escrowAccount.fetch(escrowAccountPDA);

			let decimals = escrowAcccountInfo.decimals;
			let minBetAmount = escrowAcccountInfo.minBetAmount as BN;

			return minBetAmount.div(new BN(10 ** decimals));
		} catch (error) {
			console.error('Failed to fetch user balance:', error);
			return null;
		}
	}

	useMemo(async () => {
		console.log('Loading Vault context');
		await updateVaultBalance();
		await updateVaultBet();
	}, []);

	return (
		<VaultContext.Provider
			value={{
				vaultBalance,
				updateVaultBalance,
				vaultBet,
				updateVaultBet,
			}}
		>
			{children}
		</VaultContext.Provider>
	);
}
