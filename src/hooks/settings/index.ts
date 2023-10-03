import type { GlobConfig } from '/#/config';

import { getAppEnvConfig } from '/@/utils/env';

export const useGlobSetting = (): Readonly<GlobConfig> => {
	const {
		VITE_GLOB_APP_TITLE,
		VITE_GLOB_API_URL,
		VITE_GLOB_APP_SHORT_NAME,
		VITE_GLOB_FILE_URL
	} = getAppEnvConfig();
	const glob: Readonly<GlobConfig> = {
		apiUrl: VITE_GLOB_API_URL,

		title: VITE_GLOB_APP_TITLE,
		fileUrl: VITE_GLOB_FILE_URL,
		shortName: VITE_GLOB_APP_SHORT_NAME
	};
	return glob as Readonly<GlobConfig>;
};
