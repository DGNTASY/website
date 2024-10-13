'use client';

import Image from 'next/image';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { useMemo, useState } from 'react';
import LogoUSDC from '/public/icons/usdc.svg';
import {
	findEscrowPdaProgramId,
	findUserPdaProgramId,
	getProgramId,
	solfotProgramInterface,
} from '@/utils/program';
import { SfFinal } from '@/idl/mainnet-beta/sf_final';
import { publicInitAnchor } from '@/lib/dapp/environment';

import WithdrawButton from './WithdrawButton';

export default function BetWithdraw() {
	const [withdrawableBalance, setWithdrawableBalance] = useState<{
		asString: string;
		asNumber: number;
	} | null>(null);
	const { connection } = useConnection();
	const wallet = useAnchorWallet();

	useMemo(async () => {
		if (!wallet) {
			return;
		}

		var balance = await getWithdrawableBalance();
		setWithdrawableBalance(balance);
	}, [wallet]);

	async function getWithdrawableBalance(): Promise<{
		asString: string;
		asNumber: number;
	} | null> {
		if (!wallet) {
			console.error('Wallet not connected');
			return null;
		}

		const { program } = publicInitAnchor<SfFinal>(
			connection,
			wallet,
			solfotProgramInterface,
		);

		const programId = getProgramId();
		if (!programId) {
			console.error('Failed loading program ID');
			return null;
		}

		const [userAccountPDA, _bumpSeedUser] = findUserPdaProgramId(
			wallet.publicKey,
			programId,
		);
		const [escrowAccountPDA, _bumpSeedEscrow] =
			findEscrowPdaProgramId(programId);

		try {
			const userAcccountInfo =
				await program.account.userAccount.fetch(userAccountPDA);
			const escrowAcccountInfo =
				await program.account.escrowAccount.fetch(escrowAccountPDA);

			let balance = userAcccountInfo.payoutAmount.toNumber();
			let decimals = escrowAcccountInfo.decimals;

			let userPayoutBalance = balance / 10 ** decimals;

			return {
				asString: userPayoutBalance.toString(),
				asNumber: userPayoutBalance,
			};
		} catch (error) {
			console.error('Failed to fetch user balance:', error);
			return null;
		}
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center gap-5">
				<div className="text-xl font-semibold text-center flex flex-col items-center justify-center gap-3">
					<div className="flex">
						<p>You have &nbsp;</p>
						<p className="flex gap-2 justify-center items-center">
							{withdrawableBalance == null
								? 0
								: withdrawableBalance.asString}
							<span className="">
								<Image
									src={LogoUSDC}
									alt="USDC Coin logo"
									className="max-w-6"
								/>
							</span>
						</p>
					</div>
					<p>to withdraw</p>
				</div>

				<WithdrawButton
					disabled={
						withdrawableBalance
							? withdrawableBalance.asNumber > 0
							: false
					}
					amount={
						withdrawableBalance ? withdrawableBalance.asNumber : 0
					}
				/>
			</div>
		</>
	);
}
