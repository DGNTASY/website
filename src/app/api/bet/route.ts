import { cookies } from 'next/headers';
import { PublicKey, Connection, clusterApiUrl } from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';

/**
 * User bets so:
 * 1. Frontend Creates and Signs the Transaction
 * 2. Extract Transaction Signature
 * 3. Send Transaction Signature to Backend
 * 4. User Sends the Transaction On-Chain
 * 5. Transaction Confirmation and Verification
 */
export async function POST(request: Request) {
	console.log('\nNew Response');
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

	const connection = new Connection(
		clusterApiUrl('mainnet-beta'),
		'confirmed',
	);
	const txnDetails = await connection.getTransaction(transactionHash, {
		maxSupportedTransactionVersion: 0, // change
	});
	if (!txnDetails) {
		return new Response('User txn not found', {
			status: 400,
		});
	}

	const publicKey = txnDetails.transaction.message.getAccountKeys().get(0);
	if (!publicKey) {
		return new Response('PubKey txn not found', {
			status: 400,
		});
	}

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
			status: 200,
		});
	}

	return new Response('User bet updated', {
		status: 200,
	});
}
