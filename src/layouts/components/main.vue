<template>
	<el-main>
		<el-scrollbar>
			<router-view v-slot="{ Component }">
				<transition name="slide-right" mode="out-in">
					<keep-alive :include="state.keepAliveComponentNameList">
						<component :is="Component" :key="state.componentKey" />
					</keep-alive>
				</transition>
			</router-view>
		</el-scrollbar>
	</el-main>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import useCurrentInstance from '/@/hooks/core/useCurrentInstance';
import { BackMenuModel } from '/@/router/types';
import { useNavTabStroe } from '/@/store/modules/navTabs';

const navTabStore = useNavTabStroe();

const { proxy } = useCurrentInstance();

const route = useRoute();

const state: {
	componentKey: string;
	keepAliveComponentNameList: string[];
} = reactive({
	componentKey: route.path,
	keepAliveComponentNameList: []
});

const addKeepAliveComponentName = function (keepAliveName: string | undefined) {
	if (keepAliveName) {
		let exist = state.keepAliveComponentNameList.includes(keepAliveName);
		if (exist) return;
		state.keepAliveComponentNameList.push(keepAliveName);
	}
};

onBeforeMount(() => {
	proxy.eventBus.on('onTabViewClose', (menu: BackMenuModel) => {
		state.keepAliveComponentNameList = state.keepAliveComponentNameList.filter(
			(name: string) => menu.name !== name
		);
	});
});

onUnmounted(() => {
	proxy.eventBus.off('onTabViewClose');
});

onMounted(() => {
	// 确保刷新页面时也能正确取得当前路由 keepAlive 参数
	addKeepAliveComponentName(navTabStore.activeRoute?.name);
});

watch(
	() => route.path,
	() => {
		state.componentKey = route.path;
		addKeepAliveComponentName(navTabStore.activeRoute?.name);
	}
);
</script>
