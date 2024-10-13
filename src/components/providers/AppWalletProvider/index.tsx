'use client';

import React, { useMemo } from 'react';
import {
	ConnectionProvider,
	WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Cluster, clusterApiUrl } from '@solana/web3.js';
// import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";

// Default styles
require('@solana/wallet-adapter-react-ui/styles.css');

export default function AppWalletProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	// Check environment for chain
	const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK
		? process.env.NEXT_PUBLIC_SOLANA_NETWORK
		: WalletAdapterNetwork.Devnet;

	// Select correct endpoint
	const endpoint = useMemo(() => {
		if (network == 'devnet') {
			return clusterApiUrl(network as Cluster);
		} else {
			// If fails to load NEXT_PUBLIC_SOLANA_RPC_MAINNET set cluster api devnet rpc
			return process.env.NEXT_PUBLIC_SOLANA_RPC_MAINNET
				? process.env.NEXT_PUBLIC_SOLANA_RPC_MAINNET
				: clusterApiUrl(WalletAdapterNetwork.Devnet);
		}
	}, [network]);

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
