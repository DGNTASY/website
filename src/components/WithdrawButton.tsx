'use client';

import { Button } from '@nextui-org/react';
import {
	Connection,
	PublicKey,
	Transaction,
	SystemProgram,
	TransactionSignature,
	TransactionInstruction,
} from '@solana/web3.js';
import { useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { useState } from 'react';

export default function WithdrawButton() {
	const [txnSignature, setTxnSignature] = useState('');
	const { publicKey, sendTransaction } = useWallet();

	async function withdrawTransaction() {
		if (!publicKey) {
			console.error('Wallet not connected');
			return;
		}

		const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
		if (!contractAddress) {
			console.error('Failed to get contract address');
		}

		// Add txn fetch

		// try {
		// 	// Prepare the data for the instruction
		// 	const betAmount = BigInt(1000000); // Example amount in lamports (if applicable)

		// 	// Create a data buffer for the instruction
		// 	const instructionData = new Uint8Array([
		// 		// 0x01, // Example instruction ID for 'bet' function
		// 		// ...new Uint8Array(new BigUint64Array([betAmount]).buffer)
		// 	]);

		// 	// Create an instruction for the smart contract call
		// 	const betInstruction = new TransactionInstruction({
		// 		keys: [
		// 			{ pubkey: publicKey, isSigner: true, isWritable: false },
		// 			{
		// 				pubkey: new PublicKey(contractAddress!),
		// 				isSigner: false,
		// 				isWritable: false,
		// 			},
		// 		],

		// 		programId: new PublicKey(contractAddress!),
		// 		data: instructionData,
		// 	});

		// 	// Create a transaction and add the instruction
		// 	const transaction = new Transaction().add(betInstruction);

		// 	// Send the transaction
		// 	const signature = await sendTransaction(transaction, connection);
		// 	await connection.confirmTransaction(signature, 'confirmed');
		// 	console.log('Transaction successful:', signature);
		// } catch (error) {
		// 	console.error('Transaction failed:', error);
		// }
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
