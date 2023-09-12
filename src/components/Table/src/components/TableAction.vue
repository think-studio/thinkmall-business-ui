<template>
	<div style="display: flex">
		<template v-for="action in getActions">
			<TableActionItem :action="action"></TableActionItem>
		</template>
	</div>
</template>

<script lang="ts" setup name="BasicTableAction">
import { isBoolean, isFunction } from 'lodash-es';
import { ActionItem } from '../types/tableAction';
import { hasPermission } from '/@/directives/permission';
import TableActionItem from './ActionItem.vue';

interface Props {
	actions: ActionItem[];
}

const props = withDefaults(defineProps<Props>(), {
	actions: () => []
});

function isIfShow(action: ActionItem): boolean {
	const { ifShow } = action;
	let isIfShow = true;
	if (isBoolean(ifShow)) {
		isIfShow = ifShow;
	}
	if (isFunction(ifShow)) {
		isIfShow = ifShow(action);
	}
	return isIfShow;
}

const getActions = computed(() => {
	return unref(props.actions).filter((item) => {
		return hasPermission(item.auth) && isIfShow(item);
	});
});
</script>
