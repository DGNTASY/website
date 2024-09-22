'use client';

import DarkLightSwitcher from './DarkLightSwitcher';

import {
	Navbar,
	NavbarContent,
	NavbarItem,
	Link,
	Button,
} from '@nextui-org/react';

import NavbarMenuItemsHeader from './NavbarMenuItemsHeader';
import NavbarItemsHeader from './NavbarItemsHeader';
import BrandingHeader from './BrandingHeader';
import { useContext } from 'react';
import DarkModeContext from '@/app/providers';

export default function Header({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { darkMode } = useContext(DarkModeContext);
	const MENU_ITEMS: { text: string; href: string }[] = [
		// {
		// 	text: 'About',
		// 	href: '/about',
		// },
		// {
		// 	text: 'Pricing',
		// 	href: '/pricing',
		// },
		// {
		// 	text: 'Leaderboards',
		// 	href: '/leaderboards',
		// },
		// {
		// 	text: 'dApp',
		// 	href: '/dashboard',
		// },
	];

	return (
		<Navbar
			className={`${darkMode ? 'bg-black' : 'bg-white'}`}
			maxWidth="xl"
			isBlurred={true}
			isBordered
		>
			<BrandingHeader />

			<NavbarItemsHeader menuItems={MENU_ITEMS} />

			<NavbarContent justify="end">
				{/* <NavbarItem className="hidden lg:flex">
					<Link href="/login">Login</Link>
				</NavbarItem>

				<NavbarItem>
					<Button
						as={Link}
						color="primary"
						href="/signup"
						variant="flat"
					>
						Sign Up
					</Button>
				</NavbarItem> */}

				{/* <ClientWrapper> */}
				{/* <SessionUser /> */}
				{/* </ClientWrapper> */}
				{children}

				<DarkLightSwitcher />
			</NavbarContent>

			<NavbarMenuItemsHeader menuItems={MENU_ITEMS} />
		</Navbar>
	);
}
