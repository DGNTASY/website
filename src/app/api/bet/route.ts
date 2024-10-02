import { cookies } from 'next/headers';
import {
	PublicKey,
	Connection,
	clusterApiUrl,
	Cluster,
	Keypair,
} from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { SfFinal } from '@/components/program/sf_final';
import { solfotProgramInterface } from '@/components/utils/constants';

const dummyWallet = {
	publicKey: Keypair.generate().publicKey, // Just a dummy public key
	signTransaction: async (tx: any) => tx, // No-op for signing
	signAllTransactions: async (txs: any) => txs, // No-op for signing multiple
};

/**
 * User bets so:
 * 1. Frontend Creates and Signs the Transaction
 * 2. Extract Transaction Signature
 * 3. Send Transaction Signature to Backend
 * 4. User Sends the Transaction On-Chain
 * 5. Transaction Confirmation and Verification
 */
export async function POST(request: Request) {
	console.log('\nNew Bet Request');
	// Parse response data
	const { transactionHash }: { transactionHash: string } =
		await request.json();

	// Read cookie name
	const cookieName = process.env.NEXT_PUBLIC_COOKIE;
	if (cookieName == undefined) {
		return new Response('Error evaluating request', {
			status: 400,
		});
	}

	// Check ifuser has a session
	const cookieStore = cookies();
	const token = cookieStore.get(cookieName);
	if (token == undefined) {
		return new Response('User has no session', {
			status: 400,
		});
	}
	const sessionId = token.value;

	const strProgramId = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
	const strUsdcProgramId = process.env.NEXT_PUBLIC_USDC_ADDRESS;
	var programID: PublicKey;
	var usdcProgramID: PublicKey;
	try {
		if (!strProgramId || !strUsdcProgramId) {
			throw new Error();
		}

		programID = new PublicKey(strProgramId);
		usdcProgramID = new PublicKey(strUsdcProgramId);
	} catch (error) {
		return new Response(`Error evaluating request`, {
			status: 400,
		});
	}

	const solanaEnv = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
	if (solanaEnv == undefined) {
		return new Response('Error evaluating request', {
			status: 400,
		});
	}
	const connection = new Connection(
		clusterApiUrl(solanaEnv as Cluster),
		'confirmed',
	);

	console.log('\nEverything has been loaded');

	console.log(transactionHash);
	var txnDetails = await connection.getTransaction(transactionHash);
	console.log(txnDetails);
	if (!txnDetails) {
		try {
			// wait for txn
			await connection.confirmTransaction(transactionHash, 'confirmed');
			// get txn
			txnDetails = await connection.getTransaction(transactionHash);

			if (txnDetails) {
				console.log('Transaction details:', txnDetails);
			} else {
				return new Response('Error waiting for user txn', {
					status: 400,
				});
			}
		} catch (error) {
			return new Response('Error waiting for user txn', {
				status: 400,
			});
		}
	}

	console.log('\nTxn is done');

	const time = txnDetails.blockTime;
	const currentTime = await connection.getBlockTime(
		await connection.getSlot(),
	);
	console.log(time, currentTime);
	if (!time || !currentTime || currentTime > time + 60 * 5) {
		return new Response('Time is too old or unacessible', {
			status: 400,
		});
	}

	console.log('\nTxn is not too old');

	const publicKey = txnDetails.transaction.message.accountKeys[0];

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
	const supabase = createClient(supabaseUrl, supabaseAnonKey);
	console.log('\nConnected DB');

	// hit db to check if user has a session
	console.log(
		'\nChecking that user id and wallet are the by selecting the row',
	);
	const { data, error } = await supabase
		.from('Users')
		.select('*')
		.eq('PublicKey', publicKey.toBase58())
		.eq('uuid', sessionId)
		.single();
	if (data == null || error) {
		return new Response('User has already an active session', {
			status: 400,
		});
	}

	console.log('\nCorrect signer');

	const provider = new AnchorProvider(connection, dummyWallet, {
		preflightCommitment: 'processed',
	});
	const program = new Program<SfFinal>(
		solfotProgramInterface,
		provider,
	) as Program<SfFinal>;

	// Check that there are: escrow account, user and escrow token account
	var escrowTokenAccount: PublicKey;
	var userTokenAccount: PublicKey;
	var [escrowAccount, _escrowAccountBump] = PublicKey.findProgramAddressSync(
		[Buffer.from('escrow')],
		programID,
	);
	try {
		console.log('usdc prog id: ', usdcProgramID);
		console.log('pub key: ', publicKey);

		userTokenAccount = getAssociatedTokenAddressSync(
			usdcProgramID,
			publicKey,
		);
		escrowTokenAccount = (
			await program.account.escrowAccount.fetch(escrowAccount)
		).usdcTokenAccount;

		console.log('User token account: ', userTokenAccount.toBase58());
		console.log('Escrow token account: ', escrowAccount.toBase58());
	} catch (error) {
		console.log(error);
		return new Response('Error generating token accounts', {
			status: 400,
		});
	}

	console.log('\nChecking account keys');

	const accountKeys = txnDetails.transaction.message.staticAccountKeys;
	const accountKeysToMatch = [
		escrowTokenAccount,
		userTokenAccount,
		escrowAccount,
	];

	console.log(accountKeys, accountKeysToMatch);

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
		return new Response('Wrong transaction passed in', {
			status: 400,
		});
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
	if (errorUpdate || status == 406) {
		return new Response('Error updating the ', {
			status: 400,
		});
	}

	return new Response('User bet updated', {
		status: 200,
	});
}
