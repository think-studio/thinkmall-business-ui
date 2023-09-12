<template>
	<el-container class="layout-container">
		<Aside />
		<el-container class="content-wrapper">
			<Header />
			<Main />
		</el-container>
	</el-container>
</template>

<script setup name="Layout" lang="ts">
import Aside from '/@/layouts/components/aside.vue';
import Header from '/@/layouts/components/header.vue';
import Main from '/@/layouts/components/main.vue';

onMounted(() => {
	onSetNavTabsMinWidth();
});

function onSetNavTabsMinWidth() {
	const navTabs = document.querySelector('.nav-tabs') as HTMLElement;
	if (!navTabs) {
		return;
	}
	const navBar = document.querySelector('.nav-bar') as HTMLElement;
	const navMenus = document.querySelector('.nav-menus') as HTMLElement;
	const minWidth = navBar.offsetWidth - (navMenus.offsetWidth + 20);
	navTabs.style.width = minWidth.toString() + 'px';
}
</script>

<style scoped>
.layout-container {
	width: 100%;
	height: 100%;
	background: rgb(247, 248, 253);
}

.content-wrapper {
	flex-direction: column;
	width: 100%;
	height: 100%;
}
</style>
