import { VNodeChild } from 'vue';
import { HeaderConfig } from './tableHeader';
import { FormProps } from '/@/components/Form/src/types/form';

export interface RecordProps {
	text: any;
	record: Recordable;
	index: number;
}
export declare type CustomRenderFunction = (
	record: RecordProps
) => VNodeChild | JSX.Element;

export interface BasicTableProps {
	immediate: boolean;
	api?: (...arg: any) => Promise<any>;
	headerConfig?: HeaderConfig;
	showSelection?: boolean;
	showIndex?: boolean;
	formConfig?: Partial<FormProps>;
	searchInfo?: Recordable;
	columns: BasicColumn[];
	pagination: boolean;
	actionColumn?: BasicColumn;
}
export interface TableActionType {
	setProps: (props: Partial<BasicTableProps>) => void;
	reload: (opt?: FetchParams) => Promise<void>;
}

export interface BasicColumn {
	type?: 'selection' | 'index' | 'expand';
	label: string;
	prop: string;
	width?: number | string;
	minWidth?: number | string;
	fixed?: 'left' | 'right' | boolean;
	formatter?: (
		row: any,
		column: any,
		cellValue: string | number,
		index: number
	) => string;
	showOverflowTooltip?: boolean;
	align?: 'left' | 'center' | 'right';
	customRender?: CustomRenderFunction;
	slots?: string;
}

export interface FetchParams {
	searchInfo?: Recordable;
	page?: number;
}
