'use client';

import { Button } from '@nextui-org/react';
import {
	useConnection,
	useWallet,
	useAnchorWallet,
} from '@solana/wallet-adapter-react';
import { useContext } from 'react';
import { solfotProgramInterface } from './utils/constants';
import { SfFinal } from './program/sf_final';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { UserStatusContext } from '@/app/providers';

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

		const provider = new AnchorProvider(connection, wallet);
		const program = new Program(
			solfotProgramInterface,
			provider,
		) as Program<SfFinal>;

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

			console.log('Sig: ', sig);

			connection.onSignature(
				sig,
				() => {
					updateUserStatus();
					window.location.reload(); // bad, but use state is not working properly here
				},
				'confirmed',
			);
		} catch (error) {
			const err = `Transaction failed: ${error}`;
			console.error(err);
		}
	}

	return (
		<Button
			color="primary"
			className="font-extrabold text-white"
			onClick={initializeAccountTransaction}
		>
			Ceate Account
		</Button>
	);
}
