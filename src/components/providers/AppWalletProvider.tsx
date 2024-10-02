'use client';

import React, { useMemo } from 'react';
import {
	ConnectionProvider,
	WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Cluster, clusterApiUrl } from '@solana/web3.js';

// Default styles
require('@solana/wallet-adapter-react-ui/styles.css');

export default function AppWalletProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK
		? process.env.NEXT_PUBLIC_SOLANA_NETWORK
		: WalletAdapterNetwork.Devnet;

	const endpoint = useMemo(
		() => clusterApiUrl(network as Cluster),
		[network],
	);
	const wallets = useMemo(
		() => [
			// manually add any legacy wallet adapters here
			// new UnsafeBurnerWalletAdapter(),
		],
		[network],
	);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
}
