import { isObject } from 'lodash-es';
import {
	RouteLocationNormalized,
	Router,
	RouteRecordNormalized
} from 'vue-router';
import type { App, Component, Plugin } from 'vue';
import router from '/@/router/index';
import reg from './validate/reg';

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
	return (node?.parentNode as HTMLElement) ?? document.body;
}

export function getRawRoute(
	route: RouteLocationNormalized
): RouteLocationNormalized {
	if (!route) return route;
	const { matched, ...opt } = route;
	return {
		...opt,
		matched: (matched
			? matched.map((item) => ({
					meta: item.meta,
					name: item.name,
					path: item.path
			  }))
			: undefined) as RouteRecordNormalized[]
	};
}

export const withInstall = <T>(component: T, alias?: string) => {
	const comp = component as any;
	comp.install = (app: App) => {
		app.component(comp.name || comp.displayName, component as Component);
		if (alias) {
			app.config.globalProperties[alias] = component;
		}
	};
	return component as T & Plugin;
};

/**
 * 是否是外部链接
 * @param {string} path
 * @return {Boolean}
 */
export function isExternal(path: string) {
	return /^(https?|ftp|mailto|tel):/.test(path);
}

export function getDynamicProps<T, U>(props: T): Partial<U> {
	const ret: Recordable = {};

	Object.keys(props as any).map((key) => {
		ret[key] = unref((props as Recordable)[key]);
	});

	return ret as Partial<U>;
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
	Object.keys(target).forEach((key) => {
		src[key] = isObject(src[key])
			? deepMerge(src[key], target[key])
			: (src[key] = target[key]);
	});
	return src;
}

/* 加载网络css文件 */
export function loadCss(url: string): void {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = url;
	link.crossOrigin = 'anonymous';
	document.getElementsByTagName('head')[0].appendChild(link);
}

export const debounce = (fn: Function, ms: number) => {
	return (...args: any[]) => {
		if (window.lazy) {
			clearTimeout(window.lazy);
		}
		window.lazy = setTimeout(() => {
			fn(...args);
		}, ms);
	};
};

export const setTitleFromRoute = () => {
	if (typeof router.currentRoute.value.meta.title != 'string') {
		return;
	}
	nextTick(() => {
		const webTitle = router.currentRoute.value.meta.title as string;
		document.title = `${webTitle}`;
	});
};

export const YNToBoolean = (value: 'y' | 'n') => {
	return { y: true, n: false }[value];
};

export const routerBack = (route: any) => {
	const back = window.history.state.back;
	if (back.indexOf('loading') !== -1) {
		router.push(route.meta.currentActiveMenu);
	} else {
		router.back();
	}
};

export const inputFormatterNumber = (val: string) => {
	const temp = val
		.replace(/^0+(\d)/, '$1')
		.replace(/^\./, '0.')
		.match(/^\d*(\.?\d{0,2})/g);
	return temp ? temp[0] : '';
};

export function geoCoder(code: string, address: string): Promise<any> {
	return new Promise((reslove, reject) => {
		var geocoder = new (AMap as any).Geocoder({
			city: code
		});

		geocoder.getLocation(address, function (status: string, result: any) {
			if (status === 'complete' && result.geocodes.length) {
				var lnglat = result.geocodes[0].location;
				reslove(lnglat);
			} else {
				reslove(null);
			}
		});
	});
}

export function thousanderAmount(value: string | number | undefined) {
	if (value == undefined) {
		return '-';
	}
	if (typeof value === 'number') {
		value = value + '';
	}
	return '￥' + value.replace(reg.thousander, '$&,');
}
