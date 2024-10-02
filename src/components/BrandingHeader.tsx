'use client';

import {
	NavbarBrand,
	Link,
	NavbarContent,
	NavbarMenuToggle,
} from '@nextui-org/react';
import Image from 'next/image';
import SolFootballIcon from '/public/icons/solfootball.svg';
import { useContext } from 'react';
import { DarkModeContext } from '@/app/providers';

export default function BrandingHeader() {
	const { darkMode } = useContext(DarkModeContext);

	return (
		<NavbarContent className="gap-2">
			<Link className="sm:hidden bg-transparent pointer-events-none h-full">
				<NavbarMenuToggle className="sm:hidden pointer-events-auto" />
			</Link>

			<NavbarBrand>
				<Link href="/" className="gap-2">
					<Image
						src={SolFootballIcon}
						alt="SolFootball Icon"
						className="min-w-8"
					/>

					{darkMode ? (
						<p className="font-bold text-white hidden sm:block">
							Dgntasy
						</p>
					) : (
						<p className="font-bold text-black hidden sm:block">
							Dgntasy
						</p>
					)}
				</Link>
			</NavbarBrand>
		</NavbarContent>
	);
}
