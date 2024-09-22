'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

class InexistentWalletError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InexistentWalletError';
	}
}

export default function WalletRedirect({
	hasSession,
}: {
	hasSession: boolean;
}) {
	const sessionURL = '/api/session';
	const walletContextState = useWallet();
	const pathname = usePathname();

	// send post request to create session
	useEffect(() => {
		console.log(hasSession);
		if (!hasSession) {
			console.log('no sesssion use effect');

			const createSession = async () => {
				try {
					if (
						!walletContextState ||
						walletContextState.publicKey == null
					) {
						throw new InexistentWalletError(
							'Wallet and public key inexistent',
						);
					}

					const res = await fetch(sessionURL, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							publicKeyString:
								walletContextState.publicKey?.toBase58(),
						}),
					});

					if (res.ok) {
						console.log(`Session created`);
					} else {
						console.log(
							`Error creating session: ${res.status}, ${res.statusText}`,
						);
					}
				} catch (error) {
					if (!(error instanceof InexistentWalletError)) {
						console.log('Error creating session: ', error);
					}
				}
			};

			createSession();
		}
	}, [walletContextState.connected, walletContextState.publicKey]);

	if (!pathname.includes('app') && walletContextState.connected) {
		redirect('/app/dashboard');
	}

	return (
		<>
			<WalletMultiButton />
		</>
	);
}
