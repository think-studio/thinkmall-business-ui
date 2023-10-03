import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestOptions, Result } from '/#/axios';
import { RequestEnum, ResultEnum } from '/@/enums/httpEnum';
import { ElMessage, ElMessageBox } from 'element-plus';
import { CreateAxiosOptions } from './Axios';
import { isString } from 'lodash-es';
import { formatRequestDate, joinTimestamp } from './helper';
import { tokenLocalData } from '/@/utils/storage/local-data';
import { useUserStoreWithOut } from '/@/store/modules/user';
export interface AxiosTransform {
	transformRequestHook: <T>(
		res: AxiosResponse<Result>,
		options: RequestOptions
	) => Promise<Result<T>>;
	requestInterceptors: (
		config: AxiosRequestConfig,
		options: CreateAxiosOptions
	) => AxiosRequestConfig;
	beforeRequestHook: (
		config: AxiosRequestConfig,
		options: RequestOptions
	) => AxiosRequestConfig;
	responseInterceptorsCatch?: (error: Error) => void;
}

export const transform: AxiosTransform = {
	/**
	 * @description: 请求拦截器
	 */
	requestInterceptors: (config, options) => {
		const token = useUserStoreWithOut().getToken;
		if (token && options.requestOptions?.withToken) {
			config.headers!.Authorization = 'Bearer ' + token;
		}
		return config;
	},
	/**
	 * @description: 处理请求前的步骤
	 */
	beforeRequestHook: (config, options) => {
		const { apiUrl } = options;
		if (apiUrl) {
			config.url = apiUrl + config.url;
		}
		const params = config.params || {};
		const data = config.data || false;
		data && !isString(data) && formatRequestDate(data);
		if (
			config.method?.toUpperCase() === RequestEnum.GET ||
			config.method?.toUpperCase() === RequestEnum.DELETE
		) {
			if (!isString(params)) {
				config.params = Object.assign(params, joinTimestamp(true, false));
			} else {
				config.url = config.url + params + joinTimestamp(true, true);
			}
		} else {
			if (!isString(params)) {
				formatRequestDate(params);
				if (data && Object.keys(data).length > 0) {
					config.data = data;
					config.params = params;
				} else {
					config.data = params;
					config.params = undefined;
				}
			} else {
				config.url = config.url + params;
				config.params = undefined;
			}
		}
		config.headers = Object.assign(config.headers || {}, {
			'tenant-id': 1000
		});
		return config;
	},
	/**
	 * @description: 处理请求完的步骤
	 */
	transformRequestHook: async <T>(
		res: AxiosResponse<Result<T>>,
		options: RequestOptions
	) => {
		const resData = res.data;
		if (!resData) {
			throw new Error('请求失败，请检查网络连接');
		}
		if (isString(resData) || res.config.responseType == 'arraybuffer') {
			return resData;
		}
		const { code, msg } = resData;

		const hasSuccess = code === ResultEnum.SUCCESS;
		if (hasSuccess) {
			return resData;
		}
		if (code === ResultEnum.UNAUTHORIZED) {
			const userStore = useUserStoreWithOut();
			userStore.setToken(undefined);
			userStore.logout(true);
		}
		const errorMessage = msg || '服务器响应失败';
		if (options.errorMessageMode === 'modal') {
			ElMessageBox.alert(errorMessage, '提示', {
				type: 'error'
			});
		} else if (options.errorMessageMode === 'message') {
			ElMessage.error(errorMessage);
		}
		return Promise.reject(errorMessage);
	},
	/**
	 * @description: 响应错误处理
	 */
	responseInterceptorsCatch: (error: any) => {
		const { message, code } = error || {};
		if (code !== 'ERR_CANCELED') {
			ElMessageBox.alert(message, '提示', {
				type: 'error'
			});
		}
		return Promise.reject(error);
	}
};
