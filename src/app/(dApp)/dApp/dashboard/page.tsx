import { Metadata } from 'next';

import BetInfo from '@/components/BetInfo';
import BetVaultBalance from '@/components/BetVaultBalance';
import BetWithdraw from '@/components/BetWithdraw';
import BetAction from '@/components/BetScore';

import Dashboard from './Dashboard';

export const metadata: Metadata = {
	title: 'Dashboard',
};

export default async function dApp() {
	// async function getSolanaBlockTms(): Promise<Date | null> {
	// 	'use server';

	// 	const connection = new Connection(
	// 		clusterApiUrl('mainnet-beta'), ADD ENV
	// 		'confirmed',
	// 	);

	// 	try {
	// 		// Get the latest confirmed block number
	// 		const slot = await connection.getSlot('confirmed');
	// 		const blockTime = await connection.getBlockTime(slot);
	// 		const date = blockTime ? new Date(blockTime * 1000) : null;
	// 		return date;
	// 	} catch (error) {
	// 		console.error('Error fetching block timestamp:', error);
	// 		return null;
	// 	}
	// }

	// async function getGameWeekTimestamps(): Promise<{
	// 	start: Date;
	// 	end: Date;
	// } | null> {
	// 	'use server';
	// 	return null;
	// }

	// async function getScoreSubmissionTime(): Promise<Date | null> {
	// 	'use server';
	// 	return null;
	// }

	// // Make date
	// const blockDate = await getSolanaBlockTms();

	// // check status bet
	// const gameweekDate = await getGameWeekTimestamps();
	// var gameweekStatus =
	// 	gameweekDate && blockDate
	// 		? blockDate < gameweekDate.start
	// 			? GameWeekStatus.BEFORE
	// 			: blockDate < gameweekDate.end
	// 				? GameWeekStatus.DURING
	// 				: GameWeekStatus.AFTER
	// 		: GameWeekStatus.ERROR;
	// gameweekStatus = GameWeekStatus.AFTER;

	// async function getUserStatus() {
	// 	'use server';
	// 	const statusURL = '/api/status';

	// 	try {
	// 		const res = await fetch(statusURL, {
	// 			method: 'GET',
	// 		});

	// 		if (res.ok) {
	// 			console.log('Status received');
	// 			const status: UserStatus = await res.json();
	// 			console.log(
	// 				status.score,
	// 				status.has_betted,
	// 				status.has_account,
	// 			);

	// 			return status;
	// 		} else {
	// 			console.error(
	// 				`Error confirming bet: ${res.status}, ${res.statusText}`,
	// 			);
	// 			return null;
	// 		}
	// 	} catch (error) {
	// 		console.error(`Error confirming bet: ${error}`);
	// 		return null;
	// 	}
	// }

	// const status = await getUserStatus();

	return <Dashboard />;
}
