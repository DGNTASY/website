'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Wallet from '../Wallet';

export default function Header() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<div className="flex z-[40] py-2 text-white bg-[#37003c] justify-between items-center gap-2 lg:gap-8 fixed top-0 left-0 w-screen font-medium px-3 lg:px-8 backdrop-blur-lg">
			<Link href={'/'}>
				<div className="flex justify-center items-center gap-2 lg:gap-4">
					<Image src={'/fpl.png'} alt="logo" width={40} height={40} />
					<p>DGNTASY</p>
				</div>
			</Link>

			<div className="hidden lg:flex justify-center items-center gap-4">
				<Image src={'/solana.png'} alt="logo" width={40} height={40} />
				<p className=" font-bold ps-2 text-base">
					BET&nbsp;ON&nbsp;FANTASY&nbsp;PREMIER&nbsp;LEAGUE&nbsp;FOR&nbsp;GAMEWEEK&nbsp;7
				</p>
				<Image src={'/usdc.png'} alt="logo" width={50} height={50} />
			</div>

			{/* Ensure this button is only rendered after the client-side mount */}
			<div className=" text-theme font-semibold rounded-lg">
				{isMounted && <Wallet />} {/* Conditional rendering */}
			</div>
		</div>
	);
}
