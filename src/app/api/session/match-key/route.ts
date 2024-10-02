import { cookies } from 'next/headers';
import { PublicKey } from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
	console.log('\nNew Match Key Request');
	// Parse response data
	const { publicKeyString }: { publicKeyString: string; uuid: string } =
		await request.json();

	// Parse public key string
	var publicKey: PublicKey;
	try {
		publicKey = new PublicKey(publicKeyString);
	} catch (err) {
		// err public key
		return new Response('Invalid Public Key', {
			status: 400,
		});
	}

	// Read cookie name
	const cookieName = process.env.NEXT_PUBLIC_COOKIE;
	if (!cookieName) {
		return new Response('Error evaluating request', {
			status: 400,
		});
	}

	// Check ifuser has a session
	const cookieStore = cookies();
	const token = cookieStore.get(cookieName);
	if (!token) {
		return new Response('User has not an active session', {
			status: 200,
		});
	}

	// Initialize Supabase client
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	// hit db to check if user has a session
	const { data, error } = await supabase
		.from('Users')
		.select('uuid')
		.eq('PublicKey', publicKey.toBase58());
	var uuid: string = '';

	// db error
	if (error) {
		return new Response('Error fetching uuid', {
			status: 400,
		});
	}

	// if it has, change uuid and set it as active session
	if (data && data.length > 0) {
		uuid = data[0].uuid;
	}

	if (uuid != token.value) {
		return new Response('Public Key and session do not match', {
			status: 400,
		});
	}

	return new Response('Publick Key and session match', {
		status: 200,
	});
}
