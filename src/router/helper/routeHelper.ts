import { cloneDeep } from 'lodash-es';
import {
	createRouter,
	createWebHashHistory,
	Router,
	RouteRecordNormalized
} from 'vue-router';
import { AppRouteModule, AppRouteRecordRaw } from '../types';
import { MenuModel } from '/@/api/sys/model/userModel';

export const LAYOUT = () => import('/@/layouts/index.vue');

export type LayoutMapKey = 'LAYOUT';

const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();

LayoutMap.set('LAYOUT', LAYOUT);
export const DEFAULT = () => import('/@/layouts/default/index.vue');

let dynamicViewsModules: Record<string, () => Promise<Recordable>>;

function asyncImportRoute(routes: MenuModel[] | undefined) {
	dynamicViewsModules =
		dynamicViewsModules || import.meta.glob('/src/views/**/*.{vue,tsx}');
	if (!routes) return;
	routes.forEach((item) => {
		const { component, name, children } = item;
		if (component) {
			const layoutFound = LayoutMap.get((component as string).toUpperCase());
			if (layoutFound) {
				item.component = layoutFound;
			} else {
				item.component = dynamicImport(
					dynamicViewsModules,
					component as string
				);
			}
		} else if (name) {
			item.component = 'ParentLayout';
		}

		children && asyncImportRoute(children);
	});
}

function dynamicImport(
	dynamicViewsModules: Record<string, () => Promise<Recordable>>,
	component: string
) {
	const keys = Object.keys(dynamicViewsModules);
	const matchKeys = keys.filter((key) => {
		const k = key.replace('/src/views', '');
		const startFlag = component.startsWith('/');
		const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
		const startIndex = startFlag ? 0 : 1;
		const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
		return k.substring(startIndex, lastIndex) === component;
	});
	if (matchKeys?.length === 1) {
		const matchKey = matchKeys[0];
		return dynamicViewsModules[matchKey];
	} else if (matchKeys?.length > 1) {
		return;
	} else {
		return DEFAULT;
	}
}

export function transformObjToRoute(routeList: MenuModel[]): AppRouteModule[] {
	routeList.forEach((route) => {
		const component = route.component;
		if (component) {
			if ((component as string).toUpperCase() === 'LAYOUT') {
				route.component = LAYOUT;
			} else {
				route.children = [cloneDeep(route)];
				route.component = LAYOUT;
				route.name = `${route.name}Parent`;
				route.path = '';
				const meta = route.meta || {};
				meta.single = true;
				route.meta = meta;
			}
		}
		route.children && asyncImportRoute(route.children);
	});
	return routeList;
}

export function flatMultiLevelRoutes(routeModules: AppRouteModule[]) {
	const modules: AppRouteModule[] = cloneDeep(routeModules);
	for (let index = 0; index < modules.length; index++) {
		const routeModule = modules[index];
		if (!isMultipleRoute(routeModule)) {
			continue;
		}
		promoteRouteLevel(routeModule);
	}
	return modules;
}

function isMultipleRoute(routeModule: AppRouteModule) {
	if (
		!routeModule ||
		!Reflect.has(routeModule, 'children') ||
		!routeModule.children?.length
	) {
		return false;
	}

	const children = routeModule.children;

	let flag = false;
	for (let index = 0; index < children.length; index++) {
		const child = children[index];
		if (child.children?.length) {
			flag = true;
			break;
		}
	}
	return flag;
}

function promoteRouteLevel(routeModule: AppRouteModule) {
	// Use vue-router to splice menus
	let router: Router | null = createRouter({
		routes: [routeModule as unknown as RouteRecordNormalized],
		history: createWebHashHistory()
	});

	const routes = router.getRoutes();
	addToChildren(routes, routeModule.children || [], routeModule);
	router = null;

	// routeModule.children = routeModule.children?.map((item) => omit(item, 'children')) as AppRouteModule[];
}

function addToChildren(
	routes: RouteRecordNormalized[],
	children: AppRouteRecordRaw[],
	routeModule: AppRouteModule
) {
	for (let index = 0; index < children.length; index++) {
		const child = children[index];
		const route = routes.find((item) => item.name === child.name);
		if (!route) {
			continue;
		}
		routeModule.children = routeModule.children || [];
		if (!routeModule.children.find((item) => item.name === route.name)) {
			routeModule.children?.push(route as unknown as AppRouteModule);
		}
		if (child.children?.length) {
			addToChildren(routes, child.children, routeModule);
		}
	}
}
