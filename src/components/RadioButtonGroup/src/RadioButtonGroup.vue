<template>
	<el-radio-group
		v-bind="$attrs"
		:model-value="getModelValue($attrs.modelValue)"
	>
		<el-radio
			v-for="(item, index) in options"
			:key="index"
			:label="item.value"
			border
		>
			{{ item.label }}
		</el-radio>
	</el-radio-group>
</template>

<script lang="ts" setup name="RadioButtonGroup">
interface Props {
	options: { label: string; value: boolean | string | number }[];
}

function getModelValue(value: any) {
	if (value === 'true') return true;
	if (value === 'false') return false;
	return value;
}

withDefaults(defineProps<Props>(), {
	options: () => []
});
</script>
