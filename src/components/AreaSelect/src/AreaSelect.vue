<template>
	<ElCascader
		v-bind="$attrs"
		:options="areaData"
		@change="handleChange"
		style="width: 100%"
	></ElCascader>
</template>

<script lang="ts" setup name="AreaSelect">
import type { CascaderValue } from 'element-plus';
import { isArray } from 'lodash-es';
import areaData from './areaData.json';

const emit = defineEmits(['change']);

function handleChange(val: CascaderValue): void {
	if (isArray(val)) {
		let result = getOption(val, areaData);
		emit('change', result);
	} else {
		emit('change', val);
	}
}

function getOption(val: any[], areaData: any[]) {
	let temp: any = null;
	return val.map((item, index) => {
		const cur = (index === 0 ? areaData : temp).find(
			(e: any) => e.value === item
		);
		temp = cur.children;
		const { label, value } = cur || {};
		return { label, value };
	});
}
</script>

<style lang="scss" scoped></style>
