import type { ButtonProps as ElButtonProps, FormItemRule } from 'element-plus';
import { ColEx, ComponentType } from '.';
import type { DATE_FORMAT, DATE_TIME_FORMAT } from '/@/utils/date';
export interface RenderCallbackParams {
	schema: FormSchema;
	values: Recordable;
	model: Recordable;
	field: string;
}

export interface ButtonProps extends ElButtonProps {
	btnText?: string;
}

export interface FormSchema {
	field: string;
	valueType?: 'string' | 'number' | 'boolean';
	fieldMapToTime?: [string, string];
	dateFormat?: typeof DATE_FORMAT | typeof DATE_TIME_FORMAT;
	changeEvent?: string;
	label?: string;
	subLabel?: string;
	labelWidth?: string | number;
	slot?: string;
	component?: ComponentType;
	ifShow?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);
	show?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);
	colProps?: Partial<ColEx>;
	required?:
		| boolean
		| ((renderCallbackParams: RenderCallbackParams) => boolean);
	rules?: FormItemRule[];
	defaultValue?: any;
	componentProps?:
		| ((opt: {
				schema: FormSchema;
				formActionType: FormActionType;
				formModel: Recordable;
		  }) => Recordable)
		| object;
	dynamicDisabled?:
		| boolean
		| ((renderCallbackParams: RenderCallbackParams) => boolean);
}

export interface FormProps {
	model?: Recordable;
	labelWidth?: number | string;
	schemas: FormSchema[];
	compact?: boolean;
	size?: 'default' | 'small' | 'large';
	disabled?: boolean;
	actionSpan?: number;
	submitOnReset?: boolean;
	rulesMessageJoinLabel?: boolean;
	showActionButtonGroup?: boolean;
	showResetButton?: boolean;
	showSubmitButton?: boolean;
	resetFunc?: () => Promise<void>;
	submitFunc?: () => Promise<void>;
	baseColProps?: Partial<ColEx>;
	submitButtonOptions?: Partial<ButtonProps>;
}

export interface FormActionType {
	submit: () => Promise<void>;
	getFieldsValue: () => Recordable;
	setFieldsValue: (values: Recordable) => Promise<void>;
	resetFields: () => Promise<void>;
	setProps: (formProps: Partial<FormProps>) => Promise<void>;
	validate: () => Promise<any>;
	clearValidate: (name?: string | string[]) => Promise<void>;
	updateSchema: (
		data: Partial<FormSchema> | Partial<FormSchema>[]
	) => Promise<void>;
	clearFormValues: () => void;
	initDefaultValues: () => void;
}

export type RegisterFn = (formInstance: FormActionType) => void;

export type UseFormReturnType = [RegisterFn, FormActionType];
