import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { Button } from '@nextui-org/react';

import { Reclaim } from '@reclaimprotocol/js-sdk';

export default function HandleReclaimProof() {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({
		cookies: () => cookieStore,
	});

	function handleProofRequest() {}

	return (
		<>
			<Button onClick={handleProofRequest}>Send Score</Button>
		</>
	);
}
