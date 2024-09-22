import { cookies } from 'next/headers';
import WalletRedirect from './WalletRedirect';

export default function SessionUser() {
	// Check if user has cookie for session
	const cookieName = process.env.NEXT_PUBLIC_COOKIE;
	const uuidUser = cookies().get(cookieName as string);

	return (
		<>
			<WalletRedirect hasSession={uuidUser != undefined ? true : false} />
		</>
	);
}
