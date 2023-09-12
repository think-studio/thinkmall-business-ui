export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

export interface RequestOptions {
	apiUrl?: string;
	errorMessageMode?: ErrorMessageMode;
	withToken?: boolean;
	ignoreCancelToken?: boolean;
}

export interface Result<T = any> {
	code: number;
	msg: string;
	data: T;
	success: boolean;
	ok: boolean;
	error: boolean;
}
