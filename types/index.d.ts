declare interface Fn<T = any, R = T> {
	(...arg: T[]): R;
}

declare type EmitType = (event: string, ...args: any[]) => void;

declare type RefType<T> = T | null;

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> =
	ComponentElRef<T> | null;

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

declare interface Window {
	lazy: any;
	_AMapSecurityConfig: any;
	AMapUI: any;
}
