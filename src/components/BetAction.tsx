'use client';

import { GameWeekStatus } from './GameWeekStatus';

import BetButton from './BetButton';
import ScoreButton from './ScoreButton';
import { useEffect, useState } from 'react';

type UserStatus = {
	score: string;
	has_betted: boolean;
};

export default function BetAction({
	gameweekStatus,
}: {
	gameweekStatus: GameWeekStatus;
}) {
	//
	const [status, setStatus] = useState<UserStatus | null>(null);
	const statusURL = '/api/status';

	async function updateStatus() {
		try {
			const res = await fetch(statusURL, {
				method: 'GET',
			});

			if (res.ok) {
				console.log('Status received');
				const status: UserStatus = await res.json();
				console.log(status.score, status.has_betted);
				setStatus(status);
			} else {
				console.error(
					`Error confirming bet: ${res.status}, ${res.statusText}`,
				);
			}
		} catch (error) {
			console.error(`Error confirming bet: ${error}`);
		}
	}

	useEffect(() => {
		updateStatus();
	}, []);

	return (
		<>
			<BetButton status={status} />
			<ScoreButton status={status} />
		</>
	);

	// if (gameweekStatus == GameWeekStatus.BEFORE) {
	// 	return (
	// 		<>
	// 			<BetButton />
	// 		</>
	// 	);
	// }

	// if (gameweekStatus == GameWeekStatus.DURING) {
	// 	return (
	// 		<>
	// 			<p>
	// 				Gameweek is taking place, you can withdraw your previous
	// 				winnings or come back once the gameweek ends to set your
	// 				score
	// 			</p>
	// 		</>
	// 	);
	// }

	// // check it is after with score or not
	// // check is score is setted and provide feedback
	// if (gameweekStatus == GameWeekStatus.AFTER) {
	// 	return (
	// 		<>
	// 			<ScoreButton />
	// 		</>
	// 	);
	// }

	// if (gameweekStatus == GameWeekStatus.ERROR) {
	// 	return (
	// 		<>
	// 			<p>Error colleting gameweek status</p>
	// 		</>
	// 	);
	// }
}
