<template>
	<div class="layout-logo">
		<img class="logo-img" :src="Logo" alt="logo" />
	</div>
</template>

<script setup lang="ts" name="Logo">
import Logo from '/@/assets/logo.png';
</script>

<style scoped lang="scss">
.layout-logo {
	width: 100%;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	padding: 10px;
	background: #fff;
	border-top: 2px solid rgb(247, 248, 253);

	.logo-img {
		height: 36px;
	}
}
</style>
