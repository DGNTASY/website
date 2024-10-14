import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {};

const Footer = (props: Props) => {
	return (
		<footer className="bg-theme text-white py-6 mt-auto px-6 w-full">
			<div className=" flex flex-col md:flex-row gap-4 items-center justify-between">
				<Link href="/">
					<div className="flex items-center gap-5">
						<Image
							src={'/fpl.png'}
							alt="logo"
							width={30}
							height={30}
						/>
						<p className="text-sm font-bold">DGNTASY</p>
					</div>
				</Link>
				<div className="flex space-x-4">
					<Link href="/privacy-policy" className="font-bold">
						Privacy Policy
					</Link>
					<Link href="/terms-and-conditions" className="font-bold">
						Terms & Conditions
					</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
