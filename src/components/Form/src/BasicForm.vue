<template>
	<el-form
		v-bind="getBindValue"
		:model="formModel"
		label-position="top"
		ref="formElRef"
	>
		<el-row :gutter="8">
			<slot name="formHeader"></slot>
			<template v-for="schema in getSchema" :key="schema.field">
				<form-item
					:schema="schema"
					:formModel="formModel"
					:formProps="getProps"
					:setFormModel="setFormModel"
					:formActionType="formActionType"
				>
					<template #[item]="data" v-for="item in Object.keys($slots)">
						<slot :name="item" v-bind="data || {}"></slot>
					</template>
				</form-item>
			</template>
			<FormAction
				:actionSpan="getBindValue.actionSpan"
				:submitButtonOptions="getBindValue.submitButtonOptions"
				:show-reset-button="getBindValue.showResetButton"
				v-if="getBindValue.showActionButtonGroup"
			/>
		</el-row>
	</el-form>
</template>

<script lang="ts" setup name="BasicForm">
import {
	ButtonProps,
	FormActionType,
	FormProps,
	FormSchema
} from './types/form';
import { deepMerge } from '/@/utils';
import FormItem from './components/FormItem.vue';
import FormAction from './components/FormAction.vue';

import { createFormContext } from './hooks/useFormContext';
import { useFormEvents } from './hooks/useFormEvents';
import { Ref } from 'vue';
import { dateItemType } from './helper';
import { dateUtil, formatToDate } from '/@/utils/date';
import { useFormValues } from './hooks/useFormValue';
import { ColEx } from './types';

interface BasicProps {
	model?: Recordable;
	labelWidth?: string | number;
	baseColProps?: Partial<ColEx>;
	actionSpan?: number;
	schemas?: FormSchema[];
	disabled?: boolean;
	showActionButtonGroup?: boolean;
	submitOnReset?: boolean;
	submitButtonOptions?: Partial<ButtonProps>;
}

const props = withDefaults(defineProps<BasicProps>(), {
	model: () => ({}),
	labelWidth: 0,
	schemas: () => [],
	disabled: false,
	showActionButtonGroup: true,
	actionSpan: 12,
	submitOnReset: false
});

const emit = defineEmits(['register', 'reset', 'submit']);

const formModel = reactive<Recordable>({});
const isInitedDefaultRef = ref(false);
const defaultValueRef = ref<Recordable>({});
const propsRef = ref<Partial<FormProps>>({});
const schemaRef = ref<Nullable<FormSchema[]>>(null);
const formElRef = ref<Nullable<FormActionType>>(null);

const getProps = computed((): FormProps => {
	return { ...props, ...unref(propsRef) } as FormProps;
});

const getBindValue = computed(() => {
	return { ...props, ...unref(getProps) };
});

const getSchema = computed(() => {
	const schemas = unref(schemaRef) || unref(getProps).schemas;
	for (const schema of schemas) {
		const { defaultValue, component, dateFormat } = schema;
		if (defaultValue && component && dateItemType.includes(component)) {
			if (!Array.isArray(defaultValue)) {
				schema.defaultValue = formatToDate(dateUtil(defaultValue), dateFormat);
			} else {
				const def: any[] = [];

				defaultValue.forEach((item) => {
					def.push(formatToDate(dateUtil(item), dateFormat));
				});
				schema.defaultValue = def;
			}
		}
	}
	return schemas;
});

const { handleFormValues, initDefault, clearFormValues } = useFormValues({
	getProps,
	defaultValueRef,
	getSchema,
	schemaRef,
	formModel
});

async function setProps(formProps: Partial<FormProps>): Promise<void> {
	propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
}

function setFormModel(key: string, value: any) {
	formModel[key] = value;
}

const {
	resetFields,
	handleSubmit,
	validate,
	clearValidate,
	setFieldsValue,
	getFieldsValue,
	updateSchema
} = useFormEvents({
	emit: emit as EmitType,
	getProps,
	formElRef: formElRef as Ref<FormActionType>,
	formModel,
	defaultValueRef,
	getSchema,
	schemaRef: schemaRef as Ref<FormSchema[]>,
	handleFormValues
});

createFormContext({
	resetAction: resetFields,
	submitAction: handleSubmit
});

const formActionType: FormActionType = {
	setProps,
	resetFields,
	validate,
	clearValidate,
	submit: handleSubmit,
	setFieldsValue,
	getFieldsValue,
	updateSchema,
	clearFormValues,
	initDefaultValues: initDefault
};

watch(
	() => getSchema.value,
	(schema) => {
		if (unref(isInitedDefaultRef)) {
			return;
		}
		if (schema?.length) {
			initDefault();
			isInitedDefaultRef.value = true;
		}
	}
);
onMounted(() => {
	initDefault();
	emit('register', formActionType);
});
</script>
