import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';
import { Reclaim, Proof } from '@reclaimprotocol/js-sdk';
import { v4 as uuidv4 } from 'uuid';

type SessionStatusResponse = {
	message: string;
	session: {
		id: string;
		appId: string;
		httpProviderId: [string];
		sessionId: string;
		proofs: Proof[];
		status: SessionStatus;
		statusV2: string;
		createdAt: string;
		updatedAt: string;
	};
	providerId: string;
};

enum SessionStatus {
	PENDING = 'PENDING',
	SDK_STARTED = 'SDK_STARTED',
	MOBILE_RECEIVED = 'MOBILE_RECEIVED',
	MOBILE_SUBMITTED = 'MOBILE_SUBMITTED',
	SDK_RECEIVED = 'SDK_RECEIVED',
	FAILED = 'FAILED',
}

type RequestQueryData = {
	has_betted: boolean | null;
	last_request_url: string | null;
	last_request_status_url: string | null;
	last_request_fulfilled: boolean | null;
	last_request_uuid: string | null;
};

// Parameters, note oaramValues is a custom made field
type Parameters = {
	additionalClientOptions: any;
	body: string;
	geoLocation: string;
	headers: {
		'user-agent': string;
	};
	method: string;
	paramValues: {
		URL_PARAMS_1: string;
		URL_PARAMS_2: string;
		points: string;
	};
	responseMatches: {
		type: string;
		value: string;
	}[];
	responseRedactions: {
		jsonPath: string;
		regex: string;
		xPath: String;
	}[];
	url: string;
};

// Return the generated proof
export async function GET() {
	console.log('\nNew Score Request');
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
		.select(
			'has_betted, last_request_url, last_request_status_url, last_request_fulfilled, last_request_uuid',
		)
		.eq('uuid', sessionId)
		.single();
	if (data == null || error || status == 406) {
		// Session is not valid
		return new Response('Invalid session', {
			status: 400,
		});
	}

	// An old request is till valid, fulfill this one first
	const supResData: RequestQueryData = {
		has_betted: data.has_betted,
		last_request_url: data.last_request_url,
		last_request_status_url: data.last_request_status_url,
		last_request_fulfilled: data.last_request_fulfilled,
		last_request_uuid: data.last_request_uuid,
	};
	console.log(
		`Request data: ${supResData.has_betted}, ${supResData.last_request_url}, ${supResData.last_request_status_url}, ${supResData.last_request_fulfilled}, ${supResData.last_request_uuid}`,
	);

	// User has not bettd, no need to get his score
	if (!data.has_betted) {
		return new Response('User has not betted yet', {
			status: 400,
		});
	}

	if (
		supResData.last_request_uuid != null &&
		supResData.last_request_url != null &&
		supResData.last_request_status_url != null &&
		!supResData.last_request_fulfilled
	) {
		// Old request is still valid
		// Start manual pooling
		poolRequest(supResData.last_request_status_url, sessionId);
		// Return old request
		return NextResponse.json({
			requestUrl: supResData.last_request_url,
			statusUrl: supResData.last_request_status_url,
		});
	}

	// Read Reclaim app ID, Reclaim Provider ID and Reclaim APP secret
	const reclaimAppId = process.env.RECLAIM_APP_ID;
	const reclainAppProviderId = process.env.RECLAIM_APP_PROVIDER_ID;
	const reclainAppSecret = process.env.RECLAIM_APP_SECRET;
	const reclaimSessionId = uuidv4();
	if (
		reclaimAppId == undefined ||
		reclainAppProviderId == undefined ||
		reclainAppSecret == undefined
	) {
		// Reclaim app is not configured
		return new Response('Error evaluating request', {
			status: 400,
		});
	}

	// Acttive session and with reclaim proof
	const reclaimClient = new Reclaim.ProofRequest(reclaimAppId, {
		sessionId: reclaimSessionId,
	});

	// Build proof
	await reclaimClient.buildProofRequest(
		reclainAppProviderId,
		false,
		'V2Linking',
	);

	// Add context
	reclaimClient.addContext(
		`user's uuid: ${reclaimSessionId}`,
		'Generating a score proof URL for the user',
	);

	// Add signature
	reclaimClient.setSignature(
		await reclaimClient.generateSignature(reclainAppSecret),
	);

	// Create request
	const { requestUrl, statusUrl } =
		await reclaimClient.createVerificationRequest();

	// Store urls to the db to cache the request
	const requestUrlSupabaseResponse = await supabase
		.from('Users') // Replace with your table name
		.update({
			last_request_url: requestUrl,
			last_request_status_url: statusUrl,
			last_request_fulfilled: false,
			last_request_uuid: reclaimSessionId,
		})
		.eq('uuid', sessionId);

	// Error storing request
	if (requestUrlSupabaseResponse.error) {
		return new Response('Error updating request status', {
			status: 400,
		});
	}

	// poolRequest(statusUrl);
	reclaimClient.startSession({
		onSuccessCallback: async (proofs) => {
			console.log('Session received, handling proof...');
			const successProof = await handleProof(proofs, sessionId);
			console.log(`Proof handled, result: ${successProof}`);
		},
		onFailureCallback: (error) => {
			console.error('Verification failed', error);
		},
	});

	return NextResponse.json({ requestUrl, statusUrl });
}

