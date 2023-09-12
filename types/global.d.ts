declare interface ViteEnv {
	VITE_PUBLIC_PATH: string;
	VITE_PROXY: [string, string][];
	VITE_DROP_CONSOLE: boolean;
	VITE_GLOB_API_URL: string;
	VITE_GLOB_FILE_URL: string;
	VITE_PORT: string;
	VITE_GLOB_APP_TITLE: string;
	VITE_GLOB_APP_SHORT_NAME: string;
}

declare type Nullable<T> = T | null;
declare type NonNullable<T> = T extends null | undefined ? never : T;
declare type Recordable<T = any> = Record<string, T>;
