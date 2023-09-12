<template>
	<template v-if="innerData">
		<el-popconfirm
			v-if="innerData.popConfirm && !innerData.disabled"
			:title="innerData.popConfirm.title"
			@confirm="handleClick(innerData.popConfirm?.confirm)"
		>
			<template #reference>
				<div class="ml-6">
					<el-button
						class="table-operate"
						size="small"
						:type="innerData.type"
						:disabled="innerData.disabled"
						:loading="loading"
					>
						{{ innerData.tooltip }}
					</el-button>
				</div>
			</template>
		</el-popconfirm>
		<div v-else class="ml-6">
			<el-button
				class="table-operate"
				size="small"
				:type="innerData.type"
				@click="handleClick(innerData.onClick)"
				:disabled="innerData.disabled"
				:loading="loading"
			>
				{{ action.tooltip }}
			</el-button>
		</div>
	</template>
</template>

<script lang="ts" setup name="TableActionItem">
import { isFunction } from 'lodash-es';
import { ActionItem } from '../types/tableAction';

interface Props {
	action: ActionItem;
}
const props = withDefaults(defineProps<Props>(), {});
const innerData = ref<ActionItem>(props.action);
const loading = ref(false);

watch(
	() => props.action,
	(n) => {
		if (n) {
			innerData.value = n;
		}
	}
);

let timer: NodeJS.Timeout | null = null;
async function handleClick(fn?: Fn) {
	try {
		timer = setTimeout(() => {
			loading.value = true;
		}, 300);
		if (fn && isFunction(fn)) {
			await fn();
		}
	} catch (error) {
		console.error(error);
	} finally {
		if (timer) {
			clearTimeout(timer);
		}
		loading.value = false;
	}
}
</script>

<style scoped lang="scss">
.ml-6 {
	display: inline-flex;
	vertical-align: middle;
	margin-left: 6px;
}

.ml-6 + .el-button {
	margin-left: 6px;
}
</style>
