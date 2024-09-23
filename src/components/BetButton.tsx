'use client';

import { Button } from '@nextui-org/react';
import {
	SystemProgram,
	Transaction,
	TransactionInstruction,
	PublicKey,
} from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';

type UserStatus = {
	score: string;
	has_betted: boolean;
};

export default function BetButton({ status }: { status: UserStatus | null }) {
	// const [status, setStatus] = useState<UserStatus | null>(null);
	const [txnSignature, setTxnSignature] = useState('');
	const { publicKey, sendTransaction } = useWallet();
	const betURL = '/api/bet';

	async function betTransaction() {
		if (!publicKey) {
			console.error('Wallet not connected');
			return;
		}

		const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
		if (!contractAddress) {
			console.error('Failed to get contract address');
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
			console.error('Failed to get contract address');
		}
		var usdcPublicKey: PublicKey;
		try {
			usdcPublicKey = new PublicKey(contractAddressUSDC!);
		} catch (erroor) {
			// Invalid public key
			console.error('Failed to parse publick key');
			return;
		}

		// Get accounts
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
				[Buffer.from('escrow')],
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

		const systemProgram = {
			pubkey: SystemProgram.programId,
			isSigner: false,
			isWritable: true,
		};
		const tokenProgram = {
			pubkey: TOKEN_PROGRAM_ID,
			isSigner: false,
			isWritable: false,
		};

		try {
			// Create transaction
			const transaction = new Transaction().add(
				new TransactionInstruction({
					keys: [
						escrowAccount, // Escrow Account
						userAccount, // User account
						signer, // signer
						userTokenAccount, // user token account
						escrowTokenAccount, // escrow token account
						systemProgram,
						tokenProgram,
					],
					programId: publicKey,
					// data:
				}),
			);

			// Sign and make transaction
			const connectionContext = useConnection();
			const txn = await sendTransaction(
				transaction,
				connectionContext.connection,
			);

			// Send transaction to backend
			try {
				const res = await fetch(betURL, {
					method: 'POST',
					body: JSON.stringify({
						transactionHash: txn,
					}),
				});

				if (res.ok) {
					console.log('Bet Confirmed');
				} else {
					console.error(
						`Error confirming bet: ${res.status}, ${res.statusText}`,
					);
				}
			} catch (error) {
				console.error(`Error confirming bet: ${error}`);
			}
		} catch (error) {
			const err = `Transaction failed: ${error}`;
			console.error(err);
			setTxnSignature(err);
		}
	}

	return (
		<>
			{status == null || status.has_betted == true ? (
				<></>
			) : (
				<Button
					color="primary"
					className="font-extrabold text-white"
					onClick={betTransaction}
				>
					Bet
				</Button>
			)}

			{txnSignature != '' ? (
				<p>Bet succesfull, txn signature: {txnSignature}</p>
			) : (
				<></>
			)}

			{status == null || status.has_betted == false ? (
				<></>
			) : (
				<p>Already betted</p>
			)}
		</>
	);
}
