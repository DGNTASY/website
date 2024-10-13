'use client';

import { useState, createContext, useEffect } from 'react';
import { UserStatus } from '@/components/types/UserStatus';
import { getCookie, hasCookie } from 'cookies-next';
import { getStatustURL } from '@/lib/api/routes';

export const UserStatusContext = createContext({
	userUUID: null as string | null,
	updateUserUUID: async () => {},
	userStatus: null as UserStatus | null,
	updateUserStatus: async () => {},
});

export default function UserStatusProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
	const updateUserStatus = async () => {
		console.log('Updating user Status...');
		const us = await getUserStatus();
		console.log(`tos: ${us}`);
		setUserStatus(us);
	};

	const [userUUID, setUserUUID] = useState<string | null>(null);
	const updateUserUUID = async () => {
		console.log('Updating user ID...');
		const cookieName = process.env.NEXT_PUBLIC_COOKIE;
		if (cookieName) {
			console.log(
				`to: ${hasCookie(cookieName) ? getCookie(cookieName)! : null}`,
			);
			setUserUUID(hasCookie(cookieName) ? getCookie(cookieName)! : null);
		}
	};

	async function getUserStatus(): Promise<UserStatus | null> {
		try {
			const res = await fetch(getStatustURL, {
				method: 'GET',
			});

			if (res.ok) {
				console.log('Status received');
				const status: UserStatus = await res.json();
				console.log(
					`Values: score: ${status.score}, has betted: ${status.has_betted}, has account: ${status.has_account}`,
				);

				return status;
			} else {
				console.error(
					`Error fetching status: ${res.status}, ${res.statusText}`,
				);
				return null;
			}
		} catch (error) {
			console.error(`Error makingfetching status request: ${error}`);
			return null;
		}
	}

	// Update once uuid changes -> new wallet connected
	useEffect(() => {
		console.log('Prov userUUID uuid change');
		if (!userUUID) {
			return;
		}

		updateUserStatus();
	}, [userUUID]);

	// Update on mount if user has already uuid
	useEffect(() => {
		console.log(`Prov userUUID onmount, id: ${userUUID}`);
		updateUserUUID();
		if (!userUUID) {
			return;
		}

		updateUserStatus();
	}, []);

	return (
		<UserStatusContext.Provider
			value={{
				userUUID,
				updateUserUUID,
				userStatus,
				updateUserStatus,
			}}
		>
			{children}
		</UserStatusContext.Provider>
	);
}
