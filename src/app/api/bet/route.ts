import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { Wallet } from '@coral-xyz/anchor';

import { SfFinal } from '@/idl/mainnet-beta/sf_final';
import { solfotProgramInterface } from '@/utils/program';
import {
	getUserCookie,
	initAnchor,
	initSolana,
	initSupabase,
} from '@/lib/api/environment';
import { RequestError, handleError } from '@/lib/api/error';
import { dummyWallet } from '@/utils/wallet';

/**
 * User bets so:
 * 1. Frontend Creates and Signs the Transaction
 * 2. Extract Transaction Signature
 * 3. Send Transaction Signature to Backend
 * 4. User Sends the Transaction On-Chain
 * 5. Transaction Confirmation and Verification
 */
export async function POST(request: Request) {
	try {
		console.log('\nNew Bet Request');

		// Parse response data
		const { transactionHash }: { transactionHash: string } =
			await request.json();

		// Get session cookie
		const sessionId = getUserCookie();

		// Get web3
		const { connection, programID, usdcProgramID } = initSolana();

		console.log('Everything has been loaded');

		// Check that transaction is completed
		var txnDetails = await connection.getTransaction(transactionHash);
		if (!txnDetails) {
			try {
				// wait for txn
				await connection.confirmTransaction(
					transactionHash,
					'confirmed',
				);
				// get txn
				txnDetails = await connection.getTransaction(transactionHash);

				if (!txnDetails) {
					return handleError(
						new RequestError(
							'Waiting for user transaction returned an error',
							400,
						),
					);
				}
			} catch (error) {
				console.error(
					`Error during wait for user transaction ${error}`,
				);
				return handleError(
					new RequestError(
						'Error during wait for user transaction',
						500,
					),
				);
			}
		}

		console.log('\nTxn is done');

		// Check that transaction is not too old
		const time = txnDetails.blockTime;
		if (!time) {
			return handleError(
				new RequestError('Transaction time is unacessible', 500),
			);
		}
		const currentTime = await connection.getBlockTime(
			await connection.getSlot(),
		);
		if (!currentTime) {
			return handleError(
				new RequestError('Current time is unacessible', 500),
			);
		}
		const maxDelay = 60 * 5; // 5 minutes in s
		if (currentTime > time + maxDelay) {
			return handleError(new RequestError('Time is too old', 400));
		}

		console.log('\nTxn is not too old');

		const supabase = initSupabase();

		console.log('\nConnected DB');

		// hit db to check if user has a session
		const publicKey = txnDetails.transaction.message.accountKeys[0];
		const { data, error } = await supabase
			.from('Users')
			.select('*')
			.eq('PublicKey', publicKey.toBase58())
			.eq('uuid', sessionId)
			.single();
		if (error) {
			console.log('Error validating user session: ', error);
			return handleError(
				new RequestError('Error validating user session', 500),
			);
		}
		if (data == null) {
			return handleError(
				new RequestError(
					"Either session is not valid or user doesn't have a session",
					400,
				),
			);
		}

		console.log('\nCorrect signer');

		// Init Anchor
		const { program } = initAnchor<SfFinal>(
			connection,
			dummyWallet as Wallet,
			solfotProgramInterface,
		);

		// Check that there exist: escrow account, user and escrow token account
		var escrowTokenAccount: PublicKey;
		var userTokenAccount: PublicKey;
		var [escrowAccount, _escrowAccountBump] =
			PublicKey.findProgramAddressSync(
				[Buffer.from('escrow')],
				programID,
			);
		try {
			userTokenAccount = getAssociatedTokenAddressSync(
				usdcProgramID,
				publicKey,
			);
			escrowTokenAccount = (
				await program.account.escrowAccount.fetch(escrowAccount)
			).usdcTokenAccount;
		} catch (error) {
			console.error(
				`Error generating user and escrow token accounts ${error}`,
			);
			return handleError(
				new RequestError(
					'Error generating user and escrow token accounts',
					500,
				),
			);
		}

		console.log('\nChecking account keys');

		// We look that in the transaction all account keys match
		const accountKeys = txnDetails.transaction.message.staticAccountKeys;
		const accountKeysToMatch = [
			escrowTokenAccount,
			userTokenAccount,
			escrowAccount,
		];
		var correctTxn = true;
		for (let i = 0; i < accountKeysToMatch.length; i++) {
			// can be optimized
			let accKey = accountKeysToMatch[i];

			let present = false;
			for (let j = 0; j < accountKeys.length; j++) {
				if (accKey.toBase58() == accountKeys[j].toBase58()) {
					present = true;
					continue;
				}
			}

			if (present) {
				continue;
			}

			correctTxn = false;
		}
		if (!correctTxn) {
			return handleError(
				new RequestError('Wrong transaction passed in', 500),
			);
		}

		console.log(
			'\nThe transaction and the wallet is correct, setting its bet status',
		);

		const { error: errorUpdate, status } = await supabase
			.from('Users')
			.update({
				has_betted: true,
			})
			.eq('PublicKey', publicKey.toBase58())
			.eq('uuid', sessionId);

		if (errorUpdate) {
			console.error(
				`Error while updating the user bet status: ${errorUpdate}`,
			);
			return handleError(
				new RequestError(
					'Error while updating the user bet status',
					400,
				),
			);
		}
		if (status == 406) {
			return handleError(
				new RequestError('Update was not accepted', status),
			);
		}

		return new Response(
			JSON.stringify({ message: 'User bet has been updated' }),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
	} catch (errResponse) {
		if (errResponse instanceof Response) {
			console.error(`Unhandled error: ${errResponse}`);
			return new Response(
				JSON.stringify({ message: 'Unhandled error' }),
				{
					status: 500,
				},
			);
		}

		return errResponse;
	}
}
