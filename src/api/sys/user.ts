import {
	BackRouteModel,
	LoginResultModel,
	UserInfoModel
} from './model/userModel';

import { defHttp } from '/@/utils/http/axios';

// 登录
export function loginApi(params: any) {
	return defHttp.post<LoginResultModel>(
		{
			url: '/auth/login',
			params,
			headers: {
				'client-type': 'PC-ADMIN'
			}
		},
		{
			withToken: false,
			errorMessageMode: 'modal'
		}
	);
}

// 获取用户信息
export function getUserInfoApi() {
	return defHttp.get<UserInfoModel>(
		{
			url: '/system/user/getInfo'
		},
		{
			errorMessageMode: 'modal'
		}
	);
}

// 获取动态路由
export function getRoutesApi() {
	return defHttp.get<BackRouteModel[]>({
		url: 'system/menu/getRouters'
	});
}
