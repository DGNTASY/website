import { PublicKey } from '@solana/web3.js';
import { SupabaseClient } from '@supabase/supabase-js';
import { RequestError, handleError } from '@/lib/api/error';
import {
	getUserCookieUndefinedAndCookieName,
	initSupabase,
} from '@/lib/api/environment';

export async function POST(request: Request) {
	try {
		console.log('\nNew Session Request');
		// Parse response data
		const { publicKeyString }: { publicKeyString: string } =
			await request.json();

		// Parse public key string
		var publicKey: PublicKey;
		try {
			publicKey = new PublicKey(publicKeyString);
		} catch (error) {
			// Invalid public key
			return handleError(
				new RequestError('Invalid Public Key passed in', 400),
			);
		}

		// Read cookie name
		const { cookie: sessionId, cookieName } =
			getUserCookieUndefinedAndCookieName();

		// Initialize Supabase client
		const supabase = initSupabase();

		// Depending on actualSessionId:
		// sesssion does match, me send ok response
		// if does not match, me create, set and send back a new session
		var session = await sessionMatchesPublicKey(
			sessionId,
			publicKey,
			supabase,
		);

		// Exists and matches
		if (session.exists && session.matched) {
			return new Response(
				JSON.stringify({
					message: 'User has already a valid session id',
				}),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);
		}

		// Exists but it doesn't match
		if (session.exists && !session.matched) {
			return new Response(
				JSON.stringify({
					message: 'New user session created, setting it',
				}),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json',
						'Set-Cookie': `${cookieName}=${session.actualSessionId}; Secure; Path=/; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`,
					},
				},
			);
		}

		// Session does not exists
		const { error, data, status } = await supabase
			.from('Users')
			.insert({
				PublicKey: publicKey.toBase58(),
				has_betted: false,
			})
			.select();

		if (error) {
			return handleError(
				new RequestError('Error creating new row entry', 400),
			);
		}

		if (status >= 400) {
			console.error('Database new row creation went wrong: ', status);
			return handleError(
				new RequestError('Database new row creation went wrong', 400),
			);
		}

		// add session as cookie
		if (data && data.length > 0) {
			const uuid = data[0].uuid;
			console.log('new user uuid created: ' + uuid);

			return new Response(
				JSON.stringify({ message: 'New user session created' }),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json',
						'Set-Cookie': `${cookieName}=${uuid}; Secure; Path=/; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`,
					},
				},
			);
		}

		return handleError(
			new RequestError(
				'Database executed request correclty but sent no data back',
				500,
			),
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

async function sessionMatchesPublicKey(
	sessionId: string | undefined,
	publicKey: PublicKey,
	supabase: SupabaseClient,
): Promise<
	{ exists: boolean; matched: boolean; actualSessionId: string } | never
> {
	const { data, error, status } = await supabase
		.from('Users')
		.select('uuid')
		.eq('PublicKey', publicKey.toBase58());

	if (error) {
		console.error('Error fetching from database: ', error);
		return handleError(
			new RequestError('Error fetching from database', 500),
		);
	}

	if (!data) {
		console.error('Error fetching from database: ', error);
		return handleError(
			new RequestError('Error fetching from database', 500),
		);
	}

	if (status >= 400) {
		console.error('Database fetching went wrong: ', status);
		return handleError(
			new RequestError('Database fetching went wrong', 400),
		);
	}

	let uuid: string = '';

	// No matches found
	if (data.length == 0) {
		return {
			exists: false,
			matched: false,
			actualSessionId: uuid,
		};
	}

	// if the user has a session uuid, change it and set it as active session
	uuid = data[0].uuid;
	return { exists: true, matched: sessionId == uuid, actualSessionId: uuid };
}
