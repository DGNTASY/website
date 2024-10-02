'use client';

import { DarkModeContext } from '@/app/providers';
import { useContext } from 'react';

export default function TermsAndConditions() {
	const { darkMode } = useContext(DarkModeContext);

	const TERMS_AND_CONDITIONS_LI = [
		{
			title: 'Eligibility',
			sections: [
				'You must be at least 18 years of age, or the legal age for gambling in your jurisdiction (whichever is higher), to use the Platform.',
				'By using the Platform, you represent and warrant that you meet all eligibility requirements.',
			],
		},
		{
			title: 'Risk Acknowledgment',
			sections: [
				'Blockchain and Smart Contract Risks: The Platform operates on the Solana blockchain, and your participation involves interaction with smart contracts. These smart contracts are not audited and may contain vulnerabilities, bugs, or errors. By using the Platform, you acknowledge that any interaction with smart contracts carries a significant risk of financial loss and you assume full responsibility for any such loss.',
				'Volatility: The value of Solana (SOL), USDC, or other digital assets used on the Platform may be volatile. You acknowledge and accept all risks associated with fluctuations in the value of these assets.',
				' Loss of Access: In the event of wallet loss, private key loss, or other issues related to access, you acknowledge that there may be no way to recover your funds, and the Platform is not responsible for lost or stolen digital assets.',
			],
		},
		{
			title: 'No Guarantees',
			sections: [
				'The Platform is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind, express or implied. We do not guarantee that the Platform will function without interruptions, errors, or defects.',
				'No Auditing: You understand that the smart contracts used in this Platform are not audited. We make no representations or warranties regarding their security, accuracy, or proper functionality.',
				'No Guarantees of Results: Participation in betting on the Platform does not guarantee any particular outcomes or winnings. You acknowledge that gambling involves a risk of financial loss, and you may lose part or all of your staked funds.',
			],
		},
		{
			title: 'Financial Responsibility',
			sections: [
				'You agree to be fully responsible for any and all losses, damages, and liabilities arising from your participation in the betting and gambling activities offered on the Platform.',
				'No Refunds: All transactions on the Solana blockchain are final and irreversible. The Platform cannot reverse, cancel, or provide refunds for any transaction executed via the Solana blockchain or associated smart contracts.',
			],
		},
		{
			title: 'Jurisdiction and Compliance',
			sections: [
				'Legal Compliance: It is your responsibility to ensure that your use of the Platform is in compliance with the laws and regulations of your jurisdiction, especially with regard to gambling.',
				'Prohibited Jurisdictions: The Platform is not available for use in jurisdictions where online gambling is illegal. By using the Platform, you represent that your jurisdiction allows online gambling, and you are solely responsible for complying with your local laws.',
			],
		},
		{
			title: 'Limitation of Liability',
			sections: [
				'No Liability for Financial Losses: To the maximum extent permitted by law, Dgntasy and its operators, developers, and affiliates are not liable for any financial losses you incur as a result of using the Platform, including but not limited to losses resulting from: Smart contract bugs or vulnerabilities, Exploitation or hacks of the smart contract or the Solana blockchain, Volatility in digital asset prices, Loss of access to digital wallets or private keys, Mistaken transactions, including sending funds to the wrong address',
				'No Liability for Platform Downtime: We are not responsible for any disruptions, downtime, or interruptions in the operation of the Platform, whether due to blockchain network congestion, attacks, or any other reason.',
			],
		},
		{
			title: 'Indemnification',
			sections: [
				'You agree to indemnify, defend, and hold harmless Dgntasy, its developers, employees, affiliates, and service providers from any and all claims, liabilities, damages, costs, and expenses arising out of or related to your use of the Platform, violation of these Terms, or violation of any laws or regulations.',
			],
		},
		{
			title: 'Intellectual Property',
			sections: [
				'All intellectual property rights related to the Platform, including but not limited to logos, trademarks, and content, remain the property of Dgntasy. You are prohibited from using any intellectual property for any purpose without our prior written consent.',
			],
		},
		{
			title: 'Changes to the Terms',
			sections: [
				'We may update or modify these Terms at any time, and any changes will be effective immediately upon posting on the Platform. Your continued use of the Platform after any changes to these Terms constitutes your acceptance of the revised Terms.',
			],
		},
		{
			title: 'Termination',
			sections: [
				'We reserve the right to terminate or suspend your access to the Platform at any time for any reason, including violation of these Terms or any applicable law.',
			],
		},
	];

	return (
		<main
			className={`flex items-center justify-center py-16 px-16 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
		>
			<div className="flex items-center justify-center max-w-screen-xl flex-col gap-20">
				<h1 className="text-4xl font-extrabold">
					Terms & Conditions for Dgntasy
				</h1>

				<div className="text-justify flex items-center justify-center flex-col gap-14">
					<div className="flex items-start justify-center flex-col gap-5">
						<h2 className="text-2xl font-bold text-primary">
							Effective Date: 09.28.24
						</h2>
						<p>
							Welcome to Dgntasy. By accessing or using the
							Platform, you agree to comply with and be bound by
							these Terms and Conditions. If you do not agree with
							any part of these Terms, you must not access or use
							the Platform. <br /> By using the Platform, you
							acknowledge that you are participating in gambling
							activities and assume full responsibility for your
							actions. You also acknowledge that the Platform
							operates on smart contracts deployed on the Solana
							blockchain, which are not audited, and therefore,
							may contain vulnerabilities or errors.
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
