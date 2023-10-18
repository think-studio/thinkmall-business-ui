import { http } from '@/utils/http/axios';
import type { BackRouteModel, LoginResultModel, UserInfoModel } from './model/userModel';

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return http.get<UserInfoModel>({
    url: '/system/user/getInfo',
  });
}

/**
 * @description: 用户登录
 */
export function login(params) {
  return http.post<LoginResultModel>(
    {
      url: '/auth/login',
      params,
      headers: {
        'client-type': 'PC-ADMIN',
      },
    },
    {
      withToken: false,
    }
  );
}

/**
 * @description: 获取动态路由
 */
export function getRoutesApi() {
  return http.get<BackRouteModel[]>({
    url: 'system/menu/getRouters',
  });
}
