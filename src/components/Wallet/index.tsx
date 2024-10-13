'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useContext, useEffect, useMemo } from 'react';
import { UserStatusContext } from '@/components/providers/UserStatusProvider';
import { postSessionURL } from '@/lib/api/routes';
import { PublicKey } from '@solana/web3.js';
import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
	async () =>
		(await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
	{ ssr: false },
);

// has session is cookie
export default function Wallet() {
	const { publicKey } = useWallet();
	const { updateUserUUID } = useContext(UserStatusContext);

	async function createSessionWithKey(publicKey: PublicKey | null) {
		if (publicKey == null) {
			return;
		}

		try {
			const res = await fetch(postSessionURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					publicKeyString: publicKey.toBase58(),
				}),
			});

			if (res.ok) {
				console.log(`Session created, updating user UUID...`);
				await updateUserUUID();
			} else {
				console.error(
					`Error creating user session: ${res.status}, ${res.statusText}`,
				);
			}
		} catch (error) {
			console.error('Error creating user session: ', error);
		}
	}

	// send post request to create session
	useEffect(() => {
		if (publicKey == null) {
			return;
		}

		createSessionWithKey(publicKey);
	}, [publicKey]);

	return (
		<>
			<WalletMultiButtonDynamic />
		</>
	);
}
