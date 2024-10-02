'use client';

import Image from 'next/image';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { useMemo, useState } from 'react';
import { SfFinal } from './program/sf_final';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { solfotProgramInterface } from './utils/constants';
import LogoUSDC from '/public/icons/usdc.svg';

export default function WithdrawStatus() {
	const [withdrawableBalance, setWithdrawableBalance] = useState<
		string | null
	>(null);
	const { connection } = useConnection();
	const wallet = useAnchorWallet();

	useMemo(async () => {
		if (!wallet) {
			return;
		}

		var balance = await getWithdrawableBalance();
		setWithdrawableBalance(balance);
	}, [wallet]);

	async function getWithdrawableBalance(): Promise<string | null> {
		const provider = new AnchorProvider(connection, wallet!);
		const program = new Program(
			solfotProgramInterface,
			provider,
		) as Program<SfFinal>;

		const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
		if (!contractAddress) {
			return null;
		}

		const PROGRAM_ID = new PublicKey(contractAddress!);
		if (!PROGRAM_ID) {
			console.error('Error making public key');
			return null;
		}

		const [userAccountPDA, _bumpSeedUser] =
			PublicKey.findProgramAddressSync(
				[Buffer.from('user'), wallet!.publicKey.toBuffer()],
				PROGRAM_ID,
			);
		const [escrowAccountPDA, _bumpSeedEscrow] =
			PublicKey.findProgramAddressSync(
				[Buffer.from('escrow')],
				PROGRAM_ID,
			);

		try {
			const userAcccountInfo =
				await program.account.userAccount.fetch(userAccountPDA);
			const escrowAcccountInfo =
				await program.account.escrowAccount.fetch(escrowAccountPDA);

			let balance = userAcccountInfo.payoutAmount.toNumber();
			let decimals = escrowAcccountInfo.decimals;

			let userPayoutBalance = balance / 10 ** decimals;

			return userPayoutBalance.toString();
		} catch (error) {
			console.error('Failed to fetch user balance:', error);
			return null;
		}
	}

	return (
		<>
			<div className="text-xl font-semibold text-center flex flex-col items-center justify-center gap-3">
				<p>You have</p>
				<p>
					{withdrawableBalance == null ? 0 : withdrawableBalance}
					<span className="inline-block">
						<Image
							src={LogoUSDC}
							alt="USDC Coin logo"
							className="max-w-6 translate-y-1"
						/>
					</span>{' '}
				</p>
				<p>to withdraw</p>
			</div>
		</>
	);
}
