'use client';

import ScoreButton from './ScoreButton';
import { useContext } from 'react';
import { UserStatusContext } from '@/app/providers';

export default function BetScore() {
	const { userStatus } = useContext(UserStatusContext);

	return (
		<>
			<div className="flex flex-col items-center justify-center gap-8 text-center font-semibold text-xl">
				{userStatus == null || userStatus.score == null ? (
					<>
						<p className="max-w-64">
							No score yet, wait for the end of the gameweek to
							submit your score
						</p>
					</>
				) : (
					<>
						<p>
							Your Score:{' '}
							<span className="text-secondary">
								{userStatus.score}
							</span>
						</p>
						<p className="max-w-64">
							If it changed and you want to submit a better result
							update it!
						</p>
					</>
				)}

				<ScoreButton />
			</div>
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
