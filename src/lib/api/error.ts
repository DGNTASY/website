export class RequestError {
	message: string;
	code: number;

	constructor(message: string, code: number) {
		this.message = message;
		this.code = code;
	}
}

export const checkHandleError = (err: RequestError | any): void | never => {
	if (err instanceof RequestError) {
		handleError(err);
	}
};

export const handleError = (err: RequestError): never => {
	throw new Response(JSON.stringify({ error: err.message }), {
		status: err.code,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
