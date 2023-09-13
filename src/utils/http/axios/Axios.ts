import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { AxiosCanceler } from './axiosCancel';
import { AxiosTransform } from './axiosTransform';
import { RequestOptions, Result } from '/#/axios';
import { cloneDeep, isFunction } from 'lodash-es';
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';
import qs from 'qs';

export interface CreateAxiosOptions extends AxiosRequestConfig {
	transform?: AxiosTransform;
	requestOptions?: RequestOptions;
}

export class VAxios {
	private axiosInstance: AxiosInstance;
	private readonly options: CreateAxiosOptions;
	constructor(options: CreateAxiosOptions) {
		this.axiosInstance = axios.create(options);
		this.options = options;
		this.setupInterceptors();
	}

	private getTransform() {
		return this.options.transform;
	}

	// support form-data
	supportFormData(config: AxiosRequestConfig) {
		const headers = config.headers || this.options.headers;
		const contentType = headers?.['Content-Type'] || headers?.['content-type'];

		if (
			contentType !== ContentTypeEnum.FORM_URLENCODED ||
			!Reflect.has(config, 'data') ||
			config.method?.toUpperCase() === RequestEnum.GET
		) {
			return config;
		}

		return {
			...config,
			data: qs.stringify(config.data, { arrayFormat: 'brackets' })
		};
	}

	private setupInterceptors() {
		const axiosCanceler = new AxiosCanceler();
		const { requestInterceptors, responseInterceptorsCatch } =
			this.getTransform() || {};
		this.axiosInstance.interceptors.request.use(
			(config: AxiosRequestConfig) => {
				const {
					// @ts-ignore
					headers: { ignoreCancelToken }
				} = config;

				const ignoreCancel =
					ignoreCancelToken !== undefined
						? ignoreCancelToken
						: this.options.requestOptions?.ignoreCancelToken;

				!ignoreCancel && axiosCanceler.addPending(config);
				if (requestInterceptors && isFunction(requestInterceptors)) {
					config = requestInterceptors(config, this.options);
				}

				return config;
			}
		);
		responseInterceptorsCatch &&
			isFunction(responseInterceptorsCatch) &&
			this.axiosInstance.interceptors.response.use(
				undefined,
				responseInterceptorsCatch
			);
	}

	get<T = any>(
		config: AxiosRequestConfig,
		options?: RequestOptions
	): Promise<Result<T>> {
		return this.request<T>({ method: 'get', ...config }, options);
	}

	delete<T = any>(
		config: AxiosRequestConfig,
		options?: RequestOptions
	): Promise<Result<T>> {
		return this.request<T>({ method: 'delete', ...config }, options);
	}

	put<T = any>(
		config: AxiosRequestConfig,
		options?: RequestOptions
	): Promise<Result<T>> {
		return this.request<T>({ method: 'put', ...config }, options);
	}

	post<T = any>(
		config: AxiosRequestConfig,
		options?: RequestOptions
	): Promise<Result<T>> {
		return this.request<T>({ method: 'post', ...config }, options);
	}

	uploadFile<T = any>(config: AxiosRequestConfig) {
		return this.axiosInstance.request<T>({
			...config,
			method: 'PUT',
			timeout: 1000000000
		});
	}

	request<T = any>(
		config: AxiosRequestConfig,
		options?: RequestOptions
	): Promise<Result<T>> {
		const { beforeRequestHook, transformRequestHook } =
			this.getTransform() || {};
		let conf: CreateAxiosOptions = cloneDeep(config);

		const { requestOptions } = this.options;

		const opt = Object.assign({}, requestOptions, options);
		if (beforeRequestHook && isFunction(beforeRequestHook)) {
			conf = beforeRequestHook(config, opt);
		}
		conf.requestOptions = opt;
		conf = this.supportFormData(conf);
		conf.headers = Object.assign(conf.headers || {}, {
			'tenant-id': 1000
		});
		return new Promise((resolve, reject) => {
			this.axiosInstance
				.request(conf)
				.then(async (res: AxiosResponse<Result<T>>) => {
					if (transformRequestHook && isFunction(transformRequestHook)) {
						try {
							const ret = await transformRequestHook<T>(res, opt);
							resolve(ret);
						} catch (error) {
							reject(error);
						}
						return;
					}
					resolve(res as any);
				})
				.catch((e) => {
					reject(e);
				});
		});
	}
}
