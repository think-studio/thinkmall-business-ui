<template>
	<div class="nav-tabs" ref="tabScrollbarRef">
		<div
			class="ba-nav-tab"
			v-for="(item, index) in navTabStore.tabsView"
			:ref="tabsRefs.set"
			@click="handleClick(item)"
		>
			{{ item.title }}
			<transition
				@after-leave="selectTab(tabsRefs[navTabStore.activeIndex])"
				name="el-fade-in"
			>
				<Icon
					v-show="navTabStore.tabsView.length > 1"
					class="close-icon"
					@click.stop="handleClose(item)"
					size="15"
					name="el-icon-Close"
				/>
			</transition>
		</div>
		<div :style="activeBoxStyle" class="nav-tabs-active-box"></div>
	</div>
</template>

<script setup lang="ts" name="NavTabs">
import { useNavTabStroe } from '/@/store/modules/navTabs';
import { listenerRouteChange } from '/@/logics/mitt/routeChange';
import { useTemplateRefsList } from '@vueuse/core';
import router from '/@/router';
import { BackMenuModel } from '/@/router/types';
import useCurrentInstance from '/@/hooks/core/useCurrentInstance';

const { proxy } = useCurrentInstance();

const navTabStore = useNavTabStroe();
const tabsRefs = useTemplateRefsList<HTMLDivElement>();
const tabScrollbarRef = ref<HTMLDivElement>();

listenerRouteChange((route) => {
	const { hideTab } = route.meta;
	if (hideTab) {
		return;
	}
	navTabStore.addTab(toRaw(route));
	navTabStore.setActiveRoute(route);
	nextTick(() => {
		selectTab(tabsRefs.value[navTabStore.activeIndex]);
	});
});

const activeBoxStyle = reactive({
	width: '0',
	transform: 'translateX(0px)'
});

function selectTab(dom: HTMLDivElement) {
	if (!dom) {
		return;
	}
	const scrollLeft = dom.offsetLeft + dom.clientWidth;
	if (tabScrollbarRef.value) {
		if (dom.offsetLeft < tabScrollbarRef.value.clientWidth) {
			tabScrollbarRef.value.scrollTo({
				top: 0,
				left: dom.offsetLeft,
				behavior: 'smooth'
			});
		} else if (scrollLeft > tabScrollbarRef.value.clientWidth) {
			tabScrollbarRef.value.scrollTo({
				top: 0,
				left: scrollLeft,
				behavior: 'smooth'
			});
		}
	}
	activeBoxStyle.width = dom.clientWidth + 'px';
	activeBoxStyle.transform = `translateX(${dom.offsetLeft}px)`;
}

function handleClick(menu: BackMenuModel) {
	router.push({ name: menu.name });
}

function handleClose(menu: BackMenuModel) {
	const activeRoute = navTabStore.tabsView[navTabStore.activeIndex];
	navTabStore.closeTab(menu);
	proxy.eventBus.emit('onTabViewClose', menu);
	if (activeRoute.path === menu.path) {
		let activeIndex = navTabStore.activeIndex;
		if (navTabStore.activeIndex >= navTabStore.tabsView.length - 1) {
			activeIndex = navTabStore.tabsView.length - 1;
		}
		router.push({
			name: navTabStore.tabsView[activeIndex].name
		});
	} else {
		navTabStore.setActiveRoute(activeRoute);
		nextTick(() => {
			selectTab(tabsRefs.value[navTabStore.activeIndex]);
		});
	}
}
</script>

<style scoped lang="scss">
.nav-tabs {
	flex: 1;
	display: flex;
	height: 100%;
	position: relative;
	overflow-x: auto;
	overflow-y: hidden;
	margin-right: var(--ba-main-space);
	scrollbar-width: none;

	&::-webkit-scrollbar {
		height: 5px;
	}

	&::-webkit-scrollbar-thumb {
		background: #eaeaea;
		border-radius: var(--el-border-radius-base);
		box-shadow: none;
		-webkit-box-shadow: none;
	}

	&:hover {
		&::-webkit-scrollbar-thumb:hover {
			background: #c8c9cc;
		}
	}
}

.ba-nav-tab {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	padding: 0 20px;
	cursor: pointer;
	z-index: 1;
	user-select: none;
	color: #000;
	white-space: nowrap;
	opacity: 0.7;

	&.active {
		color: #000;
	}

	&:hover {
		opacity: 1;
	}

	.close-icon {
		padding: 2px;
		margin: 2px 0 0 4px;
	}

	.close-icon:hover {
		background: var(--ba-color-primary-light);
		color: var(--el-border-color) !important;
		border-radius: 50%;
	}
}

.nav-tabs-active-box {
	position: absolute;
	height: 100%;
	// height: 40px;
	// border-radius: var(--el-border-radius-base);
	// background-color: #fff;
	background-color: rgb(247, 248, 253);
	// box-shadow: var(--el-box-shadow-light);
	transition: all 0.2s;
	-webkit-transition: all 0.2s;
}
</style>
