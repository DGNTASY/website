'use client';

import Image from 'next/image';
import { Button } from '@nextui-org/react';
import { useContext } from 'react';

import Haaland from '/public/home/Haaland.png';
import Messi from '/public/home/Messi.png';
import Ronaldo from '/public/home/Ronaldo.png';
import DarkModeContext from '../app/providers';
import Link from 'next/link';

export default function Home() {
	const { darkMode } = useContext(DarkModeContext);

	return (
		<>
			<main
				className={`flex min-h-screen items-center justify-center p-12 lg:y-24 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
			>
				<div className="flex items-center justify-around flex-col lg:flex-row self-stretch">
					<div className="lg:w-1/2 flex flex-col items-start justify-center gap-16 z-20">
						<div className="flex flex-col ">
							<h1 className="font-extrabold text-primary text-4xl">
								SolFootball
							</h1>
							<h1 className="font-extrabold text-xl">
								lets you challenge anyone in your favourite
								league
							</h1>
						</div>

						<div className="pl-0 sm:pl-10">
							<p className="font-normal">
								Lorem ipsum, dolor sit amet consectetur
								adipisicing elit. Necessitatibus consectetur
								atque aspernatur quaerat temporibus est nobis
								consequuntur autem, harum ratione nostrum, odio
								ullam officia explicabo tempora a ex. Numquam,
								magni!
							</p>
						</div>

						<div>
							<Link href={'/login'}>
								<Button
									className="font-extrabold"
									size="lg"
									color="primary"
								>
									PLAY
								</Button>
							</Link>
						</div>
					</div>

					<div className="relative flex flex-col items-center justify-center lg:w-1/2 h-full z-10">
						{/* Better: image of the field with players at their place: if interactive put changing schema and change the schema based on selection */}
						<Image
							className="max-w-40 lg:max-w-60 relative z-20"
							src={Ronaldo}
							alt="Ronaldo"
						/>
						<Image
							className="max-w-40 lg:max-w-60 relative sm:absolute z-30 translate-x-0 sm:translate-x-28 lg:translate-x-44 translate-y-0 sm:translate-y-24 lg:translate-y-32"
							src={Messi}
							alt="Messi"
						/>
						<Image
							className="max-w-40 lg:max-w-60 relative sm:absolute z-10 -translate-x-0 sm:-translate-x-28 lg:-translate-x-44 -translate-y-0 sm:-translate-y-24 lg:-translate-y-32"
							src={Haaland}
							alt="Haaland"
						/>
					</div>
				</div>
			</main>

			{/* <section>about</section> */}
		</>
	);
}
