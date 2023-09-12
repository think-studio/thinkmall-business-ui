<template>
	<template v-for="menu in innerMenus">
		<template v-if="menu.children && menu.children.length > 0">
			<el-sub-menu :index="menu.path" :key="menu.path">
				<template #title>
					<Icon :name="menu.icon"></Icon>
					<span>{{ menu.title }}</span>
				</template>
				<menu-tree :menus="menu.children"></menu-tree>
			</el-sub-menu>
		</template>
		<template v-else>
			<el-menu-item
				:index="menu.path"
				:key="menu.path"
				@click="handleClick(menu)"
				v-if="!menu.hideMenu"
			>
				<Icon :name="menu.icon" />
				<span>{{ menu.title }}</span>
			</el-menu-item>
		</template>
	</template>
</template>
<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import router from '/@/router';
import { BackMenuModel } from '/@/router/types';
import { Icon } from '/@/components/Icon';

interface Props {
	menus: BackMenuModel[];
}
const props = withDefaults(defineProps<Props>(), {
	menus: () => []
});

const innerMenus = computed(() => {
	const menus = cloneDeep(props.menus);
	for (const item of menus) {
		item.children = item.children?.filter((value) => !value.hideMenu);
	}
	return menus;
});

function handleClick(menu: BackMenuModel) {
	// if (menu.link) {
	//     window.open(menu.link)
	// } else {
	//     router.push({
	//         name: menu.name,
	//     })
	// }

	router.push({
		name: menu.name
	});
}
</script>

<style scoped lang="scss">
.el-sub-menu .icon,
.el-menu-item .icon {
	vertical-align: middle;
	margin-right: 5px;
	width: 24px;
	text-align: center;
}

.is-active > .icon {
	color: var(--el-menu-active-color) !important;
}
</style>
