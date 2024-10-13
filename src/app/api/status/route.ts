import { NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import {
	getUserCookie,
	initAnchor,
	initSolana,
	initSupabase,
} from '@/lib/api/environment';
import { RequestError, handleError } from '@/lib/api/error';
import { solfotProgramInterface } from '@/utils/program';
import { dummyWallet } from '@/utils/wallet';
import { Wallet } from '@coral-xyz/anchor';
import { SfFinal } from '@/idl/mainnet-beta/sf_final';

type UserStatus = {
	score: string;
	has_betted: boolean;
	has_account: boolean;
};

// Return the generated proof
export async function GET() {
	try {
		console.log('\nNew Status Request');

		// Read cookie name
		const sessionId = getUserCookie();

		// Check session is valid
		const supabase = initSupabase();

		console.log('Environment loaded');
		const { data, error, status } = await supabase
			.from('Users')
			.select('PublicKey, score, has_betted')
			.eq('uuid', sessionId)
			.single();
		if (error) {
			console.error('Error when requesting from database: ', error);
			return handleError(
				new RequestError('Error when fetching data from database', 500),
			);
		}
		if (data == null || status == 406) {
			// Session is not valid
			return handleError(
				new RequestError('Invalid session, not found', 400),
			);
		}

		// Init web3
		const { connection, programID } = initSolana();

		let userPublicKey: PublicKey;
		try {
			userPublicKey = new PublicKey(data.PublicKey as string);
		} catch (err) {
			console.error('Error parsing user public key: ', err);
			return handleError(
				new RequestError('Error parsing user publick key', 400),
			);
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

			console.error(
				`Status fetched, error find program address sync ${supResData.score}, ${supResData.has_betted}`,
			);

			return NextResponse.json(supResData);
		}

		// Get program
		const { program } = initAnchor<SfFinal>(
			connection,
			dummyWallet as Wallet,
			solfotProgramInterface,
		);

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
