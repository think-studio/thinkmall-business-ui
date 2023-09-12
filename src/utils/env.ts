import { getConfigFileName } from '../../build/getConfigFileName';
import type { GlobEnvConfig } from '/#/config';

export function getAppEnvConfig() {
	const ENV_NAME = getConfigFileName(import.meta.env);
	const ENV = (import.meta.env.DEV
		? // Get the global configuration (the configuration will be extracted independently when packaging)
		  (import.meta.env as unknown as GlobEnvConfig)
		: window[ENV_NAME as any]) as unknown as GlobEnvConfig;

	const {
		VITE_GLOB_FILE_URL,
		VITE_GLOB_APP_TITLE,
		VITE_GLOB_API_URL,
		VITE_GLOB_APP_SHORT_NAME,
		VITE_GLOB_IOT_API_URL
	} = ENV;
	return {
		VITE_GLOB_FILE_URL,
		VITE_GLOB_API_URL,
		VITE_GLOB_APP_TITLE,
		VITE_GLOB_APP_SHORT_NAME,
		VITE_GLOB_IOT_API_URL
	};
}

export function isProdMode(): boolean {
	return import.meta.env.PROD;
}
