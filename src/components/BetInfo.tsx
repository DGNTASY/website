import { GameWeekStatus } from './GameWeekStatus';

export default function BetInfo({
	gameweekStatus,
	currentBlockDate,
}: {
	gameweekStatus: GameWeekStatus;
	currentBlockDate: Date | null;
}) {
	return (
		<>
			<div className="flex items-center justify-center gap-3 flex-col">
				<p>If you want to bet, press the button and deposit 15 USDC</p>
				<p>
					After the game week took place, press the send score button,
					hit Prove and send us your score!
				</p>
				<p>
					Once you win hit the withdraw button and collect your
					rewards!
				</p>
			</div>
		</>
	);

	// var formattedDate = 'unavailable';
	// if (currentBlockDate != null) {
	// 	const day = `${currentBlockDate.getDay() < 10 ? `0${currentBlockDate.getDay()}` : currentBlockDate.getDay()}`;
	// 	const month = `${currentBlockDate.getMonth() < 10 ? `0${currentBlockDate.getMonth()}` : currentBlockDate.getMonth()}`;
	// 	const hour = `${currentBlockDate.getHours() < 10 ? `0${currentBlockDate.getHours()}` : currentBlockDate.getHours()}`;
	// 	const minute = `${currentBlockDate.getMinutes() < 10 ? `0${currentBlockDate.getMinutes()}` : currentBlockDate.getMinutes()}`;
	// 	formattedDate = `${day}.${month}, ${hour}:${minute}`;
	// }

	// var gameweekInfo = <span>has an error</span>;
	// if (gameweekStatus == GameWeekStatus.BEFORE) {
	// 	gameweekInfo = <span>is yet to start, place your bet!</span>;
	// } else if (gameweekStatus == GameWeekStatus.DURING) {
	// 	gameweekInfo = (
	// 		<span>started, bets have been placed, waiting for results</span>
	// 	);
	// } else {
	// 	// if (yet to change) {
	// 	//     // const hours = 10;
	// 	//     // const minutes = 10
	// 	//     // gameweekInfo = (
	// 	//     //     <span>
	// 	//     //         is done! Submit your score, you still have {hours} hours, and {minutes} minutes
	// 	//     //     </span>
	// 	//     // )
	// 	// } else {
	// 	//     // this one
	// 	// }

	// 	gameweekInfo = (
	// 		<span>
	// 			is done! Claim your rewards if you are one of the winners, if
	// 			not be ready for next week! Bets open shortly
	// 		</span>
	// 	);
	// }

	// return (
	// 	<>
	// 		<div className="flex items-center justify-center flex-col gap-3">
	// 			<p>The current time is {formattedDate}</p>
	// 			<p>The Gameweek {gameweekInfo}</p>
	// 		</div>
	// 	</>
	// );
}
