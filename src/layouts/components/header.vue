<template>
	<el-header class="layout-header">
		<div class="nav-bar">
			<NavTabs />
			<NavMenus />
		</div>
	</el-header>
</template>

<script setup name="LayoutHeader" lang="ts">
import NavTabs from '/@/layouts/tabs/index.vue';
import NavMenus from '/@/layouts/navMenu/index.vue';
</script>

<style scoped lang="scss">
.layout-header {
	height: auto;
	padding: 0;

	.nav-bar {
		display: flex;
		height: 50px;
		// margin: 20px var(--ba-main-space) 0 var(--ba-main-space);
		background-color: #fff;
	}
}
</style>
