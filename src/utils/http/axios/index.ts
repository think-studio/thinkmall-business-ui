import { VAxios } from './Axios';
import { transform } from './axiosTransform';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { useGlobSetting } from '/@/hooks/settings';

function createAxios() {
	return new VAxios({
		timeout: 10 * 1000,
		headers: { 'Content-Type': ContentTypeEnum.JSON },
		transform: transform,
		requestOptions: {
			apiUrl: useGlobSetting().apiUrl,
			errorMessageMode: 'message',
			withToken: true,
			ignoreCancelToken: false
		}
	});
}

export const defHttp = createAxios();
