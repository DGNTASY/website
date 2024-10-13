'use client';

import React, { useContext } from 'react';
import BetButton from '@/components/BetButton';
import Image from 'next/image';
import BetVaultBalance from '@/components/BetVaultBalance.tsx';
import BetWithdraw from '@/components/BetWithdraw';
import ScoreButton from '@/components/ScoreButton';
import BetAmount from '@/components/BetAmount';
import CreateAccountButton from '@/components/CreateAccountButton';
import { UserStatusContext } from '@/components/providers/UserStatusProvider';

const Dapp = () => {
	const { userStatus } = useContext(UserStatusContext);
	const has_account = userStatus ? userStatus.has_account : false;
	const has_betted = userStatus ? userStatus.has_betted : false;

	return (
		<>
			<div className="min-h-screen flex flex-col gap-12 justify-center items-center bg-gradient-to-r from-fuchsia-500 to-cyan-500 relative overflow-hidden py-28 lg:py-8">
				<div className="w-10/12 h-full bg-white/60 text-theme flex justify-between rounded-md">
					<div className="p-8">
						<BetVaultBalance />
					</div>
					<div className="p-8">
						<BetAmount />
					</div>
				</div>

				{!has_account ? (
					// Initialize account
					<div className="h-full w-11/12 grid grid-cols-1 lg:grid-cols-1 gap-16 place-items-center">
						<div className="relative w-[350px] h-[450px] overflow-hidden rounded-lg shadow-lg md:hover:scale-110 transition-all">
							<Image
								src="/create-account.jpg"
								alt="Background Image"
								layout="fill"
								objectFit="cover"
								className="z-0 opacity-50"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

							<div className="relative w-full h-full flex flex-col justify-center items-center z-20 p-6 text-white">
								<div className="flex justify-between">
									<CreateAccountButton />
								</div>
							</div>
						</div>
					</div>
				) : (
					// Play game
					<div className="h-full w-11/12 grid grid-cols-1 lg:grid-cols-3 gap-16 place-items-center ">
						{/* card1 */}
						<div className="relative w-[350px] h-[450px] overflow-hidden rounded-lg shadow-lg md:hover:scale-110 transition-all">
							<Image
								src="/bet.jpg"
								alt="Background Image"
								layout="fill"
								objectFit="cover"
								className="z-0 opacity-50 "
							/>
							<div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

							<div className="relative w-full h-full flex flex-col justify-center items-center z-20 p-6 text-white">
								<div className="flex justify-between">
									<BetButton disabled={has_betted} />
								</div>
							</div>
						</div>

						{/* card2 */}
						<div className="relative w-[350px] h-[450px] overflow-hidden rounded-lg shadow-lg md:hover:scale-110 transition-all">
							<Image
								src="/score.jpg"
								alt="Background Image"
								layout="fill"
								objectFit="cover"
								className="z-0 opacity-50"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

							<div className="relative w-full h-full flex flex-col justify-center items-center z-20 p-6 text-white">
								<div className="flex justify-between">
									<ScoreButton />
								</div>
							</div>
						</div>

						{/* card3 */}
						<div className="relative w-[350px] h-[450px] overflow-hidden rounded-lg shadow-lg md:hover:scale-110 transition-all">
							<Image
								src="/withdraw.avif"
								alt="Background Image"
								layout="fill"
								objectFit="cover"
								className="z-0 opacity-50 "
							/>
							<div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

							<div className="relative w-full h-full flex flex-col justify-center items-center z-20 p-6 text-white">
								<div className="flex justify-between">
									<BetWithdraw />
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Dapp;
