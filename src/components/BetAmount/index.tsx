'use client';

import Image from 'next/image';
import LogoUSDC from '/public/icons/usdc.svg';
import { VaultContext } from '../providers/VaultProvider';
import { useContext } from 'react';

export default function BetAmount() {
	const { vaultBet } = useContext(VaultContext);

	return (
		<div className="flex items-center justify-center flex-col gap-2 text-xl font-semibold text-center max-w-72">
			<p>Bet amount is</p>
			<p className="flex justify-center items-center gap-2 text-3xl">
				{vaultBet == null ? 0 : vaultBet.toNumber()}
				<span className="inline-block">
					<Image
						src={LogoUSDC}
						alt="USDC Coin logo"
						className="max-w-6 "
					/>
				</span>
			</p>
		</div>
	);
}
