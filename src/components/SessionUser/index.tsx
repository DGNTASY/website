import { useEffect, useState } from 'react';
import WalletRedirect from '../WalletRedirect';

export default function SessionUser() {
    const [hasSession, setHasSession] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const res = await fetch('/api/check-session');
            const data = await res.json();
            setHasSession(data.hasSession);
        };

        checkSession();
    }, []);

    return (
        <>
            <WalletRedirect hasSession={hasSession} />
        </>
    );
}
