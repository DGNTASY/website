import { GameWeekStatus } from './GameWeekStatus';

import BetButton from './BetButton';
import ScoreButton from './ScoreButton';

export default function BetAction({
	gameweekStatus,
}: {
	gameweekStatus: GameWeekStatus;
}) {
	//
	return (
		<>
			<BetButton />
			<ScoreButton />
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
