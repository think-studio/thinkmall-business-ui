<template>
	<div class="nav card">
		<el-button @click="routerBack(route)" type="info" :icon="Back" circle />

		<span>{{ title }}</span>
	</div>
</template>

<script lang="ts" setup name="BackNav">
import { routerBack } from '/@/utils';
import { Back } from '@element-plus/icons-vue';
const route = useRoute();

defineProps({
	title: String
});
</script>

<style lang="scss" scoped>
.nav {
	.el-icon {
		font-size: 28px;
		font-weight: bold;
		cursor: pointer;
	}

	span {
		margin-left: 15px;
		font-size: 18px;
		font-weight: bold;
	}
}
</style>
