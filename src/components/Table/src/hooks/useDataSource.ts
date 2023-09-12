import { useTimeoutFn } from '@vueuse/core';
import { get, isFunction, merge, toNumber } from 'lodash-es';
import { ComputedRef } from 'vue';
import { PaginationProps } from '../types/pagination';
import { BasicTableProps, FetchParams } from '../types/table';

interface ActionType {
	getPaginationInfo: ComputedRef<PaginationProps | boolean>;
	setPagination: (info: Partial<PaginationProps>) => void;
	setLoading: (loading: boolean) => void;
	getFieldsValue: () => Recordable;
}

export function useDataSource(
	propsRef: ComputedRef<BasicTableProps>,
	{ getPaginationInfo, setPagination, setLoading, getFieldsValue }: ActionType
) {
	const dataSourceRef = ref<Recordable[]>([]);
	const rawDataSourceRef = ref<Recordable>({});

	function handlePagintionChange(
		pagination: {
			pageSize?: number;
			current?: number;
		},
		quickSearchParams?: Recordable
	) {
		setPagination(pagination);
		fetch({
			searchInfo: quickSearchParams
		});
	}

	async function reload(opt?: FetchParams) {
		return await fetch(opt);
	}

	async function fetch(opt?: FetchParams) {
		let timer;
		const {
			api,
			searchInfo,
			pagination = true,
			headerConfig = {}
		} = unref(propsRef);
		const { useSearchForm = true } = headerConfig;
		if (!api || !isFunction(api)) return;
		try {
			timer = setTimeout(() => {
				setLoading(true);
			}, 300);
			let pageParams: Recordable = {};
			const { current = 1, pageSize = 10 } = unref(
				getPaginationInfo
			) as PaginationProps;

			if (pagination) {
				pageParams['pageIndex'] = (opt && opt.page) || current;
				pageParams['pageSize'] = pageSize;
			}
			let params = merge(
				searchInfo,
				useSearchForm ? getFieldsValue() : {},
				pageParams,
				opt?.searchInfo ?? {}
			);
			Object.keys(params).forEach((key) => {
				if (params[key] === '') {
					params[key] = undefined;
				}
			});

			const res = await api(params);
			rawDataSourceRef.value = res;
			let resultItems = [];
			if (pagination) {
				resultItems = get(res, 'data');

				const resultTotal: number = toNumber(get(res, 'count'));
				setPagination({
					total: resultTotal || 0
				});
				if (opt && opt.page) {
					setPagination({
						current: opt.page || 1
					});
				}
			} else {
				resultItems = get(res, 'data');
			}
			dataSourceRef.value = resultItems;
			return resultItems;
		} catch (err) {
			console.log(err);
			dataSourceRef.value = [];
			setPagination({
				total: 0
			});
		} finally {
			clearTimeout(timer);
			setLoading(false);
		}
	}
	const getDataSourceRef = computed(() => {
		const dataSource = unref(dataSourceRef);
		if (!dataSource || dataSource.length === 0) {
			return unref(dataSourceRef);
		}
		return unref(dataSourceRef);
	});

	onMounted(() => {
		if (unref(propsRef).immediate) {
			useTimeoutFn(() => {
				fetch();
			}, 16);
		}
	});

	return {
		getDataSourceRef,
		handlePagintionChange,
		reload,
		fetch
	};
}
