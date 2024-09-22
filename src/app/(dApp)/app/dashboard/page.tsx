import VaultBalance from '@/components/BetVaultBalance';
import { Button } from '@nextui-org/react';
import { Metadata } from 'next';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

import { GameWeekStatus } from '@/components/GameWeekStatus';
import BetInfo from '@/components/BetInfo';
import BetVaultBalance from '@/components/BetVaultBalance';
import BetWithdraw from '@/components/BetVaultBalance';
import BetAction from '@/components/BetAction';

export const metadata: Metadata = {
	title: 'Dashboard',
};

export default async function dApp() {
	async function getSolanaBlockTms(): Promise<Date | null> {
		'use server';

		const connection = new Connection(
			clusterApiUrl('mainnet-beta'),
			'confirmed',
		);

		try {
			// Get the latest confirmed block number
			const slot = await connection.getSlot('confirmed');
			const blockTime = await connection.getBlockTime(slot);
			const date = blockTime ? new Date(blockTime * 1000) : null;
			return date;
		} catch (error) {
			console.error('Error fetching block timestamp:', error);
			return null;
		}
	}

	async function getGameWeekTimestamps(): Promise<{
		start: Date;
		end: Date;
	} | null> {
		'use server';
		return null;
	}

	async function getScoreSubmissionTime(): Promise<Date | null> {
		'use server';
		return null;
	}

	// Make date
	const blockDate = await getSolanaBlockTms();

	// check status bet
	const gameweekDate = await getGameWeekTimestamps();
	var gameweekStatus =
		gameweekDate && blockDate
			? blockDate < gameweekDate.start
				? GameWeekStatus.BEFORE
				: blockDate < gameweekDate.end
					? GameWeekStatus.DURING
					: GameWeekStatus.AFTER
			: GameWeekStatus.ERROR;
	gameweekStatus = GameWeekStatus.AFTER;

	return (
		<main className="min-h-screen bg-black">
			<section className="flex items-center justify-center flex-col gap-16 max-w-screen-xl min-h-screen">
				{/* Current state of the bet */}
				<BetInfo
					gameweekStatus={gameweekStatus}
					currentBlockDate={blockDate}
				/>

				{/* If he has a bet or not */}
				<BetAction gameweekStatus={gameweekStatus} />

				{/* The current pot and possible winnings */}
				<BetVaultBalance gameweekStatus={gameweekStatus} />

				{/* His winnings to withdraw */}
				<BetWithdraw gameweekStatus={gameweekStatus} />
			</section>
		</main>
	);
}
