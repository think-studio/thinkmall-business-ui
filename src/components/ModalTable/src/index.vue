<template>
	<BasicModal
		v-bind="$attrs"
		@register="registerModal"
		:title="innerData.title"
		:show-ok-btn="false"
	>
		<el-table :data="innerData.data" border>
			<el-table-column
				v-for="item in innerData.column"
				:prop="item.prop"
				:label="item.label"
				:formatter="item.formatter"
			/>
		</el-table>
	</BasicModal>
</template>
<script lang="ts" setup name="ModalTable">
import { BasicColumn } from '../../Table';
import { BasicModal, useModalInner } from '/@/components/Modal';

interface Props {
	title?: string;
	column?: BasicColumn[];
	data?: Recordable[];
}

const props = withDefaults(defineProps<Props>(), {
	title: '弹框',
	column: () => [],
	data: () => []
});

const innerData = ref<Props>(props);

const [registerModal] = useModalInner((data) => {
	if (data) {
		innerData.value = data;
	}
});
</script>
