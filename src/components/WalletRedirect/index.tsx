'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useContext, useMemo } from 'react';
import { UserStatusContext } from '@/app/providers';
import { PublicKey } from '@solana/web3.js';
import { deleteCookie } from 'cookies-next';
import dynamic from 'next/dynamic';

class InexistentWalletError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InexistentWalletError';
    }
}

const WalletMultiButtonDynamic = dynamic(
    async () =>
        (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false },
);

export default function WalletRedirect({
    hasSession,
}: {
    hasSession: boolean;
}) {
    const sessionURL = '/api/session';
    const sessionMatchKeyURL = '/api/session/match-key';
    const { publicKey, connected } = useWallet();
    const pathname = usePathname();
    const { updateUserStatus } = useContext(UserStatusContext);

    async function doesSessionMatchKey(publicKey: PublicKey | null) {
        try {
            if (publicKey == null) {
                throw new InexistentWalletError(
                    'Wallet and public key inexistent',
                );
            }

            const res = await fetch(sessionMatchKeyURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    publicKeyString: publicKey.toBase58(),
                }),
            });

            if (res.ok) {
                console.log('Session does match public key');
                return true;
            } else {
                console.log('Session does not match public key');
                return false;
            }
        } catch (err) {
            console.log('Session does not match public key');
            return false;
        }
    }

    async function createSessionWithKey(publicKey: PublicKey | null) {
        try {
            if (publicKey == null) {
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
                    publicKeyString: publicKey.toBase58(),
                }),
            });

            if (res.ok) {
                console.log(`Session created`);
                updateUserStatus();
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
    }

    // send post request to create session
    useMemo(async () => {
        if (!hasSession) {
            createSessionWithKey(publicKey);
            return;
        }

        const match = await doesSessionMatchKey(publicKey);
        if (!match) {
            // eliminate cookie
            const cookieName = process.env.NEXT_PUBLIC_COOKIE;
            if (!cookieName) {
                throw new InexistentWalletError('Cannot read cookie name');
            }
            deleteCookie(cookieName);

            createSessionWithKey(publicKey);
        }
    }, [publicKey]);

    return (
        <>
            <WalletMultiButtonDynamic />
        </>
    );
}
