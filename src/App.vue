<template>
	<ElConfigProvider :locale="zhCn">
		<router-view></router-view>
	</ElConfigProvider>
</template>
<script lang="ts" setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { setTitleFromRoute } from '/@/utils';
import iconfontInit from '/@/utils/iconfont';
import { useRoute } from 'vue-router';

import { loading } from '/@/utils/loading';

import { useUserStore } from '/@/store/modules/user';
import router from '/@/router/index';

import { useNavTabStroe } from '/@/store/modules/navTabs';
import { BackMenuModel } from '/@/router/types';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';
import { routes } from '/@/router/static';

const route = useRoute();

onMounted(() => {
	iconfontInit();
	if (!useUserStore().getToken) {
		router.push({ name: 'Login' }).then(() => {
			loading.hide();
		});
	} else {
		useUserStore()
			.setUserInfo()
			.then(() => {
				const backMenuList: BackMenuModel[] = transformRouteToMenu(routes);
				router.push({ name: 'Home' }).then(() => {});
				console.log(backMenuList);
				useNavTabStroe().setBackMenuList(backMenuList);
			});
	}
});

// 监听路由变化时更新浏览器标题
watch(
	() => route.path,
	() => {
		setTitleFromRoute();
	}
);
</script>
<style scoped></style>
