import { FormItemRule } from 'element-plus';
import { isNumber } from 'lodash-es';
import { ComponentType } from './types';

const DATE_TYPE = ['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'];

function genType() {
	return [...DATE_TYPE, 'RangePicker'];
}

export const dateItemType = genType();

export function createPlaceholderMessage(component: ComponentType) {
	if (component.includes('Input') || component.includes('Complete')) {
		return '请输入';
	}
	if (component.includes('Picker')) {
		return '请选择';
	}
	if (
		component.includes('Select') ||
		component.includes('Cascader') ||
		component.includes('Checkbox') ||
		component.includes('Radio') ||
		component.includes('Switch')
	) {
		return '请选择';
	}
	return '';
}
export function setComponentRuleType(
	rule: FormItemRule,
	component: ComponentType,
	valueFormat: string
) {
	if (
		['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'].includes(
			component
		)
	) {
		rule.type = valueFormat ? 'string' : 'object';
	} else if (
		['RangePicker', 'Upload', 'CheckboxGroup', 'TimePicker'].includes(component)
	) {
		rule.type = 'array';
	} else if (['InputNumber'].includes(component)) {
		rule.type = 'number';
	}
}
export function handleInputNumberValue(component?: ComponentType, val?: any) {
	if (!component) return val;
	if (
		['Input', 'InputPassword', 'InputSearch', 'InputTextArea'].includes(
			component
		)
	) {
		return val && isNumber(val) ? `${val}` : val;
	}
	return val;
}
