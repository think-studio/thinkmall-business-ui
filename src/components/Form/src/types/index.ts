type ColSpanType = number;

export interface ColEx {
	span?: ColSpanType;

	push?: ColSpanType;

	pull?: ColSpanType;

	xs?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

	sm?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

	md?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

	lg?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

	xl?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;
}

export type ComponentType =
	| 'Input'
	| 'InputNumber'
	| 'Select'
	| 'Option'
	| 'TreeSelect'
	| 'RadioButtonGroup'
	| 'RadioGroup'
	| 'Checkbox'
	| 'CheckboxGroup'
	| 'DatePicker'
	| 'IconSelector'
	| 'Tree'
	| 'ApiSelect'
	| 'Upload'
	| 'DictSelect'
	| 'AreaSelect';
