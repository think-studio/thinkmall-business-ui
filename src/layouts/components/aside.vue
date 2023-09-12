<template>
	<el-aside class="layout-aside-Default">
		<Logo />
		<BasicMenu />
	</el-aside>
</template>

<script setup name="LayoutAside" lang="ts">
import Logo from './logo.vue';

import BasicMenu from './basicMenu.vue';
</script>

<style scoped lang="scss">
.layout-aside-Default {
	display: flex;
	flex-direction: column;
	background-color: var(--ba-bg-color-overlay);
	// margin: 16px 0 16px 16px;
	//   height: calc(100vh - 32px);
	// box-shadow: var(--el-box-shadow-light);
	// border-radius: var(--el-border-radius-base);
	overflow: hidden;
	transition: width 0.3s ease;
	width: 260px;
}
</style>
