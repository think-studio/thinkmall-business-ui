<template>
	<div>
		<TableHeader
			@add="handleActionAdd"
			@refresh="handleFetch"
			@delete="handleActionDelete"
			:loading="getLoading"
			v-bind="tableHeaderBindValue"
		>
			<slot name="operateHeader"></slot>
			<template #searchForm>
				<BasicForm
					@register="registerForm"
					v-bind="getFormProps"
					submit-on-reset
					label-position="right"
					:action-span="8"
					@submit="handleSearchInfoChange"
				/>
			</template>
		</TableHeader>
		<el-table
			v-bind="$attrs"
			ref="tableElRef"
			:border="true"
			:data="getDataSourceRef"
			header-cell-class-name="table-header-cell"
			:tree-props="{ children: 'children' }"
			:row-key="rowKey"
			class="ba-data-table"
			v-loading="getLoading"
			@selection-change="handleSelectionChange"
		>
			<el-table-column
				v-if="getProps.showSelection"
				type="selection"
				width="55"
				align="center"
			/>
			<el-table-column v-if="getProps.showIndex" type="index" align="center" />
			<template v-for="column in columns">
				<el-table-column show-overflow-tooltip v-bind="column as any">
					<template v-if="column.slots" #default="scope">
						<slot
							:name="column.slots"
							v-bind="{ record: scope.row, index: scope.$index }"
						></slot>
					</template>
					<template
						v-if="column.customRender && isFunction(column.customRender)"
						#default="scope"
					>
						<component
							:is="
								column.customRender!({
									text: scope.row[scope.column.property],
									record: scope.row,
									index: scope.$index
								}) as any
							"
						></component>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<div
			class="table-pagination"
			v-if="getShowPagination && !isBoolean(getPaginationInfo)"
		>
			<el-pagination
				:total="getPaginationInfo.total"
				:current-page="getPaginationInfo.current"
				layout="sizes,total, ->, prev, pager, next, jumper"
				@current-change="hanldePaginationCuttentChange"
				@size-change="handlePaginationSizeChange"
			></el-pagination>
		</div>
	</div>
</template>

<script lang="ts" setup name="BasicTable">
import { useColumns } from './hooks/useColumn';
import { BasicForm, useForm } from '/@/components/Form';
import TableHeader from './components/TableHeader.vue';
import { BasicColumn, BasicTableProps, TableActionType } from './types/table';
import { useDataSource } from './hooks/useDataSource';
import { usePagination } from './hooks/usePagination';
import { isBoolean, isFunction } from 'lodash-es';
import { useLoading } from './hooks/useLoading';
import { useTableForm } from './hooks/useTableForm';
import { Ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { HeaderConfig } from './types/tableHeader';

interface BasicProps {
	api?: (...arg: any[]) => Promise<any>;
	rowKey?: string;
	columns?: BasicColumn[];
	immediate?: boolean;
	beforeFetch?: Fn;
	headerConfig?: HeaderConfig;
	showSelection?: boolean;
	showIndex?: boolean;
}
const props = withDefaults(defineProps<BasicProps>(), {
	immediate: true,
	showSelection: true,
	showIndex: true,
	rowKey: 'id',
	headerConfig: () => ({
		quickSearchField: '',
		useSearchForm: true,
		quickSearchPlaceholder: '请输入',
		showBatchDeleteBtn: true,
		useQuickSearch: true,
		showAddBtn: true
	})
});

const emit = defineEmits([
	'register',
	'actionAdd',
	'actionDelete',
	'selectionChange'
]);
const innerPropsRef = ref<Partial<BasicTableProps>>();
const [registerForm, { getFieldsValue }] = useForm();

const quickSearchParams = ref<Recordable>({});
const selectKeys = ref<number[]>([]);

function setProps(props: Partial<BasicTableProps>) {
	innerPropsRef.value = { ...unref(innerPropsRef), ...props };
}

const getProps = computed(() => {
	return { ...unref(props), ...unref(innerPropsRef) } as BasicTableProps;
});

const { getColumns } = useColumns(getProps);

const { getLoading, setLoading } = useLoading();

const columns = computed(() => {
	return getColumns();
});

const { getPaginationInfo, setPagination, getShowPagination } =
	usePagination(getProps);

const { getDataSourceRef, handlePagintionChange, fetch, reload } =
	useDataSource(getProps, {
		getPaginationInfo,
		setPagination,
		setLoading,
		getFieldsValue
	});

const { getFormProps, handleSearchInfoChange } = useTableForm(
	getProps,
	fetch,
	getLoading
);

const bindValue = computed(() => {
	return {
		data: unref(getDataSourceRef)
	};
});

const tableHeaderBindValue = computed(() => {
	const { headerConfig } = unref(getProps);
	return {
		...headerConfig,
		selectKeys: unref(selectKeys)
	};
});

function hanldePaginationCuttentChange(current: number) {
	handlePagintionChange({ current }, unref(quickSearchParams));
}

function handlePaginationSizeChange(size: number) {
	handlePagintionChange({ pageSize: size }, unref(quickSearchParams));
}

function handleActionAdd() {
	emit('actionAdd');
}

function handleActionDelete() {
	ElMessageBox.confirm(
		`确定要删除选中的${unref(selectKeys).length}项吗?`,
		'提示',
		{
			type: 'warning'
		}
	)
		.then(() => {
			emit('actionDelete', unref(selectKeys));
		})
		.catch(() => {});
}

function handleFetch(params?: Recordable) {
	if (params) {
		quickSearchParams.value = params;
	}
	fetch({
		page: 1,
		searchInfo: {
			...params,
			...unref(quickSearchParams)
		}
	});
}

function handleSelectionChange(value: Ref[]) {
	selectKeys.value = value.map((item: any) => unref(item).id);
	emit('selectionChange', unref(value));
}

const tableAction: TableActionType = {
	setProps,
	reload
};
emit('register', tableAction);
</script>

<style scoped lang="scss">
.ba-data-table :deep(.el-button + .el-button) {
	padding: 12px;
}

.ba-data-table :deep(.table-header-cell) .cell {
	color: var(--el-text-color-primary);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
:deep(.el-table) .cell {
	box-sizing: border-box;
	word-break: break-all;
	line-height: 23px;
	// padding: 6px 16px;
}
.table-pagination {
	box-sizing: border-box;
	width: 100%;
	max-width: 100%;
	background-color: var(--ba-bg-color-overlay);
	padding: 13px 15px;
}
</style>
