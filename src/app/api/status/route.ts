import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type UserStatus = {
	score: string;
	has_betted: boolean;
};

// Return the generated proof
export async function GET() {
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
	console.log('Session id: ' + sessionId);

	// Check session is valid
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
	const supabase = createClient(supabaseUrl, supabaseAnonKey);
	console.log('\nConnected DB');
	const { data, error, status } = await supabase
		.from('Users')
		.select('score, has_betted')
		.eq('uuid', sessionId)
		.single();
	if (data == null || error || status == 406) {
		// Session is not valid
		return new Response('Invalid session', {
			status: 400,
		});
	}

	const supResData: UserStatus = {
		score: data.score,
		has_betted: data.has_betted,
	};

	console.log(`Status fetched ${supResData.score}, ${supResData.has_betted}`);

	return NextResponse.json(supResData);
}
