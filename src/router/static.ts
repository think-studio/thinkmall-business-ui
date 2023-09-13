import { RouteRecordRaw } from 'vue-router';

const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Root',
		redirect: '/loading'
	},
	{
		path: '/loading',
		name: 'Loading',
		component: () => import('/@/views/loading/index.vue')
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('/@/views/login/index.vue'),
		meta: {
			title: '登录'
		}
	},
	{
		path: '/:path(.*)*',
		redirect: (to) => {
			return {
				name: 'Loading',
				query: { url: to.path, query: JSON.stringify(to.query) }
			};
		}
	}
];

export { staticRoutes };
