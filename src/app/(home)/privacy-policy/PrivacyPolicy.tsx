'use client';

import { DarkModeContext } from '@/app/providers';
import { useContext } from 'react';

export default function PrivacyPolicy() {
	const { darkMode } = useContext(DarkModeContext);

	const TERMS_AND_CONDITIONS_LI = [
		{
			title: 'Information We Collect',
			sections: [
				'Public Key: We collect your public key to associate your participation in the gameweek and to determine winners.',
				'Fantasy Premier League Score: We collect and store your score for up to one week, after which it is permanently deleted.',
				'We do not collect any personal, sensitive, or identifying information beyond your public key and game score.',
			],
		},
		{
			title: 'Use of Information',
			sections: [
				'The information we collect is used solely for the purpose of: Associating your public key with your Fantasy Premier League score, Determining winners for each gameweek.',
			],
		},
		{
			title: 'Data Retention',
			sections: [
				'We store the collected scores for one week, after which the data is deleted. We do not retain your scores or any other personal data after that time.',
			],
		},
		{
			title: 'Cookies',
			sections: [
				'We use a single cookie to store a session in your browser. This session is used to facilitate your experience on our platform. We do not use third-party cookies or any form of tracking technology.',
			],
		},
		{
			title: 'No Data Sharing',
			sections: [
				'We do not share, sell, or trade your information with any third parties. All data remains within our system and is used only for the purposes outlined in this Privacy Policy.',
			],
		},
		{
			title: 'No Sensitive Data Collected',
			sections: [
				'Dgntasy does not collect sensitive information such as your name, address, payment details, or any other personal information that could directly identify you.',
			],
		},
		{
			title: 'User Rights',
			sections: [
				'You have full control over whether to use our platform. If you choose to stop using Dgntasy, you are free to do so at any time. You have the right to opt-out of our services by simply exiting the platform.',
			],
		},
		{
			title: 'Children',
			sections: [
				'Dgntasy is not intended for use by individuals under the age of 18. We do not knowingly collect information from children, and we ask that children do not use our platform.',
			],
		},
		{
			title: 'Data Transfers',
			sections: [
				'We do not transfer data to any other countries or third parties. All data is stored and processed locally on our systems.',
			],
		},
		{
			title: 'Changes to This Policy',
			sections: [
				'Any changes to this Privacy Policy will be posted on this page. We encourage you to review this policy periodically to stay informed of any updates.',
			],
		},
	];

	return (
		<main
			className={`flex items-center justify-center py-16 px-16 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
		>
			<div className="flex items-center justify-center max-w-screen-xl flex-col gap-20">
				<h1 className="text-4xl font-extrabold">
					Privacy Policy for Dgntasy
				</h1>

				<div className="text-justify flex items-center justify-center flex-col gap-14">
					<div className="flex items-start justify-center flex-col gap-5">
						<h2 className="text-2xl font-bold text-primary">
							Last Updated: 09.28.24
						</h2>
						<p>
							At Dgntasy, we respect your privacy and are
							committed to protecting your personal information.
							This Privacy Policy explains how we collect, use,
							and safeguard your information when you use our
							service.
						</p>
					</div>

					<ol className="flex items-start justify-center flex-col gap-8">
						{TERMS_AND_CONDITIONS_LI.map((tcItem, i) => {
							return (
								<li
									className="flex gap-3 flex-col"
									key={`tc-${i}`}
								>
									<h3 className="text-xl font-bold text-primary">
										{i}. {tcItem.title}
									</h3>
									<div className="flex items-start justify-center gap-5 flex-col">
										{tcItem.sections.map((section, j) => {
											return (
												<p className="flex gap-3">
													<span className="font-semibold text-primary">
														{i}.{j}
													</span>{' '}
													<span>{section}</span>
												</p>
											);
										})}
									</div>
								</li>
							);
						})}
					</ol>
				</div>
			</div>
		</main>
	);
}
