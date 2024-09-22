'use client';

import { Button } from '@nextui-org/react';

import { useEffect, useState } from 'react';

interface RequestScoreSubmission {
	requestUrl: string;
	statusUrl: string;
	error?: string;
}

type UserStatus = {
	score: string;
	has_betted: boolean;
};

export default function HandleReclaimProof() {
	const [status, setStatus] = useState<UserStatus | null>(null);
	const [proofUrls, setProofUrls] = useState<RequestScoreSubmission | null>(
		null,
	);

	const statusURL = '/api/status';

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

	function openProof() {
		window.open(proofUrls?.requestUrl, '_blank');
	}

	useEffect(() => {
		updateStatus();
	}, []);

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
							<Button
								color="primary"
								className="text-white font-bold"
								onClick={openProof}
							>
								Prove
							</Button>
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
