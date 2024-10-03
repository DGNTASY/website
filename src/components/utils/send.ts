import { Transaction } from '@solana/web3.js';

export default async function sendTransactionBackend(
	transaction: Transaction,
): Promise<string | null> {
	const sendURL = '/api/send';

	var txn: string | null = null;

	try {
		const res = await fetch(sendURL, {
			method: 'POST',
			body: JSON.stringify({
				transaction: transaction,
			}),
		});

		if (res.ok) {
			txn = await res.json();
		} else {
			return txn;
		}
	} catch (err) {
		return txn;
	}

	return txn;
}
