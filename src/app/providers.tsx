'use client';

import AppWalletProvider from '@/components/providers/AppWalletProvider';
import UserStatusProvider from '@/components/providers/UserStatusProvider';
import VaultProvider from '@/components/providers/VaultProvider';

export function Providers({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AppWalletProvider>
			<VaultProvider>
				<UserStatusProvider>{children}</UserStatusProvider>
			</VaultProvider>
		</AppWalletProvider>
	);
}
