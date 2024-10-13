'use client';

import {
	useAnchorWallet,
	useConnection,
	useWallet,
} from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import {
	findEscrowPdaProgramId,
	getProgramId,
	getUSDCProgramId,
	solfotProgramInterface,
} from '@/utils/program';
import { SfFinal } from '@/idl/mainnet-beta/sf_final';
import { Button } from '../ui/button';
import { publicInitAnchor } from '@/lib/dapp/environment';

interface Props {
	disabled?: boolean;
	amount?: number;
}

export default function WithdrawButton({ disabled, amount }: Props) {
	const [txnSignature, setTxnSignature] = useState('');
	const { sendTransaction } = useWallet();
	const wallet = useAnchorWallet();
	const { connection } = useConnection();

	async function withdrawTransaction() {
		if (amount == 0) {
			return;
		}

		// ensure wallet is there
		if (!wallet) {
			console.error('Wallet not connected');
			return;
		}

		// Prepare contract public key
		const programId = getProgramId();
		if (!programId) {
			console.error('Failed to get program id');
			return;
		}

		const usdcProgramId = getUSDCProgramId();
		if (!usdcProgramId) {
			console.error('Failed to get USDC program Id');
			return;
		}

		const { program } = publicInitAnchor<SfFinal>(
			connection,
			wallet,
			solfotProgramInterface,
		);

		// prepare accounts
		const [escrowAccountPDA, _escrowAccountBump] =
			findEscrowPdaProgramId(programId);

		const userTokenAcc = getAssociatedTokenAddressSync(
			usdcProgramId,
			wallet.publicKey,
		);

		const escrowTokenAcc = (
			await program.account.escrowAccount.fetch(escrowAccountPDA)
		).usdcTokenAccount;

		try {
			const transaction = await program.methods
				.withdraw()
				.accounts({
					escrowTokenAccount: escrowTokenAcc,
					userTokenAccount: userTokenAcc,
				})
				.transaction();

			const signature = await sendTransaction(transaction, connection);
			setTxnSignature(signature);
		} catch (error) {
			setTxnSignature('');
			console.error('Transaction failed:', error);
		}
	}

	return (
		<>
			<Button
				color="primary"
				className="bg-[#43a3fe] text-theme font-semibold rounded-md hover:bg-[#43a3fe]"
				disabled={disabled}
				onClick={withdrawTransaction}
			>
				CLAIM PRIZE
			</Button>

			{txnSignature != '' ? (
				<div>
					<p>PRIZE CLAIMED SUCCESSFULLY</p>
				</div>
			) : (
				<></>
			)}
		</>
	);
}
