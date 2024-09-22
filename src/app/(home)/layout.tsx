import '@/app/globals.css';
import { Providers } from '@/app/providers';

import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SessionUser from '@/components/SessionUser';

const roboto = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: {
		template: 'SolFootball - %s',
		default: 'SolFootball',
	},
	description:
		'Manage, Play and earn rewards with your favourite football team!',
	applicationName: 'SolFootball',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={roboto.className}>
				<Providers>
					<Header>
						<SessionUser />
					</Header>
					{children}
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