async function handleProof(
	proofs: Proof[],
	sessionId: string,
): Promise<boolean> {
	// Validate proof
	if (proofs.length != 1) {
		console.log('More than one proof');
		return false;
	}

	const strParameters = proofs[0].claimData.parameters;

	// Parse it
	const parameters = JSON.parse(strParameters) as Parameters;
	// parameters to score
	const score: number = Number(parameters.paramValues.points);

	// Save it in database
	const successUpdate = await updateReclaimRequestToFulfilled(
		sessionId,
		score,
	);

	return successUpdate;
}

async function updateReclaimRequestToFulfilled(
	sessionId: string,
	score?: number,
): Promise<boolean> {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
	const supabase = createClient(supabaseUrl, supabaseAnonKey);
	console.log('\nConnected DB');

	const updateData: { [key: string]: any } = {
		last_request_fulfilled: true,
	};

	if (score) {
		updateData.score = score;
	}

	const { error } = await supabase
		.from('Users')
		.update(updateData)
		.eq('uuid', sessionId);
	if (error) {
		// Session is not valid
		return false;
	}

	return true;
}

async function poolRequest(statusUrl: string, sessionId: string) {
	// Max Pooling Time
	const MAX_POOLING_TIME = 15 * 60 * 1000; // 15 min in ms

	const intervalId = setInterval(async () => {
		// pool response
		const res = await fetch(statusUrl, {
			method: 'GET',
		});

		const statusResponse: SessionStatusResponse = await res.json();

		switch (statusResponse.session.status) {
			case SessionStatus.PENDING:
				console.log('Session stil pending');
				break;

			case SessionStatus.MOBILE_SUBMITTED:
				// Handle proof
				console.log('Session received, handling proof...');
				const successProof = await handleProof(
					statusResponse.session.proofs,
					sessionId,
				);
				console.log(`Proof handled, result: ${successProof}`);

				// Stop interval if proof handled succesfully
				if (successProof) {
					clearInterval(intervalId);
				}

				// If it won't be handled succesfully the
				// interval will try until shutted down
				break;

			case SessionStatus.FAILED:
				// Update in db last_request_fulfilled to true
				console.log('Session failed');
				const successUpdate =
					await updateReclaimRequestToFulfilled(sessionId);

				if (successUpdate) {
					clearInterval(intervalId);
				}
				break;

			default:
				break;
		}
	}, 15_000); // 15s

	// Close interval after MAX_POOLING_TIME
	setTimeout(() => {
		console.log('Clearing interval');
		clearInterval(intervalId);
		console.log('Interval cleared');
	}, MAX_POOLING_TIME);
}
