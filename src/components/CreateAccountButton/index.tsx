'use client';

import { Button } from '../ui//button';
import {
	useConnection,
	useWallet,
	useAnchorWallet,
} from '@solana/wallet-adapter-react';
import { useContext } from 'react';
import { solfotProgramInterface } from '@/utils/program';
import { SfFinal } from '@/idl/mainnet-beta/sf_final';
import { UserStatusContext } from '@/components/providers/UserStatusProvider';
import { publicInitAnchor } from '@/lib/dapp/environment';

export default function CreateAccountButton() {
	const { updateUserStatus } = useContext(UserStatusContext);
	const { sendTransaction } = useWallet();
	const { connection } = useConnection();
	const wallet = useAnchorWallet();

	async function initializeAccountTransaction() {
		if (!wallet) {
			console.error('Wallet not connected');
			return;
		}

		const { program } = publicInitAnchor<SfFinal>(
			connection,
			wallet,
			solfotProgramInterface,
		);

		const transaction = await program.methods
			.initializeUser()
			.transaction();

		transaction.recentBlockhash = (
			await connection.getLatestBlockhash()
		).blockhash;
		transaction.feePayer = wallet.publicKey;

		try {
			// Sign and make transaction
			const sig = await sendTransaction(transaction, connection);
			connection.onSignature(
				sig,
				async () => {
					await updateUserStatus();
				},
				'confirmed',
			);
		} catch (error) {
			console.error(`Transaction failed: ${error}`);
		}
	}

	return (
		<Button
			color="primary"
			className="bg-[#43a3fe] text-theme font-semibold rounded-md hover:bg-[#43a3fe] "
			onClick={initializeAccountTransaction}
		>
			CREATE ACCOUNT
		</Button>
	);
}
