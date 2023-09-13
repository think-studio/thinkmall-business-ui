import { UserInfoModel } from '/@/api/sys/model/userModel';
import { getUserInfoApi, loginApi } from '/@/api/sys/user';
import { store } from '/@/store';
import { tokenLocalData } from '/@/utils/storage/local-data';
import { ElMessageBox } from 'element-plus';
import { router } from '/@/router';

interface UserState {
	token?: string;
	userInfo?: UserInfoModel;
	permission?: string[];
	sessionTimeout?: boolean;
}

export const useUserStore = defineStore('app-user', {
	state: (): UserState => ({
		token: undefined,
		userInfo: undefined,
		permission: undefined,
		sessionTimeout: false
	}),
	getters: {
		getToken(): Nullable<string> {
			return this.token || tokenLocalData.get();
		},
		getPermission(): Nullable<string[]> {
			return this.permission || [];
		},
		getSessionTimeout(): boolean {
			return !!this.sessionTimeout;
		},
		getUserInfo(): UserInfoModel | undefined {
			return this.userInfo;
		}
	},
	actions: {
		setToken(token: string | undefined, expires_in?: number) {
			this.token = token;
			tokenLocalData.set(token);
		},
		login(params: any) {
			return new Promise(async (resolve, reject) => {
				try {
					const { access_token, expires_in } = await (
						await loginApi(params)
					).data;
					this.setToken(access_token, expires_in);
					resolve(access_token);
				} catch (error) {
					reject(error);
				}
			});
		},
		async setUserInfo() {
			const res = await getUserInfoApi();
			this.userInfo = res.data;
			this.setPermission();
			// this.setOrgInfo();
			// useAppStore().setDictData();
			return res.data;
		},

		setPermission() {
			this.permission = this.userInfo?.permissions;
		},
		/**
		 * @description: logout
		 */
		async logout(goLogin = false) {
			if (this.getToken) {
				try {
				} catch {
					console.log('注销Token失败');
				}
			}
			this.setToken(undefined);
			this.setSessionTimeout(false);
			goLogin && this.goLoginPage();
		},
		setSessionTimeout(flag: boolean) {
			this.sessionTimeout = flag;
		},
		goLoginPage() {
			router.go(0);
		},
		/**
		 * @description: Confirm before logging out
		 */
		confirmLoginOut() {
			ElMessageBox.confirm('是否确认退出登录?', '温馨提醒', {
				// confirmButtonText: 'OK',
				// cancelButtonText: 'Cancel',
				type: 'warning'
			})
				.then(async () => {
					await this.logout(true);
				})
				.catch(() => {});
		}
	}
});

export function useUserStoreWithOut() {
	return useUserStore(store);
}
