<template>
	<el-col :span="actionSpan">
		<el-form-item>
			<el-button v-if="showResetButton" type="default" @click="resetAction">
				重置
			</el-button>
			<el-button
				type="primary"
				v-bind="getSubmitBtnOptions"
				@click="submitAction"
			>
				{{ getSubmitBtnOptions.btnText }}
			</el-button>
		</el-form-item>
	</el-col>
</template>

<script lang="ts" setup name="BasicFormAction">
import { useFormContext } from '../hooks/useFormContext';
import { ButtonProps } from '../types/form';

interface Props {
	actionSpan: number;
	showResetButton: boolean;
	submitButtonOptions?: Partial<ButtonProps>;
}
const props = withDefaults(defineProps<Props>(), {
	showResetButton: true
});
const getSubmitBtnOptions = computed(() => {
	return Object.assign({
		btnText: '确认',
		...props.submitButtonOptions
	});
});

const { resetAction, submitAction } = useFormContext();
</script>
