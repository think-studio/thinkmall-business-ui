<template>
	<ElConfigProvider :locale="zhCn">
		<router-view></router-view>
	</ElConfigProvider>
</template>
<script lang="ts" setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { setTitleFromRoute } from '/@/utils';
import { useRoute } from 'vue-router';

const route = useRoute();

// 监听路由变化时更新浏览器标题
watch(
	() => route.path,
	() => {
		setTitleFromRoute();
	}
);
</script>
<style scoped></style>
