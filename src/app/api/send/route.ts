import { cookies } from 'next/headers';
import { Connection, Transaction } from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
	console.log('\nNew Send Request');
	// Parse response data
	const { transaction }: { transaction: Transaction } = await request.json();

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
		return new Response('User has not an active session', {
			status: 200,
		});
	}
	const uuid = token.value;

	// Read private rpc
	const rpc = process.env.PRIVATE_SOLANA_RPC;
	if (rpc == undefined) {
		return new Response('Error evaluating request', {
			status: 400,
		});
	}
	const connection = new Connection(rpc, 'confirmed');
	transaction.recentBlockhash = (
		await connection.getLatestBlockhash()
	).blockhash;

	// Check that the transaction instruction has the program
	const programID = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
	if (programID == undefined) {
		return new Response('Error evaluating request', {
			status: 400,
		});
	}

	var present = false;
	for (let i = 0; i < transaction.instructions.length; ++i) {
		if (transaction.instructions[i].programId.toBase58() == programID) {
			present = true;
			break;
		}
	}

	if (!present) {
		return new Response('Error evaluating request', {
			status: 400,
		});
	}

	// Initialize Supabase client
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	// hit db to check if user has a session
	const { data, error } = await supabase
		.from('Users')
		.select('PublicKey')
		.eq('uuid', uuid);
	var PublicKey: string = '';

	// db error
	if (error) {
		console.log('\nerror db fetch');
		return new Response('Error fetching uuid', {
			status: 400,
		});
	}

	// if it has, change uuid and set it as active session
	if (data && data.length > 0) {
		PublicKey = data[0].PublicKey;
	}

	// check that is the signer
	var isSigner = false;
	for (let i = 0; i < transaction.signatures.length; ++i) {
		if (transaction.signatures[i].publicKey.toBase58() == PublicKey) {
			isSigner = true;
			break;
		}
	}

	if (!isSigner) {
		return new Response('Error evaluating request', {
			status: 400,
		});
	}

	// send transaction
	var txn: string | null;
	try {
		txn = await connection.sendRawTransaction(transaction.serialize());
		await connection.confirmTransaction(txn, 'confirmed');
	} catch (err) {
		return new Response('Failed sending transaction', {
			status: 400,
		});
	}

	return new Response(txn, {
		status: 400,
	});
}
