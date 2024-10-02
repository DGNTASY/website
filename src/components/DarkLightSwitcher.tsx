'use client';

import { Button } from '@nextui-org/react';
import { useContext } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

import { DarkModeContext } from '@/app/providers';

export default function DarkLightSwitcher() {
	const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

	return (
		<Button
			isIconOnly
			color="primary"
			onClick={toggleDarkMode}
			className="pointer-events-auto"
		>
			{darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
		</Button>
	);
}
