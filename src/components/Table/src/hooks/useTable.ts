import { WatchStopHandle } from 'vue';
import { BasicTableProps, FetchParams, TableActionType } from '../types/table';
import { DynamicProps } from '/#/utils';
import { FormActionType } from '/@/components/Form/src/types/form';
import { getDynamicProps } from '/@/utils';

type Props = Partial<DynamicProps<BasicTableProps>>;

type UseTableMethod = TableActionType & {
	getForm: () => FormActionType;
};

export function useTable(
	tableProps?: Props
): [
	(instance: TableActionType, formInstance: UseTableMethod) => void,
	TableActionType
] {
	const tableRef = ref<Nullable<TableActionType>>(null);
	const loadedRef = ref<Nullable<boolean>>(false);
	const formRef = ref<Nullable<UseTableMethod>>(null);

	let stopWatch: WatchStopHandle;
	function register(instance: TableActionType, formInstance: UseTableMethod) {
		onUnmounted(() => {
			tableRef.value = null;
			loadedRef.value = null;
		});

		if (unref(loadedRef) && instance === unref(tableRef)) return;

		tableRef.value = instance;
		formRef.value = formInstance;
		tableProps && instance.setProps(getDynamicProps(tableProps));
		loadedRef.value = true;

		stopWatch?.();

		stopWatch = watch(
			() => tableProps,
			() => {
				tableProps && instance.setProps(getDynamicProps(tableProps));
			},
			{
				immediate: true,
				deep: true
			}
		);
	}

	function getTableInstance(): TableActionType {
		const table = unref(tableRef);
		if (!table) {
			console.error(
				'The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!'
			);
		}
		return table as TableActionType;
	}

	const method: TableActionType = {
		reload: async (opt?: FetchParams) => {
			return await getTableInstance().reload(opt);
		},
		setProps: (props: Partial<BasicTableProps>) => {
			getTableInstance().setProps(props);
		}
	};
	return [register, method];
}
