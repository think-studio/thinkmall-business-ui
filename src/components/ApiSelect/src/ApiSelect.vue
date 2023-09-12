<template>
	<el-select
		v-bind="$attrs"
		filterable
		:remote-method="handleRemote"
		:loading="loading"
		:remote="remote"
		clearable
		@change="handleChange"
		style="width: 100%"
		:multiple="multiple"
	>
		<el-option
			v-for="item in options"
			:key="item.value"
			:label="item.label"
			:value="item.value"
		/>
	</el-select>
</template>

<script lang="ts" setup name="ApiSelect">
import { get, isFunction } from 'lodash-es';

interface ApiSelectProps {
	api?: (...arg: any) => Promise<any>;
	config?: Recordable<string>;
	format?: (value: Recordable) => string;
	params?: Recordable;
	immediate?: boolean;
	remote?: boolean;
	queryField?: string;
	multiple?: boolean;
}

const emit = defineEmits(['change']);

const props = withDefaults(defineProps<ApiSelectProps>(), {
	config: () => ({
		label: 'label',
		value: 'value'
	}),
	immediate: true,
	remote: false,
	queryField: '',
	multiple: false
});

const options = ref<any[]>([]);
const sourceData = ref([]);
const loading = ref(false);

// watch(
//   () => props,
//   (n, o) => {
//     fetch();
//   },
//   {
//     deep: true,
//   }
// );

function handleRemote(query: string) {
	if (!props.remote) return;
	if (query !== '') {
		if (props.queryField) {
			loading.value = true;
			fetch({ [props.queryField]: query });
			loading.value = false;
		} else {
			console.error('请配置queryField参数');
		}
	} else {
		options.value = [];
	}
}

async function fetch(params: Recordable = {}) {
	const { api, config } = props;
	if (!api) {
		return;
	}
	if (isFunction(api)) {
		try {
			const res = await api({ ...props.params, ...params });
			const data = get(res, 'data');
			sourceData.value = data;
			const { label, value } = config;
			options.value = data.map((item: { [x: string]: any }) => {
				let labelResult = item[label];
				if (props.format && isFunction(props.format)) {
					labelResult = props.format(item);
				}
				return {
					label: labelResult,
					value: item[value]
				};
			});
		} catch (error) {}
	}
}

function handleChange(value: string | number) {
	const { value: configValue } = props.config;
	const item = unref(sourceData).find((item) => {
		return item[configValue] === value;
	});
	emit('change', item);
}

onMounted(() => {
	if (props.immediate && !props.remote) {
		setTimeout(() => {
			fetch();
		}, 16);
	}
});
</script>
