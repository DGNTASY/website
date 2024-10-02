'use client';

import BetInfo from '@/components/BetInfo';
import BetVaultBalance from '@/components/BetVaultBalance';
import BetWithdraw from '@/components/BetWithdraw';
import BetAction from '@/components/BetScore';

import { DarkModeContext, UserStatusContext } from '@/app/providers';
import { useContext } from 'react';
import CreateAccountButton from '@/components/CreateAccountButton';

export default function Dashboard() {
	const { darkMode } = useContext(DarkModeContext);
	const { userStatus } = useContext(UserStatusContext);

	const tgLink = process.env.NEXT_PUBLIC_TELEGRAM_LINK;
	if (!tgLink) {
		throw new Error('Failed loading telegram link');
	}

	if (!userStatus) {
		return (
			<main
				className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
			>
				<section className="flex items-center justify-center max-w-screen min-h-screen p-5">
					<div className="flex items-center justify-center flex-col max-w-xl text-center">
						<h1 className="text-xl font-semibold">
							Error fetching user status, try reloading the page,
							if it persists try disconnecting the wallet and
							reconnecting again, if the error still persists
							contact us at our{' '}
							<a href="/" className="text-secondary">
								Telegram
							</a>{' '}
							channel
						</h1>
					</div>
				</section>
			</main>
		);
	}

	if (!userStatus.has_account) {
		return (
			<main
				className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
			>
				<section className="flex items-center justify-center min-w-screen min-h-screen p-5">
					<div className="flex flex-col items-center justify-center gap-5 max-w-xl">
						<h1 className="text-xl font-semibold text-center">
							Before using the app please create your{' '}
							<span className="text-secondary">User Account</span>
						</h1>
						<CreateAccountButton />
					</div>
				</section>
			</main>
		);
	}

	return (
		<main
			className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
		>
			<section className="flex items-center justify-center flex-col gap-10 min-w-screen min-h-screen sm:grid sm:grid-cols-2">
				{/* Betting */}
				<div className="flex items-center justify-center p-5 w-full h-full order-2 sm:order-1">
					<BetInfo />
				</div>

				{/* Balance */}
				<div className="flex items-center justify-center p-5 w-full h-full order-1 sm:order-2">
					<BetVaultBalance />
				</div>

				{/* Score */}
				<div className="flex items-center justify-center p-5 w-full h-full order-3 sm:order-3">
					<BetAction />
				</div>

				{/* Withdraw */}
				<div className="flex items-center justify-center p-5 w-full h-full order-4 sm:order-4">
					<BetWithdraw />
				</div>
			</section>
		</main>
	);
}
