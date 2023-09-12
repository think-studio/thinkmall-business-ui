import { RouteLocationNormalized } from 'vue-router';
import { BackMenuModel } from '/@/router/types';

interface UseNavTabState {
	backMenuList: BackMenuModel[];
	tabsView: BackMenuModel[];
	activeRoute?: BackMenuModel;
	activeIndex: number;
}

export const useNavTabStroe = defineStore('navTab', {
	state(): UseNavTabState {
		return {
			backMenuList: [],
			activeRoute: undefined,
			tabsView: [],
			activeIndex: 0
		};
	},

	actions: {
		setBackMenuList(data: any) {
			this.backMenuList = data;
		},
		setActiveRoute(route: RouteLocationNormalized | BackMenuModel) {
			const currentMenu = findMenu(this.tabsView, route.path);
			if (!currentMenu) return;
			const currentMenuIndex = toRaw(this.tabsView).findIndex(
				(item) => item.path === unref(route.path)
			);
			if (currentMenuIndex === -1) return;
			this.activeIndex = currentMenuIndex;
			this.activeRoute = currentMenu;
		},
		addTab(route: RouteLocationNormalized) {
			const isExist = toRaw(this.tabsView).find((item) => {
				return item.path === unref(route.path);
			});
			if (isExist) {
				return;
			}
			const currentMenu = findMenu(this.backMenuList, unref(route.path));
			if (!currentMenu) {
				return;
			}
			this.tabsView.push(currentMenu);
		},
		closeTab(route: BackMenuModel) {
			const index = toRaw(this.tabsView).findIndex(
				(item) => item.path === unref(route.path)
			);
			if (index !== -1) {
				this.tabsView.splice(index, 1);
			}
		}
	}
});

export function findMenu(
	tabsViewRoutes: BackMenuModel[],
	path: string
): BackMenuModel | undefined {
	for (const route of tabsViewRoutes) {
		if (route.path == path) {
			return route;
		} else if (route.children) {
			const done = findMenu(route.children as BackMenuModel[], path);
			if (done) return done;
		}
	}
}
