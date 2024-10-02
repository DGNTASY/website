import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Cluster, Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { solfotProgramInterface } from '@/components/utils/constants';
import { SfFinal } from '@/components/program/sf_final';

type UserStatus = {
	score: string;
	has_betted: boolean;
	has_account: boolean;
};

// Return the generated proof
export async function GET() {
	console.log('\nNew Status Request');
	// Read cookie name
	const cookieName = process.env.NEXT_PUBLIC_COOKIE;
	if (cookieName == undefined) {
		return new Response('Error evaluating request', {
			status: 400,
		});
	}

	// Check if user has a session
	const cookieStore = cookies();
	const token = cookieStore.get(cookieName);
	if (token == undefined) {
		// No session
		return new Response('User doesnt have an active session', {
			status: 400,
		});
	}
	const sessionId = token.value;

	// Check session is valid
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
	const supabase = createClient(supabaseUrl, supabaseAnonKey);
	const { data, error, status } = await supabase
		.from('Users')
		.select('PublicKey, score, has_betted')
		.eq('uuid', sessionId)
		.single();
	if (data == null || error || status == 406) {
		// Session is not valid
		return new Response('Invalid session', {
			status: 400,
		});
	}

	const solanaEnv = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
	const strProgramID = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
	if (solanaEnv == undefined || strProgramID == undefined) {
		return new Response('Error evaluating request', {
			status: 400,
		});
	}
	const connection = new Connection(
		clusterApiUrl(solanaEnv as Cluster),
		'confirmed',
	);

	let userPublicKey: PublicKey;
	let programID: PublicKey;
	try {
		userPublicKey = new PublicKey(data.PublicKey as string);
		programID = new PublicKey(strProgramID as string);
	} catch (err) {
		return new Response('Error parsing publick key', {
			status: 400,
		});
	}

	let userAccount: [PublicKey, number];
	try {
		userAccount = PublicKey.findProgramAddressSync(
			[Buffer.from('user'), userPublicKey.toBuffer()],
			programID,
		);
	} catch (err) {
		const supResData: UserStatus = {
			score: data.score,
			has_betted: data.has_betted,
			has_account: false,
		};

		console.log(
			`Status fetched, error find program address sync ${supResData.score}, ${supResData.has_betted}`,
		);

		return NextResponse.json(supResData);
	}

	// const provider = new AnchorProvider(connection, null, {});
	const program = new Program(solfotProgramInterface, {
		connection,
	}) as Program<SfFinal>;

	// Check if user has an account
	const accountData = await program.account.userAccount.fetchNullable(
		userAccount[0],
	);

	if (accountData === null) {
		const supResData: UserStatus = {
			score: data.score,
			has_betted: data.has_betted,
			has_account: false,
		};

		console.log(
			`Status fetched, account data is null, ${supResData.score}, ${supResData.has_betted}`,
		);

		return NextResponse.json(supResData);
	}

	const supResData: UserStatus = {
		score: data.score,
		has_betted: data.has_betted,
		has_account: true,
	};

	console.log(
		`Status fetched, owns a user account, ${supResData.score}, ${supResData.has_betted}`,
	);

	return NextResponse.json(supResData);
}
