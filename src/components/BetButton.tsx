'use client';

import { Button } from '@nextui-org/react';
import { Transaction, TransactionInstruction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

type UserStatus = {
	score: string;
	has_betted: boolean;
};

export default function BetButton() {
	const [status, setStatus] = useState<UserStatus | null>(null);
	const [txnSignature, setTxnSignature] = useState('');
	const { publicKey, sendTransaction } = useWallet();
	const betURL = '/api/bet';
	const statusURL = '/api/status';

	async function betTransaction() {
		if (!publicKey) {
			console.error('Wallet not connected');
			return;
		}

		const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
		if (!contractAddress) {
			console.error('Failed to get contract address');
		}

		try {
			// Create transaction
			const transaction = new Transaction().add(
				new TransactionInstruction({
					keys: [],
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

	async function updateStatus() {
		try {
			const res = await fetch(statusURL, {
				method: 'GET',
			});

			if (res.ok) {
				console.log('Status received');
				const status: UserStatus = await res.json();
				console.log(status.score, status.has_betted);
				setStatus(status);
			} else {
				console.error(
					`Error confirming bet: ${res.status}, ${res.statusText}`,
				);
			}
		} catch (error) {
			console.error(`Error confirming bet: ${error}`);
		}
	}

	useEffect(() => {
		updateStatus();
	}, []);

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
