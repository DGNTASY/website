'use client';

import { UserStatusContext } from '@/app/providers';
import { Button } from '@nextui-org/react';
import { useContext, useState } from 'react';
import QRCode from 'react-qr-code';

interface RequestScoreSubmission {
	requestUrl: string;
	statusUrl: string;
	error?: string;
}

export default function HandleReclaimProof() {
	const { userStatus } = useContext(UserStatusContext);

	const sessionURL = '/api/score';
	const TIMEOUT_REQUEST = 10 * 60 * 1000; // 14min in ms
	const [proofUrls, setProofUrls] = useState<RequestScoreSubmission | null>(
		null,
	);

	async function handleProofRequest() {
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
					{userStatus?.score ? 'Update Score' : 'Send Score'}
				</Button>

				{proofUrls ? (
					<>
						<div className="flex items-center justify-center flex-col gap-3">
							{/* Make qr code if a website - Make link if phone */}
							{isMobile(
								navigator.userAgent || navigator.vendor,
							) ? (
								<div className="font-semibold text-center flex justify-center items-center flex-col">
									<Button
										color="primary"
										className="text-white font-bold"
										onClick={openProof}
									>
										Prove
									</Button>
									<p>
										Refresh the page once you have submitted
										the proof!
									</p>
								</div>
							) : (
								<div className="font-semibold text-center flex justify-center items-center flex-col">
									<QRCode value={proofUrls.requestUrl} />
									<p>
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
