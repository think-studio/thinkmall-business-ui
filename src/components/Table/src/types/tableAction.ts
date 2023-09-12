export interface ActionItem {
	onClick?: Fn;
	type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
	icon?: string;
	popConfirm?: PopConfirm;
	// 权限编码控制是否显示
	auth?: string | string[];
	// 业务控制是否显示
	ifShow?: boolean | ((action: ActionItem) => boolean);
	tooltip?: string;
	disabled?: boolean;
}

export interface PopConfirm {
	title: string;
	confirm: Fn;
}
