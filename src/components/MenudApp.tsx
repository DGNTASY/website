import SessionUser from './SessionUser';

import { cookies } from 'next/headers';

export default function MenudApp({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const MENUS = [];

	async function getUserCookieUuid(): Promise<string | undefined> {
		'use server';
		// Get user uuid
		const cookieName = process.env.NEXT_PUBLIC_COOKIE;
		if (!cookieName) return undefined;
		return cookies().get(cookieName)?.value;
	}

	return (
		<div
			// className="grid grid-cols-20-90 z-20 h-screen "
			className="flex items-center justify-center h-screen w-screen"
		>
			{/* <div className="flex flex-col items-center justify-around self-stretch bg-black border-r-1 ">
				<div>
					<WalletButton />
				</div>

				<div className="flex flex-col overflow-y-scroll gap-16 max-h-500 border-2">
					<div>Menu 1</div>
					<div>Menu 2</div>
					<div>Menu 3</div>
					<div>Menu 4</div>
					<div>Menu 5</div>
				</div>
			</div> */}

			{/* <div className="flex items-center justify-center "> */}
			<div className="relative h-screen w-full">
				<div className="absolute h-full top-0 right-0 p-6 inline-block">
					<SessionUser />
					<br />
					<p className="text-sm">
						Session id:
						<br />
						<span>
							{getUserCookieUuid() == undefined
								? ''
								: getUserCookieUuid()}
						</span>
					</p>
				</div>

				{children}
			</div>
			{/* </div> */}
		</div>
	);
}
