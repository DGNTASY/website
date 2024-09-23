'use client';

import { Button } from '@nextui-org/react';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

interface RequestScoreSubmission {
	requestUrl: string;
	statusUrl: string;
	error?: string;
}

type UserStatus = {
	score: string;
	has_betted: boolean;
};

export default function HandleReclaimProof({
	status,
}: {
	status: UserStatus | null;
}) {
	// const [status, setStatus] = useState<UserStatus | null>(null);
	const [proofUrls, setProofUrls] = useState<RequestScoreSubmission | null>(
		null,
	);

	async function handleProofRequest() {
		const sessionURL = '/api/score';

		const updateScore = async () => {
			try {
				const res = await fetch(sessionURL, {
					method: 'GET',
				});

				if (res.ok) {
					const data: RequestScoreSubmission = await res.json();
					console.log(`Got score submission`);

					if (data.error) {
						throw new Error(data.error);
					}

					setProofUrls(data);
				} else {
					console.error(
						`Error requesting proof submission: ${res.status}, ${res.statusText}`,
					);
				}
			} catch (error) {
				console.error('Error requesting proof submission: ', error);
			}
		};

		await updateScore();
	}

	function openProof() {
		window.open(proofUrls?.requestUrl, '_blank');
	}

	function isMobile(userAgent: string): boolean {
		return (
			/android/i.test(userAgent) || /iPhone|iPad|iPod/i.test(userAgent)
		);
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center gap-3">
				<Button
					color="primary"
					className="text-white font-bold"
					onClick={handleProofRequest}
				>
					Send Score
				</Button>

				{status == null || status.score == null ? (
					<>
						<p>
							No score yet, wait for the end of the gameweek to
							submit your score
						</p>
					</>
				) : (
					<>
						<p>Score: {status.score}</p>
					</>
				)}

				{proofUrls ? (
					<>
						<div className="flex items-center justify-center flex-col gap-3">
							{/* Make qr code if a website - Make link if phone */}
							{isMobile(
								navigator.userAgent || navigator.vendor,
							) ? (
								<Button
									color="primary"
									className="text-white font-bold"
									onClick={openProof}
								>
									Prove
								</Button>
							) : (
								<QRCode value={proofUrls.requestUrl} />
							)}

							<p>Status: {proofUrls.statusUrl}</p>
						</div>
					</>
				) : (
					<></>
				)}
			</div>
		</>
	);
}
