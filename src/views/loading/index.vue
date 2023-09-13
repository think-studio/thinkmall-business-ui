<template>
	<div>
		<div class="default-main ba-main-loading"></div>
	</div>
</template>

<script lang="ts" setup name="Loading">
import { loading } from '/@/utils/loading';

import { useUserStore } from '/@/store/modules/user';
import router from '/@/router/index';
import {
	transformObjToRoute,
	flatMultiLevelRoutes
} from '/@/router/helper/routeHelper';
import { useNavTabStroe } from '/@/store/modules/navTabs';
import { BackMenuModel } from '/@/router/types';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';
import { RouteRecordRaw, useRoute } from 'vue-router';
import { getRoutesApi } from '/@/api/sys/user';

const route = useRoute();

onMounted(async () => {
	loading.show();
	if (!useUserStore().getToken) {
		router.push({ name: 'Login' }).then(() => {
			loading.hide();
		});
	} else {
		try {
			await useUserStore().setUserInfo();
			const { data: backRouteList } = await getRoutesApi();
			let routeList = transformObjToRoute(backRouteList);
			routeList = flatMultiLevelRoutes(routeList);
			routeList.forEach((route) => {
				router.addRoute(route as unknown as RouteRecordRaw);
			});

			const backMenuList: BackMenuModel[] = transformRouteToMenu(routeList);
			useNavTabStroe().setBackMenuList(backMenuList);

			if (route.query && route.query.url) {
				router
					.push({
						path: route.query.url as string,
						query: JSON.parse(route.query.query as string)
					})
					.then(() => {
						loading.hide();
					});
				return;
			}
			const firstRouteName = router.getRoutes()[0].name;
			router.push({ name: firstRouteName }).then(() => {
				loading.hide();
			});
		} catch (error) {
			console.error(error);
		}
	}
});
</script>

<style scoped lang="scss">
.ba-main-loading {
	height: 300px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.loading-footer {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
