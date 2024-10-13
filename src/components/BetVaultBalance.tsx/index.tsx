'use client';

import { useContext } from 'react';
import Image from 'next/image';
import LogoUSDC from '/public/icons/usdc.svg';

import { VaultContext } from '@/components/providers/VaultProvider';

export default function BetVaultBalance() {
	const { vaultBalance } = useContext(VaultContext);

	return (
		<>
			<div className="flex items-center justify-center flex-col gap-2 text-xl font-semibold text-center max-w-72">
				<p>Total pot</p>
				<p className="flex justify-center items-center gap-2 text-3xl">
					{vaultBalance == null ? 0 : vaultBalance.toNumber()}
					<span className="inline-block">
						<Image
							src={LogoUSDC}
							alt="USDC Coin logo"
							className="max-w-6"
						/>
					</span>
				</p>
			</div>
		</>
	);
}
