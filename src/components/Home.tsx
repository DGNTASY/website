'use client';

import Image from 'next/image';
import { Button } from '@nextui-org/react';
import { useContext, useState } from 'react';

import { DarkModeContext } from '../app/providers';
import Link from 'next/link';
import ReclaimWhite from '/public/icons/ReclaimLogoWhite.svg';
import ReclaimBlack from '/public/icons/ReclaimLogoBlack.svg';
import SolanaWhite from '/public/icons/SolanaLogoWhite.svg';
import SolanaBlack from '/public/icons/SolanaLogoBlack.svg';
import CircleWhite from '/public/icons/CircleLogoWhite.svg';
import CircleBlack from '/public/icons/CircleLogoBlack.svg';

import LogoPremierLeague from '/public/pl/PremierLeagueLogo.svg';
import LogoUSDC from '/public/icons/usdc.svg';

import Arsenal from '/public/pl/Arsenal.svg';
import AstonVilla from '/public/pl/AstonVilla.svg';
import Brentford from '/public/pl/Brentford.svg';
import Bournemouth from '/public/pl/Bournemouth.svg';
import BrightonAndHoveAlbion from '/public/pl/BrightonAndHoveAlbion.svg';
import Chelsea from '/public/pl/Chelsea.svg';
import CrystalPalace from '/public/pl/CrystalPalace.svg';
import Everton from '/public/pl/Everton.svg';
import Fulham from '/public/pl/Fulham.svg';
import IpswichTown from '/public/pl/IpswichTown.svg';
import LeicesterCity from '/public/pl/LeicesterCity.svg';
import Liverpool from '/public/pl/Liverpool.svg';
import Manchestercity from '/public/pl/ManchesterCity.svg';
import ManchesterUnited from '/public/pl/ManchesterUnited.svg';
import NewcastleUnited from '/public/pl/NewcastleUnited.svg';
import NottinghamForest from '/public/pl/NottinghamForest.svg';
import Southampton from '/public/pl/Southampton.svg';
import TottenhamHotspur from '/public/pl/TottenhamHotspur.svg';
import WestHamUnited from '/public/pl/WestHamUnited.svg';
import WolverhamptonWanderers from '/public/pl/WolverhamptonWanderers.svg';

