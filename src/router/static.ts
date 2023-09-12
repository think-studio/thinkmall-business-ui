import { RouteRecordRaw } from 'vue-router';
import { LAYOUT } from './helper/routeHelper';

const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Root',
		redirect: '/home',
		meta: {
			hidden: true
		}
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('/@/views/login/index.vue'),
		meta: {
			title: '登录',
			hidden: true
		}
	},
	{
		path: '/:catchAll(.*)*',
		redirect: (to) => {
			return {
				name: 'Home'
			};
		},
		meta: {
			hidden: true
		}
	}
];

const routes: Array<RouteRecordRaw> = [
	...staticRoutes,
	{
		path: '',
		name: 'HomeParent',
		component: LAYOUT,
		meta: {
			single: true
		},
		children: [
			{
				path: 'home',
				name: 'Home',
				component: () => import('/@/layouts/default/index.vue'),
				meta: {
					icon: 'fa fa-home',
					title: '首页',
					single: true
				}
			}
		]
	},
	{
		path: '/demo1',
		name: 'Demo1',
		component: LAYOUT,
		meta: {
			title: 'demo1'
		},
		redirect: '/demo1/a',
		children: [
			{
				path: 'a',
				name: 'A',
				component: () => import('/@/layouts/default/index.vue'),
				meta: {
					title: 'A'
				}
			},
			{
				path: 'b',
				name: 'B',
				meta: {
					title: 'B'
				},
				children: [
					{
						path: 'c',
						name: 'C',
						component: () => import('/@/layouts/default/index.vue'),
						meta: {
							title: 'C'
						}
					},
					{
						path: 'd',
						name: 'D',
						component: () => import('/@/layouts/default/index.vue'),
						meta: {
							title: 'D'
						}
					}
				]
			}
		]
	}
];

export { routes };
