import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_SCREENLOCKED } from '@/store/mutation-types';

import { getUserInfo as getUserInfoApi, login } from '@/api/system/user';
import { storage } from '@/utils/Storage';
import type { UserInfoModel } from '@/api/system/model/userModel';

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: UserInfoModel;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): UserInfoModel {
      return this.info;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info: UserInfoModel) {
      this.info = info;
    },
    // 登录
    login(params: any) {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await login(params);
          const { access_token, expires_in } = response.data;
          storage.set(ACCESS_TOKEN, access_token, expires_in);
          storage.set(IS_SCREENLOCKED, false);
          this.setToken(access_token);
          resolve(access_token);
        } catch (error) {
          reject(error);
        }
      });
    },

    // 获取用户信息
    async getInfo() {
      const res = await getUserInfoApi();
      this.setUserInfo(res.data);
      this.setAvatar(res.data.user.avatar);
      return res.data;
    },

    // 登出
    async logout() {
      this.setPermissions([]);

      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
    },
  },
});

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store);
}
