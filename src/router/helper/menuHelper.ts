import { cloneDeep } from 'lodash-es';
import { BackMenuModel } from '../types';
import { treeMap } from '/@/utils/helper/treeHelper';
import { RouteRecordRaw } from 'vue-router';
import { BackRouteModel } from '/@/api/sys/model/userModel';

export function transformRouteToMenu(
	routeModeList: BackRouteModel[]
): BackMenuModel[] {
	const cloneRouteModList = cloneDeep(routeModeList);
	const routeList: BackRouteModel[] = [];

	cloneRouteModList.forEach((item) => {
		if (item.meta?.single) {
			const realItem = item?.children?.[0];
			realItem && routeList.push(realItem);
		} else {
			routeList.push(item);
		}
	});
	const list: BackMenuModel[] = treeMap(routeList, {
		conversion: (node: BackRouteModel) => {
			const { name, path, hidden, meta: { title, icon } = {} } = node;
			return {
				icon,
				name: name,
				hideMenu: hidden,
				title,
				path
			};
		}
	});
	joinParentPath(list);
	return cloneDeep(list);
}

function joinParentPath(menus: BackMenuModel[], parentPath = '') {
	for (let index = 0; index < menus.length; index++) {
		const menu = menus[index];

		if (!menu.path.startsWith('/')) {
			menu.path = `${parentPath}/${menu.path}`;
		}
		if (menu?.children?.length) {
			joinParentPath(menu.children, menu.path);
		}
	}
}
