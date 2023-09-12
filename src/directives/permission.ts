/**
 * Global authority directive
 * Used for fine-grained control of component permissions
 * @Example v-auth="RoleEnum.TEST"
 */
import type { App, Directive, DirectiveBinding, unref } from 'vue';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { isArray, intersection } from 'lodash-es';

function isAuth(el: Element, binding: any) {
	const value = binding.value;
	if (!value) return;
	if (!hasPermission(value)) {
		el.parentNode?.removeChild(el);
	}
}

export function hasPermission(value?: string | string[], def = true): boolean {
	// Visible by default
	if (!value) {
		return def;
	}
	const allCodeList: string[] = useUserStoreWithOut().permission || [];
	if (allCodeList[0] === '*:*:*') {
		return true;
	}
	if (!isArray(value)) {
		return allCodeList.includes(value);
	} else {
		return (intersection(value, allCodeList) as string[]).length > 0;
	}
}

const mounted = (el: Element, binding: DirectiveBinding<any>) => {
	isAuth(el, binding);
};

const authDirective: Directive = {
	mounted
};

export function setupPermissionDirective(app: App) {
	app.directive('auth', authDirective);
}

export default authDirective;
