'use client';

import { Button } from '@nextui-org/react';
import {
	PublicKey,
	Transaction,
	TransactionInstruction,
} from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';

export default function WithdrawButton() {
	const [txnSignature, setTxnSignature] = useState('');
	const { publicKey, sendTransaction } = useWallet();

	async function withdrawTransaction() {
		// ensure wallet is there
		if (!publicKey) {
			console.error('Wallet not connected');
			return;
		}

		// Prepare contract public key
		const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
		if (!contractAddress) {
			console.error('Failed to get contract address');
			return;
		}
		var caPublicKey: PublicKey;
		try {
			caPublicKey = new PublicKey(contractAddress!);
		} catch (erroor) {
			// Invalid public key
			console.error('Failed to parse publick key');
			return;
		}

		const contractAddressUSDC = process.env.NEXT_PUBLIC_USDC_ADDRESS;
		if (!contractAddressUSDC) {
			console.error('Failed to get USDC address');
			return;
		}
		var usdcPublicKey: PublicKey;
		try {
			usdcPublicKey = new PublicKey(contractAddress!);
		} catch (erroor) {
			// Invalid public key
			console.error('Failed to parse USDC publick key');
			return;
		}

		const connectionCtx = useConnection();

		// prepare accounts
		const [escrowAccountPDA, escrowAccountBump] =
			PublicKey.findProgramAddressSync(
				[Buffer.from('escrow')],
				caPublicKey,
			);
		const escrowAccount = {
			pubkey: escrowAccountPDA,
			isSigner: false,
			isWritable: true,
		};

		const [userAccountPDA, userAccountBump] =
			PublicKey.findProgramAddressSync(
				[Buffer.from('user'), publicKey.toBuffer()],
				caPublicKey,
			);
		const userAccount = {
			pubkey: userAccountPDA,
			isSigner: false,
			isWritable: true,
		};

		const signer = {
			pubkey: publicKey,
			isSigner: true,
			isWritable: true,
		};

		// Check
		const userTokenAcc = await getAssociatedTokenAddress(
			usdcPublicKey,
			publicKey,
		);
		const userTokenAccount = {
			pubkey: userTokenAcc,
			isSigner: false,
			isWritable: true,
		};

		const escrowTokenAcc = await getAssociatedTokenAddress(
			usdcPublicKey,
			escrowAccountPDA,
		);
		const escrowTokenAccount = {
			pubkey: escrowTokenAcc,
			isSigner: false,
			isWritable: true,
		};

		const tokenProgram = {
			pubkey: TOKEN_PROGRAM_ID,
			isSigner: false,
			isWritable: false,
		};

		// Add txn fetch

		try {
			const txn = new Transaction().add(
				new TransactionInstruction({
					keys: [
						escrowAccount, // Escrow Account
						userAccount, // User Account
						signer, // Signer
						userTokenAccount, // User Token Account
						escrowTokenAccount, // Escrow Token Account
						tokenProgram, // Token Program
					],
					programId: caPublicKey,
					// No data
				}),
			);

			const signature = await sendTransaction(
				txn,
				connectionCtx.connection,
			);
			await connectionCtx.connection.confirmTransaction(
				signature,
				'confirmed',
			);
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
				className="font-extrabold text-white"
				onClick={withdrawTransaction}
			>
				Withdraw
			</Button>

			{txnSignature != '' ? (
				<p>Withdraw succesfull, txn signature: {txnSignature}</p>
			) : (
				<></>
			)}
		</>
	);
}
