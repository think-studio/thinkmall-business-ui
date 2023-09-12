import { RouteMeta, RouteRecordRaw } from 'vue-router';

export type Component<T = any> =
	| ReturnType<typeof defineComponent>
	| (() => Promise<typeof import('*.vue')>)
	| (() => Promise<T>);

export interface AppRouteRecordRaw {
	icon: string;
	component?: Component | string;
	children: AppRouteRecordRaw[];
	hideMenu: 'y' | 'n';
	currentActiveMenu: string;
	hideTab: 'y' | 'n';
	name: string;
	path: string;
	redirect?: string;
	title: string;
	meta: Recordable;
}
export type AppRouteModule = AppRouteRecordRaw;

export interface BackMenuModel {
	children: BackMenuModel[];
	hideMenu: boolean;
	name: string;
	path: string;
	title: string;
	icon: string;
}
