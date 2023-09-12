<template>
	<el-switch
		v-bind="$attrs"
		v-model="valueRef"
		:loading="loadingRef"
		:before-change="handleBeforeChange"
	></el-switch>
</template>

<script lang="ts" setup name="TableSwitch">
import { isFunction } from 'lodash-es';

interface Props {
	value: string | boolean;
	api: (params: Recordable) => Promise<any>;
	params: Recordable;
	beforeFetch?: (value: string | boolean) => Recordable;
}

const props = withDefaults(defineProps<Props>(), {
	value: false,
	params: () => ({})
});

const loadingRef = ref<boolean>(false);
const valueRef = ref<string | boolean>(props.value);

watch(
	() => props.value,
	(newValue) => {
		valueRef.value = newValue;
	},
	{
		immediate: true
	}
);

async function handleBeforeChange() {
	const { api, beforeFetch, params } = props;
	if (isFunction(api)) {
		loadingRef.value = true;
		if (isFunction(beforeFetch)) {
			Object.assign(params, beforeFetch(unref(valueRef)));
		}
		try {
			const res = await api(params);
			if (res.data) {
				return Promise.resolve(true);
			}
			return Promise.reject(false);
		} catch (error) {
			return Promise.reject(false);
		} finally {
			loadingRef.value = false;
		}
	} else {
		return Promise.reject(false);
	}
}
</script>
