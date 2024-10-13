import { PublicKey } from '@solana/web3.js';
import _IDL from '@/idl/solana_fpl.json';
import mainnetBetaIDL from '../idl/mainnet-beta/sf_final.json';

/* Constants for the Deployed "Hello World" Program */
export const solfotProgramInterface = JSON.parse(
	JSON.stringify(mainnetBetaIDL),
);

/* Program ID */
export const getProgramId = (): PublicKey | null => {
	const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
	if (!contractAddress) {
		return null;
	}

	var caPublicKey: PublicKey;
	try {
		caPublicKey = new PublicKey(contractAddress);
		return caPublicKey;
	} catch (erroor) {
		// Invalid public key
		console.error('Failed to parse publick key');
		return null;
	}
};

/* Constants for the Deployed "Hello World" Program */
export const getUSDCProgramId = (): PublicKey | null => {
	const contractAddressUSDC = process.env.NEXT_PUBLIC_USDC_ADDRESS;
	if (!contractAddressUSDC) {
		console.error('Failed to get contract address');
		return null;
	}

	var usdcPublicKey: PublicKey;
	try {
		usdcPublicKey = new PublicKey(contractAddressUSDC);
		return usdcPublicKey;
	} catch (error) {
		// Invalid public key
		console.error(`Failed to parse publick key: ${error}`);
		return null;
	}
};

export const findEscrowPdaProgramId = (
	programPublickKey: PublicKey,
): [PublicKey, number] => {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('escrow')],
		programPublickKey,
	);
};

export const findUserPdaProgramId = (
	userPublickKey: PublicKey,
	programPublickKey: PublicKey,
): [PublicKey, number] => {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('user'), userPublickKey.toBuffer()],
		programPublickKey,
	);
};
