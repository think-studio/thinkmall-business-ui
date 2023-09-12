import { LoginResultModel, MenuModel, UserInfoModel } from './model/userModel';
import { ContentTypeEnum } from '/@/enums/httpEnum';
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

// 退出登录
export function doLogout() {
	return defHttp.post<boolean>(
		{
			url: '/admin/admin_user/logout'
		},
		{
			errorMessageMode: 'modal'
		}
	);
}

// 查询用户登录日志
export function getUserLoginLogApi(params: any) {
	return defHttp.post<any>({
		url: '/admin/loginLog/page',
		params
	});
}

// 重置用户密码
export function resetPasswordApi(params: any) {
	return defHttp.post<boolean>({
		url: '/admin/admin_user/password/update',
		params
	});
}
