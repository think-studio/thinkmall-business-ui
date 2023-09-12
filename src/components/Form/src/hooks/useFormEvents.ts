import { FormInstance } from 'element-plus';
import { isArray, isObject, uniqBy } from 'lodash-es';
import { ComputedRef, Ref } from 'vue';
import { dateItemType, handleInputNumberValue } from '../helper';
import { FormActionType, FormProps, FormSchema } from '../types/form';
import { deepMerge } from '/@/utils';
import { dateUtil } from '/@/utils/date';

interface UseFormActionContext {
	emit: EmitType;
	getProps: ComputedRef<FormProps>;
	formElRef: Ref<FormActionType>;
	formModel: Recordable;
	defaultValueRef: Ref<Recordable>;
	getSchema: ComputedRef<FormSchema[]>;
	schemaRef: Ref<FormSchema[]>;
	handleFormValues: Fn;
}

export function useFormEvents({
	emit,
	getProps,
	formElRef,
	formModel,
	defaultValueRef,
	getSchema,
	schemaRef,
	handleFormValues
}: UseFormActionContext) {
	async function resetFields() {
		const formEl = unref(formElRef);
		if (!formEl) {
			return;
		}
		const { submitOnReset } = unref(getProps);
		Object.keys(formModel).forEach(async (key) => {
			formModel[key] = defaultValueRef.value[key];
		});
		clearValidate(Object.keys(formModel));
		emit('reset', toRaw(formElRef));
		submitOnReset && handleSubmit();
	}
	async function updateSchema(
		data: Partial<FormSchema> | Partial<FormSchema>[]
	) {
		let updateData: Partial<FormSchema>[] = [];
		if (isObject(data)) {
			updateData.push(data as FormSchema);
		}
		if (isArray(data)) {
			updateData = [...data];
		}

		const hasField = updateData.every(
			(item) => Reflect.has(item, 'field') && item.field
		);

		if (!hasField) {
			console.error('没有field');
			return;
		}
		const schema: FormSchema[] = [];
		updateData.forEach((item) => {
			unref(getSchema).forEach((val) => {
				if (val.field === item.field) {
					const newSchema = deepMerge(val, item);
					schema.push(newSchema as FormSchema);
				} else {
					schema.push(val);
				}
			});
		});
		schemaRef.value = uniqBy(schema, 'field');
	}
	async function clearValidate(name?: string | string[]) {
		await unref(formElRef)?.clearValidate(name);
	}
	function itemIsDateType(key: string) {
		return unref(getSchema).some((item) => {
			return item.field === key
				? dateItemType.includes(item.component ?? '')
				: false;
		});
	}

	function getFieldsValue(): Recordable {
		const formEl = unref(formElRef);
		if (!formEl) return {};
		return handleFormValues(toRaw(unref(formModel)));
	}

	async function setFieldsValue(values: Recordable): Promise<void> {
		const fields = unref(getSchema).map((item) => item.field);

		const validKeys: string[] = [];
		Object.keys(values).forEach((key) => {
			const schema = unref(getSchema).find((item) => item.field === key);
			let value = values[key];

			const hasKey = Reflect.has(values, key);

			value = handleInputNumberValue(schema?.component, value);
			// 0| '' is allow
			if (hasKey && fields.includes(key)) {
				// time type
				if (itemIsDateType(key)) {
					if (Array.isArray(value)) {
						const arr: any[] = [];
						for (const ele of value) {
							arr.push(ele ? dateUtil(ele) : null);
						}
						formModel[key] = arr;
					} else {
						const { componentProps } = schema || {};
						let _props = componentProps as any;
						if (typeof componentProps === 'function') {
							_props = _props({ formModel });
						}
						formModel[key] = value
							? _props?.valueFormat
								? value
								: dateUtil(value)
							: null;
					}
				} else {
					formModel[key] = value;
				}
				validKeys.push(key);
			}
		});
	}

	async function validate(): Promise<any> {
		return new Promise((relove, reject) => {
			(unref(formElRef) as unknown as FormInstance)?.validate(
				(valid, invalid) => {
					if (valid) {
						relove(handleFormValues(toRaw(formModel)));
					} else {
						if (invalid) {
							(unref(formElRef) as unknown as FormInstance)?.scrollToField(
								Object.keys(invalid)
							);
						}
						reject(invalid);
					}
				}
			);
		});
	}
	async function handleSubmit(e?: Event) {
		e && e.preventDefault();
		const formEl = unref(formElRef);
		if (!formEl) {
			return;
		}
		try {
			const res = await validate();
			emit('submit', res);
		} catch (error) {}
	}
	return {
		resetFields,
		handleSubmit,
		validate,
		clearValidate,
		setFieldsValue,
		getFieldsValue,
		updateSchema
	};
}
