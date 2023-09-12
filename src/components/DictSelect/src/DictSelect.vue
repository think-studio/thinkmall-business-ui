<template>
	<el-select
		v-bind="$attrs"
		filterable
		clearable
		@change="handleChange"
		style="width: 100%"
	>
		<el-option
			v-for="item in options"
			:key="item.id"
			:label="item.dictLabel"
			:value="item.dictValue"
		/>
	</el-select>
</template>

<script lang="ts" setup name="DictSelect">
import { DictDataModel } from '/@/api/system/dict/model/dataModel';
import { useAppStore } from '/@/store/modules/app';

interface ApiSelectProps {
	type: string;
}

const emit = defineEmits(['change']);

const props = withDefaults(defineProps<ApiSelectProps>(), {});

const options = ref<DictDataModel[]>([]);

const appStore = useAppStore();
const dictData = appStore.getDict;
const currentDict = dictData.find((item) => item.dictName === props.type);
options.value = currentDict?.dataList || [];

function handleChange(value: string | number) {
	const item = unref(options).find((item) => {
		return item.dictValue === value;
	});
	emit('change', item);
}

onMounted(() => {});
</script>
