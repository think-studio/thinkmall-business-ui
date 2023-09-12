import { cloneDeep } from 'lodash-es';
import { ComputedRef, Ref } from 'vue';
import { BasicColumn, BasicTableProps } from '../types/table';

function handleActionColumn(
	propsRef: ComputedRef<BasicTableProps>,
	columns: BasicColumn[]
) {
	const { actionColumn } = unref(propsRef);
	if (!actionColumn) return;
	columns.push({
		fixed: 'right',
		...actionColumn
	});
}

export function useColumns(propsRef: ComputedRef<BasicTableProps>) {
	const columnsRef = ref(unref(propsRef).columns || []) as unknown as Ref<
		BasicColumn[]
	>;
	// let cacheColumns = unref(propsRef).columns;
	const getColumnsRef = computed(() => {
		const columns = cloneDeep(unref(columnsRef));
		handleActionColumn(propsRef, columns);
		return columns;
	});

	function getColumns() {
		let columns = toRaw(unref(getColumnsRef));
		return columns;
	}
	watch(
		() => unref(propsRef).columns,
		(columns) => {
			columnsRef.value = columns;
		}
	);
	return {
		getColumns
	};
}
