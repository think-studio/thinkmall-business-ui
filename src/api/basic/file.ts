import { ContentTypeEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';

// 文件上传接口
export function fileUploadApi(params: Recordable) {
	return defHttp.post({
		url: '/upload',
		params,
		headers: {
			ContentType: ContentTypeEnum.FORM_DATA
		}
	});
}
