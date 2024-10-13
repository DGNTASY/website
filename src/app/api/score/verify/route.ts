import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Proof } from '@reclaimprotocol/js-sdk';
import { v4 as uuidv4 } from 'uuid';
import {
	getUserCookie,
	initReclaim,
	initSupabase,
} from '@/lib/api/environment';
import { NextApiResponse } from 'next';
import { RequestError, handleError } from '@/lib/api/error';

// Session status response that is sent from Reclaim for a succesfull response
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

// Possible statuses of a Reclaim session status response
enum SessionStatus {
	PENDING = 'PENDING',
	SDK_STARTED = 'SDK_STARTED',
	MOBILE_RECEIVED = 'MOBILE_RECEIVED',
	MOBILE_SUBMITTED = 'MOBILE_SUBMITTED',
	SDK_RECEIVED = 'SDK_RECEIVED',
	FAILED = 'FAILED',
}

// Data selected and returned from supabase query
type RequestQueryData = {
	has_betted: boolean | null;
	last_request_url: string | null;
	last_request_status_url: string | null;
	last_request_fulfilled: boolean | null;
	last_request_uuid: string | null;
};

// Parameters, note paramValues is a custom-proof made field
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
	try {
		console.log('\nNew Score Request');

		// Read cookie name
		const sessionId = getUserCookie();

		// Connect to DB
		const supabase = initSupabase();
		console.log('\nConnected DB');

		// Check session is valid
		const { data, error, status } = await supabase
			.from('Users')
			.select(
				'has_betted, last_request_url, last_request_status_url, last_request_fulfilled, last_request_uuid',
			)
			.eq('uuid', sessionId)
			.single();
		if (error) {
			// Session is not valid
			return handleError(
				new RequestError(
					'Error occured when requesting from database',
					500,
				),
			);
		}

		if (data == null || status == 406) {
			// Session is not valid
			return handleError(
				new RequestError('Invalid Session, not found', 404),
			);
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
			return handleError(
				new RequestError('User has not betted yet', 400),
			);
		}

		if (
			supResData.last_request_uuid != null &&
			supResData.last_request_url != null &&
			supResData.last_request_status_url != null &&
			!supResData.last_request_fulfilled
		) {
			// Old request is still valid, for how long can it be valid?
			// Start manual pooling
			poolRequest(supResData.last_request_status_url, sessionId);
			// Return old request
			return NextResponse.json({
				requestUrl: supResData.last_request_url,
				statusUrl: supResData.last_request_status_url,
			});
		}

		// Read Reclaim app ID, Reclaim Provider ID and Reclaim APP secret
		const reclaimSessionId = uuidv4();
		const { statusUrl, requestUrl } = await initReclaim(
			reclaimSessionId,
			async (proofs) => {
				console.log('Session received, handling proof...');
				const successProof = await handleProof(proofs, sessionId);
				console.log(`Proof handled, result: ${successProof}`);
			},
			(error) => {
				console.error('Verification failed', error);
			},
		);

		// Store urls to the db to cache the request
		const { error: errorSupabaseUrl, status: statusSupabaseUrl } =
			await supabase
				.from('Users') // Replace with your table name
				.update({
					last_request_url: requestUrl,
					last_request_status_url: statusUrl,
					last_request_fulfilled: false,
					last_request_uuid: reclaimSessionId,
				})
				.eq('uuid', sessionId);
		// Error storing request
		if (errorSupabaseUrl) {
			return handleError(
				new RequestError(
					`Error updating user's Reclaim request status, error code: ${errorSupabaseUrl.code}`,
					500,
				),
			);
		}
		// Request happened but was unsuccesfull
		if (statusSupabaseUrl >= 400) {
			return handleError(
				new RequestError(
					`Satus error updating user's Reclaim request status, status error code: ${statusSupabaseUrl}`,
					400,
				),
			);
		}

		return NextResponse.json({ requestUrl, statusUrl });
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
	if (!score) {
		console.error('Not able to get user score');
		return false;
	}

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
	if (!supabaseUrl || !supabaseAnonKey) {
		console.error(
			'Failed to load supabase when trying to fulfill reclaim request',
		);
		return false;
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey);
	console.log('\nConnected to DB');

	const { error, status } = await supabase
		.from('Users')
		.update({
			last_request_fulfilled: true,
			score: score,
		})
		.eq('uuid', sessionId);
	if (error) {
		// Session is not valid
		console.error(
			`Database error, error code: ${error.code}, when updating a user score, score value: ${score}`,
		);
		return false;
	}
	if (status >= 400) {
		// Status error
		console.error(
			`Database status error, status code: ${status}, when updating a user score, score value: ${score}`,
		);
		return false;
	}

	return true;
}

async function poolRequest(statusUrl: string, sessionId: string) {
	// Max Pooling Time
	const MAX_POOLING_TIME = 10 * 60 * 1000; // 10 min in ms

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
	}, 45_000); // 45s

	// Close interval after MAX_POOLING_TIME
	setTimeout(() => {
		console.log('Clearing interval');
		clearInterval(intervalId);
		console.log('Interval cleared');
	}, MAX_POOLING_TIME);
}
