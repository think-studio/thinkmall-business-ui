import { unref } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import type { FormProps, FormSchema } from '../types/form';
import {
	isArray,
	isFunction,
	isNull,
	isObject,
	isString,
	isUndefined,
	set
} from 'lodash-es';
import { dateUtil, DATE_FORMAT } from '/@/utils/date';

interface UseFormValuesContext {
	defaultValueRef: Ref<any>;
	getSchema: ComputedRef<FormSchema[]>;
	schemaRef: Ref<FormSchema[] | null>;
	getProps: ComputedRef<FormProps>;
	formModel: Recordable;
}
export function useFormValues({
	defaultValueRef,
	getSchema,
	schemaRef,
	formModel,
	getProps
}: UseFormValuesContext) {
	// Processing form values
	function handleFormValues(values: Recordable) {
		if (!isObject(values)) {
			return {};
		}
		const res: Recordable = {};
		for (const item of Object.entries(values)) {
			let [, value] = item;
			const [key] = item;
			const currentSchemn = unref(getSchema).find(
				(schema) => key === schema.field
			);
			if (currentSchemn && currentSchemn.fieldMapToTime && isArray(value)) {
				const { dateFormat = DATE_FORMAT } = currentSchemn;
				set(
					res,
					currentSchemn.fieldMapToTime[0],
					dateUtil(value[0]).format(dateFormat)
				);
				set(
					res,
					currentSchemn.fieldMapToTime[1],
					dateUtil(value[1]).format(dateFormat)
				);
			} else {
				if (isString(value)) {
					value = value.trim();
				}
				set(res, key, value);
			}
		}
		return res;
	}

	function clearFormValues() {
		schemaRef.value = null;
		Object.keys(formModel).forEach((key) => {
			Reflect.deleteProperty(formModel, key);
		});
	}

	function initDefault() {
		const schemas = unref(getSchema);

		const obj: Recordable = {};
		schemas.forEach((item) => {
			const { defaultValue } = item;
			if (!isNull(defaultValue) && !isUndefined(defaultValue)) {
				obj[item.field] = defaultValue;
				formModel[item.field] = defaultValue;
			} else {
				formModel[item.field] = undefined;
			}
		});
		defaultValueRef.value = obj;
	}

	return { handleFormValues, initDefault, clearFormValues };
}
