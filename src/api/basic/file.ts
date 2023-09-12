import { defHttp } from '/@/utils/http/axios';

interface OssInfoModel {
	fileKey: string;
	fileUrl: string;
	uploadUrl: string;
}

export const getOssUploadInfolApi = (params: {
	contentType: string;
	folderName: string;
	suffix: string;
}) => {
	return defHttp.get<OssInfoModel>({
		url: '/base/oss/aliyun_form_upload',
		params: params
	});
};

export const ossUploadApi = (
	url: string,
	file: File,
	headers: Recordable,
	onUploadProgress: (progressEvent: ProgressEvent) => void
) => {
	return defHttp.uploadFile({
		url: url,
		onUploadProgress,
		data: file,
		headers: {
			...headers
		}
	});
};
