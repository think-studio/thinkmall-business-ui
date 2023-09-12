<template>
	<div>
		<transition name="el-zoom-in-bottom" mode="out-in">
			<div class="table-form-search" v-show="useSearchForm && showForm">
				<slot name="searchForm"></slot>
			</div>
		</transition>
		<div class="table-header">
			<el-tooltip content="刷新" placement="top">
				<el-button
					color="#40485b"
					@click="handleAction('refresh')"
					class="table-header-operate"
					type="info"
					:loading="loading"
				>
					<Icon name="fa fa-refresh" />
				</el-button>
			</el-tooltip>
			<el-tooltip v-if="showAddBtn" content="添加" placement="top">
				<el-button
					@click="handleAction('add')"
					class="table-header-operate"
					type="primary"
				>
					<Icon name="fa fa-plus" />
					<span class="table-header-operate-text">添加</span>
				</el-button>
			</el-tooltip>
			<el-tooltip v-if="showBatchDeleteBtn" content="删除" placement="top">
				<el-button
					@click="handleAction('delete')"
					class="table-header-operate"
					type="danger"
					:disabled="selectKeys.length <= 0"
				>
					<Icon name="fa fa-remove" />
					<span class="table-header-operate-text">删除</span>
				</el-button>
			</el-tooltip>
			<slot></slot>
			<div class="table-search">
				<el-input
					v-if="useQuickSearch"
					v-model="quickSearchValue"
					@input="debounce(handleSearch, 500)()"
					class="quick-search"
					:placeholder="quickSearchPlaceholder"
				/>
				<div
					class="table-search-button-group"
					v-if="useSearchForm"
					@click="showForm = !showForm"
				>
					<el-tooltip
						:content="showForm ? '收起' : '展开更多搜索'"
						placement="top"
					>
						<el-button class="table-search-button-item" color="#dcdfe6" plain>
							<Icon size="14" name="el-icon-Search" />
						</el-button>
					</el-tooltip>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup name="TableHeader">
import { debounce } from '/@/utils';
interface Props {
	loading: boolean;
	useQuickSearch?: boolean;
	quickSearchPlaceholder?: string;
	quickSearchField?: string;
	useSearchForm?: boolean;
	showBatchDeleteBtn?: boolean;
	showAddBtn?: boolean;
	selectKeys: number[] | string[];
}

const emit = defineEmits(['add', 'refresh', 'delete']);

const props = withDefaults(defineProps<Props>(), {
	loading: false,
	useQuickSearch: true,
	useSearchForm: true,
	quickSearchPlaceholder: '请输入关键词',
	quickSearchField: '',
	showBatchDeleteBtn: true,
	showAddBtn: true,
	selectKeys: () => []
});

const showForm = ref<boolean>(true);
const quickSearchValue = ref<string>('');

function handleAction(action: 'add' | 'refresh' | 'delete') {
	emit(action);
}

function handleSearch() {
	emit('refresh', {
		[props.quickSearchField]: unref(quickSearchValue)
	});
}
</script>

<style scoped lang="scss">
.table-form-search {
	overflow: hidden;
	box-sizing: border-box;
	width: 100%;
	max-width: 100%;
	background-color: var(--ba-bg-color-overlay);
	border: 1px solid var(--ba-border-color);
	border-bottom: none;
	padding-top: 13px;
	padding-right: 13px;
}

.table-header {
	position: relative;
	overflow: hidden;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	width: 100%;
	max-width: 100%;
	background-color: var(--ba-bg-color-overlay);
	// border: 1px solid var(--ba-border-color);
	border-bottom: none;
	padding: 13px 15px;
	font-size: 14px;

	.table-header-operate-text {
		margin-left: 6px;
	}

	.table-header-operate .icon {
		font-size: 14px !important;
		color: var(--ba-bg-color-overlay) !important;
	}

	.el-button.is-disabled {
		.icon {
			color: var(--el-button-disabled-text-color) !important;
		}
	}
}

.table-search {
	display: flex;
	margin-left: auto;

	.quick-search {
		width: auto;
	}
}

.table-search-button-group {
	display: flex;
	margin-left: 12px;
	box-shadow: 0 0 0 1px var(--el-border-color);
	border-radius: var(--el-border-radius-base);
	overflow: hidden;

	button:focus,
	button:active {
		background-color: var(--ba-bg-color-overlay);
	}

	button:hover {
		background-color: var(--el-color-info-light-7);
	}

	.table-search-button-item {
		border: none;
		border-radius: 0;
	}

	.el-button + .el-button {
		margin: 0;
	}

	.right-border {
		border-right: 1px solid var(--el-border-color);
	}
}
</style>
