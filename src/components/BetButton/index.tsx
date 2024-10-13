'use client';

import {
	useConnection,
	useWallet,
	useAnchorWallet,
} from '@solana/wallet-adapter-react';
import { useContext, useState } from 'react';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { UserStatusContext } from '@/components/providers/UserStatusProvider';
import {
	findEscrowPdaProgramId,
	getProgramId,
	getUSDCProgramId,
	solfotProgramInterface,
} from '@/utils/program';
import { SfFinal } from '@/idl/mainnet-beta/sf_final';
import { Button } from '../ui/button';
import { publicInitAnchor } from '@/lib/dapp/environment';
import { postBetURL } from '@/lib/api/routes';

interface Props {
	disabled?: boolean;
}

export default function BetButton({ disabled }: Props) {
	const [betTxnSignature, setBetTxnSignature] = useState('');
	const { userStatus, updateUserStatus } = useContext(UserStatusContext);
	const { sendTransaction } = useWallet();
	const { connection } = useConnection();
	const wallet = useAnchorWallet();

	async function betTransaction() {
		if (!wallet) {
			console.error('Wallet not connected');
			return;
		}

		const programId = getProgramId();
		if (!programId) {
			console.error('Failed to get contract address');
			return;
		}

		const USDCprogramId = getUSDCProgramId();
		if (!USDCprogramId) {
			console.error('Failed to get contract address');
			return;
		}

		const { program } = publicInitAnchor<SfFinal>(
			connection,
			wallet,
			solfotProgramInterface,
		);

		const [escrowAccountPDA, _escrowAccountBump] =
			findEscrowPdaProgramId(programId);

		const userTokenAcc = await getAssociatedTokenAddress(
			USDCprogramId,
			wallet.publicKey,
		);
		const escrowTokenAcc = (
			await program.account.escrowAccount.fetch(escrowAccountPDA)
		).usdcTokenAccount;

		const transaction = await program.methods
			.bet()
			.accounts({
				escrowTokenAccount: escrowTokenAcc,
				userTokenAccount: userTokenAcc,
			})
			.transaction();

		try {
			// Sign and make transaction
			const txn = await sendTransaction(transaction, connection);

			// Send transaction to backend
			try {
				const res = await fetch(postBetURL, {
					method: 'POST',
					body: JSON.stringify({
						transactionHash: txn,
					}),
				});

				if (res.ok) {
					console.log('Bet Confirmed');
					setBetTxnSignature(txn);
					await updateUserStatus();
				} else {
					console.error(
						`Error confirming bet: ${res.status}, ${res.statusText}`,
					);
				}
			} catch (error) {
				console.error(`Error confirming bet: ${error}`);
			}
		} catch (error) {
			console.error(`Bet transaction failed: ${error}`);
		}
	}

	return (
		<div className="flex items-center justify-center gap-5 flex-col">
			{userStatus?.has_betted == true ? (
				<p className="p-3 bg-[#43a3fe] text-theme font-semibold">
					You have already placed a bet for the current gameweek
				</p>
			) : (
				<Button
					onClick={betTransaction}
					disabled={disabled}
					className="px-4 py-2 bg-[#43a3fe] text-theme font-semibold rounded-md hover:bg-[#43a3fe]"
				>
					PLACE BET
				</Button>
			)}

			{betTxnSignature != '' ? (
				<p className="p-3 bg-[#43a3fe] text-theme font-semibold">
					Bet succesfull
				</p>
			) : (
				<></>
			)}
		</div>
	);
}
