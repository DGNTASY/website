import { cookies } from 'next/headers';
import { RequestError, handleError } from './error';
import { Cluster, Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { AnchorProvider, Idl, Program, Wallet } from '@coral-xyz/anchor';
import { Proof, Reclaim } from '@reclaimprotocol/js-sdk';

// Reclaim Proof Request Type
type OnSuccessCallback = (proofs: Proof[]) => void;
type OnFailureCallback = (error: Error) => void;

export const initSolana = ():
	| {
			connection: Connection;
			programID: PublicKey;
			usdcProgramID: PublicKey;
	  }
	| never => {
	const strProgramId = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
	const strUsdcProgramId = process.env.NEXT_PUBLIC_USDC_ADDRESS;
	const solanaEnv = process.env.NEXT_PUBLIC_SOLANA_NETWORK;

	if (!strProgramId || !strUsdcProgramId || !solanaEnv) {
		return handleError(
			new RequestError('Failed to load web3 environment', 500),
		);
	}

	var programID: PublicKey;
	var usdcProgramID: PublicKey;
	var connection: Connection;
	try {
		programID = new PublicKey(strProgramId);
		usdcProgramID = new PublicKey(strUsdcProgramId);
		connection = new Connection(
			clusterApiUrl(solanaEnv as Cluster),
			'confirmed',
		);
	} catch (error) {
		return handleError(
			new RequestError('Failed to load web3 environment', 500),
		);
	}

	return { connection, programID, usdcProgramID };
};

export const initAnchor = <T extends Idl>(
	connection: Connection,
	wallet: Wallet,
	programInterface: any,
): {
	provider: AnchorProvider;
	program: Program<T>;
} => {
	const provider = new AnchorProvider(connection, wallet, {
		preflightCommitment: 'processed',
	});
	const program = new Program<T>(programInterface, provider) as Program<T>;
	return { provider, program };
};

export const initSupabase = (): SupabaseClient | never => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return handleError(
			new RequestError('Failed to load supabase environment', 500),
		);
	}

	return createClient(supabaseUrl, supabaseAnonKey);
};

export const initReclaim = async (
	reclaimSessionId: string,
	successCallback: OnSuccessCallback,
	failureCallback: OnFailureCallback,
): Promise<{ statusUrl: string; requestUrl: string } | never> => {
	const reclaimAppId = process.env.RECLAIM_APP_ID;
	const reclainAppProviderId = process.env.RECLAIM_APP_PROVIDER_ID;
	const reclainAppSecret = process.env.RECLAIM_APP_SECRET;

	if (!reclaimAppId || !reclainAppProviderId || !reclainAppSecret) {
		return handleError(
			new RequestError('Failed to load Reclaim environment', 500),
		);
	}

	// Make Client
	const reclaimClient = new Reclaim.ProofRequest(reclaimAppId, {
		sessionId: reclaimSessionId,
	});

	// Build Request Proof
	try {
		await reclaimClient.buildProofRequest(
			reclainAppProviderId,
			false,
			'V2Linking',
		);
	} catch (error) {
		console.log('Reclaim proof has not been built correctly: ', error);
		return handleError(
			new RequestError('Failed to build Reclaim proof', 500),
		);
	}

	// Add context
	reclaimClient.addContext(
		`user's uuid: ${reclaimSessionId}`,
		'Generating a score proof URL for the user',
	);

	// Set app signature
	let signature: string;
	try {
		signature = await reclaimClient.generateSignature(reclainAppSecret);
	} catch (error) {
		console.log('Error generating signature: ', error);
		return handleError(
			new RequestError('Error generatign Reclaim signature', 500),
		);
	}
	reclaimClient.setSignature(signature);

	// Add callbacks
	reclaimClient.startSession({
		onSuccessCallback: successCallback,
		onFailureCallback: failureCallback,
	});

	// Create request and URLs
	try {
		return await reclaimClient.createVerificationRequest();
	} catch (error) {
		console.log('Error creating verification request: ', error);
		return handleError(
			new RequestError(
				'Error creating Reclaim verification request',
				500,
			),
		);
	}
};

export const getUserCookie = (): string | never => {
	// Read cookie name
	const cookieName = process.env.NEXT_PUBLIC_COOKIE;
	if (!cookieName) {
		return handleError(new RequestError('Failed to load cookie name', 500));
	}

	// Check ifuser has a session
	const cookieStore = cookies();
	const token = cookieStore.get(cookieName);
	if (token == undefined) {
		return handleError(new RequestError('Failed to get user cookie', 401));
	}

	return token.value;
};

export const getUserCookieUndefined = (): undefined | string | never => {
	// Read cookie name
	const cookieName = process.env.NEXT_PUBLIC_COOKIE;
	if (!cookieName) {
		return handleError(new RequestError('Failed to load cookie name', 500));
	}

	// Check ifuser has a session
	const cookieStore = cookies();
	const token = cookieStore.get(cookieName);
	if (token != undefined) {
		return token.value;
	}

	return token;
};

export const getUserCookieUndefinedAndCookieName = ():
	| {
			cookie: string | undefined;
			cookieName: string;
	  }
	| never => {
	// Read cookie name
	const cookieName = process.env.NEXT_PUBLIC_COOKIE;
	if (!cookieName) {
		return handleError(new RequestError('Failed to load cookie name', 500));
	}

	// Check ifuser has a session
	const cookieStore = cookies();
	const token = cookieStore.get(cookieName);
	if (token != undefined) {
		return { cookie: token.value, cookieName: cookieName };
	}

	return { cookie: token, cookieName: cookieName };
};
