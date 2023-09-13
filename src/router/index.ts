import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { setRouteChange } from '/@/logics/mitt/routeChange';
import { staticRoutes } from './static';

export const router = createRouter({
	history: createWebHashHistory(),
	routes: staticRoutes
});

router.beforeEach(async (to) => {
	setRouteChange(to);
	NProgress.configure({ showSpinner: false });
	NProgress.start();
	return true;
});

router.afterEach((to) => {
	NProgress.done();
});

export default router;
