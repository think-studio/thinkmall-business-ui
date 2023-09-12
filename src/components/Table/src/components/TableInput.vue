<template>
	<el-input
		v-loading="loadingRef"
		v-bind="$attrs"
		v-model="valueRef"
		@keypress.enter="handleConfirm"
	></el-input>
</template>

<script lang="ts" setup name="TableInput">
import { isFunction } from 'lodash-es';

interface Props {
	value: string | number;
	api: (params: Recordable) => Promise<any>;
	params: Recordable;
	beforeFetch?: (value: string | number) => Recordable;
}

const emits = defineEmits(['success']);

const props = withDefaults(defineProps<Props>(), {
	value: '',
	params: () => ({})
});

const loadingRef = ref<boolean>(false);
const valueRef = ref<string | number>(props.value);

watch(
	() => props.value,
	(newValue) => {
		valueRef.value = newValue;
	},
	{
		immediate: true
	}
);

async function handleConfirm() {
	const { api, beforeFetch, params } = props;
	if (isFunction(api)) {
		loadingRef.value = true;
		if (isFunction(beforeFetch)) {
			Object.assign(params, beforeFetch(unref(valueRef)));
		}
		try {
			const res = await api(params);
			emits('success', unref(valueRef));
		} catch (error) {
			console.error(error);
		} finally {
			loadingRef.value = false;
		}
	}
}
</script>
