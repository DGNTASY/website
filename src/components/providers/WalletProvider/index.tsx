'use client';

import React, { FC, ReactNode, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
	ConnectionProvider,
	WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
	PhantomWalletAdapter,
	SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css'; // Default styles for the wallet modal

const SolanaWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
	// Set network to devnet or mainnet-beta
	const network = WalletAdapterNetwork.Devnet;

	// Get the cluster endpoint (Solana RPC)
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);

	// Set up the wallet(s) you want to support
	const wallets = useMemo(
		() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
		[],
	);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};

export default SolanaWalletProvider;
