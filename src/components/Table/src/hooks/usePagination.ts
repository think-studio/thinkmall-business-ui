import { isBoolean } from 'lodash-es';
import { ComputedRef } from 'vue';
import { PaginationProps } from '../types/pagination';
import { BasicTableProps } from '../types/table';

export function usePagination(refProps: ComputedRef<BasicTableProps>) {
	const configRef = ref<PaginationProps>({});
	const show = ref(true);
	const getPaginationInfo = computed((): PaginationProps | boolean => {
		const { pagination = true } = unref(refProps);
		show.value = pagination;
		if (!unref(show) || (isBoolean(pagination) && !pagination)) {
			return false;
		}
		return {
			current: 1,
			pageSize: 10,
			total: 0,
			...unref(configRef)
		};
	});

	function setPagination(info: Partial<PaginationProps>) {
		const paginationInfo = unref(getPaginationInfo);
		configRef.value = {
			...(!isBoolean(paginationInfo) ? paginationInfo : {}),
			...info
		};
	}
	const getShowPagination = computed(() => {
		return unref(show);
	});
	return {
		getPaginationInfo,
		setPagination,
		getShowPagination
	};
}
