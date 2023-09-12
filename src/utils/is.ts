export function isDef<T = unknown>(val?: T): val is T {
	return typeof val !== 'undefined';
}

export function isUnDef<T = unknown>(val?: T): val is T {
	return !isDef(val);
}
