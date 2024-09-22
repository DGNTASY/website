import { cookies } from 'next/headers';
import { PublicKey } from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
	console.log('\nNew Response');
	// Parse response data
	const { publicKeyString }: { publicKeyString: string } =
		await request.json();

	// Parse public key string
	var publicKey: PublicKey;
	try {
		publicKey = new PublicKey(publicKeyString);
	} catch (erroor) {
		// Invalid public key
		return new Response('Invalid Public Key', {
			status: 400,
		});
	}

	console.log('\nPub key: ' + publicKey.toBase58());

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
	if (token != undefined) {
		console.log('\nCookie defined: ' + token.name + ' ' + token.value);

		return new Response('User has already an active session', {
			status: 200,
		});
	}

	console.log('\nCookie not defined');

	// Initialize Supabase client
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	console.log('\nConnected DB');

	// hit db to check if user has a session
	const { data, error } = await supabase
		.from('Users')
		.select('uuid')
		.eq('PublicKey', publicKey.toBase58());
	var uuid: string = '';

	console.log('\nfetched db for uuid based on adress');

	// db error
	if (error) {
		console.log('\nerror db fetch');
		return new Response('Error fetching uuid', {
			status: 400,
		});
	}

	// if it has, change uuid and set it as active session
	if (data && data.length > 0) {
		uuid = data[0].uuid;
	}
	if (uuid != '') {
		console.log('\nuuid catched: ' + uuid);
		return new Response('User has an active session', {
			status: 200,
			headers: {
				'Set-Cookie': `${cookieName}=${uuid}; Secure; Path=/; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`,
			},
		});
	}

	console.log('\nGenerating new user entry');
	// If not generate new row
	const supabaseRes = await supabase
		.from('Users')
		.insert({
			PublicKey: publicKey.toBase58(),
			has_betted: false,
		})
		.select();

	if (supabaseRes.error) {
		return new Response('Error creating new row entry', {
			status: 400,
		});
	}

	console.log('\nEntry created rutirning uuid');

	// add session as cookie
	if (supabaseRes.data && supabaseRes.data.length > 0) {
		return new Response('New user session created', {
			status: 200,
			headers: {
				'Set-Cookie': `${cookieName}=${supabaseRes.data[0].uuid}; Secure; Path=/; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`,
			},
		});
	} else {
		return new Response('No data back', {
			status: 400,
		});
	}
}
