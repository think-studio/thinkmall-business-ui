<template>
	<el-scrollbar class="vertical-menus-scrollbar">
		<el-menu
			class="layouts-menu-vertical"
			:collapse-transition="false"
			:default-active="activeMenu"
			:unique-opened="true"
		>
			<MenuTree :menus="useNavTabStroe().backMenuList"></MenuTree>
		</el-menu>
	</el-scrollbar>
</template>

<script setup name="BasicMenu" lang="ts">
import MenuTree from './menuTree.vue';
import { listenerRouteChange } from '/@/logics/mitt/routeChange';
import { useNavTabStroe } from '/@/store/modules/navTabs';

const activeMenu = ref<string>('');

listenerRouteChange((route) => {
	const currentActiveMenu = route.meta.currentActiveMenu as string;
	if (currentActiveMenu) {
		activeMenu.value = currentActiveMenu;
	} else {
		activeMenu.value = route.path;
	}
});
</script>

<style scoped lang="scss">
.layouts-menu-vertical {
	border: 0;
	--el-menu-bg-color: #ffffff;
	--el-menu-text-color: #303133;
	--el-menu-active-color: #409eff;
}
</style>
