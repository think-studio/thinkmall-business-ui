import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { setRouteChange } from '/@/logics/mitt/routeChange';
import { routes } from './static';

export const router = createRouter({
	history: createWebHashHistory(),
	routes: routes
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
