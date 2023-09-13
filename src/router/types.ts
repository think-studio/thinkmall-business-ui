export type Component<T = any> =
	| ReturnType<typeof defineComponent>
	| (() => Promise<typeof import('*.vue')>)
	| (() => Promise<T>);

export interface BackMenuModel {
	children: BackMenuModel[];
	hideMenu: boolean;
	name: string;
	path: string;
	title: string;
	icon: string;
}
