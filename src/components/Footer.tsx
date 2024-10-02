'use client';

import { Divider } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { FaTelegram } from 'react-icons/fa6';
import { FaXTwitter } from 'react-icons/fa6';

import SolFootballIcon from '/public/icons/solfootball.svg';
import { DarkModeContext } from '@/app/providers';

// Should be broken into more components
export default function Footer() {
	const { darkMode } = useContext(DarkModeContext);

	const tgLink = process.env.NEXT_PUBLIC_TELEGRAM_LINK;
	const docsLink = process.env.NEXT_PUBLIC_DOCS_LINK;
	const xLink = process.env.NEXT_PUBLIC_X_LINK;
	const reclaimLink = process.env.NEXT_PUBLIC_RELCIAM_LINK;
	if (!tgLink || !docsLink || !xLink || !reclaimLink) {
		return <p>Error fetching links</p>;
	}

	// Icons
	const FOOTER_ICONS = [
		{
			link: tgLink,
			icon: FaTelegram,
		},
		{
			link: docsLink,
			icon: FaXTwitter,
		},
	];

	// Columns
	const FOOTER_COLUMNS = [
		{
			title: 'Resources',
			rows: [
				{
					link: reclaimLink,
					name: 'Reclaim',
				},
				{
					link: docsLink,
					name: 'Documents',
				},
			],
		},
		{
			title: 'Follow Us',
			rows: [
				{
					link: xLink,
					name: 'X',
				},
				{
					link: tgLink,
					name: 'Telegram',
				},
			],
		},
		{
			title: 'Legal',
			rows: [
				{
					link: '/privacy-policy',
					name: 'Privacy Policy',
				},
				{
					link: '/privacy-and-conditions',
					name: 'Terms & Conditions',
				},
			],
		},
	];

	return (
		<footer
			className={`p-5 sm:p-12 pb-4 border-t-1 border-gray-500 ${darkMode ? 'bg-black' : 'bg-white'}`}
		>
			<div className="flex flex-col items-start justify-center gap-5">
				<div className="flex flex-col lg:flex-row justify-between items-center w-full text-black gap-4 lg:gap-2">
					<div className="flex flex-row items-start justify-start self-stretch gap-2">
						<Image
							src={SolFootballIcon}
							alt="SolFootball Icon"
							className="min-w-9"
						/>
						<p className="font-extrabold text-3xl text-primary">
							Dgntasy
						</p>
					</div>

					<div className="grid gap-8 sm:gap-7 md:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
						{FOOTER_COLUMNS.map((el, i) => (
							<div
								className="flex flex-col items-start justify-start"
								key={`footer-column-${i}`}
							>
								<h2 className="mb-2 text-base font-semibold text-primary uppercase">
									{el.title}
								</h2>
								{el.rows.map((r, i) => (
									<Link
										className="hover:text-secondary"
										href={r.link}
										key={`footer-row-${i}`}
									>
										<p
											className={`${darkMode ? 'text-white' : 'text-black'} hover:text-secondary transition-all-125`}
										>
											{r.name}
										</p>
									</Link>
								))}
							</div>
						))}
					</div>
				</div>

				<Divider />

				<div className="flex flex-col sm:flex-row gap-5 sm:gap-0 items-center justify-between w-full">
					<p
						className={`${darkMode ? 'text-slate-600' : 'text-slate-400'} order-2 sm:order-1`}
					>
						© 2024 Dgntasy All Rights Reserved.
					</p>

					<div className="flex items-center justify-center gap-5 order-1 sm:order-2 flex-wrap">
						{FOOTER_ICONS.map((fi, i) => (
							<Link href={fi.link} key={`footer-icon-${i}`}>
								<fi.icon size={24} className="text-primary" />
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
