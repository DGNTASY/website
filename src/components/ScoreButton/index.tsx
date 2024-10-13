'use client';

import { UserStatusContext } from '@/components/providers/UserStatusProvider';
import { useContext, useState } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '../ui/button';
import { getScoreURL } from '@/lib/api/routes';

interface RequestScoreSubmission {
	requestUrl: string;
	statusUrl: string;
	error?: string;
}

export default function ScoreButton() {
	const { userStatus } = useContext(UserStatusContext);

	const TIMEOUT_REQUEST = 8 * 60 * 1000; // 8min in ms
	const [proofUrls, setProofUrls] = useState<RequestScoreSubmission | null>(
		null,
	);

	async function handleProofRequest() {
		try {
			const res = await fetch(getScoreURL, {
				method: 'GET',
			});

			if (res.ok) {
				const data: RequestScoreSubmission = await res.json();
				console.log(`Got score submission`);

				if (data.error) {
					throw new Error(data.error);
				}

				setProofUrls(data);
				setTimeout(() => {
					setProofUrls(null);
				}, TIMEOUT_REQUEST);
			} else {
				console.error(
					`Error requesting proof submission: ${res.status}, ${res.statusText}`,
				);
			}
		} catch (error) {
			console.error('Error requesting proof submission: ', error);
		}
	}

	function openProof() {
		if (!proofUrls) {
			return;
		}

		window.open(proofUrls.requestUrl, '_blank');
	}

	function isMobile(userAgent: string): boolean {
		return (
			/android/i.test(userAgent) || /iPhone|iPad|iPod/i.test(userAgent)
		);
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center gap-5">
				{userStatus?.score ? (
					<p className="rounded-md text-white text-center font-bold py-3 px-2">
						Current score of <br />{' '}
						<span className="font-extrabold text-3xl">
							{userStatus.score}
						</span>
					</p>
				) : (
					<></>
				)}

				<Button
					color="primary"
					className="bg-[#43a3fe] text-theme font-semibold rounded-md hover:bg-[#43a3fe]"
					onClick={handleProofRequest}
				>
					{userStatus?.score ? 'UPDATE SCORE' : 'PROVE SCORE'}
				</Button>

				{proofUrls ? (
					<>
						<div className="flex items-center justify-center flex-col">
							{/* Make qr code if a website - Make link if phone */}
							{isMobile(
								navigator.userAgent || navigator.vendor,
							) ? (
								<div className="font-semibold text-center flex justify-center items-center flex-col gap-5">
									<Button
										color="primary"
										className="bg-[#43a3fe] text-theme font-semibold rounded-md hover:bg-[#43a3fe]"
										onClick={openProof}
									>
										Prove
									</Button>
									<p className="bg-[#43a3fe] rounded-md">
										Refresh the page once you have submitted
										the proof!
									</p>
								</div>
							) : (
								<div className="font-semibold text-center flex justify-center items-center flex-col gap-5">
									<QRCode value={proofUrls.requestUrl} />
									<p className="bg-[#43a3fe] rounded-md text-theme">
										Refresh the page once you have submitted
										the proof!
									</p>
								</div>
							)}
						</div>
					</>
				) : (
					<></>
				)}
			</div>
		</>
	);
}