export default function Home() {
	const { darkMode } = useContext(DarkModeContext);
	const [isPopUpVisible, setPopUpVisibility] = useState(false);

	const TEAMS_LIST = [
		Arsenal,
		AstonVilla,
		Brentford,
		Bournemouth,
		BrightonAndHoveAlbion,
		Chelsea,
		CrystalPalace,
		Everton,
		Fulham,
		IpswichTown,
		LeicesterCity,
		Liverpool,
		Manchestercity,
		ManchesterUnited,
		NewcastleUnited,
		NottinghamForest,
		Southampton,
		TottenhamHotspur,
		WestHamUnited,
		WolverhamptonWanderers,
	];

	function changePopUpVisibility() {
		setPopUpVisibility(!isPopUpVisible);
	}

	function redirectToFantasyPremierLeague() {
		window.open('https://fantasy.premierleague.com/', '_blank');
	}

	return (
		<>
			<div
				className={`${isPopUpVisible ? 'visible' : 'hidden'} fixed w-screen h-screen flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-white'} bg-opacity-80 z-50`}
			>
				<section
					className={`flex items-start justify-center flex-col bg-gradient-to-br from-80% to-20% to-primary-900 py-5 px-9 gap-8 max-w-xl border-1  ${darkMode ? 'text-white border-white from-black' : 'text-black border-black from-white'}`}
				>
					<h1 className="font-bold text-5xl">Start By Winning!</h1>
					<p className="font-semibold text-xl">
						To play and{' '}
						<span className="text-secondary">win huge prizes</span>{' '}
						connect the wallet on the{' '}
						<span className="text-secondary">top right button</span>
						, you will be redirected to the dApp dashboard
					</p>
					<Button
						color="primary"
						className={`font-extrabold ${darkMode ? 'text-white' : 'text-black'}`}
						size="lg"
						onClick={changePopUpVisibility}
					>
						Understood
					</Button>
				</section>
			</div>

			<main
				className={`flex min-h-screen items-center justify-center p-12 lg:y-24 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} z-40`}
			>
				<div className="flex items-center justify-around flex-col lg:flex-row self-stretch">
					<div className="lg:w-1/2 flex flex-col items-start justify-center gap-6 lg:gap-16 z-20">
						<div className="flex flex-col gap-2 text-justify">
							<h1 className="font-extrabold text-primary text-5xl lg:text-8xl">
								Dgntasy
							</h1>
							<h2 className="font-extrabold text-xl lg:text-3xl">
								lets you challenge anyone in your favourite
								league
							</h2>
						</div>

						<div className="flex items-center justify-center flex-grow lg:pl-20">
							<div className="flex items-center justify-center flex-grow text-justify">
								<p className="text-sm lg:text-base font-normal">
									Fantasy Premier League (FPL) is a virtual
									football game where participants create and
									manage their own team of real-life Premier
									League players, earning points based on
									their performances in actual matches. With{' '}
									<span className="text-primary">
										Dgntasy
									</span>{' '}
									, you can bet on your FPL score for each
									gameweek, giving you a chance to win a large
									pot depending on how well your team
									performs.
								</p>
							</div>
						</div>

						<div className="flex items-center justify-end flex-grow w-full">
							<Button
								className={`font-extrabold ${darkMode ? 'text-white' : 'text-black'}`}
								size="lg"
								color="primary"
								onClick={changePopUpVisibility}
							>
								PLAY
							</Button>
						</div>
					</div>

					<div className="relative flex flex-col items-center justify-center w-full lg:w-1/2 h-full z-10">
						<Image
							className="w-60 absolute z-20 -translate-x-20 translate-y-8"
							src={LogoPremierLeague}
							alt="Usdc"
						/>
						<Image
							className="w-60 absolute z-10 translate-x-20 -translate-y-8"
							src={LogoUSDC}
							alt="Premier League Logo"
						/>
						<div className="absolute flex items-center justify-center flex-wrap w-full h-full gap-3 opacity-65">
							{TEAMS_LIST.map((team) => {
								return (
									<>
										<Image
											className="max-w-16 sm:max-w-32"
											src={team}
											alt="Premier League Team Logo"
										/>
									</>
								);
							})}
						</div>
					</div>
				</div>
			</main>

			<section className="flex items-center justify-center flex-col min-h-20 gap-3 bg-primary py-3">
				<h2
					className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-black'}`}
				>
					Powered by
				</h2>
				<div className="flex items-center justify-center gap-10 flex-row">
					<Link href={'https://reclaimprotocol.org/'}>
						<Image
							className="w-14"
							src={darkMode ? ReclaimWhite : ReclaimBlack}
							alt="Reclaim Logo"
						/>
					</Link>
					<Link href={'https://www.circle.com/en/'}>
						<Image
							src={darkMode ? CircleWhite : CircleBlack}
							alt="Circle Logo"
							className="w-14"
						/>
					</Link>
					<Link href={'https://solana.com/'}>
						<Image
							src={darkMode ? SolanaWhite : SolanaBlack}
							alt="Circle Logo"
							className="w-14"
						/>
					</Link>
				</div>
			</section>

			<section
				className={`flex flex-row lg:grid items-center justify-center min-h-screen flex-wrap lg:grid-cols-2 ${darkMode ? 'text-white bg-black' : 'text-black bg-white'}`}
			>
				<div className="p-5 lg:p-10 flex flex-col items-start justify-start gap-7 w-full h-full">
					<h2 className="font-extrabold text-primary text-2xl lg:text-5xl">
						Overview
					</h2>
					<p className="text-justify text-base lg:text-xl">
						<span className="text-secondary">Dgntasy</span> is a
						decentralized application (dApp) that lets you bet on
						your Fantasy Premier League (FPL) gameweek scores for a
						chance to win big rewards. Each week, you can compete
						against others, and if your score is among the top
						three, you’ll take home a portion of the pot.
					</p>
				</div>

				<div className="p-5 lg:p-10 flex flex-col items-start justify-center gap-7">
					<h2 className="font-extrabold text-primary text-2xl lg:text-5xl">
						What is FPL and How to Play
					</h2>
					<div className="flex flex-col items-start justify-center gap-4">
						<div className="flex flex-col items-start justify-center gap-1">
							<p className="text-justify text-base lg:text-xl">
								Fantasy Premier League (FPL) is a virtual game
								where you create a football team using real-life
								players. Your team earns points based on the
								players' performance each week. Here’s how to
								start:
							</p>
							<h3 className="text-secondary text-base lg:text-xl">
								FPL Flow:
							</h3>
						</div>
						<ul className="flex flex-col items-start justify-center gap-2 border-l-2 border-primary pl-4">
							<li>
								<p className="text-justify text-base lg:text-xl">
									Log in to the FPL website and create an
									account.
								</p>
							</li>
							<li>
								<p className="text-justify text-base lg:text-xl">
									Build your team of real-life players
								</p>
							</li>
							<li>
								<p className="text-justify text-base lg:text-xl">
									Wait for the gameweek to finish and check
									your score.
								</p>
							</li>
						</ul>
					</div>
					<Button
						className={`font-extrabold ${darkMode ? 'text-white' : 'text-black'}`}
						size="lg"
						color="primary"
						onClick={redirectToFantasyPremierLeague}
					>
						FPL
					</Button>
				</div>

				<div className="p-5 lg:p-10 flex flex-col items-start justify-center gap-7">
					<h2 className="font-extrabold text-primary text-2xl lg:text-5xl">
						How to Use the Dgntasy dApp
					</h2>

					<div className="flex flex-col items-start justify-center gap-3">
						<h3 className="text-base lg:text-xl">
							Here’s how to get started and place your bet:
						</h3>

						<ul className="flex flex-col items-start justify-center gap-2 border-l-2 border-primary pl-4">
							<li>
								<p className="text-justify text-base lg:text-xl">
									Log in to the Dgntasy dApp by connecting
									your wallet in the{' '}
									<span className="text-secondary">
										top right
									</span>
									.
								</p>
							</li>
							<li>
								<p className="text-justify text-base lg:text-xl">
									<span className="text-secondary">
										Create an account
									</span>{' '}
									within the dApp, if you don’t have one yet.
								</p>
							</li>
							<li>
								<p className="text-justify text-base lg:text-xl">
									<span className="text-secondary">
										Place your bet
									</span>{' '}
									for the current gameweek by pressing the{' '}
									<span className="text-secondary">
										"Bet" button
									</span>{' '}
									and sending USDC funds to the escrow
									contract.
								</p>
							</li>
							<li>
								<p className="text-justify text-base lg:text-xl">
									Wait for the gameweek to finish.
								</p>
							</li>
							<li className="flex flex-col items-start justify-center gap-1">
								<p className="text-justify text-base lg:text-xl">
									Submit your score:
								</p>

								<ul className="flex flex-col items-start justify-center gap-2 border-l-2 border-primary pl-4">
									<li>
										<p className="text-justify text-base lg:text-xl">
											<span className="text-secondary">
												On desktop
											</span>
											: Click "Send Score," and a QR code
											will appear. Scan it, log in to your
											FPL account, and send proof of your
											score.
										</p>
									</li>
									<li>
										<p className="text-justify text-base lg:text-xl">
											<span className="text-secondary">
												On mobile
											</span>
											: Press the "Prove" button, log in
											to FPL directly, and send the score
											proof.
										</p>
									</li>
								</ul>
							</li>
							<li>
								<p className="text-justify text-base lg:text-xl">
									After the gameweek ends, the oracle will
									select the{' '}
									<span className="text-secondary">
										top 3 scores
									</span>{' '}
									and distribute
									<span className="text-secondary">
										rewards
									</span>
									. The pot, scores, and betting status reset
									for a new gameweek.
								</p>
							</li>
						</ul>
					</div>

					<Button
						className={`font-extrabold ${darkMode ? 'text-white' : 'text-black'}`}
						size="lg"
						color="primary"
						onClick={changePopUpVisibility}
					>
						PLAY
					</Button>
				</div>

				<div className="p-5 lg:p-10 flex flex-col items-start justify-end gap-7 w-full h-full">
					<h2 className="font-extrabold text-primary text-2xl lg:text-5xl">
						Learn More
					</h2>
					<p className="text-justify text-base lg:text-xl">
						For more details, check out our{' '}
						<span className="text-secondary">
							<a href="/">Telegram</a>
						</span>{' '}
						channel, our
						<span className="text-secondary">
							<a href="/">documentation</a>
						</span>
						, or follow us on{' '}
						<span className="text-secondary">
							<a href="/">Twitter</a>
						</span>
						!
					</p>
				</div>
			</section>
		</>
	);
}
